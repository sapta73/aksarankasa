import React, { useEffect } from "react";

function LevelSelect({
  student,
  gameMode,
  selectedMapel,
  onStartQuiz,
  onGoHome,
}) {
  // Memastikan selectedMapel tersedia, jika tidak ada coba ambil dari localStorage
  useEffect(() => {
    if (!selectedMapel) {
      console.log("selectedMapel not available in props, trying localStorage");
      const storedMapel = localStorage.getItem("selectedMapel");
      if (storedMapel) {
        try {
          const mapelData = JSON.parse(storedMapel);
          console.log("Retrieved mapel from localStorage:", mapelData);
          // Jika menggunakan setSelectedMapel di sini, pastikan sudah diteruskan ke komponen
        } catch (e) {
          console.error("Error parsing selectedMapel from localStorage:", e);
        }
      }
    } else {
      console.log("Using selectedMapel from props:", selectedMapel);
    }
  }, [selectedMapel]);
  const handleBackToMapel = () => {
    // Kembali ke halaman pemilihan mata pelajaran
    window.history.back();
  };

  return (
    <div className="level-select-container">
      <div className="header-container">
        <button className="back-button" onClick={handleBackToMapel}>
          <i className="fas fa-arrow-left"></i>
        </button>
        <h1 className="page-title">{selectedMapel?.nama || "Pilih Level"}</h1>
        <div className="header-right"></div>
      </div>

      <div className="content-container">
        <p className="subtitle">
          Mode {gameMode.charAt(0).toUpperCase() + gameMode.slice(1)} -{" "}
          {student.name}
        </p>

        <div className="level-grid">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((level) => (
            <button
              key={level}
              className="btn level-button"
              // [LOGIKA BARU] Buka semua level di mode reguler
              disabled={gameMode === "turnamen" && level > student.level}
              onClick={() => onStartQuiz(level)}
            >
              Level {level}
            </button>
          ))}
        </div>

        <button className="btn btn-secondary logout-button" onClick={onGoHome}>
          Kembali ke Beranda
        </button>
      </div>
    </div>
  );
}
export default LevelSelect;
