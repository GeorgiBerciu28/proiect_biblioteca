import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AccountDetails from "./pages/AccountDetails";
import AddBook from "./pages/admin/AddBook";
import EditBook from "./pages/admin/EditBook";
import DeleteBook from "./pages/admin/DeleteBook";
import UserList from "./pages/admin/UserList";
import Borrow from "./pages/Borrow";

function App() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const [showBooksMenu, setShowBooksMenu] = useState(false);

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

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("userChanged"));
    navigate("/");
  };

  const renderMenu = () => {
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
        {(!currentUser || currentUser.role === "USER") && (
          <input
            type="text"
            placeholder="Caută o carte..."
            style={{
              marginLeft: "6px",
              padding: "10px 15px",
              width: "500px",
              borderRadius: "20px",
              border: "none",
              outline: "none",
              fontSize: "1rem",
              backgroundColor: "white",
              color: "black",
            }}
          />
        )}

        {currentUser?.role === "MANAGER" && (
          <div
            style={{
              position: "relative",
              marginRight: "20px",
            }}
            onMouseEnter={() => setShowAdminMenu(true)}
            onMouseLeave={() => setShowAdminMenu(false)}
          >
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
                  gap: "12px",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.25)",
                  minWidth: "500px",
                  zIndex: 3000,
                }}
              >
                <Link
                  to="/admin/users"
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

                <div
                  style={{ position: "relative" }}
                  onMouseEnter={() => setShowBooksMenu(true)}
                  onMouseLeave={() => setShowBooksMenu(false)}
                >
                  <div
                    style={{
                      color: "white",
                      textDecoration: "none",
                      fontWeight: "bold",
                      fontSize: "1.5rem",
                      textAlign: "center",
                      cursor: "pointer"
                    }}
                  >
                    Gestionare cărți
                  </div>

                  {showBooksMenu && (
                    <div
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: "50%",
                        transform: "translateX(-50%)",
                        backgroundColor: "#c27bd6",
                        borderRadius: "12px",
                        padding: "15px 20px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                        minWidth: "260px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.25)"
                      }}
                    >
                     <Link
                        to="/admin/books/add"
                        style={{
                          backgroundColor: "#a85acb",
                          padding: "12px 20px",
                          borderRadius: "10px",
                          color: "white",
                          textDecoration: "none",
                          fontWeight: "bold",
                          fontSize: "1.2rem",
                          textAlign: "center",
                          boxShadow: "0 3px 8px rgba(0,0,0,0.2)"
                        }}
                      >
                         Adăugare carte
                      </Link>

                      <Link
                        to="/admin/books/edit"
                        style={{
                          backgroundColor: "#a85acb",
                          padding: "12px 20px",
                          borderRadius: "10px",
                          color: "white",
                          textDecoration: "none",
                          fontWeight: "bold",
                          fontSize: "1.2rem",
                          textAlign: "center",
                          boxShadow: "0 3px 8px rgba(0,0,0,0.2)"
                        }}
                      >
                         Editare carte
                      </Link>

                      <Link
                        to="/admin/books/delete"
                        style={{
                          backgroundColor: "#a85acb",
                          padding: "12px 20px",
                          borderRadius: "10px",
                          color: "white",
                          textDecoration: "none",
                          fontWeight: "bold",
                          fontSize: "1.2rem",
                          textAlign: "center",
                          boxShadow: "0 3px 8px rgba(0,0,0,0.2)"
                        }}
                      >
                         Ștergere carte
                      </Link>

                    </div>
                  )}
                </div>
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

      <div style={{ paddingTop: "100px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/account" element={<AccountDetails />} />
          <Route path="/admin/books/add" element={<AddBook />} />
          <Route path="/admin/books/edit" element={<EditBook/>}/>
          <Route path="/admin/books/delete" element={<DeleteBook/>}/>
          <Route path="/admin/users" element={<UserList/>} />
          <Route path="/borrow" element={<Borrow/>} />
        </Routes>
      </div>
      <footer
        style={{
          width: "100%",
          backgroundColor: "#5f2669ff",
          padding: "100px 0",
          textAlign: "left",
          color: "white",
          fontSize: "1.3rem",
          fontWeight: "bold",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          bottom: 0,
          left: 0,
          zIndex: 900,
        }}
      >
      <button
        style={{
        backgroundColor: "#8e5ba6",  // mov mai deschis
        color: "white",
        border: "none",
        padding: "12px 30px",
        borderRadius: "25px",
        fontSize: "1.1rem",
        fontWeight: "bold",
        marginLeft: "10px",
        cursor: "default", // nu poate fi apăsat ca să nu facă nimic
      }}
      >
        About Us
      </button>
      </footer>

    </>

  );
}

export default App;
