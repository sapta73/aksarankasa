import React from "react";

function LevelSelect({ student, gameMode, onStartQuiz, onGoHome }) {
  return (
    <div className="level-select-container">
      <h1 className="form-title">
        Mode {gameMode.charAt(0).toUpperCase() + gameMode.slice(1)}
      </h1>
      <p className="home-subtitle">Pilih Level, {student.name}!</p>
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
      <button
        className="btn btn-secondary"
        style={{ marginTop: "2rem" }}
        onClick={onGoHome}
      >
        Kembali ke Beranda
      </button>
    </div>
  );
}
export default LevelSelect;
