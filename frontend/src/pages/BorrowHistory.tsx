import { useEffect, useState } from "react";

interface BorrowRecord {
  id: number;
  bookTitle: string;
  bookAuthor: string;
  bookImage: string | null;
  borrowDate: string;
  returnDate: string | null;
  status: string; // "active" sau "returned"
}

export default function BorrowHistory() {
  const [history, setHistory] = useState<BorrowRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "active" | "returned">("all");

  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    document.title = "Istoric împrumuturi";

    if (!user) {
      setLoading(false);
      return;
    }

    // Fetch borrow history from backend
    fetch(`http://localhost:8080/api/borrows/user/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setHistory(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Eroare la încărcarea istoricului:", err);
        setLoading(false);
      });
  }, []);

  if (!user) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>Trebuie să fii autentificat pentru a vedea istoricul împrumuturilor.</h2>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>Se încarcă istoricul...</h2>
      </div>
    );
  }

  const filteredHistory = history.filter((record) => {
    if (filter === "all") return true;
    if (filter === "active") return record.status === "active";
    if (filter === "returned") return record.status === "returned";
    return true;
  });

  return (
    <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px", color: "#5f2669ff" }}>
        📚 Istoricul împrumuturilor tale
      </h1>

      {/* FILTRE */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "15px",
          marginBottom: "30px",
        }}
      >
        <button
          onClick={() => setFilter("all")}
          style={{
            padding: "10px 25px",
            backgroundColor: filter === "all" ? "#7a0fc4" : "#d8c2f0",
            color: filter === "all" ? "white" : "#5f2669ff",
            border: "none",
            borderRadius: "20px",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "1rem",
          }}
        >
          Toate
        </button>

        <button
          onClick={() => setFilter("active")}
          style={{
            padding: "10px 25px",
            backgroundColor: filter === "active" ? "#7a0fc4" : "#d8c2f0",
            color: filter === "active" ? "white" : "#5f2669ff",
            border: "none",
            borderRadius: "20px",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "1rem",
          }}
        >
          Active
        </button>

        <button
          onClick={() => setFilter("returned")}
          style={{
            padding: "10px 25px",
            backgroundColor: filter === "returned" ? "#7a0fc4" : "#d8c2f0",
            color: filter === "returned" ? "white" : "#5f2669ff",
            border: "none",
            borderRadius: "20px",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "1rem",
          }}
        >
          Returnate
        </button>
      </div>

      {/* LISTA ÎMPRUMUTURI */}
      {filteredHistory.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "40px",
            backgroundColor: "#f6e8ff",
            borderRadius: "15px",
          }}
        >
          <p style={{ fontSize: "1.2rem", color: "#666" }}>
            {filter === "all"
              ? "Nu ai niciun împrumut înregistrat."
              : filter === "active"
              ? "Nu ai împrumuturi active în acest moment."
              : "Nu ai returnat nicio carte încă."}
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {filteredHistory.map((record) => (
            <div
              key={record.id}
              style={{
                display: "flex",
                gap: "20px",
                backgroundColor: "#f6e8ff",
                padding: "20px",
                borderRadius: "15px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                alignItems: "center",
              }}
            >
              {/* IMAGINE CARTE */}
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
                {record.bookImage ? (
                  <img
                    src={`http://localhost:8080/uploads/${record.bookImage}`}
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

              {/* DETALII */}
              <div style={{ flex: 1 }}>
                <h2 style={{ margin: "0 0 8px 0", fontSize: "1.4rem" }}>
                  {record.bookTitle}
                </h2>
                <p style={{ margin: "4px 0", fontSize: "1.1rem" }}>
                  <strong>Autor:</strong> {record.bookAuthor}
                </p>
                <p style={{ margin: "4px 0", fontSize: "1rem", color: "#666" }}>
                  <strong>Data împrumut:</strong>{" "}
                  {new Date(record.borrowDate).toLocaleDateString("ro-RO")}
                </p>
                {record.returnDate && (
                  <p style={{ margin: "4px 0", fontSize: "1rem", color: "#666" }}>
                    <strong>Data returnare:</strong>{" "}
                    {new Date(record.returnDate).toLocaleDateString("ro-RO")}
                  </p>
                )}
              </div>

              {/* STATUS */}
              <div
                style={{
                  padding: "10px 20px",
                  borderRadius: "20px",
                  backgroundColor:
                    record.status === "active" ? "#ffd700" : "#90ee90",
                  color: record.status === "active" ? "#8b4513" : "#006400",
                  fontWeight: "bold",
                  fontSize: "1rem",
                }}
              >
                {record.status === "active" ? "În folosință" : "Returnată"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}