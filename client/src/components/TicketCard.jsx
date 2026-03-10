import { FaFontAwesomeFlag } from "react-icons/fa";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function TicketCard({ ticket, setSelectedTicket }) {
  // DRAG AND DROP SETUP FOR THIS TICKET
  // useSortable: Makes this ticket draggable and sortable within its column
  // listeners: Event handlers attached to make the card draggable
  // attributes: Accessibility attributes (aria-describedby, etc)
  // setNodeRef: Attaches dnd-kit tracking to this element
  // transform: Position adjustment while dragging (handles movement across columns)
  // transition: Smooth animation during transitions
  // isDragging: Boolean to apply special styles when this card is being dragged
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: ticket._id,
  });

  // Apply transform and visual styles for dragging
  // 1. transform: Moves the card to follow the cursor
  // 2. opacity: Fades card to 0.1 while dragging (overlay copy is more visible)
  // 3. boxShadow: Adds depth while dragging
  // 4. zIndex: Ensures the card sits on top during drag
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1000 : "auto",
    opacity: isDragging ? 0.1 : 1,
    boxShadow: isDragging ? "0 8px 16px rgba(0, 0, 0, 0.2)" : "none",
  };

  // HELPERS
  // Converts name to initials for the assignee avatar
  const getInitials = (name) => {
    if (!name) return "";

    const parts = name.trim().split(" ");

    if (parts.length === 1) {
      return (parts[0][0] + parts[0][parts[0].length - 1]).toUpperCase();
    }

    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const priority = ticket.priority;

  return (
    // Attach drag handlers, tracking ref, and computed styles to the card
    // {...listeners}: Mouse events for dragging
    // {...attributes}: Accessibility features
    // ref={setNodeRef}: Connects this element to dnd-kit
    // style={style}: Applies transform and visual effects
    <div
      className={`column-item ${ticket.status === "Done" ? "ticket-done" : ""}`}
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      onClick={() => setSelectedTicket(ticket)}
    >
      <div className="column-top">
        <p>{ticket.ticketKey}</p>

        <p className={`priority-${priority}`}>
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
}

export default TicketCard;
