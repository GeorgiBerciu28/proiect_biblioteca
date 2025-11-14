import { Link } from "react-router-dom";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    document.title = "Main Page | MyLibrary";
  }, []);

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
      {/* HERO SECTION */}
      <div
        style={{
          maxWidth: "900px",
        }}
      >
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
      </div>
    </div>
  );
}
