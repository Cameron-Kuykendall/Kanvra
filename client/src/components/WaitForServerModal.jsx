import { useState } from "react";

function WaitForServerModal() {
  const [open, setOpen] = useState(true);

  if (!open) return null;

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h2>Loading Server</h2>
        <p>
          The backend server may take <strong>10–20 seconds</strong> to boot up if it has been inactive.
        </p>
        <p>Please be patient while the service wakes up.</p>

        <button style={buttonStyle} onClick={() => setOpen(false)}>
          Close
        </button>
      </div>
    </div>
  );
}

export default WaitForServerModal;

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
};

const modalStyle = {
  backgroundColor: "white",
  padding: "30px",
  borderRadius: "10px",
  width: "400px",
  textAlign: "center",
  boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
};

const buttonStyle = {
  marginTop: "20px",
  padding: "10px 20px",
  border: "none",
  borderRadius: "6px",
  backgroundColor: "#0077ff",
  color: "white",
  cursor: "pointer",
};
