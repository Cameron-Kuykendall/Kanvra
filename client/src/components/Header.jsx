function Header({ tickets, setShowModal, setSelectedTicket }) {
  const handleCreate = () => {
    setSelectedTicket(null); 
    setShowModal(true);
  };

  return (
    <div className="header">
      <h1>Kanvra</h1>
      <h3>{tickets.length} tickets</h3>

      <button onClick={handleCreate} className="add-ticket-head">
        + New Ticket
      </button>
    </div>
  );
}

export default Header;
