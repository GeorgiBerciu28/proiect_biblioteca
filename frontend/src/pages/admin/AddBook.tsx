import { useState, useEffect } from "react";

export default function AddBook() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [year, setYear] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("disponibil");
  const [categories, setCategories] = useState<string[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    document.title = "Adaugare | Administratie";
  }, []);

  const categoryOptions = [
    "clasica_literatura_universala",
    "fantasy",
    "science_fiction",
    "thriller_mystery_crime",
    "romantism",
    "non_fictiune_eseuri_analize_jurnale",
    "dezvoltare_personala_psihologie",
    "istorie_biografii_memorii",
    "stiinta_tehnologie",
    "poezii"
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !author || !year) {
      setMessage("Completează câmpurile obligatorii (titlu, autor, anul).");
      return;
    }

    const bookData = {
      title,
      author,
      year,
      description,
      status,
      categories, // 🔥 trimitem lista de categorii
    };

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

      // resetare formular
      setTitle("");
      setAuthor("");
      setYear("");
      setDescription("");
      setStatus("disponibil");
      setCategories([]);
      setImage(null);

    } catch (err) {
      setMessage("Eroare la adăugare.");
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "25px" }}>
        Adaugă o carte nouă
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
        {/* PREVIEW IMAGINE */}
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

        {/* FORMULAR */}
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
            style={inputStyle}
          />

          <input
            type="text"
            placeholder="Autorul *"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            style={inputStyle}
          />

          <input
            type="number"
            placeholder="Anul apariției *"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            style={inputStyle}
          />

          {/* CATEGORII MULTIPLE */}
          <div
            style={{
              background: "white",
              padding: "15px",
              borderRadius: "10px",
              border: "1px solid #b298cf",
              maxHeight: "170px",
              overflowY: "auto",
            }}
          >
            <label style={{ fontWeight: "bold", fontSize: "1.1rem" }}>
              Categorii:
            </label>

            {categoryOptions.map((cat) => (
              <label key={cat} style={{ display: "block", marginTop: "6px" }}>
                <input
                  type="checkbox"
                  checked={categories.includes(cat)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setCategories([...categories, cat]);
                    } else {
                      setCategories(categories.filter((c) => c !== cat));
                    }
                  }}
                />
                <span style={{ marginLeft: "8px" }}>{cat}</span>
              </label>
            ))}
          </div>

          <textarea
            placeholder="Descriere"
            value={description}
            rows={4}
            onChange={(e) => setDescription(e.target.value)}
            style={{ ...inputStyle, resize: "none" }}
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={inputStyle}
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

const inputStyle = {
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #b298cf",
  fontSize: "1rem",
  outline: "none",
  width: "100%",
};
