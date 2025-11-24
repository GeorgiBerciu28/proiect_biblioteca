import { Link ,useNavigate} from "react-router-dom";
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

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const loadBooks = () => {
    fetch("http://localhost:8080/books")
      .then((res) => res.json())
      .then((data) => {
        setBooks(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Eroare la fetch:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    document.title = "Main Page | MyLibrary";

    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }

    loadBooks();
  }, []);
  const addToCart = (book: Book) => {

  const cart: Book[] = JSON.parse(localStorage.getItem("cart") || "[]");
  cart.push(book);
  localStorage.setItem("cart", JSON.stringify(cart));
  navigate("/borrow");
  };

  const borrowBook = async (id: number) => {
    const res = await fetch(`http://localhost:8080/books/borrow/${id}`, {
      method: "PUT",
    });

    if (res.ok) {
      setMessage("Cartea a fost împrumutată!");
      loadBooks();
    } else {
      const text = await res.text();
      setMessage(text || "Nu s-a putut împrumuta cartea.");
    }

    setTimeout(() => setMessage(""), 3000);
  };

  if (loading) {
    return <h2 style={{ textAlign: "center", marginTop: "60px" }}>Se încarcă cărțile...</h2>;
  }

  return (
    <div style={{ width: "100%", minHeight: "100vh", padding: "40px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px", fontSize: "2.5rem" }}>
        Bun venit în biblioteca interactivă care iti permite 
        sa iti imprumuti cartea online,
        dar trebuie sa te dai jos din pat pentru a o putea citii!
      </h1>

      {/* Mesaj */}
      {message && (
        <div
          style={{
            textAlign: "center",
            padding: "12px",
            marginBottom: "20px",
            backgroundColor: "#d8b4e2",
            borderRadius: "10px",
            fontWeight: "bold",
          }}
        >
          {message}
        </div>
      )}

      {/* GRID CU CARTI */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "25px",
          padding: "20px",
        }}
      >
        {books.map((book) => (
          <div
            key={book.id}
            style={{
              background: "#f6e8ff",
              padding: "15px",
              borderRadius: "15px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
          >
            {/* Imagine */}
            <div
              style={{
                width: "100%",
                height: "360px",
                background: "#d8c2f0",
                borderRadius: "10px",
                overflow: "hidden",
                marginBottom: "10px",
              }}
            >
              {book.image ? (
                <img
                  src={`http://localhost:8080/uploads/${book.image}`}
                  alt="coperta"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <div
                  style={{
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "#7a4fa1",
                  }}
                >
                  Fără imagine
                </div>
              )}
            </div>

            {/* Detalii carte */}
            <h2 style={{ fontSize: "1.2rem", marginBottom: "5px" }}>{book.title}</h2>
            <p style={{ margin: 0, fontWeight: "bold" }}>{book.author}</p>
            <p style={{ margin: 0 }}>An: {book.year}</p>
            <p style={{ margin: 0 }}>Tip: {book.type}</p>

            {/* Status */}
            <p
              style={{
                marginTop: "10px",
                color: book.status === "disponibil" ? "green" : "red",
                fontWeight: "bold",
              }}
            >
              {book.status}
            </p>

            {/* Buton IMPRUMUTA */}
            {user && book.status === "disponibil" && (
              <button
                onClick={() => addToCart(book)}
                style={{
                  marginTop: "10px",
                  width: "100%",
                  padding: "10px",
                  backgroundColor: "#7a0fc4",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Împrumută
              </button>
            )}

            {/* Dacă e imprumutată */}
            {user && book.status !== "disponibil" && (
              <button
                disabled
                style={{
                  marginTop: "10px",
                  width: "100%",
                  padding: "10px",
                  backgroundColor: "gray",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  fontWeight: "bold",
                  cursor: "not-allowed",
                }}
              >
                Indisponibilă
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
