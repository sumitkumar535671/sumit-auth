import {Router} from "express"
import validate from "../../middlewares/validate.js";
import { getSchema } from "../authorize/authorize.schema.js";
import { loginSchema, registerSchema } from "./auth.schema.js";
import { getLoginPage, getRegisterPage, loginUser, registerUser } from "./auth.controller.js";


const router = Router();

router.get("/register",validate(getSchema),getRegisterPage);
router.get("/login",validate(getSchema),getLoginPage);

router.post("/register",validate(registerSchema),registerUser);
router.post("/login",validate(loginSchema),loginUser);

export default router;
