import { useState,useEffect } from "react";

export default function AddBook() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [year, setYear] = useState("");
  const [type, setType] =useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("disponibil");
  const [image, setImage] = useState<File | null>(null);

  const [message, setMessage] = useState("");
  useEffect(() => {
      document.title = "Adaugare | Administratie";
  }, []);
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !author || !year || !type) {
      setMessage("Completează toate câmpurile obligatorii.");
      return;
    }

    // 🔥 JSON-ul cu datele cărții
    const bookData = {
      title,
      author,
      year,
      type,
      description,
      status
    };

    // 🔥 formData pentru Spring Boot (multipart)
    const formData = new FormData();
    formData.append(
      "data",
      new Blob([JSON.stringify(bookData)], { type: "application/json" })
    );

    if (image) {
      formData.append("image", image);
    }

    try {
      const res = await fetch("http://localhost:8080/books", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error();

      setMessage("Cartea a fost adăugată cu succes!");

      setTitle("");
      setAuthor("");
      setYear("");
      setType("");
      setDescription("");
      setImage(null);

    } catch (error) {
      setMessage("Eroare la adăugare.");
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "25px" }}>
        Formular pentru adăugarea unei cărți noi
      </h1>

      {message && (
        <div
          style={{
            marginBottom: "20px",
            padding: "12px 18px",
            background: "#d8b4e2",
            borderRadius: "10px",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          {message}
        </div>
      )}

      {/* CARD container */}
      <div
        style={{
          background: "#f6e8ff",
          padding: "25px",
          borderRadius: "20px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
          display: "flex",
          gap: "30px",
        }}
      >

        {/* IMAGE PREVIEW */}
        <div style={{ flex: "1" }}>
          <div
            style={{
              width: "100%",
              height: "260px",
              background: "#e0c6f3",
              borderRadius: "15px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
              marginBottom: "10px",
            }}
          >
            {image ? (
              <img
                src={URL.createObjectURL(image)}
                alt="preview"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <span style={{ color: "#7d4aae" }}>Previzualizare copertă</span>
            )}
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{
              width: "100%",
              padding: "10px",
              cursor: "pointer",
              borderRadius: "8px",
              border: "1px solid #b298cf",
              background: "white",
            }}
          />
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          style={{
            flex: "2",
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}
        >
          <input
            type="text"
            placeholder="Titlul cărții *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #b298cf",
              fontSize: "1rem",
              outline: "none",
            }}
          />

          <input
            type="text"
            placeholder="Autorul *"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            style={{
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #b298cf",
              fontSize: "1rem",
              outline: "none",
            }}
          />

          <input
            type="number"
            placeholder="Anul apariției *"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            style={{
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #b298cf",
              fontSize: "1rem",
              outline: "none",
            }}
          />
          <input
            type="text"
            placeholder="Tipul romanului *"
            value={type}
            onChange={(e) => setType(e.target.value)}
            style={{
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #b298cf",
              fontSize: "1rem",
              outline: "none",
            }}
          />
          <textarea
            placeholder="Descriere"
            value={description}
            rows={5}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #b298cf",
              fontSize: "1rem",
              outline: "none",
              resize: "none",
            }}
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #b298cf",
              fontSize: "1rem",
              outline: "none",
              background: "white",
            }}
          >
            <option value="disponibil">Disponibil</option>
            <option value="imprumutat">Împrumutat</option>
          </select>

          <button
            type="submit"
            style={{
              padding: "12px",
              background: "#7a0fc4",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontSize: "1.2rem",
              cursor: "pointer",
              fontWeight: "bold",
              marginTop: "10px",
            }}
          >
            Adaugă cartea
          </button>
        </form>
      </div>
    </div>
  );
}
