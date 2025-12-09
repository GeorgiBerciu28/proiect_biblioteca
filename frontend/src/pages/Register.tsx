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
        navigate("/login");
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
          <p style={{ color: "red", fontSize: "0.9rem", marginBottom: "10px" }}>
            {error}
          </p>
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
            onChange={(e) => setEmail(e.target.value)}
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
            style={{
              padding: "12px",
              backgroundColor: "#9022a4",
              color: "white",
              width: "150px",
              border: "none",
              borderRadius: "20px",
              marginTop: "10px",
              fontSize: "1rem",
              fontWeight: "bold",
              cursor: "pointer",
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