import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("Se conectează la backend...");

  useEffect(() => {
    fetch("http://localhost:8080/api/hello")
      .then((res) => res.text())
      .then((data) => setMessage(data))
      .catch(() => setMessage("Eroare la conectare cu backendul"));
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "100px", fontSize: "1.5rem" }}>
      <h1>{message}</h1>
    </div>
  );
}

export default App;
