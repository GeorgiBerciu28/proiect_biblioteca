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
  const [selectedBooks, setSelectedBooks] = useState<number[]>([]);

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
        const active = data.filter((b: BorrowRecord) => b.status === "active");
        setActiveBorrows(active);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Eroare la încărcarea împrumuturilor:", err);
        setLoading(false);
      });
  };

  const toggleSelect = (borrowId: number) => {
    setSelectedBooks((prev) =>
      prev.includes(borrowId)
        ? prev.filter((id) => id !== borrowId)
        : [...prev, borrowId]
    );
  };

  const calculateDaysRemaining = (borrowDate: string) => {
    const borrowed = new Date(borrowDate);
    const deadline = new Date(borrowed);
    deadline.setDate(deadline.getDate() + 14);

    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  const returnBooks = async () => {
    if (selectedBooks.length === 0) {
      alert("Selectează cel puțin o carte pentru returnare!");
      return;
    }

    try {
      const promises = selectedBooks.map((borrowId) =>
        fetch(`http://localhost:8080/api/borrows/${borrowId}/return`, {
          method: "PUT",
        })
      );

      await Promise.all(promises);

      alert("Cărțile au fost returnate cu succes!");
      setSelectedBooks([]);
      loadActiveBorrows();
    } catch (error) {
      console.error(error);
      alert("Eroare la returnarea cărților.");
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
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {activeBorrows.map((borrow) => {
              const daysRemaining = calculateDaysRemaining(borrow.borrowDate);
              const isOverdue = daysRemaining < 0;
              const isNearDeadline = daysRemaining <= 3 && daysRemaining >= 0;

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
                  <input
                    type="checkbox"
                    checked={selectedBooks.includes(borrow.id)}
                    onChange={() => toggleSelect(borrow.id)}
                    style={{ width: "24px", height: "24px", cursor: "pointer" }}
                  />

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
                        <p
                          style={{
                            color: "#d32f2f",
                            fontWeight: "bold",
                            fontSize: "1.1rem",
                            margin: "4px 0",
                          }}
                        >
                          ⚠️ ÎNTÂRZIERE: {Math.abs(daysRemaining)} zile
                        </p>
                      ) : isNearDeadline ? (
                        <p
                          style={{
                            color: "#f57c00",
                            fontWeight: "bold",
                            fontSize: "1.1rem",
                            margin: "4px 0",
                          }}
                        >
                          ⏰ Mai ai {daysRemaining}{" "}
                          {daysRemaining === 1 ? "zi" : "zile"} până la deadline!
                        </p>
                      ) : (
                        <p
                          style={{
                            color: "#388e3c",
                            fontWeight: "bold",
                            fontSize: "1rem",
                            margin: "4px 0",
                          }}
                        >
                          ✓ Mai ai {daysRemaining} zile
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {selectedBooks.length > 0 && (
            <div style={{ marginTop: "30px", textAlign: "center" }}>
              <button
                onClick={returnBooks}
                style={{
                  padding: "15px 40px",
                  backgroundColor: "#4caf50",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  fontSize: "1.2rem",
                  boxShadow: "0 4px 12px rgba(76, 175, 80, 0.3)",
                }}
              >
                Returnează {selectedBooks.length}{" "}
                {selectedBooks.length === 1 ? "carte" : "cărți"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
