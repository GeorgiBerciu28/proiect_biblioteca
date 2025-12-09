import { useEffect, useState } from "react";

export default function AccountDetails() {

  const [user, setUser] = useState<any>(null);

  // campuri editabile
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  // schimbare parola
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // pentru colorarea casutei la confirmare parola
  const [passwordMatch, setPasswordMatch] = useState<null | boolean>(null);
  const [isConfirmFocused, setIsConfirmFocused] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState("");


  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) {
      const parsed = JSON.parse(u);
      setUser(parsed);
      setFirstName(parsed.firstName);
      setLastName(parsed.lastName);
      setEmail(parsed.email);
      setSubscriptionStatus(parsed.subscriptionStatus);
    }
  }, []);

  useEffect(() => {
    const reloadUser = () => {
      const updated = JSON.parse(localStorage.getItem("user") || "null");
      if (updated) {
        setUser(updated);
        setSubscriptionStatus(updated.subscriptionStatus);
      }
    };

    window.addEventListener("userChanged", reloadUser);
    return () => window.removeEventListener("userChanged", reloadUser);
  }, []);


  const handleDeactivate = async () => {
    const confirm = window.confirm("Sigur vrei să dezactivezi abonamentul?");
    if (!confirm) return;

    await fetch(`http://localhost:8080/api/deactivate-subscription/${user.id}`, {
      method: "POST",
    });

    alert("Abonamentul a fost dezactivat.");

    const updatedUser = { ...user, subscriptionStatus: "inactive" };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setSubscriptionStatus("inactive");
    window.dispatchEvent(new Event("userChanged"));
  };


  // salvarea modificarilor (nume / email / parola)
  const handleSave = async () => {
    if (newPassword !== confirmPassword) {
      alert("Parolele nu coincid!");
      return;
    }

    // trimit datele la backend
    const response = await fetch(`http://localhost:8080/api/users/${user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        oldPassword,
        newPassword
      }),
    });

    // actualizam local user-ul
    if (response.ok) {
      const updatedUser = {
        ...user,
        firstName,
        lastName,
        email,
        subscriptionStatus: user.subscriptionStatus
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));


      window.dispatchEvent(new Event("userChanged"));
      alert("Modificările au fost salvate!");
    } else {
      const text = await response.text();
      alert("Eroare: " + text);
    }
  };

  if (!user) return <h2 style={{ marginTop: "120px" }}>Nu ești autentificat.</h2>;

  // pagina pentru detalii cont
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        backgroundImage: "url('/accountDetails.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: "80px",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          width: "420px",
          padding: "40px",
          borderRadius: "20px",
          boxShadow: "0 4px 25px rgba(0,0,0,0.25)",
        }}
      >
        {/* titlu pagina*/}
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          Detalii cont
        </h2>

        {/* prenume + nume */}
        <div style={{ display: "flex", gap: "20px" }}>
          <div style={{ flex: 1 }}>
            <label>Prenume *</label>
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ flex: 1 }}>
            <label>Nume *</label>
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        {/* email */}
        <label>Email *</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />

        <h3 style={{ marginTop: "20px" }}>Schimbare parolă</h3>

        {/* parola actuala */}
        <label>Parola actuală</label>
        <input
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          style={inputStyle}
        />

        {/* parola noua */}
        <label>Parolă nouă</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => {
            setNewPassword(e.target.value);
            setPasswordMatch(
              e.target.value === confirmPassword && confirmPassword.length > 0
            );
          }}
          style={inputStyle}
        />

        {/* confirmare parola noua */}
        <label>Confirmă parola nouă</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setPasswordMatch(
              newPassword === e.target.value && e.target.value.length > 0
            );
          }}
          onFocus={() => setIsConfirmFocused(true)}
          onBlur={() => setIsConfirmFocused(false)}
          style={{
            ...inputStyle,
            // colorarea casutei
            backgroundColor:
              !isConfirmFocused
                ? "#f1f1f1"
                : passwordMatch === null
                  ? "#f1a194ff"
                  : passwordMatch
                    ? "#83f58aff"
                    : "#f1a194ff"
          }}
        />


        {subscriptionStatus === "active" && (
          <button
            onClick={handleDeactivate}
            style={{
              padding: "10px 20px",
              backgroundColor: "red",
              color: "white",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              fontSize: "1.2rem",
              marginTop: "20px"
            }}
          >
            Dezactivează abonamentul
          </button>
        )}

        {subscriptionStatus === "inactive" && (
          <div
            style={{
              marginTop: "15px",
              padding: "12px",
              backgroundColor: "#ffe6e6",
              border: "1px solid #ff9090",
              borderRadius: "10px",
              color: "#c40000",
              fontWeight: "bold",
              textAlign: "center",
              fontSize: "1.1rem"
            }}
          >
            Abonament INACTIV — activează abonamentul din meniu!
          </div>
        )}
        {subscriptionStatus === "pending" && (
          <div
            style={{
              marginTop: "15px",
              padding: "12px",
              backgroundColor: "#fff3cd",
              border: "1px solid #ffe58f",
              borderRadius: "10px",
              color: "#a68500",
              fontWeight: "bold",
              textAlign: "center",
              fontSize: "1.1rem"
            }}
          >
            ⏳ Cererea ta este în curs de aprobare...
          </div>
        )}



        {/* buton salvare */}
        <button
          onClick={handleSave}
          style={{
            marginTop: "10px",
            padding: "12px 20px",
            backgroundColor: "#9022a4",
            borderRadius: "20px",
            border: "none",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
            width: "100%",
            fontSize: "1.1rem",
          }}
        >
          Salvează modificările
        </button>
      </div>
    </div>
  );

}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px",
  marginTop: "5px",
  marginBottom: "15px",
  backgroundColor: "#f1f1f1",
  border: "1px solid #d5d5d5",
  borderRadius: "5px",
  fontSize: "1rem"
};
