import express from "express";
import { createTicket, getTickets, updateTicketStatus, updateTicket, deleteTicket } from "../controllers/controller.js";

const router = express.Router();

router.post("/", createTicket);
router.get("/", getTickets);
router.patch("/:id/status", updateTicketStatus);
router.patch("/:id", updateTicket);
router.delete("/:id", deleteTicket);

export default router;
