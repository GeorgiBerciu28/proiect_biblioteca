import { useEffect, useState } from "react";

interface BorrowRecord {
  id: number;
  bookTitle: string;
  bookAuthor: string;
  bookImage: string | null;
  borrowDate: string | null;
  returnDate: string | null;
  dueDate?: string | null;
  status: string;
  reservationDate?: string | null;
  reservationExpiresAt?: string | null;
}

export default function BorrowHistory() {
  const [history, setHistory] = useState<BorrowRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "active" | "returned">("all");
  const [now, setNow] = useState<number>(Date.now());

  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    document.title = "Istoric împrumuturi";

    if (!user) {
      setLoading(false);
      return;
    }

    fetch(`http://localhost:8080/api/borrows/user/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setHistory(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(interval);
  }, []);

  const getRemainingTime = (expiresAt?: string | null) => {
    if (!expiresAt) return null;

    const diffMs = new Date(expiresAt).getTime() - now;
    if (diffMs <= 0) return "Rezervare expirată";

    const totalMinutes = Math.floor(diffMs / 60000);
    const days = Math.floor(totalMinutes / (60 * 24));
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
    const minutes = totalMinutes % 60;

    const parts = [];
    if (days > 0) parts.push(`${days} z`);
    if (hours > 0) parts.push(`${hours} h`);
    parts.push(`${minutes} min`);

    return `Expiră în ${parts.join(" ")}`;
  };

  const filteredHistory = history.filter((record) => {
    if (filter === "all") return true;
    if (filter === "pending") return record.status === "pending";
    if (filter === "active") return record.status === "active";
    if (filter === "returned") return record.status === "returned";
    return true;
  });

  const getStatusLabel = (status: string) => {
    if (status === "pending") return "Rezervată (în așteptare)";
    if (status === "active") return "În folosință";
    return "Returnată";
  };

  const getStatusColors = (status: string) => {
    if (status === "pending") return { bg: "#add8e6", text: "#004080" };
    if (status === "active") return { bg: "#ffd700", text: "#8b4513" };
    return { bg: "#90ee90", text: "#006400" };
  };

  return (
    <div style={{ padding: "40px", maxWidth: "1100px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "10px", textAlign: "left" }}>Istoric împrumuturi</h1>

      <p style={{ marginBottom: "25px", color: "#555", textAlign: "left" }}>
        Aici poți vedea toate împrumuturile tale: active, finalizate și rezervările în așteptare.
      </p>

      {/* Filtre */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "25px" }}>
        <FilterButton label="Toate" active={filter === "all"} onClick={() => setFilter("all")} />
        <FilterButton label="Rezervate" active={filter === "pending"} onClick={() => setFilter("pending")} />
        <FilterButton label="Active" active={filter === "active"} onClick={() => setFilter("active")} />
        <FilterButton label="Returnate" active={filter === "returned"} onClick={() => setFilter("returned")} />
      </div>

      {loading ? (
        <p style={{ textAlign: "center" }}>Se încarcă istoricul...</p>
      ) : filteredHistory.length === 0 ? (
        <p style={{ textAlign: "center" }}>Nu există înregistrări pentru acest filtru.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          {filteredHistory.map((record) => {
            const { bg, text } = getStatusColors(record.status);
            const remaining = record.status === "pending" ? getRemainingTime(record.reservationExpiresAt) : null;

            return (
              <div
                key={record.id}
                style={{
                  display: "flex",
                  gap: "15px",
                  backgroundColor: "#f5ecff",
                  padding: "18px",
                  borderRadius: "14px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                }}
              >
                {/* imagine */}
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
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                      Fără imagine
                    </div>
                  )}
                </div>

                {/* detalii */}
                <div style={{ flex: 1 }}>
                  <h2 style={{ margin: 0 }}>{record.bookTitle}</h2>
                  <p><strong>Autor:</strong> {record.bookAuthor}</p>

                  {/* pending */}
                  {record.status === "pending" && (
                    <p>
                      <strong>Rezervată la:</strong>{" "}
                      {record.reservationDate && new Date(record.reservationDate).toLocaleString()}
                    </p>
                  )}

                  {/* active */}
                  {record.status === "active" && (
                    <>
                      <p>
                        <strong>Împrumutată la:</strong>{" "}
                        {record.borrowDate && new Date(record.borrowDate).toLocaleString()}
                      </p>

                      <p style={{ color: "#b30000", fontWeight: "bold" }}>
                        <strong>Trebuie returnată până la:</strong>{" "}
                        {record.dueDate && new Date(record.dueDate).toLocaleString()}
                      </p>
                    </>
                  )}

                  {/* returned */}
                  {record.status === "returned" && (
                    <p>
                      <strong>Returnată la:</strong>{" "}
                      {record.returnDate && new Date(record.returnDate).toLocaleString()}
                    </p>
                  )}

                  {/* timer */}
                  {remaining && (
                    <p style={{ marginTop: "8px", fontWeight: "bold", color: remaining.includes("expirată") ? "red" : "#333" }}>
                      ⏳ {remaining}
                    </p>
                  )}
                </div>

                {/* badge */}
                <div>
                  <span
                    style={{
                      backgroundColor: bg,
                      color: text,
                      padding: "6px 12px",
                      borderRadius: "20px",
                      fontWeight: "bold",
                    }}
                  >
                    {getStatusLabel(record.status)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface FilterButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

function FilterButton({ label, active, onClick }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "8px 18px",
        borderRadius: "20px",
        border: "none",
        fontWeight: "bold",
        cursor: "pointer",
        backgroundColor: active ? "#7a0fc4" : "#d8c2f0",
        color: active ? "white" : "#5f2669ff",
      }}
    >
      {label}
    </button>
  );
}
