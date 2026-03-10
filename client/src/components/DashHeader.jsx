function DashHeader({ filters, setFilters, tickets }) {
  return (
    <div className="dash-header">
      <input
        id="search"
        name="search"
        type="text"
        placeholder="Search tickets..."
        value={filters.search}
        onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
      />

      <select
        id="priority-filter"
        name="priority"
        value={filters.priority}
        onChange={(e) => setFilters((prev) => ({ ...prev, priority: e.target.value }))}
      >
        <option value="all">All Priority</option>
        <option value="Critical">Critical</option>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>

      <select
        id="type-filter"
        name="type"
        value={filters.type}
        onChange={(e) => setFilters((prev) => ({ ...prev, type: e.target.value }))}
      >
        <option value="all">All Types</option>
        <option value="Bug">Bug</option>
        <option value="Feature">Feature</option>
        <option value="Task">Task</option>
        <option value="Improvement">Improvement</option>
        <option value="Epic">Epic</option>
      </select>

      <select
        id="assignee-filter"
        name="assignee"
        value={filters.assignee}
        onChange={(e) => setFilters((prev) => ({ ...prev, assignee: e.target.value }))}
      >
        <option value="all">All Assignees</option>

        {[...new Set(tickets.map((ticket) => ticket.assignee))].map((assignee) => (
          <option key={assignee} value={assignee}>
            {assignee}
          </option>
        ))}
      </select>
    </div>
  );
}

export default DashHeader;
