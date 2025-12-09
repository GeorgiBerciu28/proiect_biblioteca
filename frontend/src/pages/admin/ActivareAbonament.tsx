import { useEffect, useState } from "react";
import PopupMessage from "../PopUpMessage";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  subscriptionStatus: string;
}

export default function ActivareAbonament() {
  const [pending, setPending] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [popup, setPopup] = useState<string | null>(null);

  const loadPending = () => {
    fetch("http://localhost:8080/api/pending-subscriptions")
      .then(res => res.json())
      .then(data => {
        setPending(data);
        setLoading(false);

        // Actualizăm și badge-ul din navbar
        window.dispatchEvent(new CustomEvent("pendingUpdated", { detail: data.length }));
      });
  };

  useEffect(() => {
    loadPending();
  }, []);

  const approve = async (id: number) => {
    await fetch(`http://localhost:8080/api/approve-subscription/${id}`, {
      method: "POST"
    });

    setPopup("Abonament activat!");
    loadPending();

  };

  if (loading) {
    return <h2 style={{ textAlign: "center", marginTop: "40px" }}>Se încarcă...</h2>;
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "25px" }}>
        Cereri pentru activarea abonamentului
      </h1>

      {pending.length === 0 && (
        <h3 style={{ textAlign: "center", color: "gray" }}>
          Nu există cereri noi.
        </h3>
      )}

      {pending.length > 0 && (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "white",
            borderRadius: "15px",
            overflow: "hidden",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
          }}
        >
          <thead style={{ background: "#8e44ad", color: "white" }}>
            <tr>
              <th style={th}>ID</th>
              <th style={th}>Nume</th>
              <th style={th}>Email</th>
              <th style={th}>Activare abonament</th>
            </tr>
          </thead>

          <tbody>
            {pending.map(u => (
              <tr key={u.id} style={{ textAlign: "center" }}>
                <td style={td}>{u.id}</td>
                <td style={td}>{u.firstName + " " + u.lastName}</td>
                <td style={td}>{u.email}</td>
                <td style={td}>
                  <button
                    onClick={() => approve(u.id)}
                    style={{
                      padding: "10px 20px",
                      backgroundColor: "green",
                      color: "white",
                      border: "none",
                      borderRadius: "10px",
                      cursor: "pointer",
                      fontSize: "1rem",
                      fontWeight: "bold"
                    }}
                  >
                    Activează
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {popup && (
      <PopupMessage 
          text={popup} 
          onClose={() => setPopup(null)} 
      />
    )}
    </div>
  );
}

const th: React.CSSProperties = {
  padding: "12px",
  fontSize: "1rem"
};

const td: React.CSSProperties = {
  padding: "12px",
  borderBottom: "1px solid #ddd"
};
