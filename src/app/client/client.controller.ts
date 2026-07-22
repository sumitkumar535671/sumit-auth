 import type {Request,Response} from "express";
 import type {RegisterType} from "./client.schemas.js";
 import crypto from "crypto";
 import bcrypt from "bcrypt";
import { db } from "../../db/index.js";
import { clients } from "../../db/schema.js";



 export async function registerClient(req:Request,res:Response) {
    try {

        const {name,redirectUris,allowedScopes} = (req.validatedData as RegisterType).body;

        const clientId = crypto.randomUUID();
        const clientSecret = crypto.randomBytes(32).toString("hex");
        const clientSecretHash = await bcrypt.hash(clientSecret,10);
        const [client] = await db.insert(clients).values({
        name,
        clientId,
        clientSecretHash,
        redirectUris,
        allowedScopes
    }).returning({
        id:clients.id,
        name:clients.name,
        clientId:clients.clientId,
        redirectUris:clients.redirectUris,
        allowedScopes:clients.allowedScopes,
        createdAt:clients.createdAt,
        updatedAt:clients.updatedAt
    });

    return res.status(201).json({
        success:true,
        data:{
            ...client,
            clientSecret,
        }
    });

    } catch (error) {
        console.log("error in inserting client",error)
    }
 }