import {importSPKI,exportJWK,type JWK} from "jose";
import { publicKey } from "./keys.js";

let jwks:{keys:JWK[]};

export async function initJWKS() {
    const key = await importSPKI(publicKey,"RS256");//PEM String --> CryptoKey Object
    const jwk = await exportJWK(key);//CryptoKey Object --> JSON Object

    jwks ={
        keys:[
            {
                ...jwk,
                use: "sig",
                alg: "RS256",
                kid:`${process.env.KEY_ID}`,

            },
        ],
    };


}

export function getJWKS(){
    if(!jwks){
        throw new Error("JWKS not initialized. Call initJWKS() first.");
    }

    return jwks;
}
