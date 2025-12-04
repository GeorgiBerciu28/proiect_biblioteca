import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
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

interface MostReadEntry {
  book: Book;
  count: number;
}

export default function MostRead() {
  const { id } = useParams<{ id: string }>();
  const [mostRead, setMostRead] = useState<MostReadEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [message,setMessage] = useState("");  
  const [book, setBook] = useState<Book | null>(null);
  const [user, setUser] = useState<any>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  useEffect(() => {
    document.title = "Cele mai citite | MyLibrary";

    fetch("http://localhost:8080/api/borrows/most-read")
      .then(res => res.json())
      .then(data => {
        console.log("MOST READ:", data);
        setMostRead(data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
  const data = localStorage.getItem("user");
  if (data) {
    const usr = JSON.parse(data);
    setUser(usr);

   
    fetch(`http://localhost:8080/favorites/${usr.id}`)
      .then((res) => res.json())
      .then((favs) => setFavorites(favs.map((f: any) => f.bookId)))
      .catch((err) => console.error(err));
  }
}, []);


  if (loading) {
    return <h2 style={{ textAlign: "center", marginTop: "40px" }}>Se încarcă...</h2>;
  }

  if (mostRead.length === 0) {
    return (
      <h2 style={{ textAlign: "center", marginTop: "40px" }}>
        Nu există date despre cele mai citite cărți.
      </h2>
    );
  }
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
    
    setMessage("Carte adăugată în coș!");
    setTimeout(() => setMessage(""), 2000);
  };
  const handleFavorite = async (bookId: number) => {
  if (!user) {
    alert("Trebuie să fii logat pentru a folosi favorite!");
    return;
  }

  const isFav = favorites.includes(bookId);

  const url = isFav
    ? "http://localhost:8080/favorites/remove"
    : "http://localhost:8080/favorites/add";

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: user.id,
      bookId: bookId,
    }),
  });

  if (!res.ok) {
    alert(await res.text());
    return;
  }

  // UI instant
  setFavorites((prev) =>
    isFav ? prev.filter((f) => f !== bookId) : [...prev, bookId]
  );
};

  return (
    <div style={{ padding: "40px" }}>
      <h2 style={{ textAlign: "center", fontSize: "2.5rem", color: "#7a0fc4" }}>
        Cele mai citite cărți
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "25px",
          marginTop: "30px",
        }}
      >
        {mostRead.map((entry) => {
          const book = entry.book;

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
                  height: "320px",
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
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: "10px"
                }}>
                
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
                    onClick={() => handleFavorite(book.id)}
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

              <p
                style={{
                  marginTop: "10px",
                  color: "black",
                  fontWeight: "bold",
                }}
              >
                Citită de <span style={{ color: "#7a0fc4" }}>{entry.count}</span> ori
              </p>

              <p
                style={{
                  marginTop: "10px",
                  color: book.status === "disponibil" ? "green" : "red",
                  fontWeight: "bold",
                }}
              >
                {book.status}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
