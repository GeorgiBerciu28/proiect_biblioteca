import { Link,useParams } from "react-router-dom";
import { useEffect, useState } from "react";

interface Book {
  id: number;
  title: string;
  author: string;
  year: number;
  description: string;
  status: string;
  image: string | null;
  categories: string[];
}

export default function CategoryPage() {
  const { category } = useParams();
  const safeCategory = category ?? "";

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [favorites, setFavorites] = useState<number[]>([]);

  const categoryImages: Record<string, { src: string; top: string; left: string; width: string }[]> = {

    clasica_literatura_universala: [{ src: "/clasic.jpg", top: "0%", left: "0%", width: "100%" }],
    dezvoltare_personala_psihologie: [{ src: "/dezvoltare.jpg", top: "0%", left: "-7%", width: "110%" }],
    fantasy: [{ src: "/fantasy.jpg", top: "0%", left: "0%", width: "110%" }],
    istorie_biografii_memorii: [{ src: "/history.jpg", top: "-15%", left: "0%", width: "100%" }],
    non_fictiune_eseuri_analize_jurnale: [{ src: "/non-fiction.jpg", top: "-25%", left: "0%", width: "100%" }],
    poezii: [{ src: "/poetry.jpg", top: "-10%", left: "0%", width: "100%" }],
    romantism: [{ src: "/hearts.webp", top: "0%", left: "0%", width: "100%" }],
    science_fiction: [{ src: "/science_fiction.jpg", top: "0%", left: "0%", width: "100%" }],
    stiinta_tehnologie: [{ src: "/science.jpg", top: "-30%", left: "0%", width: "100%" }],
    thriller_mystery_crime: [{ src: "/mistery.jpg", top: "-28%", left: "0%", width: "100%" }],

  };

  const categoryLabels: Record<string, string> = {
    clasica_literatura_universala: "Clasica Literatura Universala",
    fantasy: "Fantasy",
    science_fiction: "Science Fiction",
    thriller_mystery_crime: "Thriller/Mystery/Crime",
    romantism: "Romantism",
    non_fictiune_eseuri_analize_jurnale: "Non-Fictiune (Eseuri, Analize, Jurnale)",
    dezvoltare_personala_psihologie: "Dezvoltare Personala/Psihologie",
    istorie_biografii_memorii: "Istorie/Biografii/Memorii",
    stiinta_tehnologie: "Stiinta/Tehnologie",
    poezii: "Poezii",
  };

  const categoryTextStyles: Record<string, {
    top: string;
    left: string;
    fontSize: string;
    color: string;
    fontWeight?: string;
    textShadow?: string;
  }> = {

    clasica_literatura_universala: {
      top: "7%", left: "67%",
      fontSize: "70px", color: "#43210aff",
      textShadow: "4px 4px 10px #f79c00ff"
    },

    fantasy: {
      top: "10%", left: "67%",
      fontSize: "90px", color: "#ffffffff",
      textShadow: "7px 7px 10px #000000ff"
    },

    poezii: {
      top: "30%", left: "82.5%",
      fontSize: "100px", color: "#8f2b6fff",
      textShadow: "7px 7px 10px #000000ff"
    },

    romantism: {
      top: "20%", left: "50%",
      fontSize: "100px", color: "#3b0219ff",
      fontWeight: "bold",
      textShadow: "7px 7px 10px #ffffffff"
    },

    thriller_mystery_crime: {
      top: "5%", left: "25%",
      fontSize: "80px", color: "#f3cfcfff",
      textShadow: "7px 7px 7px black"
    },

    science_fiction: {
      top: "10%", left: "80%",
      fontSize: "90px", color: "#aa9ee8ff",
      textShadow: "7px 7px 7px #aca5a5ff"
    },

    non_fictiune_eseuri_analize_jurnale: {
      top: "3%", left: "29%",
      fontSize: "60px", color: "#191142ff",
      textShadow: "7px 7px 7px #ffffffff"
    },

    dezvoltare_personala_psihologie: {
      top: "20%", left: "50%",
      fontSize: "80px", color: "#191142ff",
      textShadow: "7px 7px 7px #ffffffff"
    },

    istorie_biografii_memorii: {
      top: "3%", left: "24%",
      fontSize: "50px", color: "#191142ff",
      textShadow: "7px 7px 7px #090909ff"
    },

    stiinta_tehnologie: {
      top: "30%", left: "50%",
      fontSize: "90px", color: "#042e82ff",
      textShadow: "7px 7px 7px #090909ff"
    },

  };


  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
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
    cart.push(book);
    localStorage.setItem("cart", JSON.stringify(cart));
    window.location.href = "/borrow";
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

      // actualizare instantă UI
      if (isFav) {
        setFavorites(favorites.filter(id => id !== bookId));
      } else {
        setFavorites([...favorites, bookId]);
      }
  };

  useEffect(() => {
    document.title = `Categorie - ${safeCategory}`;
    fetch(`http://localhost:8080/books/category/${encodeURIComponent(safeCategory)}`)
      .then((res) => res.json())
      .then((data) => {
        setBooks(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [safeCategory]);

  return (
    <div style={{ width: "100%", minHeight: "100vh", marginTop: "150px" }}>

      {/* CHENAR */}
      <div
        style={{
          width: "100vw",
          height: "500px",
          position: "relative",
          overflow: "hidden",
          marginLeft: "calc(50% - 50vw)",
          marginTop: "-127px",
        }}
      >

        {/* TITLU  */}
        <h1 style={{
          position: "absolute",
          top: categoryTextStyles[safeCategory]?.top,
          left: categoryTextStyles[safeCategory]?.left,
          transform: "translate(-50%, -50%)",
          fontSize: categoryTextStyles[safeCategory]?.fontSize,
          color: categoryTextStyles[safeCategory]?.color,
          fontFamily: "Blackadder",
          textShadow: categoryTextStyles[safeCategory]?.textShadow,
          whiteSpace: "nowrap",
          zIndex: 10
        }}>
           {categoryLabels[safeCategory] || safeCategory}
        </h1>

        {(categoryImages[safeCategory] || []).map((img, index) => (
          <img
            key={index}
            src={img.src}
            style={{
              position: "absolute",
              top: img.top,
              left: img.left,
              width: img.width,
            }}
          />
        ))}
      </div>

      {/* GRID CARTI */}
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
                <div style={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                  Fără imagine
                </div>
              )}
            </div>

            {/* <h2 style={{ fontSize: "1.2rem", marginBottom: 5 }}>{book.title}</h2> */}
            <Link 
                  to={`/book/${book.id}`} 
                  style={{ textDecoration: "none", color: "#4a0a78", fontWeight: "bold" }}
                >
                  <h2 style={{ fontSize: "1.2rem", marginBottom: "5px" }}>
                    {book.title}
                  </h2>
            </Link>
            <p style={{ fontWeight: "bold" }}>{book.author}</p>
            <p>An: {book.year}</p>

            {book.categories.map((cat, index) => (
              <p key={index} style={{ margin: "3px 0", fontWeight: "bold", color: "#5a1e5f" }}>
                {cat.replaceAll("_", " ")}
              </p>
            ))}

            <p style={{ color: book.status === "disponibil" ? "green" : "red", fontWeight: "bold" }}>
              {book.status}
            </p>

            {user && (
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
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
