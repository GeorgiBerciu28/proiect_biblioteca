import { useEffect } from "react";

export default function LibraryLocation() {
  useEffect(() => {
    document.title = "Locația noastră | MyLibrary";
  }, []);

  return (
    <div style={{ 
      width: "100%", 
      minHeight: "100vh",
      padding: "40px 20px",
      backgroundColor: "#f9f4fc"
    }}>
      <div style={{ 
        maxWidth: "1400px", 
        margin: "0 auto"
      }}>
        <h1 style={{ 
          textAlign: "center", 
          color: "#5f2669ff",
          fontSize: "3rem",
          marginBottom: "40px"
        }}>
          📍 Unde ne găsești
        </h1>

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "40px",
          marginBottom: "40px"
        }}>
          {/* HARTA - Configurată pentru Cluj-Napoca, Piața Unirii */}
          <div style={{
            backgroundColor: "white",
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
            height: "500px"
          }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2732.5896891877374!2d23.588344315652434!3d46.77021097913861!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47490e8c6c6e6b15%3A0x5a7c0b0a0b0a0b0a!2sPia%C8%9Ba%20Unirii%2C%20Cluj-Napoca!5e0!3m2!1sro!2sro!4v1234567890123!5m2!1sro!2sro"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Locația bibliotecii"
            />
          </div>

          {/* INFORMAȚII CONTACT */}
          <div style={{
            backgroundColor: "white",
            borderRadius: "20px",
            padding: "40px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.15)"
          }}>
            <h2 style={{ 
              color: "#5f2669ff",
              marginBottom: "30px",
              fontSize: "2rem"
            }}>
              📚 Biblioteca MyLibrary
            </h2>

            <div style={{ marginBottom: "25px" }}>
              <h3 style={{ 
                color: "#7a0fc4",
                marginBottom: "10px",
                fontSize: "1.3rem"
              }}>
                📍 Adresă:
              </h3>
              <p style={{ 
                fontSize: "1.1rem",
                lineHeight: "1.6",
                color: "#333"
              }}>
                Piața Unirii nr. 15<br/>
                Cluj-Napoca, Cluj 400110<br/>
                România
              </p>
            </div>

            <div style={{ marginBottom: "25px" }}>
              <h3 style={{ 
                color: "#7a0fc4",
                marginBottom: "10px",
                fontSize: "1.3rem"
              }}>
                📞 Telefon:
              </h3>
              <p style={{ 
                fontSize: "1.1rem",
                color: "#333"
              }}>
                +40 264 123 456<br/>
                +40 745 678 901
              </p>
            </div>

            <div style={{ marginBottom: "25px" }}>
              <h3 style={{ 
                color: "#7a0fc4",
                marginBottom: "10px",
                fontSize: "1.3rem"
              }}>
                ✉️ Email:
              </h3>
              <p style={{ 
                fontSize: "1.1rem",
                color: "#333"
              }}>
                contact@mylibrary.ro<br/>
                info@mylibrary.ro
              </p>
            </div>

            <div style={{ marginBottom: "25px" }}>
              <h3 style={{ 
                color: "#7a0fc4",
                marginBottom: "10px",
                fontSize: "1.3rem"
              }}>
                🕐 Program:
              </h3>
              <p style={{ 
                fontSize: "1.1rem",
                lineHeight: "1.8",
                color: "#333"
              }}>
                Luni - Vineri: 09:00 - 20:00<br/>
                Sâmbătă: 10:00 - 18:00<br/>
                Duminică: 10:00 - 14:00
              </p>
            </div>
          </div>
        </div>

        {/* CUM AJUNGI */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "20px",
          padding: "40px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
          marginBottom: "40px"
        }}>
          <h2 style={{ 
            color: "#5f2669ff",
            marginBottom: "30px",
            fontSize: "2rem",
            textAlign: "center"
          }}>
            🚗 Cum ajungi la noi
          </h2>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "30px"
          }}>
            <div style={{
              backgroundColor: "#f6e8ff",
              padding: "25px",
              borderRadius: "15px"
            }}>
              <div style={{ fontSize: "3rem", textAlign: "center", marginBottom: "15px" }}>
                🚗
              </div>
              <h3 style={{ 
                color: "#7a0fc4",
                marginBottom: "15px",
                fontSize: "1.3rem",
                textAlign: "center"
              }}>
                Cu mașina
              </h3>
              <p style={{ 
                fontSize: "1rem",
                lineHeight: "1.6",
                color: "#333",
                textAlign: "center"
              }}>
                Parcare subterană disponibilă în Piața Unirii. 
                Accesibil din centrul orașului în 2 minute.
              </p>
            </div>

            <div style={{
              backgroundColor: "#f6e8ff",
              padding: "25px",
              borderRadius: "15px"
            }}>
              <div style={{ fontSize: "3rem", textAlign: "center", marginBottom: "15px" }}>
                🚌
              </div>
              <h3 style={{ 
                color: "#7a0fc4",
                marginBottom: "15px",
                fontSize: "1.3rem",
                textAlign: "center"
              }}>
                Transport public
              </h3>
              <p style={{ 
                fontSize: "1rem",
                lineHeight: "1.6",
                color: "#333",
                textAlign: "center"
              }}>
                Autobuze: Liniile 24, 24B, 25, 28<br/>
                Stație: "Piața Unirii" (direct în fața clădirii)
              </p>
            </div>

            <div style={{
              backgroundColor: "#f6e8ff",
              padding: "25px",
              borderRadius: "15px"
            }}>
              <div style={{ fontSize: "3rem", textAlign: "center", marginBottom: "15px" }}>
                🚶
              </div>
              <h3 style={{ 
                color: "#7a0fc4",
                marginBottom: "15px",
                fontSize: "1.3rem",
                textAlign: "center"
              }}>
                Pe jos
              </h3>
              <p style={{ 
                fontSize: "1rem",
                lineHeight: "1.6",
                color: "#333",
                textAlign: "center"
              }}>
                În centrul orașului, foarte accesibil.
                La 5 minute de mers pe jos de pe Calea Moților.
              </p>
            </div>
          </div>
        </div>

        {/* FACILITĂȚI */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "20px",
          padding: "40px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.15)"
        }}>
          <h2 style={{ 
            color: "#5f2669ff",
            marginBottom: "30px",
            fontSize: "2rem",
            textAlign: "center"
          }}>
            ✨ Facilități disponibile
          </h2>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "20px"
          }}>
            {[
              { icon: "♿", text: "Acces persoane cu dizabilități" },
              { icon: "📶", text: "WiFi gratuit" },
              { icon: "☕", text: "Cafenea în incintă" },
              { icon: "💻", text: "Calculatoare pentru cititori" },
              { icon: "🔇", text: "Zone de lectură liniștită" },
              { icon: "👶", text: "Zonă pentru copii" },
              { icon: "🎧", text: "Săli de studiu individuale" },
              { icon: "📚", text: "Peste 10,000 de titluri" }
            ].map((facility, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: "#f6e8ff",
                  padding: "20px",
                  borderRadius: "12px",
                  textAlign: "center"
                }}
              >
                <div style={{ fontSize: "2.5rem", marginBottom: "10px" }}>
                  {facility.icon}
                </div>
                <p style={{ 
                  fontSize: "0.95rem",
                  color: "#5f2669ff",
                  fontWeight: "600",
                  lineHeight: "1.4"
                }}>
                  {facility.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* MESAJ FINAL */}
        <div style={{
          marginTop: "40px",
          textAlign: "center",
          padding: "30px",
          backgroundColor: "#7a0fc4",
          borderRadius: "20px",
          color: "white"
        }}>
          <h2 style={{ fontSize: "2rem", marginBottom: "15px" }}>
            Te așteptăm cu drag! 📖
          </h2>
          <p style={{ fontSize: "1.2rem", lineHeight: "1.6" }}>
            Vino să descoperi universul cărților într-un mediu primitor și modern.<br/>
            Echipa MyLibrary este mereu gata să te ajute!
          </p>
        </div>
      </div>
    </div>
  );
}