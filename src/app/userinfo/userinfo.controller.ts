import type{Request,Response} from "express"
import AppError from "../../utils/AppError.js";
import jwt from "jsonwebtoken";
import { publicKey } from "../../config/keys.js";
import { db } from "../../db/index.js";
import { users } from "../../db/schema.js";
import { eq } from "drizzle-orm";
import { email } from "zod";

export async function getUserInfo(req:Request,res:Response) {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer")){
        throw new AppError("Missing or invalid Authorization header", 401);
    }

    const token = authHeader.slice(7);

    let decoded:any;

    try {
        decoded = jwt.verify(token,publicKey,{
            algorithms:["RS256"],
        })
    } catch (error:any) {
        throw new AppError(
            error.message === "jwt expired" ? "Token expired" : "Invalid token",
            401,
        );
    }


    const userId = parseInt(decoded.sub,10);
    const scopes = (decoded.scopes || "").split(" ").filter(Boolean);

    const [user] = await db.select().from(users).where(eq(users.id,userId));

    if(!user || user.deletedAt){
        throw new AppError("User not found", 404);
    }

    const response:any = {
        sub:user.id.toString(),
        first_name:user.firstName,
        last_name:user.lastName || undefined,
        email:user.email,
    };

    if (scopes.includes("profile")) {
        response.name = `${user.firstName} ${user.lastName || ""}`.trim();
        response.given_name = user.firstName;
        response.family_name = user.lastName || undefined;
    }

    if (scopes.includes("email")) {
        response.email = user.email;
        response.email_verified = user.emailVerified;
    }

    return res.status(200).json(response);
}