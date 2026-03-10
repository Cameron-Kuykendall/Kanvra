import TicketCard from "./TicketCard";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

function Column({ title, status, tickets, setSelectedTicket }) {
  // Filter tickets to show only ones with this column's status
  const filteredTickets = tickets.filter((ticket) => ticket.status === status);

  // DRAG AND DROP SETUP FOR THIS COLUMN
  // useDroppable: Makes this column a valid drop target
  // setNodeRef: Attaches dnd-kit tracking to the column element
  // isOver: Tracks if a dragged item is hovering over this column
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  return (
    <div ref={setNodeRef} className={`column ${isOver ? "column-hover" : ""}`}>
      <h1>
        <span className={`${status.toLowerCase().replace(" ", "-")}-circle`}></span>
        {title} <span className="column-count">{filteredTickets.length}</span>
      </h1>

      <div className="column-scroll">
        {/* SortableContext: Enables sorting/dragging of tickets within this column */}
        {/* verticalListSortingStrategy: Arranges tickets vertically */}
        <SortableContext items={filteredTickets.map((ticket) => ticket._id)} strategy={verticalListSortingStrategy}>
          {filteredTickets.map((ticket) => (
            <TicketCard setSelectedTicket={setSelectedTicket} key={ticket._id} ticket={ticket} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}

export default Column;
