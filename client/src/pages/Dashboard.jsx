import Column from "../components/Column";
import Header from "../components/Header";
import DashHeader from "../components/DashHeader";
import WaitForServerModal from "../components/WaitForServerModal";
import { DndContext, PointerSensor, useSensor, useSensors, DragOverlay } from "@dnd-kit/core";
import { useEffect, useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import { FaFontAwesomeFlag } from "react-icons/fa";
import CreateTicketModal from "../components/CreateTicketModal";
import { API_URL } from "../config";

function Dashboard() {
  // State for all tickets and the currently dragged ticket ID
  const [tickets, setTickets] = useState([]);
  const [activeId, setActiveId] = useState(null);

  //state for opening a ticketCard
  const [selectedTicket, setSelectedTicket] = useState(null);

  //State for Filtering
  const [filters, setFilters] = useState({
    search: "",
    priority: "all",
    type: "all",
    assignee: "all",
  });

  //state for  modal
  const [showModal, setShowModal] = useState(false);

  const filteredTickets = tickets.filter((ticket) => {
    if (filters.priority !== "all" && ticket.priority !== filters.priority) return false;

    if (filters.type !== "all" && ticket.type !== filters.type) return false;

    if (filters.assignee !== "all" && ticket.assignee !== filters.assignee) return false;

    if (filters.search && !ticket.title.toLowerCase().includes(filters.search.toLowerCase())) return false;

    return true;
  });

  // DRAG AND DROP SETUP
  // PointerSensor: Enables drag detection with 8px minimum distance before drag activates
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  // HELPERS
  // Converts a name to initials for the assignee avatar
  const getInitials = (name) => {
    if (!name) return "";
    const parts = name.trim().split(" ");
    if (parts.length === 1) {
      return (parts[0][0] + parts[0][parts[0].length - 1]).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Renders the dragged ticket in the DragOverlay (the floating copy that follows the cursor)
  const renderTicket = (ticket) => (
    <div style={{ opacity: 0.8, boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)", width: "300px" }} className="column-item">
      <div className="column-top">
        <p>{ticket.ticketKey}</p>
        <p className={`priority-${ticket.priority}`}>
          <FaFontAwesomeFlag className="priority-flag" />
          {ticket.priority}
        </p>
      </div>
      <div className="column-medium">
        <h2>{ticket.title}</h2>
      </div>
      <div className="column-bottom">
        {ticket.labels.map((label) => (
          <p key={label}>{label}</p>
        ))}
        <p className="assignee">{getInitials(ticket.assignee)}</p>
      </div>
    </div>
  );

  // LIFECYCLE
  // Fetch all tickets when component mounts
  useEffect(() => {
    const GetTickets = async () => {
      const res = await fetch(`${API_URL}/tickets`);
      const data = await res.json();
      setTickets(data);
    };

    GetTickets();
  }, []);

  // DRAG AND DROP HANDLERS

  // Called when drag starts - stores the ID of the dragged ticket
  // Used to render the correct ticket in the DragOverlay
  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  // Called when drag is cancelled (ESC key or invalid drop) - resets active ticket
  const handleDragCancel = () => {
    setActiveId(null);
  };

  // Called continuously while dragging over other tickets
  // Handles real-time reordering: moves cards out of the way and updates status if moving to a different column
  const handleDragOver = (event) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    // Only reorder if dragging over another ticket (not a column)
    const columnStatuses = ["Backlog", "In Progress", "Review", "Done"];
    // Ignore drags directly over column headers
    if (columnStatuses.includes(overId)) return;

    setTickets((prev) => {
      const activeTicket = prev.find((t) => t._id === activeId);
      const overTicket = prev.find((t) => t._id === overId);

      if (!activeTicket || !overTicket) return prev;

      // If dragging ticket to a different column, update its status first
      // (This makes the card appear in the new column as you drag)
      let updatedTickets = prev;
      if (activeTicket.status !== overTicket.status) {
        updatedTickets = updatedTickets.map((t) => (t._id === activeId ? { ...t, status: overTicket.status } : t));
      }

      // Reorder tickets: move the dragged ticket to the position of the ticket you're hovering over
      const oldIndex = updatedTickets.findIndex((t) => t._id === activeId);
      const newIndex = updatedTickets.findIndex((t) => t._id === overId);

      if (oldIndex === -1 || newIndex === -1) return prev;

      return arrayMove(updatedTickets, oldIndex, newIndex);
    });
  };

  // Called when drag ends (mouse released)
  // Saves the final ticket status to the server
  const handleDragEnd = async (event) => {
    setActiveId(null);

    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Determine if dropped on a column header or a ticket
    const columnStatuses = ["Backlog", "In Progress", "Review", "Done"];
    const isDropOnColumn = columnStatuses.includes(overId);

    if (isDropOnColumn) {
      // Dropped directly on column header - change status to that column
      const ticketId = activeId;
      const newStatus = overId;

      // Update local state
      setTickets((prevTickets) =>
        prevTickets.map((ticket) => (ticket._id === ticketId ? { ...ticket, status: newStatus } : ticket)),
      );

      // Save to server
      await fetch(`${API_URL}/tickets/${ticketId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });
    } else {
      // Dropped on another ticket - status was already updated during handleDragOver
      // We only need to save the final status to the server
      const overTicket = tickets.find((t) => t._id === overId);
      if (!overTicket) return;

      // Save ticket status to server
      await fetch(`${API_URL}/tickets/${activeId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: overTicket.status }),
      });
    }
  };

  //CREATE TICKET
  const createTicket = async (ticketData) => {
    const res = await fetch(`${API_URL}/tickets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ticketData),
    });

    const newTicket = await res.json();

    setTickets((prev) => [...prev, newTicket]);
  };

  //UPDATE TICKET
  const updateTicket = async (id, ticketData) => {
    const res = await fetch(`${API_URL}/tickets/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ticketData),
    });

    const updated = await res.json();

    setTickets((prev) => prev.map((t) => (t._id === id ? updated : t)));
  };

  //Delete Tivket
  const deleteTicket = async (id) => {
    await fetch(`${API_URL}/tickets/${id}`, {
      method: "DELETE",
    });

    setTickets((prev) => prev.filter((ticket) => ticket._id !== id));
  };

  return (
    <div className="dash-root">
      <WaitForServerModal />
      <Header setShowModal={setShowModal} setSelectedTicket={setSelectedTicket} tickets={filteredTickets} />{" "}
      <DashHeader tickets={tickets} filters={filters} setFilters={setFilters} />
      {/* DndContext: Wraps all drag-and-drop enabled elements and manages all drag/drop events */}
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragCancel={handleDragCancel}
        onDragEnd={handleDragEnd}
      >
        <CreateTicketModal
          key={selectedTicket ? selectedTicket._id : "new-ticket"}
          isOpen={showModal || selectedTicket}
          ticket={selectedTicket}
          onClose={() => {
            setShowModal(false);
            setSelectedTicket(null);
          }}
          onCreate={createTicket}
          onUpdate={updateTicket}
          onDelete={deleteTicket}
        />
        <div className="dash-columns">
          <Column setSelectedTicket={setSelectedTicket} title="Backlog" status="Backlog" tickets={filteredTickets} />
          <Column
            setSelectedTicket={setSelectedTicket}
            title="In Progress"
            status="In Progress"
            tickets={filteredTickets}
          />
          <Column setSelectedTicket={setSelectedTicket} title="Review" status="Review" tickets={filteredTickets} />
          <Column setSelectedTicket={setSelectedTicket} title="Done" status="Done" tickets={filteredTickets} />
        </div>
        {/* DragOverlay: Renders the floating copy of the dragged ticket that follows the cursor */}
        <DragOverlay>
          {activeId
            ? (() => {
                const ticket = tickets.find((t) => t._id === activeId);
                return ticket ? renderTicket(ticket) : null;
              })()
            : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

export default Dashboard;
