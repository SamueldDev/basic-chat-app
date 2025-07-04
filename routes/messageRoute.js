


import { Router } from "express";
import { createMessage, getMessages } from "../controller/messageController.js";

const router = Router();

router.post('/', createMessage);
router.get('/', getMessages);

export default router;
