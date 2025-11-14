import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {

  useEffect(() => {
    document.title = "Create Account | MyLibrary";
  }, []);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [parola, setParola] = useState("");
  const [confirmParola, setConfirmParola] = useState("");

  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("First name:", firstName);
    console.log("Last name:", lastName);
    console.log("Email:", email);
    console.log("Parola:", parola);
    console.log("Confirm parola:", confirmParola);

    navigate("/login");
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

        <form onSubmit={handleRegister}>

          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
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
    </div>
  );
}


