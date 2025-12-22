import { useEffect, useState } from "react";

interface BorrowRecord {
  id: number;
  bookId: number;
  bookTitle: string;
  bookAuthor: string;
  bookImage: string | null;
  borrowDate: string;
  returnDate: string | null;
  status: string;
}

export default function ReturnBooks() {
  const [activeBorrows, setActiveBorrows] = useState<BorrowRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRatings, setSelectedRatings] = useState<{ [key: number]: number }>({});
  const [hoverRatings, setHoverRatings] = useState<{ [key: number]: number }>({});
  const [message, setMessage] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    document.title = "Returnare cărți";
    loadActiveBorrows();
  }, []);

  const loadActiveBorrows = () => {
    if (!user) {
      setLoading(false);
      return;
    }

    fetch(`http://localhost:8080/api/borrows/user/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        const active = data.filter((b: BorrowRecord) =>
          ["active", "reserved"].includes(b.status.toLowerCase())
        );
        setActiveBorrows(active);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Eroare la încărcarea împrumuturilor:", err);
        setLoading(false);
      });
  };

  const calculateDaysRemaining = (borrowDate: string) => {
    const borrowed = new Date(borrowDate);
    const deadline = new Date(borrowed);
    deadline.setDate(deadline.getDate() + 14);
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const submitRatingAndReturn = async (borrow: BorrowRecord) => {
    const rating = selectedRatings[borrow.id] || 0;
    if (rating === 0) {
      setMessage("Te rog să selectezi un rating!");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    try {
      
      const ratingRes = await fetch("http://localhost:8080/api/ratings/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          bookId: borrow.bookId,
          rating: rating,
        }),
      });

      if (!ratingRes.ok) throw new Error("Eroare la salvarea rating-ului");

      
      const returnRes = await fetch(
        `http://localhost:8080/api/borrows/${borrow.id}/return`,
        { method: "PUT" }
      );

      if (!returnRes.ok) throw new Error("Eroare la returnarea cărții");

      setMessage(`Mulțumim pentru rating! Cartea "${borrow.bookTitle}" a fost returnată cu succes! ⭐`);
      setTimeout(() => setMessage(""), 4000);

      setSelectedRatings((prev) => ({ ...prev, [borrow.id]: 0 }));
      setHoverRatings((prev) => ({ ...prev, [borrow.id]: 0 }));

      loadActiveBorrows();
    } catch (error) {
      console.error(error);
      setMessage("Eroare la returnarea cărții. Te rog încearcă din nou.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  if (!user) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>Trebuie să fii autentificat pentru a returna cărți.</h2>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>Se încarcă...</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px", color: "#5f2669ff" }}>
        📚 Returnare cărți împrumutate
      </h1>

      {message && (
        <div
          style={{
            textAlign: "center",
            padding: "15px",
            marginBottom: "20px",
            backgroundColor: message.includes("Eroare") ? "#ffebee" : "#e8f5e9",
            color: message.includes("Eroare") ? "#c62828" : "#2e7d32",
            borderRadius: "10px",
            fontWeight: "bold",
            fontSize: "1.1rem",
          }}
        >
          {message}
        </div>
      )}

      {activeBorrows.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px",
            backgroundColor: "#f6e8ff",
            borderRadius: "20px",
          }}
        >
          <p style={{ fontSize: "1.5rem", color: "#666" }}>
            Nu ai cărți împrumutate în acest moment.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {activeBorrows.map((borrow) => {
            const daysRemaining = calculateDaysRemaining(borrow.borrowDate);
            const isOverdue = daysRemaining < 0;
            const isNearDeadline = daysRemaining <= 3 && daysRemaining >= 0;
            const selectedRating = selectedRatings[borrow.id] || 0;
            const hoverRating = hoverRatings[borrow.id] || 0;

            return (
              <div
                key={borrow.id}
                style={{
                  display: "flex",
                  gap: "20px",
                  backgroundColor: isOverdue
                    ? "#ffe6e6"
                    : isNearDeadline
                    ? "#fff4e6"
                    : "#f6e8ff",
                  padding: "25px",
                  borderRadius: "15px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  alignItems: "center",
                  border: isOverdue
                    ? "3px solid #ff4444"
                    : isNearDeadline
                    ? "3px solid #ff9800"
                    : "none",
                }}
              >
                <div
                  style={{
                    width: "100px",
                    height: "140px",
                    backgroundColor: "#d8c2f0",
                    borderRadius: "10px",
                    overflow: "hidden",
                    flexShrink: 0,
                  }}
                >
                  {borrow.bookImage ? (
                    <img
                      src={`http://localhost:8080/uploads/${borrow.bookImage}`}
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
                        color: "#7a4fa1",
                      }}
                    >
                      Fără imagine
                    </div>
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <h2 style={{ margin: "0 0 8px 0", fontSize: "1.5rem" }}>
                    {borrow.bookTitle}
                  </h2>
                  <p style={{ margin: "4px 0", fontSize: "1.1rem" }}>
                    <strong>Autor:</strong> {borrow.bookAuthor}
                  </p>
                  <p style={{ margin: "4px 0", fontSize: "1rem", color: "#666" }}>
                    <strong>Data împrumut:</strong>{" "}
                    {new Date(borrow.borrowDate).toLocaleDateString("ro-RO")}
                  </p>

                  <div style={{ marginTop: "10px" }}>
                    {isOverdue ? (
                      <p style={{ color: "#d32f2f", fontWeight: "bold", fontSize: "1.1rem", margin: "4px 0" }}>
                        ⚠️ ÎNTÂRZIERE: {Math.abs(daysRemaining)} zile
                      </p>
                    ) : isNearDeadline ? (
                      <p style={{ color: "#f57c00", fontWeight: "bold", fontSize: "1.1rem", margin: "4px 0" }}>
                        ⏰ Mai ai {daysRemaining} {daysRemaining === 1 ? "zi" : "zile"} până la deadline!
                      </p>
                    ) : (
                      <p style={{ color: "#388e3c", fontWeight: "bold", fontSize: "1rem", margin: "4px 0" }}>
                        ✓ Mai ai {daysRemaining} zile
                      </p>
                    )}
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "15px", flexWrap: "wrap" }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        onClick={() => setSelectedRatings((prev) => ({ ...prev, [borrow.id]: star }))}
                        onMouseEnter={() => setHoverRatings((prev) => ({ ...prev, [borrow.id]: star }))}
                        onMouseLeave={() => setHoverRatings((prev) => ({ ...prev, [borrow.id]: 0 }))}
                        style={{
                          fontSize: "2.5rem",
                          cursor: "pointer",
                          color: star <= (hoverRating || selectedRating) ? "#FFD700" : "#ccc",
                          transition: "all 0.2s ease",
                          transform: star === hoverRating ? "scale(1.2)" : "scale(1)",
                        }}
                      >
                        ★
                      </span>
                    ))}
                    {selectedRating > 0 && (
                      <span style={{ marginLeft: "10px", fontWeight: "bold", color: "#7a0fc4" }}>
                        {selectedRating === 1 && "⭐ Mediocră"}
                        {selectedRating === 2 && "⭐⭐ Slab"}
                        {selectedRating === 3 && "⭐⭐⭐ Acceptabil"}
                        {selectedRating === 4 && "⭐⭐⭐⭐ Foarte bună"}
                        {selectedRating === 5 && "⭐⭐⭐⭐⭐ Excelentă"}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => submitRatingAndReturn(borrow)}
                    style={{
                      padding: "12px 24px",
                      marginTop: "15px",
                      backgroundColor: selectedRating > 0 ? "#4caf50" : "#ccc",
                      color: "white",
                      border: "none",
                      borderRadius: "10px",
                      fontWeight: "bold",
                      cursor: selectedRating > 0 ? "pointer" : "not-allowed",
                      fontSize: "1.1rem",
                      transition: "background-color 0.2s",
                    }}
                    disabled={selectedRating === 0}
                    onMouseEnter={(e) => { if (selectedRating > 0) e.currentTarget.style.backgroundColor = "#45a049"; }}
                    onMouseLeave={(e) => { if (selectedRating > 0) e.currentTarget.style.backgroundColor = "#4caf50"; }}
                  >
                    Confirmă returnarea
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
