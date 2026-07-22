import type {Request,Response} from "express"
import type { CreateType, GetType } from "./authorize.schema.js";
import { db } from "../../db/index.js";
import { authorizationCode, authSessions, clients, users } from "../../db/schema.js";
import { eq } from "drizzle-orm";
import AppError from "../../utils/AppError.js";
import crypto from "crypto";

export async function getAuthorizationCode(req:Request,res:Response) {
    const query = (req.validatedData as GetType).query;

    const [client] = await db.select().from(clients).where(eq(clients.clientId,query.client_id));
    if(!client || client.deletedAt) throw new AppError("Invalid Client",400);

    if(!client.redirectUris.includes(query.redirect_uri))
        throw new AppError("redirect_uri is not registerd",400);

    const requestedScope = query.scope.split(" ");
    if(!requestedScope.includes("openid"))
        throw new AppError(`scope must include "openid"`,400);

    const invalidScopes = requestedScope.filter((scope)=> !client.allowedScopes.includes(scope));
    if(invalidScopes.length > 0){
        throw new AppError(`Client is not allowed to request scopes: ${invalidScopes.join(", ")}`,400)
    }

    const sessionToken = req.cookies.auth_session;
    if(!sessionToken){
        return res.status(200).render("auth/login",{authorizeQuery:query});
    }

    const sessionTokenHash = crypto.createHash("sha256").update(sessionToken).digest("hex");

    const [session] = await db.select().from(authSessions).where(eq(authSessions.sessionTokenHash,sessionTokenHash));
    if(!session || new Date()>session.expiresAt){
        return res.status(200).render("auth/login",{authorizeQuery:query})
    }

    const [user] = await db.select().from(users).where(eq(users.id,session.userId));
    if(!user || user.deletedAt){
        return res.status(200).render("auth/login",{
            authorizeQuery:query
        });
    }

    return res.status(200).render("authorize/consent",{
        clientName: client.name,
        redirectUri: query.redirect_uri,
        requestedScope,
        authorizeQuery: query,
    });

}


export async function createAuthorizationCode(req:Request,res:Response) {
    const query = (req.validatedData as CreateType).body;

    const [client] = await db.select().from(clients).where(eq(clients.clientId,query.client_id));
    if(!client || client.deletedAt) throw new AppError("Invalid client",400);

    if (!client.redirectUris.includes(query.redirect_uri))
        throw new AppError("redirect_uri is not registered", 400);

    const requestedScopes = query.scope.split(" ");
    if (!requestedScopes.includes("openid")) {
        throw new AppError(`scope must include "openid"`, 400);
    }

    const invalidScopes = requestedScopes.filter(
        (scope) => !client.allowedScopes.includes(scope),
    );
    if (invalidScopes.length > 0)
        throw new AppError(
            `Client is not allowed to request scopes: ${invalidScopes.join(", ")}`,
            400,
        );

    const sessionToken = req.cookies.auth_session;
    if (!sessionToken) throw new AppError("Unauthorized(no session)", 401);

    const sessionTokenHash = crypto
        .createHash("sha256")
        .update(sessionToken)
        .digest("hex");
    const [session] = await db
        .select()
        .from(authSessions)
        .where(eq(authSessions.sessionTokenHash, sessionTokenHash));
    if (!session || new Date() > session.expiresAt)
        throw new AppError("Unauthorized", 401);

    const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, session.userId));
    if (!user || user.deletedAt) throw new AppError("Unauthorized", 401);

    const code = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 10*60*1000);// 10 m

    await db.insert(authorizationCode).values({
        code,
        userId:user.id,
        clientId:client.id,
        redirectUri:query.redirect_uri,
        scopes:requestedScopes,
        expiresAt,
    });

    const redirectUrl = new URL(query.redirect_uri);
    redirectUrl.searchParams.set("code",code);
    redirectUrl.searchParams.set("state",query.state);

    //return res.status(200).json({message:"nice",redirectUrl})

    return res.redirect(redirectUrl.toString());
}
