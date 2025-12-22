import React, { useEffect, useState } from "react";
import PopupMessage from "../PopUpMessage";

interface Borrow {
    id: number;
    userId: number;
    bookId: number;
    userFirstName: string;  // ⭐ ADĂUGAT
    userLastName: string;   // ⭐ ADĂUGAT
    bookTitle: string;
    bookAuthor: string;
    reservationDate: string;
    reservationExpiresAt: string;
}

export default function ConfirmareRezervareCarti() {
    const [pending, setPending] = useState<Borrow[]>([]);
    const [popup, setPopup] = useState<string | null>(null);

    const loadPending = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/borrows/pending");
            const data = await response.json();
            console.log("📋 Pending borrows:", data);
            setPending(data);
        } catch (error) {
            console.error(error);
            setPopup("Eroare la încărcarea rezervărilor.");
        }
    };

    useEffect(() => {
        loadPending();
        const handler = () => loadPending();
        window.addEventListener("reservationsChanged", handler);
        return () => window.removeEventListener("reservationsChanged", handler);
    }, []);

    const confirmBorrow = async (id: number) => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/borrows/${id}/confirm`,
                { method: "POST" }
            );

            if (!response.ok) {
                const text = await response.text();
                setPopup("Eroare: " + text);
                return;
            }

            setPopup("Împrumutul a fost confirmat!");
            
            const pendingRes = await fetch("http://localhost:8080/api/borrows/pending");
            const pendingData = await pendingRes.json();

            window.dispatchEvent(
                new CustomEvent("pendingBorrowsUpdated", {
                    detail: pendingData.length
                })
            );
            loadPending();
        } catch (error) {
            console.error(error);
            setPopup("Eroare la confirmare.");
        }
    };

    return (
        <div style={{ padding: "40px" }}>
            <h1 style={{ textAlign: "center", marginBottom: "30px" }}>
                Confirmă Împrumuturile Rezervate
            </h1>

            {pending.length === 0 ? (
                <h3 style={{ textAlign: "center", color: "gray" }}>
                    Nu există rezervări în așteptare.
                </h3>
            ) : (
                <table style={{
                    width: "100%", borderCollapse: "collapse", backgroundColor: "#f9f5ff",
                    borderRadius: "12px", overflow: "hidden",
                }}>
                    <thead>
                        <tr style={{ backgroundColor: "#7a0fc4", color: "white" }}>
                            <th style={th}>Utilizator</th>
                            <th style={th}>Carte</th>
                            <th style={th}>Rezervată la</th>
                            <th style={th}>Expiră la</th>
                            <th style={th}>Acțiuni</th>
                        </tr>
                    </thead>

                    <tbody>
                        {pending.map((p) => (
                            <tr key={p.id}>
                                <td style={td}>
                                    {/* ⭐ AFIȘEAZĂ DIRECT DIN BORROW */}
                                    <strong>{p.userFirstName} {p.userLastName}</strong>
                                </td>

                                <td style={td}>
                                    <strong>{p.bookTitle}</strong><br />
                                    <span style={{ color: "gray" }}>{p.bookAuthor}</span>
                                </td>

                                <td style={td}>{new Date(p.reservationDate).toLocaleString()}</td>
                                <td style={td}>{new Date(p.reservationExpiresAt).toLocaleString()}</td>

                                <td style={td}>
                                    <button onClick={() => confirmBorrow(p.id)} style={{
                                        padding: "8px 14px", backgroundColor: "#7a0fc4", color: "white",
                                        border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold",
                                    }}>
                                        Confirmă împrumutul
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {popup && <PopupMessage text={popup} onClose={() => setPopup(null)} />}
        </div>
    );
}

const th: React.CSSProperties = { padding: "12px", textAlign: "left", fontWeight: "bold" };
const td: React.CSSProperties = { padding: "12px", borderBottom: "1px solid #ddd" };