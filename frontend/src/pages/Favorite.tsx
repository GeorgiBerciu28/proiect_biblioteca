import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface FavoriteEntry {
  id: number;
  userId: number;
  bookId: number;
  book: {
    id: number;
    title: string;
    author: string;
    year: number;
    status: string;
    categories: string[];
    description: string;
    image: string | null;
  };
}
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
export default function Favorite() {
  const [user, setUser] = useState<any>(null);
  const [favorites, setFavorites] = useState<FavoriteEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
        setLoading(false);
       return; 
    }

    const userObj = JSON.parse(userData);
    setUser(userObj);

    fetch(`http://localhost:8080/favorites/${userObj.id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("FAVORITE LIST:", data);
        setFavorites(data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);
   useEffect(() => {
    
    document.title = "Favorite ❤️ | MyLibrary";
  }, []);

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

  const removeFavorite = async (bookId: number) => {
    if (!user) 
       // setLoading(false);

        return( <h2 style={{ textAlign: "center", marginTop: "40px" }}>
                Înregistrează-te pentru a-ți putea vizualiza lista de favorite ❤️
                </h2>);
    
    const res = await fetch("http://localhost:8080/favorites/remove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        bookId: bookId,
      }),
    });

    if (res.ok) {
      setFavorites(favorites.filter((fav) => fav.bookId !== bookId));
    } else {
      alert(await res.text());
    }
  };

  if (loading) return <h2 style={{ textAlign: "center" }}>Se încarcă favoritele...</h2>;
   if (!user) 
       // setLoading(false);

        return( <h2 style={{ textAlign: "center", marginTop: "40px" }}>
                Înregistrează-te pentru a-ți putea vizualiza lista de favorite ❤️
                </h2>);
    

  if (favorites.length === 0)
    return <h2 style={{ textAlign: "center", marginTop: "40px" }}>Nu ai nicio carte la favorite</h2>;

  return (
    <div style={{ padding: "40px" }}>
      <h2 style={{ textAlign: "left", fontSize: "2rem", color: "#7a0fc4" }}>
        Cărțile tale favorite
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "25px",
          marginTop: "30px",
        }}
      >
        {favorites.map((fav) => (
          <div key={fav.id}
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
                height: "300px",
                background: "#d8c2f0",
                borderRadius: "10px",
                overflow: "hidden",
                marginBottom: "10px",
              }}
            >
              {fav.book.image ? (
                    <Link to={`/book/${fav.book.id}`}>
                      <img
                        src={`http://localhost:8080/uploads/${fav.book.image}`}
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
                  to={`/book/${fav.book.id}`} 
                  style={{ textDecoration: "none", color: "#4a0a78", fontWeight: "bold" }}
                >
                  <h2 style={{ fontSize: "1.2rem", marginBottom: "5px" }}>
                    {fav.book.title}
                  </h2>
              </Link>
            <p style={{ margin: 0, fontWeight: "bold" }}>{fav.book.author}</p>
            <p style={{ margin: 0 }}>An: {fav.book.year}</p>

            
           {fav.book.status === "disponibil" ? (
                      <button
                        onClick={() => addToCart(fav.book)}
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
              onClick={() => removeFavorite(fav.bookId)}
              style={{
                 padding: "10px",
                     background: "red",
                     color: "white",
                     border: "none",
                     borderRadius: "10px",
                     fontWeight: "bold",
                     cursor: "pointer",
                     flexGrow: 1,
                     marginRight: "10px",
              }}
            >
              Elimină din favorite
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
