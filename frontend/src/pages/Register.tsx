import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PopupMessage from "./PopUpMessage";

export default function Register() {
  useEffect(() => {
    document.title = "Create Account | MyLibrary";
  }, []);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [parola, setParola] = useState("");
  const [confirmParola, setConfirmParola] = useState("");
  const [error, setError] = useState("");
  const [popup, setPopup] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validare frontend pentru @library
    if (email.toLowerCase().includes("@library")) {
      setError("⚠️ Domeniul @library este rezervat exclusiv pentru administratori!");
      return;
    }

    if (parola !== confirmParola) {
      setError("Parolele nu coincid!");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password: parola,
        }),
      });

      const data = await response.json();

      if (data.id) {
        setPopup(data.message || "Înregistrare reușită!");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        setError(data.message || "Eroare la înregistrare!");
      }
    } catch (error) {
      setError("Eroare de conexiune la server!");
      console.error("Error:", error);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        backgroundImage: "url('/book3.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "40px 50px",
          width: "350px",
          borderRadius: "20px",
          boxShadow: "0 4px 25px rgba(0, 0, 0, 0.25)",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "10px", fontSize: "1.6rem" }}>
          Create New Customer Account
        </h2>

        {error && (
          <div
            style={{
              backgroundColor: "#ffe6e6",
              color: "#c00",
              padding: "10px",
              borderRadius: "10px",
              marginBottom: "15px",
              border: "1px solid #ffb3b3",
              fontSize: "0.9rem",
              fontWeight: "bold",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            style={{
              padding: "10px",
              width: "250px",
              marginBottom: "20px",
              borderRadius: "20px",
              border: "1px solid #ccc",
            }}
          />

          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            style={{
              padding: "10px",
              width: "250px",
              marginBottom: "20px",
              borderRadius: "20px",
              border: "1px solid #ccc",
            }}
          />

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              // Curățăm eroarea dacă utilizatorul modifică email-ul
              if (error.includes("@library")) {
                setError("");
              }
            }}
            required
            style={{
              padding: "10px",
              width: "250px",
              marginBottom: email.toLowerCase().includes("@library") ? "5px" : "20px",
              borderRadius: "20px",
              border: email.toLowerCase().includes("@library") 
                ? "2px solid #ff4444" 
                : "1px solid #ccc",
            }}
          />

          {email.toLowerCase().includes("@library") && (
            <p style={{ 
              color: "#ff4444", 
              fontSize: "0.85rem", 
              marginTop: "0",
              marginBottom: "15px",
              fontWeight: "bold",
              textAlign: "left",
              paddingLeft: "10px"
            }}>
              ⚠️ Domeniul @library este rezervat pentru administratori
            </p>
          )}

          <input
            type="password"
            placeholder="Password"
            value={parola}
            onChange={(e) => setParola(e.target.value)}
            required
            style={{
              padding: "10px",
              width: "250px",
              marginBottom: "20px",
              borderRadius: "20px",
              border: "1px solid #ccc",
            }}
          />

          <input
            type="password"
            placeholder="Confirm password"
            value={confirmParola}
            onChange={(e) => setConfirmParola(e.target.value)}
            required
            style={{
              padding: "10px",
              width: "250px",
              marginBottom: "20px",
              borderRadius: "20px",
              border: "1px solid #ccc",
            }}
          />

          <button
            type="submit"
            disabled={email.toLowerCase().includes("@library")}
            style={{
              padding: "12px",
              backgroundColor: email.toLowerCase().includes("@library") 
                ? "#cccccc" 
                : "#9022a4",
              color: "white",
              width: "150px",
              border: "none",
              borderRadius: "20px",
              marginTop: "10px",
              fontSize: "1rem",
              fontWeight: "bold",
              cursor: email.toLowerCase().includes("@library") 
                ? "not-allowed" 
                : "pointer",
              opacity: email.toLowerCase().includes("@library") ? 0.6 : 1,
              transition: "all 0.3s",
            }}
          >
            Sign up
          </button>
        </form>
      </div>
      {popup && (
        <PopupMessage 
          text={popup} 
          onClose={() => setPopup(null)} 
        />
      )}
    </div>
  );
}