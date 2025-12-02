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

export default function Borrow() {
  const [cart, setCart] = useState<Book[]>([]);
  const [selectedBooks, setSelectedBooks] = useState<number[]>([]);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    document.title = "Coșul de împrumuturi";

    const stored = localStorage.getItem("cart");
    const cartData: Book[] = stored ? JSON.parse(stored) : [];
    setCart(cartData);
  }, []);

  const toggleSelect = (bookId: number) => {
    setSelectedBooks((prev) =>
      prev.includes(bookId)
        ? prev.filter((id) => id !== bookId)
        : [...prev, bookId]
    );
  };

  const removeFromCart = (bookId: number) => {
    const newCart = cart.filter((b) => b.id !== bookId);
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    setSelectedBooks((prev) => prev.filter((id) => id !== bookId));
  };

  const confirmBorrow = async () => {
    if (selectedBooks.length === 0) {
      alert("Selectează cel puțin o carte!");
      return;
    }

    if (!user) {
      alert("Trebuie să fii autentificat!");
      return;
    }

try {
      const response = await fetch("http://localhost:8080/books/borrow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          bookIds: selectedBooks,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        alert("Eroare: " + text);
        return;
      }

      alert("Împrumut efectuat!");

      localStorage.removeItem("cart");
      setCart([]);
      setSelectedBooks([]);

    } catch (error) {
      console.error(error);
      alert("Eroare de conexiune cu serverul.");
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "left", marginBottom: "20px" }}>Coșul tău</h1>

      {cart.length === 0 && (
        <p style={{ textAlign: "left" }}>Nu ai adăugat nicio carte în coș.</p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
        {cart.map((book) => (
          <div
            key={book.id}
            style={{
              display: "flex",
              gap: "15px",
              backgroundColor: "#f2e6ff",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              alignItems: "flex-start",
            }}
          >
            <input
              type="checkbox"
              checked={selectedBooks.includes(book.id)}
              onChange={() => toggleSelect(book.id)}
              style={{ width: "20px", height: "20px", marginTop: "5px" }}
            />

            <div
              style={{
                width: "120px",
                height: "160px",
                backgroundColor: "#d8c2f0",
                borderRadius: "8px",
                overflow: "hidden",
                flexShrink: 0,
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
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#6a3faa",
                  }}
                >
                  Fără imagine
                </div>
              )}
            </div>

            <div style={{ textAlign: "left", width: "100%" }}>
              <h2 style={{ marginBottom: "5px" }}>{book.title}</h2>
              <p><strong>Autor:</strong> {book.author}</p>
              <p><strong>An:</strong> {book.year}</p>
              <p><strong>Tip:</strong> {book.type}</p>
              <p><strong>Descriere:</strong> {book.description}</p>
            </div>

            <button
              onClick={() => removeFromCart(book.id)}
              style={{
                backgroundColor: "#ff4d4d",
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "8px 12px",
                cursor: "pointer",
                height: "40px",
                marginLeft: "auto",
                fontWeight: "bold",
              }}
            >
              Șterge
            </button>
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        <button
          onClick={confirmBorrow}
          style={{
            marginTop: "30px",
            padding: "12px 20px",
            backgroundColor: "#7a0fc4",
            color: "white",
            border: "none",
            borderRadius: "10px",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "1.1rem",
            display: "block",
            marginLeft: "auto",
          }}
        >
          Confirmă împrumutul
        </button>
      )}
    </div>
  );
}
