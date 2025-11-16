import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Main Page | MyLibrary";
    
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    alert("Te-ai deconectat cu succes!");
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "0 20px",
      }}
    >
      <div style={{ maxWidth: "900px" }}>
        {user ? (
          <>
            <h1
              style={{
                fontSize: "3rem",
                color: "#333",
                marginBottom: "20px",
                fontWeight: "bold",
              }}
            >
              Bine ai venit, {user.firstName} {user.lastName}!
            </h1>
            <p
              style={{
                fontSize: "1.2rem",
                color: "#555",
                maxWidth: "700px",
                marginBottom: "20px",
                marginInline: "auto",
              }}
            >
              Rolul tău: <strong>{user.role}</strong>
            </p>
            <p
              style={{
                fontSize: "1.1rem",
                color: "#666",
                marginBottom: "40px",
              }}
            >
              Email: {user.email}
            </p>
            <button
              onClick={handleLogout}
              style={{
                padding: "12px 35px",
                backgroundColor: "#f44336",
                color: "white",
                fontSize: "1.1rem",
                borderRadius: "8px",
                border: "none",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Deconectare
            </button>
          </>
        ) : (
          <>
            <h1
              style={{
                fontSize: "3rem",
                color: "#333",
                marginBottom: "20px",
                fontWeight: "bold",
              }}
            >
              Bun venit în biblioteca ta digitală!
            </h1>

            <p
              style={{
                fontSize: "1.2rem",
                color: "#555",
                maxWidth: "700px",
                marginBottom: "40px",
                marginInline: "auto",
              }}
            >
              Aici vei putea să explorezi cărți și să descoperi informații
              într-un mod rapid și ușor.
            </p>

            <Link
              to="/login"
              style={{
                padding: "12px 35px",
                backgroundColor: "#a72874ff",
                color: "white",
                fontSize: "1.1rem",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              Începe acum
            </Link>
          </>
        )}
      </div>
    </div>
  );
}