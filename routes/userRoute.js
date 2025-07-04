
import { Router } from "express";

// import { createUser, updateStatus } from "../controller/userController.js";

import { login, register } from "../controller/userController.js";
const router = Router();

router.post("/login", login)
router.post("/register", register)

// router.post('/', createUser);
// router.put('/:username/status', updateStatus);



export default router;