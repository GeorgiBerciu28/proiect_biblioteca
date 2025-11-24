import { useEffect, useState } from "react";

interface Book {
  id: number;
  title: string;
  author: string;
  year: number;
  type: String;
  status: string;
  image: string | null;
  description : String;
}

export default function DeleteBook() {
  const [books, setBooks] = useState<Book[]>([]);
  const [message, setMessage] = useState("");
  useEffect(() => {
      document.title = "Stergere | Administratie";
  }, []);
  // Load books from backend
  const loadBooks = () => {
    fetch("http://localhost:8080/books")
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadBooks();
  }, []);

  // Delete
  const handleDelete = async (id: number) => {
  if (!confirm("Sigur vrei să ștergi această carte?")) return;

  try {
    const res = await fetch(`http://localhost:8080/books/${id}`, {
      method: "DELETE",
    });

    const text = await res.text(); // citim textul trimis de backend

    if (!res.ok) {
      setMessage(text);  // afișăm mesajul real
      return;
    }

    setMessage(text);  // "Cartea a fost ștearsă."
    loadBooks();

  } catch (err) {
    setMessage("Eroare de conexiune cu serverul.");
  }
};


  return (
    <div style={{ padding: "40px" }}>
      <h1 style={{ textAlign: "left", marginBottom: "25px" }}>
        Tabelul cartilor din biblioteca
      </h1>

      {message && (
        <div
          style={{
            marginBottom: "20px",
            padding: "12px",
            background: "#e3c1e9",
            borderRadius: "10px",
            textAlign: "center",
            fontWeight: "bold",
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
        <thead style={{ background: "#a35acb", color: "white" }}>
          <tr>
            <th style={th}>ID</th>
            <th style={th}>Copertă</th>
            <th style={th}>Titlu</th>
            <th style={th}>Autor</th>
            <th style={th}>An</th>
            <th style={th}>Tip</th>
            <th style={th}>Disponibilitate</th>
            <th style={th}>Descriere</th>
            <th style={th}>Acțiune</th>
          </tr>
        </thead>

        <tbody>
          {books.map((b) => (
            <tr key={b.id} style={{ textAlign: "center" }}>
              <td style={td}>{b.id}</td>

              <td style={td}>
                {b.image ? (
                  <img
                    src={`http://localhost:8080/uploads/${b.image}`}
                    style={{ width: "60px", height: "80px", objectFit: "cover" }}
                  />
                ) : (
                  "—"
                )}
              </td>

              <td style={td}>{b.title}</td>
              <td style={td}>{b.author}</td>
              <td style={td}>{b.year}</td>
              <td style={td}>{b.type}</td>

            {/* Disponibilitate */}
              <td style={td}>
              {b.status === "disponibil" ? (
                <span style={{ color: "green", fontWeight: "bold" }}>Disponibilă</span>
              ) : (
                <span style={{ color: "red", fontWeight: "bold" }}>Împrumutată</span>
              )}
             </td>

        <td style={td}>{b.description || "—"}</td>

              <td style={td}>
                <button
                  onClick={() => handleDelete(b.id)}
                  style={{
                    padding: "8px 15px",
                    background: "red",
                    border: "none",
                    color: "white",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Șterge
                </button>
              </td>
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
