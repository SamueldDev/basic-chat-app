
import { Router } from "express";

import { createUser, updateStatus } from "../controller/userController.js";

const router = Router();

router.post('/', createUser);
router.put('/:username/status', updateStatus);

export default router;