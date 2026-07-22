import type {Request,Response} from "express"
import "dotenv/config"
import { getJWKS } from "../../config/jwks.js";

export async function getOpenIdConfiguration(req:Request,res:Response) {
    return res.status(200).json({
        issuer: process.env.ISSUER,
        authorization_endpoint:`${process.env.ISSUER}/authorize`,
        token_endpoint:`${process.env.ISSUER}/token`,
        userinfo_endpoint:`${process.env.ISSUER}/userinfo`,
        jwks_uri:`${process.env.ISSUER}/.well-known/jwks.json`

    });
}

export async function getJWKSJson(req:Request,res:Response) {
    return res.status(200).json(getJWKS());
}