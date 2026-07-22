import {Router} from "express";
import { getJWKSJson, getOpenIdConfiguration } from "./discovery.controller.js";
const router = Router();

router.get("/openid-configuration",getOpenIdConfiguration);
router.get("/jwks.json",getJWKSJson)

export default router;