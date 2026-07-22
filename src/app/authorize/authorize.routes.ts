import {Router} from "express";
import validate from "../../middlewares/validate.js";
import { createSchema, getSchema } from "./authorize.schema.js";
import { createAuthorizationCode, getAuthorizationCode } from "./authorize.controller.js";
const router = Router();

router.get("/",validate(getSchema),getAuthorizationCode);
router.post("/",validate(createSchema),createAuthorizationCode);

export default router;
