import { useEffect, useState } from "react";

interface Book {
  id: number;
  title: string;
  author: string;
  year: number;
  description: string;
  stock: number;
  status: string;
  image: string | null;
  categories: string[];
}

export default function EditBook() {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const [newDescription, setNewDescription] = useState("");
  const [newStatus, setNewStatus] = useState("disponibil");
  const [newCategories, setNewCategories] = useState<string[]>([]);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [newStock, setNewStock] = useState(0);
  const [message, setMessage] = useState("");

  const categoryOptions = [
    "clasica_literatura_universala",
    "fantasy",
    "science_fiction",
    "thriller_mystery_crime",
    "romantism",
    "non_fictiune_eseuri_analize_jurnale",
    "dezvoltare_personala_psihologie",
    "istorie_biografii_memorii",
    "stiinta_tehnologie",
    "poezii"
  ];

  const loadBooks = () => {
    fetch("http://localhost:8080/books")
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch((err) => console.error("Eroare la încărcare:", err));
  };

  useEffect(() => {
    loadBooks();
    document.title = "Editare carte | Administratie";
  }, []);

  const handleSelect = (book: Book) => {
    setSelectedBook(book);
    setNewDescription(book.description);
    setNewStatus(book.status);
    setNewCategories(book.categories || []);
    setNewStock(book.stock);
    setNewImage(null);
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewImage(e.target.files[0]);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBook) return;

    const updateData = {
      description: newDescription,
      status: newStatus,
      categories: newCategories,
      stock: newStock
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
      const text = await res.text();
      if (!res.ok) {
        setMessage(text); 
        return;
      }  
       // throw new Error();

      setMessage("Cartea a fost actualizată!");
      setSelectedBook(null);
      loadBooks();
    } catch (err) {
      setMessage("Eroare la actualizare.");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1 style={{ marginBottom: "25px" }}>Tabelul cărților</h1>

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

      {/* TABEL CU CĂRȚI */}
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
            <th style={th}>Status</th>
            <th style={th}>Categorie</th>
            <th style={th}>Stoc</th> 
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
              <td style={td}>{b.status}</td>
              <td style={td}>{b.categories?.join(", ") || "—"}</td>
              <td style={td}>{b.stock}</td>
              <td style={td}>
                <button
                  onClick={() => handleSelect(b)}
                  style={{
                    padding: "8px 15px",
                    background: "#6a0dad",
                    border: "none",
                    color: "white",
                    borderRadius: "8px",
                    cursor: "pointer"
                  }}
                >
                  Editează
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* FORMULAR EDITARE */}
      {selectedBook && (
        <form
          onSubmit={handleUpdate}
          style={{
            background: "#f0dfff",
            padding: "30px",
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

          {/* CATEGORII MULTIPLE */}
          <div
            style={{
              background: "white",
              padding: "15px",
              borderRadius: "10px",
              border: "1px solid #b298cf",
              maxHeight: "150px",
              overflowY: "auto",
              marginTop: "15px"
            }}
          >
            <label style={{ fontWeight: "bold" }}>Categorii:</label>

            {categoryOptions.map(cat => (
              <label key={cat} style={{ display: "block", marginTop: "6px" }}>
                <input
                  type="checkbox"
                  checked={newCategories.includes(cat)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setNewCategories([...newCategories, cat]);
                    } else {
                      setNewCategories(newCategories.filter(c => c !== cat));
                    }
                  }}
                />
                <span style={{ marginLeft: "8px" }}>{cat}</span>
              </label>
            ))}
          </div>

          <textarea
            value={newDescription}
            placeholder="Descriere"
            onChange={(e) => setNewDescription(e.target.value)}
            rows={4}
            style={{ ...inputStyle, resize: "none" }}
          />

          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            style={inputStyle}
          >
            <option value="disponibil">Disponibil</option>
            <option value="imprumutat">Împrumutat</option>
          </select>

          <input
            type="number"
            value={newStock}
            onChange={(e) => setNewStock(Number(e.target.value))}
            placeholder="Stoc"
            style={inputStyle}
          />


          <label style={{ marginTop: "10px" }}>
            Poză nouă (opțional):
          </label>
          <input type="file" accept="image/*" onChange={handleImage} />

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
              width: "100%",
              marginTop: "20px"
            }}
          >
            Salvează modificările
          </button>
        </form>
      )}
    </div>
  );
}

const th: React.CSSProperties = { padding: "12px", fontSize: "1rem" };
const td: React.CSSProperties = {
  padding: "12px",
  borderBottom: "1px solid #ddd"
};

const inputStyle = {
  padding: "12px",
  width: "100%",
  borderRadius: "8px",
  border: "1px solid #b298cf",
  marginTop: "15px"
};
