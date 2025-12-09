import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PopupMessage from "./PopUpMessage";

interface Book {
  id: number;
  title: string;
  author: string;
  year: number;
  categories: string[];
  status: string;
  description: string;
  image: string | null;
  pdf: string | null;
}

export default function BookDetail() {
  const { id } = useParams<{ id: string }>();

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState<any>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [message, setMessage] = useState("");

  const [popup, setPopup] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Details | MyLibrary";
  }, []);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
  }, []);

  useEffect(() => {
    fetch(`http://localhost:8080/books/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setBook(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!user) return;

    fetch(`http://localhost:8080/favorites/${user.id}`)
      .then((res) => res.json())
      .then((data) => setFavorites(data.map((f: any) => f.bookId)))
      .catch((err) => console.error(err));
  }, [user]);

  const addToCart = () => {
    if (!book) return;

    const cart: Book[] = JSON.parse(localStorage.getItem("cart") || "[]");

    if (cart.some((item) => item.id === book.id)) {
      setMessage("Cartea este deja în coș!");
      return;
    }

    cart.push(book);
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartChanged"));

    setMessage("Carte adăugată în coș!");
  };

  const handleFavorite = async () => {
    if (!user) {
      setPopup("Trebuie să fii logat pentru a putea adauga carti la favorite!");
      return;
    }

    if (!book) return;

    const isFav = favorites.includes(book.id);

    const url = isFav
      ? "http://localhost:8080/favorites/remove"
      : "http://localhost:8080/favorites/add";

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        bookId: book.id,
      }),
    });

    if (!res.ok) {
      alert(await res.text());
      return;
    }

    if (isFav) {
      setFavorites(favorites.filter((f) => f !== book.id));
    } else {
      setFavorites([...favorites, book.id]);
    }
  };

  if (loading) return <h2 style={{ marginTop: "100px" }}>Se încarcă...</h2>;
  if (!book) return <h2 style={{ marginTop: "100px" }}>Cartea nu a fost găsită.</h2>;

  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "120px auto" }}>

      {message && (
        <p style={{ color: "green", fontWeight: "bold" }}>{message}</p>
      )}

      <div
        style={{
          display: "flex",
          gap: "40px",
          marginTop: "20px",
          alignItems: "flex-start"
        }}
      >

        {/* ⭐ COLUMNA STÂNGĂ: IMAGINE + BUTON PDF */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          
          <div
            style={{
              width: "300px",
              height: "450px",
              overflow: "hidden",
              borderRadius: "10px",
              flexShrink: 0
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
                  background: "#ddd",
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                Fără imagine
              </div>
            )}
          </div>

          {/* ⭐ BUTONUL PDF SUB IMAGINE */}
          {book.pdf && (
            <button
              onClick={() => {
                if (!user) {
                  setPopup("Trebuie să fii logat pentru a citi online această carte!");
                  return;
                }

                if (user.subscriptionStatus !== "active") {
                  setPopup("Ai nevoie de un abonament activ pentru a citi online!");
                  return;
                }

                window.open(`http://localhost:8080/uploads/${book.pdf}`, "_blank");
              }}
              style={{
                marginTop: "15px",
                width: "300px",
                padding: "12px",
                backgroundColor: "#6b179c",
                color: "white",
                border: "none",
                borderRadius: "10px",
                fontSize: "1rem",
                cursor: "pointer",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              📖 Citește online
            </button>
          )}

        </div>

        {/* ⭐ COLUMNA DREAPTĂ: DETALII CARTE */}
        <div
          style={{
            flexGrow: 1,
            background: "#f3d9ff",
            padding: "30px",
            borderRadius: "18px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            minWidth: "300px",
          }}
        >
          <h1 style={{ color: "#6b179c", fontSize: "2rem", marginBottom: "15px" }}>
            {book.title}
          </h1>

          <p><strong>Autor:</strong> {book.author}</p>
          <p><strong>An:</strong> {book.year}</p>
          <p><strong>Categorii:</strong> {book.categories.join(", ")}</p>
          <p><strong>Status:</strong> {book.status}</p>

          <h3 style={{ marginTop: "20px", color: "#4d0b71" }}>Descriere</h3>
          <p style={{ lineHeight: "1.6" }}>{book.description}</p>

          {/* BUTOANE */}
          <div style={{ display: "flex", gap: "20px", marginTop: "30px" }}>

            {book.status === "disponibil" ? (
              <button
                onClick={addToCart}
                style={{
                  padding: "12px 20px",
                  backgroundColor: "#7a0fc4",
                  color: "white",
                  borderRadius: "10px",
                  border: "none",
                  fontSize: "1rem",
                  cursor: "pointer",
                }}
              >
                Adaugă în coș
              </button>
            ) : (
              <button
                disabled
                style={{
                  padding: "12px 20px",
                  backgroundColor: "gray",
                  color: "white",
                  borderRadius: "10px",
                  border: "none",
                }}
              >
                Indisponibilă
              </button>
            )}

            <button
              onClick={handleFavorite}
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "white",
                border: "2px solid #7a0fc4",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
                padding: 0,
              }}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill={favorites.includes(book.id) ? "red" : "none"}
                stroke={favorites.includes(book.id) ? "red" : "#7a0fc4"}
                strokeWidth="2"
              >
                <path d="M12 21s-7-4.35-10-9.5S4.5 3 7.5 5.5 12 10 12 10s2.5-4.5 5.5-4.5S22 7.5 22 11.5 12 21 12 21z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {popup && (
        <PopupMessage text={popup} onClose={() => setPopup(null)} />
      )}
    </div>
  );
}
