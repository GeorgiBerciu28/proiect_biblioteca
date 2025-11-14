import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  useEffect(() => {
    document.title = "Autentification | MyLibrary";
  }, []);

  const [email, setEmail] = useState("");
  const [parola, setParola] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100vh",
        fontFamily: "Arial, sans-serif",
      }}
    >

     
      <div
        style={{
          flex: 0.7,
          height: "100vh",
          overflow: "hidden",
          position: "relative",
        }}
      >
        
        <img
          src="/book2.jpg"
          alt="Login background"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
          }}
        />

        
        <h1
          style={{
            position: "absolute",
            top: "40px",
            left: "40px",
            color: "purple",
            fontSize: "3.5rem",
            fontWeight: "700",
            textShadow: "0 4px 15px rgba(0, 0, 0, 0.6)",
            letterSpacing: "3px",
            margin: 0,
          }}
        >
          Welcome back
        </h1>
      </div>

      
      <div
        style={{
          flex: 0.3,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
        <h2
          style={{
            fontFamily: "Arial, sans-serif",
            fontSize: "2rem",
            fontWeight: 700,
            marginBottom: "20px",
          }}
        >
          Register customer
        </h2>

        <form style={{ marginTop: "20px", textAlign: "center" }} onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              padding: "10px",
              width: "250px",
              marginBottom: "10px",
              borderRadius: "20px",
              border: "1px solid #ccc",
            }}
          />
          <br />

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
          <br />

          <button
            type="submit"
            style={{
              padding: "10px 20px",
              backgroundColor: "#9022a4",
              color: "white",
              border: "none",
              borderRadius: "20px",
              width: "150px",
            }}
          >
            Sign in
          </button>

          <h2
            style={{
              fontFamily: "Arial, sans-serif",
              fontSize: "1.3rem",
              fontWeight: 600,
              marginTop: "25px",
            }}
          >
            Not a member yet?
          </h2>

          <button
            type="button"
            onClick={() => navigate("/register")}
            style={{
              padding: "10px 20px",
              backgroundColor: "#9022a4",
              color: "white",
              border: "none",
              borderRadius: "20px",
              width: "150px",
            }}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
