import { useEffect, useState } from "react";

interface Book {
  id: number;
  title: string;
  author: string;
  year: number;
  type: string;
  status: string;
  description: string;
  image: string | null;
}

export default function EditBook() {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [newType, setNewType] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newImage, setNewImage] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  // Load books from backend
  const loadBooks = () => {
    fetch("http://localhost:8080/books")
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch((err) => console.error("Eroare la încărcare:", err));
  };

  useEffect(() => {
    loadBooks();
    document.title = "Stergere | Administratie";
  }, []);

  // Select book from table
  const handleSelect = (book: Book) => {
    setSelectedBook(book);
    setNewType(book.type);
    setNewStatus(book.status);
    setNewDescription(book.description);
    setNewImage(null); // reset imagine
  };

  // Upload new image
  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewImage(e.target.files[0]);
    }
  };

  // Submit update
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBook) return;

    const updateData = {
      type: newType,
      description: newDescription,
      status: newStatus
    };

    const formData = new FormData();
    formData.append(
      "data",
      new Blob([JSON.stringify(updateData)], { type: "application/json" })
    );

    if (newImage) {
      formData.append("image", newImage);
    }

    try {
      const res = await fetch(`http://localhost:8080/books/${selectedBook.id}`, {
        method: "PUT",
        body: formData
      });

      if (!res.ok) throw new Error();

      setMessage("Cartea a fost actualizată!");
      setSelectedBook(null);
      loadBooks();
    } catch (err) {
      console.error(err);
      setMessage("Eroare la actualizare.");
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
            padding: "12px",
            marginBottom: "20px",
            background: "#dcb8ff",
            borderRadius: "10px",
            textAlign: "center",
            fontWeight: "bold"
          }}
        >
          {message}
        </div>
      )}

      {/* --- TABEL CU CARTI --- */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          borderRadius: "15px",
          overflow: "hidden",
          marginBottom: "40px"
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
            <th style={th}>Status</th>
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
              <td style={td}>{b.status}</td>

              <td style={td}>
                <button
                  style={{
                    padding: "8px 15px",
                    background: "#6a0dad",
                    border: "none",
                    color: "white",
                    borderRadius: "8px",
                    cursor: "pointer"
                  }}
                  onClick={() => handleSelect(b)}
                >
                  Editează
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* --- FORMULAR DE EDITARE --- */}
      {selectedBook && (
        <form
          onSubmit={handleUpdate}
          style={{
            background: "#f0dfff",
            padding: "50px",
            borderRadius: "15px",
            maxWidth: "600px",
            margin: "0 auto"
          }}
        >
          <h2 style={{ textAlign: "center" }}>
            Editare: {selectedBook.title}
          </h2>

          <p><b>Autor:</b> {selectedBook.author}</p>
          <p><b>An:</b> {selectedBook.year}</p>

          <input
            type="text"
            value={newType}
            placeholder="Tip / gen roman"
            onChange={(e) => setNewType(e.target.value)}
            style={input}
          />

          <textarea
            value={newDescription}
            placeholder="Descriere"
            onChange={(e) => setNewDescription(e.target.value)}
            rows={4}
            style={{ ...input, resize: "none" }}
          />

          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            style={input}
          >
            <option value="disponibil">Disponibil</option>
            <option value="imprumutat">Împrumutat</option>
          </select>

          <label style={{ marginTop: "10px", display: "block" }}>
            Poza nouă (opțional):
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
            style={{ marginBottom: "15px" }}
          />

          <button
            type="submit"
            style={{
              padding: "12px",
              background: "#6a0dad",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontSize: "1.2rem",
              cursor: "pointer",
              width: "100%"
            }}
          >
            Salvează modificările
          </button>
        </form>
      )}
    </div>
  );
}

const th: React.CSSProperties = {
  padding: "12px",
  fontSize: "1rem"
};

const td: React.CSSProperties = {
  padding: "12px",
  borderBottom: "1px solid #ddd"
};

const input: React.CSSProperties = {
  padding: "12px",
  width: "100%",
  borderRadius: "8px",
  border: "1px solid #b298cf",
  marginBottom: "12px"
};
