import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

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
}

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [popup, setPopup] = useState<string | null>(null);


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
  useEffect(() => {
    if (!user) return;

    fetch(`http://localhost:8080/favorites/${user.id}`)
      .then(res => res.json())
      .then(favs => {
        setFavorites(favs.map((f: any) => f.bookId));
      })
      .catch(err => console.error(err));
  }, [user]);
  const addToCart = (book: Book) => {
    const cart: Book[] = JSON.parse(localStorage.getItem("cart") || "[]");

    // Verifică dacă cartea există deja în coș
    const exists = cart.some(item => item.id === book.id);
    if (exists) {
      setMessage("Cartea este deja în coș!");
      setTimeout(() => setMessage(""), 2000);
      return;
    }

    cart.push(book);
    localStorage.setItem("cart", JSON.stringify(cart));

    // Trigger event pentru actualizare coș
    window.dispatchEvent(new Event("cartChanged"));
  };

  if (loading) {
    return <h2 style={{ textAlign: "center", marginTop: "60px" }}>Se încarcă cărțile...</h2>;
  }

  return (
    <>
      {/* BANNER SUPERIOR */}
      <div
        style={{
          width: "100%",
          marginLeft: "calc(50% - 50vw)",
          height: "500px",
          backgroundColor: "#fadbd5",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          paddingRight: "50px",
          overflow: "hidden",
          position: "relative"
        }}
      >
        <img
          src="/imageHome.gif"
          alt="Banner"
          style={{
            width: "500px",
            height: "auto",
            objectFit: "contain",
            display: "block",
            marginRight: "100px",
          }}
        />

        <img src="/gg.png" style={{ position: "absolute", top: "10px", left: "1700px", width: "210px" }} />
        <img src="/gjgj.png" style={{ position: "absolute", top: "0px", left: "0px", width: "1200px", zIndex: 0 }} />
        <img src="/wel.png" style={{ position: "absolute", top: "0px", left: "700px", width: "500px", zIndex: 0 }} />
        <img src="/e.png" style={{ position: "absolute", top: "150px", left: "830px", width: "230px", zIndex: 0 }} />
        <img src="/gg.png" style={{ position: "absolute", top: "320px", left: "1170px", width: "180px", zIndex: 0 }} />
        <img src="/gg.png" style={{ position: "absolute", top: "240px", left: "1220px", width: "100px", zIndex: 0 }} />
        <img src="/gg.png" style={{ position: "absolute", top: "400px", left: "1320px", width: "100px", zIndex: 0 }} />
      </div>

      <div style={{ width: "100%", minHeight: "100vh", padding: "40px" }}>
        <h2 style={{
          textAlign: "center",
          fontSize: "2.5rem",
          color: "#5f2669ff",
          marginBottom: "30px",
          marginTop: "20px"
        }}>
          📖 Colecția noastră de cărți
        </h2>

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

        {/* GRID CU CĂRȚI */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "25px",
            padding: "20px",
          }}
        >
          {books.map((book) => {
            const handleFavorite = async () => {
              if (!user) {
                setPopup("Trebuie să fii logat pentru a adauga carti la favorite!");
                return;
              }

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

              // Actualizare instantă UI
              if (isFav) {
                setFavorites(favorites.filter(id => id !== book.id));
              } else {
                setFavorites([...favorites, book.id]);
              }
            };

            return (
              <div
                key={book.id}
                style={{
                  background: "#f6e8ff",
                  padding: "15px",
                  borderRadius: "15px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                }}
              >
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
                    <Link to={`/book/${book.id}`}>
                      <img
                        src={`http://localhost:8080/uploads/${book.image}`}
                        alt="coperta"
                        style={{ width: "100%", height: "100%", objectFit: "cover", cursor: "pointer" }}
                      />
                    </Link>
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

                {/* //<h2 style={{ fontSize: "1.2rem", marginBottom: "5px" }}>{book.title}</h2> */}
                <Link
                  to={`/book/${book.id}`}
                  style={{ textDecoration: "none", color: "#4a0a78", fontWeight: "bold" }}
                >
                  <h2 style={{ fontSize: "1.2rem", marginBottom: "5px" }}>
                    {book.title}
                  </h2>
                </Link>
                <p style={{ margin: 0, fontWeight: "bold" }}>{book.author}</p>
                <p style={{ margin: 0 }}>An: {book.year}</p>

                <div style={{ margin: 0 }}>
                  {book.categories.map((cat, index) => (
                    <p
                      key={index}
                      style={{
                        margin: "2px 0",
                        fontWeight: "bold",
                        color: "#5a1e5f",
                      }}
                    >
                      {cat.replaceAll("_", " ")}
                    </p>
                  ))}
                </div>

                <p
                  style={{
                    marginTop: "10px",
                    color: book.status === "disponibil" ? "green" : "red",
                    fontWeight: "bold",
                  }}
                >
                  {book.status}
                </p>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "10px",
                    width: "100%",
                  }}
                >
                  {book.status === "disponibil" ? (
                    <button
                      onClick={() => addToCart(book)}
                      style={{
                        padding: "10px",
                        backgroundColor: "#7a0fc4",
                        color: "white",
                        border: "none",
                        borderRadius: "10px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        flexGrow: 1,
                        marginRight: "10px",
                      }}
                    >
                      Adaugă în coș
                    </button>
                  ) : (
                    <button
                      disabled
                      style={{
                        padding: "10px",
                        backgroundColor: "gray",
                        color: "white",
                        border: "none",
                        borderRadius: "10px",
                        fontWeight: "bold",
                        cursor: "not-allowed",
                        flexGrow: 1,
                        marginRight: "10px",
                      }}
                    >
                      Indisponibilă
                    </button>
                  )}

                  <button
                    onClick={handleFavorite}
                    style={{
                      width: "45px",
                      height: "45px",
                      borderRadius: "10px",
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
            );
          })}

        </div>
      </div>
      {popup && (
        <PopupMessage
          text={popup}
          onClose={() => setPopup(null)}
        />
      )}

    </>
  );
}