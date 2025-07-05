


import { Router } from "express";
import { createMessage, getMessages } from "../controller/messageController.js";
import { authenticate } from "../middleware/authenticate.js";

const router = Router();

router.post('/', authenticate, createMessage);
router.get('/', authenticate, getMessages);

export default router;
