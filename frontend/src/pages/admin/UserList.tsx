import { useEffect, useState } from "react";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  
  
  useEffect(() => {
   
    document.title = "Vizualizare conturi | Administratie";
  }, []);

  const loadUsers = () => {
    fetch("http://localhost:8080/api/users/all")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
        setMessage("Eroare la încărcarea utilizatorilor.");
      });
  };

  useEffect(() => {
    loadUsers();
  }, []);

  if (loading) {
    return <h2 style={{ textAlign: "center", marginTop: "40px" }}>Se încarcă utilizatorii...</h2>;
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "25px" }}>
        Lista utilizatorilor
      </h1>

      {message && (
        <div
          style={{
            marginBottom: "20px",
            padding: "10px",
            background: "#f4c3d9",
            borderRadius: "10px",
            textAlign: "center",
          }}
        >
          {message}
        </div>
      )}

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "white",
          borderRadius: "15px",
          overflow: "hidden",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        }}
      >
        <thead style={{ background: "#9055a2", color: "white" }}>
          <tr>
            <th style={th}>ID</th>
            <th style={th}>Nume</th>
            <th style={th}>Prenume</th>
            <th style={th}>Email</th>
            <th style={th}>Rol</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.id} style={{ textAlign: "center" }}>
              <td style={td}>{u.id}</td>
              <td style={td}>{u.lastName}</td>
              <td style={td}>{u.firstName}</td>
              <td style={td}>{u.email}</td>
              <td style={td}>{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const th: React.CSSProperties = {
  padding: "12px",
  fontSize: "1rem",
};

const td: React.CSSProperties = {
  padding: "12px",
  borderBottom: "1px solid #ddd",
};
