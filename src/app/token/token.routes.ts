import {Router} from "express";
import validate from "../../middlewares/validate.js";
import { tokenSchema } from "./token.schema.js";
import { exchangeToken } from "./token.controller.js";
const router = Router();

router.post("/token",validate(tokenSchema),exchangeToken);

export default router;