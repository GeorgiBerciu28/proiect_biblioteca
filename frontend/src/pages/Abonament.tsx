import { useNavigate } from "react-router-dom";
import { useState } from "react";
import PopupMessage from "./PopUpMessage";

export default function Abonament() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "null");
     const [popup, setPopup] = useState<string | null>(null); 

    // dacă nu este logat
    if (!user) {
        return (
            <div style={{ padding: "40px", textAlign: "center" }}>
                <h1>Trebuie să fii autentificat pentru a activa abonamentul.</h1>
            </div>
        );
    }

    if (user.role === "MANAGER") {
        return (
            <div style={{ padding: "40px", textAlign: "center" }}>
                <h1>Administratorul are abonament activ.</h1>
                <button
                    onClick={() => navigate("/")}
                    style={{
                        marginTop: "20px",
                        padding: "10px 20px",
                        backgroundColor: "#8e44ad",
                        color: "white",
                        fontSize: "1.2rem",
                        borderRadius: "10px",
                        cursor: "pointer",
                    }}
                >
                    Înapoi la pagină
                </button>
            </div>
        );
    }

    const handleActivate = async () => {
        await fetch(`http://localhost:8080/api/request-subscription/${user.id}`, {
            method: "POST",
        });

        const updatedUser = { ...user, subscriptionStatus: "pending" };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        window.dispatchEvent(new Event("userChanged"));


        fetch("http://localhost:8080/api/pending-subscriptions")
            .then(res => res.json())
            .then(data => {
                window.dispatchEvent(new CustomEvent("pendingUpdated", { detail: data.length }));
            });
        setPopup("Mulțumim! Așteaptă confirmarea administratorului.");

         setTimeout(() => {
            navigate("/");
        }, 2000);
    };

    return (
        <div style={{ padding: "40px", textAlign: "center" }}>
            <h1>Dorești activarea abonamentului?</h1>

            <div style={{ marginTop: "30px" }}>
                <button
                    onClick={handleActivate}
                    style={{
                        padding: "12px 24px",
                        backgroundColor: "green",
                        color: "white",
                        fontSize: "1.3rem",
                        borderRadius: "10px",
                        cursor: "pointer",
                        marginRight: "20px",
                    }}
                >
                    Da, doresc activarea abonamentului
                </button>

                <button
                    onClick={() => navigate("/")}
                    style={{
                        padding: "12px 24px",
                        backgroundColor: "gray",
                        color: "white",
                        fontSize: "1.3rem",
                        borderRadius: "10px",
                        cursor: "pointer",
                    }}
                >
                    Mă mai gândesc
                </button>
            </div>
            {popup && (
                <PopupMessage text={popup} onClose={() => setPopup(null)} />
            )}
        </div>
    );
}
