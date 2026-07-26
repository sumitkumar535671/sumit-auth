import express ,{type Application}from 'express';
import path from 'node:path';
import "dotenv/config"
import discoverRoutes from "./discovery/discovery.routes.js"
import clientRoutes from "./client/client.routes.js";
import authRoutes from "./auth/auth.routes.js";
import cookieParser from 'cookie-parser';
import authorizeRoutes from "./authorize/authorize.routes.js";
import tokenRoutes from "./token/token.routes.js";
import userRoutes from "./userinfo/userinfo.routes.js"

export default function createServerApplication():Application {
    const app = express();

    app.use(express.json());
    app.use(express.urlencoded({extended:true}));
    app.use(cookieParser());

    app.use(express.static(path.join(process.cwd(),"src","public")));

    app.set("view engine","ejs");
    app.set("views",path.join(process.cwd(),"src","views"));
    
    

    app.get("/",(req,res)=>{
        return res.status(200).json({
            message:"Welcome to SumitAuth"
        })
    });

    app.use("/.well-known",discoverRoutes);
    app.use("/client",clientRoutes);
    app.use("/auth",authRoutes);
    app.use("/authorize",authorizeRoutes);
    app.use("/",tokenRoutes);
    app.use("/",userRoutes);

    return app;
} 