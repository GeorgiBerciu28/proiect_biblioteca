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
import CategoryPage from "./pages/CategoryPage";
import BorrowHistory from "./pages/BorrowHistory";
import LibraryLocation from "./pages/LibraryLocation";
import ReturnBooks from "./pages/ReturnBooks";
import SearchResults from "./pages/SearchResults";
import TermsAndConditions from "./pages/TermsAndConditions";

function App() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const [showBooksMenu, setShowBooksMenu] = useState(false);
  const [showSubNav, setShowSubNav] = useState(true);
  const [showMenuCategories, setShowMenuCategories] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const subNavLinkStyle: React.CSSProperties = {
    color: "white",
    fontWeight: "bold",
    fontSize: "1.2rem",
    textDecoration: "none",
  };

  const navigate = useNavigate();

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Actualizare număr articole în coș
  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartCount(cart.length);
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setCurrentUser(JSON.parse(savedUser));

    // Inițializare număr articole coș
    updateCartCount();

    const onUserChange = () => {
      const updated = localStorage.getItem("user");
      setCurrentUser(updated ? JSON.parse(updated) : null);
    };

    const onCartChange = () => {
      updateCartCount();
    };

    window.addEventListener("userChanged", onUserChange);
    window.addEventListener("cartChanged", onCartChange);
    
    return () => {
      window.removeEventListener("userChanged", onUserChange);
      window.removeEventListener("cartChanged", onCartChange);
    };
  }, []);

  useEffect(() => {
    let lastScroll = window.scrollY;

    const handleScroll = () => {
      const current = window.scrollY;

      if (current > lastScroll && current > 120) {
        setShowSubNav(false);
      } else {
        setShowSubNav(true);
      }

      lastScroll = current;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    window.dispatchEvent(new Event("userChanged"));
    window.dispatchEvent(new Event("cartChanged"));
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

        <Link
          to="/borrow-history"
          style={{
            padding: "10px",
            textDecoration: "none",
            color: "#7a0fc4",
            fontWeight: "bold",
            fontSize: "1.2rem",
            marginBottom: "4px",
            textAlign: "center"
          }}
        >
          Istoric împrumuturi
        </Link>

        {currentUser.role === "USER" && (
          <Link
            to="/return-books"
            style={{
              padding: "10px",
              textDecoration: "none",
              color: "#4caf50",
              fontWeight: "bold",
              fontSize: "1.2rem",
              marginBottom: "4px",
              textAlign: "center"
            }}
          >
            Returnare cărți
          </Link>
        )}

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
      {/* NAVBAR PRINCIPAL */}
      <nav
        style={{
          width: "100%",
          height: "80px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 32px",
          backgroundColor: "#b67ec0ff",
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
            placeholder="Caută după titlu, autor sau descriere..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleSearch}
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

        {/* PANOU ADMIN */}
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
              Panou Administrație ▼
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

{/* WRAPPER ICONIȚE */}
<div style={{ display: "flex", alignItems: "center", gap: "5px", marginRight: "80px" }}>
  
  {/* COȘ DE CUMPĂRĂTURI */}
  {currentUser && currentUser.role === "USER" && (
    <Link to="/borrow" style={{ position: "relative", textDecoration: "none" }}>
      <div
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          backgroundColor: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          position: "relative"
        }}
      >
        <span style={{ fontSize: "2rem" }}>🛒</span>
        {cartCount > 0 && (
          <div
            style={{
              position: "absolute",
              top: "-5px",
              right: "-5px",
              backgroundColor: "red",
              color: "white",
              borderRadius: "50%",
              width: "25px",
              height: "25px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "0.9rem",
              fontWeight: "bold"
            }}
          >
            {cartCount}
          </div>
        )}
      </div>
    </Link>
  )}

  {/* MENIU UTILIZATOR */}
  <div
    style={{ position: "relative" }}
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
</div>

      </nav>

      {/* NAVBAR SECUNDAR */}
      <div
        style={{
          width: "100%",
          backgroundColor: "#cd96b7ff",
          left: 0,
          padding: "10px 0",
          display: "flex",
          gap: "40px",
          position: "fixed",
          top: "80px",
          zIndex: 900,
          transition: "opacity 0.4s ease, transform 0.4s ease",
          opacity: showSubNav ? 1 : 0,
          transform: showSubNav ? "translateY(0)" : "translateY(-20px)",
          pointerEvents: showSubNav ? "auto" : "none",
        }}
      >
        <div style={{ position: "relative" }}>
          <div
            onClick={() => setShowMenuCategories(prev => !prev)}
            style={{
              ...subNavLinkStyle,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              fontSize: "1.7rem",
              marginLeft: "50px"
            }}
          >
            Categorii ▼
          </div>

          {showMenuCategories && (
            <div
              style={{
                position: "absolute",
                top: "40px",
                left: "60px",
                backgroundColor: "#fff",
                borderRadius: "12px",
                padding: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                minWidth: "330px",
                zIndex: 2000
              }}
            >
              {[
                { key: "clasica_literatura_universala", label: "Clasica Literatura Universala" },
                { key: "fantasy", label: "Fantasy" },
                { key: "science_fiction", label: "Science Fiction" },
                { key: "thriller_mystery_crime", label: "Thriller/Mystery/Crime" },
                { key: "romantism", label: "Romantism" },
                { key: "non_fictiune_eseuri_analize_jurnale", label: "Non-Fictiune (Eseuri, Analize, Jurnale)" },
                { key: "dezvoltare_personala_psihologie", label: "Dezvoltare Personala/Psihologie" },
                { key: "istorie_biografii_memorii", label: "Istorie/Biografii/Memorii" },
                { key: "stiinta_tehnologie", label: "Stiinta/Tehnologie" },
                { key: "poezii", label: "Poezii" },
              ].map(cat => (
                <Link
                  key={cat.key}
                  to={`/category/${encodeURIComponent(cat.key)}`}
                  style={{
                    display: "block",
                    padding: "10px 14px",
                    fontSize: "1.3rem",
                    fontWeight: "bold",
                    textDecoration: "none",
                    color: "#6a1b7a",
                    borderRadius: "6px"
                  }}
                >
                  {cat.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        <div style={{ flex: 0.4 }}></div>
        <Link to="/" style={subNavLinkStyle}>Acasă</Link>

        <Link to="/location" style={subNavLinkStyle}>
          Locația noastră
        </Link>

        <Link to="/cele-mai-citite" style={subNavLinkStyle}>
          Cele mai citite
        </Link>

        <Link to="/cele-mai-recomandate" style={subNavLinkStyle}>
          Cele mai recomandate
        </Link>
      </div>

      {/* CONȚINUT PAGINĂ */}
      <div style={{ paddingTop: "100px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/account" element={<AccountDetails />} />
          <Route path="/admin/books/add" element={<AddBook />} />
          <Route path="/admin/books/edit" element={<EditBook />} />
          <Route path="/admin/books/delete" element={<DeleteBook />} />
          <Route path="/admin/users" element={<UserList />} />
          <Route path="/borrow" element={<Borrow />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/borrow-history" element={<BorrowHistory />} />
          <Route path="/location" element={<LibraryLocation />} />
          <Route path="/return-books" element={<ReturnBooks />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/terms" element={<TermsAndConditions />} />
        </Routes>
      </div>
      
      {/* FOOTER */}
      <footer
        style={{
          width: "100%",
          backgroundColor: "#5f2669ff",
          padding: "60px 80px",
          color: "white",
          bottom: 0,
          left: 0,
          zIndex: 900,
        }}
      >
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <h2 style={{ 
            fontSize: "2.5rem", 
            marginBottom: "30px",
            fontWeight: "bold",
            textAlign: "center"
          }}>
            📚 Despre librăria noastră
          </h2>
          
          <div style={{ display: "flex", gap: "50px", marginBottom: "40px" }}>
            <div style={{ flex: 1 }}>
              <p style={{ 
                fontSize: "1.2rem", 
                lineHeight: "1.8", 
                textAlign: "justify",
                marginBottom: "20px"
              }}>
                Bine ai venit la biblioteca noastră digitală! Suntem pasionați de cărți și de puterea lor 
                de a transforma vieți. Cu o colecție vastă care cuprinde toate genurile - de la clasici 
                ai literaturii universale până la cele mai recente bestseller-uri - ne dedicăm să aducem 
                bucuria lecturii în casele voastre.
              </p>
              <p style={{ 
                fontSize: "1.2rem", 
                lineHeight: "1.8", 
                textAlign: "justify"
              }}>
                Platforma noastră vă oferă acces rapid și simplu la mii de titluri, sistem de împrumut 
                intuitiv și recomandări personalizate. Fie că sunteți în căutarea unei aventuri fantastice, 
                a unei lecturi educative sau a unei povești de dragoste, veți găsi aici cartea potrivită 
                pentru fiecare moment.
              </p>
            </div>
            
            <div style={{ flex: 1 }}>
              <div
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  padding: "30px",
                  borderRadius: "20px",
                  marginBottom: "20px"
                }}
              >
                <h3 style={{ marginBottom: "15px", fontSize: "1.5rem" }}>
                  🎯 Misiunea noastră
                </h3>
                <p style={{ fontSize: "1.1rem", lineHeight: "1.6" }}>
                  Să facem lectura accesibilă tuturor și să promovăm cultura literară în comunitate prin tehnologie modernă și servicii de calitate.
                </p>
              </div>
              
              <div
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  padding: "30px",
                  borderRadius: "20px"
                }}
              >
                <h3 style={{ marginBottom: "15px", fontSize: "1.5rem" }}>
                  ⭐ De ce să ne alegi?
                </h3>
                <ul style={{ fontSize: "1.1rem", lineHeight: "1.8", paddingLeft: "20px" }}>
                  <li>Colecție diversificată și actualizată constant</li>
                  <li>Sistem de împrumut simplu și rapid</li>
                  <li>Fără taxe de întârziere</li>
                  <li>Recomandări personalizate</li>
                </ul>
              </div>
            </div>
          </div>

          <div style={{ 
            display: "flex", 
            justifyContent: "center", 
            gap: "60px",
            paddingTop: "30px",
            borderTop: "1px solid rgba(255,255,255,0.2)"
          }}>
            <div style={{ textAlign: "center" }}>
              <h3 style={{ fontSize: "2.5rem", margin: "0", color: "#d8b4e2" }}>500+</h3>
              <p style={{ margin: "5px 0", fontSize: "1.1rem" }}>Cărți disponibile</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <h3 style={{ fontSize: "2.5rem", margin: "0", color: "#d8b4e2" }}>1000+</h3>
              <p style={{ margin: "5px 0", fontSize: "1.1rem" }}>Utilizatori activi</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <h3 style={{ fontSize: "2.5rem", margin: "0", color: "#d8b4e2" }}>24/7</h3>
              <p style={{ margin: "5px 0", fontSize: "1.1rem" }}>Acces disponibil</p>
            </div>
          </div>

          <div style={{ 
            textAlign: "center", 
            marginTop: "40px",
            paddingTop: "20px",
            borderTop: "1px solid rgba(255,255,255,0.2)",
            fontSize: "0.9rem",
            color: "rgba(255,255,255,0.7)"
          }}>
            <div style={{ marginBottom: "15px" }}>
              <Link 
                to="/terms" 
                style={{ 
                  color: "white", 
                  textDecoration: "underline",
                  fontSize: "1rem",
                  fontWeight: "bold"
                }}
              >
                📋 Termeni și Condiții
              </Link>
            </div>
            © 2024 Library Management System. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;