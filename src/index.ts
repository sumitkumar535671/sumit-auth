import createServerApplication from "./app/index.js";
import http from "node:http";
import "dotenv/config"
import verifyDatabaseConnection from "./db/health.js";
import { initJWKS } from "./config/jwks.js";



async function main() {
    try {

        await verifyDatabaseConnection();
        console.log("DB connected");

        await initJWKS();
        console.log("JWKS initialized");

        const server = http.createServer(createServerApplication())
        const port = process.env.PORT || 8080;

        server.listen(port,()=>{
            console.log(`Server started on a port ${port}`);
        })
    } catch (error) {
        console.error("my error",error);
        process.exit(1);
    }
}

main()