import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import AccountDetails from "./pages/AccountDetails";


function App() {

  const [currentUser, setCurrentUser] = useState<any>(null); // state-ul care retine userul logat
  const [showMenu, setShowMenu] = useState(false);  // afiseaza / ascunde meniul user-ului
  const [showAdminMenu, setShowAdminMenu] = useState(false); // afiseaza / ascunde meniul de Admin Dashboard
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setCurrentUser(JSON.parse(savedUser));

    const onUserChange = () => {
      const updated = localStorage.getItem("user");
      setCurrentUser(updated ? JSON.parse(updated) : null);
    };

    window.addEventListener("userChanged", onUserChange);
    return () => window.removeEventListener("userChanged", onUserChange);
  }, []);

  // logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("userChanged"));
    navigate("/"); // trimite userul la pagina principala dupa logout
  };

  // meniul care apare cand pun mouse-ul pe iconita user-ului
  const renderMenu = () => {
    // meniu pentru user nelogat
    if (!currentUser) {
      return (
        <Link
          to="/login"
          style={{
            textDecoration: "none",
            padding: "8px 20px",
            backgroundColor: "white",
            borderRadius: "8px",
            color: "black",
            fontSize: "1.2rem",
            fontWeight: "bold",
            boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
            display: "block",
            whiteSpace: "nowrap",
          }}
        >
          Login / Register
        </Link>
      );
    }
    // meniu pentru user logat 
    return (
      <div
        style={{
          backgroundColor: "white",
          boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
          borderRadius: "8px",
          padding: "10px",
          display: "flex",
          flexDirection: "column",
          gap: "2px",
          minWidth: "150px",
        }}
      >
        {/* buton detalii cont */}
        <Link
          to="/account"
          style={{
            padding: "10px",
            textDecoration: "none",
            color: "black",
            fontWeight: "bold",
            fontSize: "1.2rem",
            marginBottom: "4px",
            textAlign: "center"
          }}
        >
          Detalii cont
        </Link>

        {/* buton delogare */}
        <button
          onClick={handleLogout}
          style={{
            padding: "8px 20px",
            background: "none",
            border: "none",
            color: "red",
            fontWeight: "bold",
            fontSize: "1.0rem",
            cursor: "pointer",
            textAlign: "center",
            marginTop: "4px",
          }}
        >
          Deconectare
        </button>
      </div>
    );
  };

  return (
    <>
      {/* bara de navigare (deasupra paginii) */}
      <nav
        style={{
          width: "100%",
          height: "80px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 32px",
          backgroundColor: "#5f2669ff",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 1000,
        }}
      >
        <h2 style={{ margin: 0, color: "white", fontSize: "2.3rem" }}>📖 Library</h2>

        {/* daca userul logat este MANAGER → afisam Panou Administratie */}
        {currentUser?.role === "MANAGER" && (
          <div
            style={{
              position: "relative",
              marginRight: "20px",
            }}
            onMouseEnter={() => setShowAdminMenu(true)}
            onMouseLeave={() => setShowAdminMenu(false)}
          >
            {/* buton panou administratie */}
            <div
              style={{
                padding: "12px 22px",
                backgroundColor: "#8e44ad",
                color: "white",
                fontWeight: "bold",
                fontSize: "1.8rem",
                borderRadius: "12px",
                cursor: "pointer",
                whiteSpace: "nowrap",
                textAlign: "center",
              }}
            >
              Panou Administratie
            </div>

            {/* meniul pentru administrator */}
            {showAdminMenu && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  backgroundColor: "#9b59b6",
                  borderRadius: "12px",
                  padding: "15px 20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.25)",
                  minWidth: "500px",
                  zIndex: 3000,
                }}
              >

                {/* buton 1 */}
                <Link
                  to="#"
                  style={{
                    color: "white",
                    textDecoration: "none",
                    fontWeight: "bold",
                    fontSize: "1.5rem",
                    textAlign: "center"
                  }}
                >
                  Vezi conturi utilizatori
                </Link>

                {/* buton 2 */}
                <Link
                  to="#"
                  style={{
                    color: "white",
                    textDecoration: "none",
                    fontWeight: "bold",
                    fontSize: "1.5rem",
                    marginTop: "12px",
                    textAlign: "center"
                  }}
                >
                  Gestionare cărți
                </Link>
              </div>
            )}
          </div>
        )}

        <div
          style={{
            position: "relative",
            marginRight: "80px",
            paddingBottom: "80px",
            marginTop: "80px"
          }}
          onMouseEnter={() => setShowMenu(true)}
          onMouseLeave={() => setShowMenu(false)}
        >
          {/* imagine user / admin */}
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "70%",
              backgroundColor: "white",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            <img
              src={currentUser?.role === "MANAGER" ? "/admin.jpg" : "/user.png"}
              style={{ width: "40px", height: "40px" }}

            />
          </div>

          {/* meniul pentru user */}
          {showMenu && (
            <div
              style={{
                position: "absolute",
                top: "85px",
                left: "50%",
                transform: "translateX(-55%)",
                zIndex: 2000,
              }}
            >
              {renderMenu()}
            </div>
          )}
        </div>
      </nav>

      {/* pagini site */}
      <div style={{ paddingTop: "100px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/account" element={<AccountDetails />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
