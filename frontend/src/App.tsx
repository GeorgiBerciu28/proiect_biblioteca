import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <Router>
      <nav
        style={{
          width: "100%",
          height: "80px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 32px",
          boxSizing: "border-box",
          backgroundColor: "black",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          position: "fixed",     
          top: 0,
          left: 0,
          zIndex: 1000,
        }}
      >
        <h2 style={{ margin: 0, whiteSpace: "nowrap", color: "white" }}>
          📖 Library FGG
        </h2>

        <Link
          to="/login"
          style={{
            display: "inline-block",
            padding: "10px 25px",
            backgroundColor: "#9022a4",
            color: "white",
            borderRadius: "20px",
            textDecoration: "none",
            fontWeight: "bold",
            fontSize: "1rem",
            whiteSpace: "nowrap",
          }}
        >
          Sign in
        </Link>
      </nav>

      {/* 🔹 CONTENTUL PAGINILOR (spațiu sub navbar) */}
      <div style={{ paddingTop: "100px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>

    </Router>
  );
}

export default App;
