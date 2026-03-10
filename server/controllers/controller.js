import Ticket from "../models/Ticket.js";
import asyncHandler from "express-async-handler";

//Create a new ticket
const createTicket = asyncHandler(async (req, res) => {
  //increment count for ticket ID andnumber
  const lastTicket = await Ticket.findOne().sort({ ticketNumber: -1 });

  const nextNumber = lastTicket ? lastTicket.ticketNumber + 1 : 1;

  const ticketKey = `KAN-${nextNumber}`;

  const newTicket = await Ticket.create({
    ...req.body,
    ticketNumber: nextNumber,
    ticketKey: ticketKey,
  });

  if (!newTicket) {
    res.status(400).json({ error: "Failed to create ticket" });
    return;
  }
  res.status(201).json(newTicket);
});

//Get All Tickets (returns an array of tickets even if empty [])
const getTickets = asyncHandler(async (req, res) => {
  const tickets = await Ticket.find().sort({ ticketNumber: 1 });
  res.status(200).json(tickets);
});

// Update ticket status (Kanban drag + drop)
const updateTicketStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    return res.status(404).json({ error: "Ticket not found" });
  }

  ticket.status = status;

  const updatedTicket = await ticket.save();

  res.status(200).json(updatedTicket);
});

//update / edit ticket
const updateTicket = asyncHandler(async (req, res) => {
  const updatedTicket = await Ticket.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

  if (!updatedTicket) {
    return res.status(404).json({ error: "Ticket not found" });
  }

  res.status(200).json(updatedTicket);
});

//delete ticket
const deleteTicket = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findByIdAndDelete(req.params.id);

  if (!ticket) {
    return res.status(404).json({ error: "Ticket not found" });
  }

  res.status(200).json({ message: "Ticket deleted" });
});
//
//
//
//export functions
export { createTicket, getTickets, updateTicketStatus, updateTicket, deleteTicket };
