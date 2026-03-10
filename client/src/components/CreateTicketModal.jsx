import { useState } from "react";

function getInitialForm(ticket) {
  return {
    title: ticket?.title || "",
    description: ticket?.description || "",
    labels: ticket?.labels ? ticket.labels.join(" ") : "",
    priority: ticket?.priority || "Low",
    type: ticket?.type || "Task",
    assignee: ticket?.assignee || "",
  };
}

function CreateTicketModal({ isOpen, onClose, onCreate, onDelete,  ticket, onUpdate }) {
  const [form, setForm] = useState(() => getInitialForm(ticket));

  if (!isOpen) return null;

  const isEditing = Boolean(ticket);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDelete = async () => {
    if (!ticket) return;

    await onDelete(ticket._id);

    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const ticketData = {
      ...form,
      labels: form.labels.split(" ").filter(Boolean),
    };

    if (isEditing) {
      await onUpdate(ticket._id, ticketData);
    } else {
      await onCreate(ticketData);
    }

    setForm(getInitialForm(null));
    onClose();
  };
  const handleClose = () => {
    // Reset form when closing so opening "Create" starts clean.
    setForm(getInitialForm(ticket));
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>{isEditing ? "Edit Ticket" : "Create Ticket"}</h2>
          <button className="modal-close" onClick={handleClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <input name="title" placeholder="Ticket title" value={form.title} onChange={handleChange} required />

          <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />
          <textarea
            name="labels"
            placeholder="Labels (separate with spaces)"
            value={form.labels}
            onChange={handleChange}
          />
          <select name="priority" value={form.priority} onChange={handleChange}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>

          <select name="type" value={form.type} onChange={handleChange}>
            <option value="Bug">Bug</option>
            <option value="Feature">Feature</option>
            <option value="Task">Task</option>
            <option value="Improvement">Improvement</option>
            <option value="Epic">Epic</option>
          </select>

          <input name="assignee" placeholder="Assignee" value={form.assignee} onChange={handleChange} />

          <div className="modal-actions">
            {isEditing && (
              <button type="button" className="delete-ticket" onClick={handleDelete}>
                Delete
              </button>
            )}
            <button type="button" onClick={handleClose}>
              Cancel
            </button>

            <button type="submit">{isEditing ? "Update Ticket" : "Create Ticket"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTicketModal;
