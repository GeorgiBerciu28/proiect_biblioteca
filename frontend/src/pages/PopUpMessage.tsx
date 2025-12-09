export default function PopupMessage({
  text,
  onClose,
}: {
  text: string;
  onClose: () => void;
}) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "white",
          padding: "25px 35px",
          borderRadius: "15px",
          minWidth: "350px",
          textAlign: "center",
          fontSize: "1.3rem",
          color: "#4a0a78",
          fontWeight: "bold",
          position: "relative",
          animation: "fadeIn 0.2s",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "-7px",
            right: "-10px",
            background: "none",
            border: "none",
            fontSize: "1.3rem",
            cursor: "pointer",
            color: "#4a0a78",
          }}
        >
          ✖
        </button>

        {text}
      </div>
    </div>
  );
}
