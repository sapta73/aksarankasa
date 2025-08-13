import React from "react";
// import "../styles/Student.css"; (UDH GUA HAPUS NIH, LOGIKA BARU, REVISI 22 JULI 2025)

function HomePage({ onSelectMode }) {
  return (
    <div className="home-container">
      <h1 className="game-title">AKSARANKASA</h1>
      <p className="home-subtitle">
        Taklukkan Literasi dan Numerasi, Jelajahi Galaksi Pengetahuan!
      </p>
      <div className="mode-selection">
        <button
          className="btn btn-primary mode-button"
          onClick={() => onSelectMode("student")}
        >
          Mode Siswa
        </button>
        <button
          className="btn btn-secondary mode-button"
          onClick={() => onSelectMode("teacher")}
        >
          Mode Guru
        </button>
      </div>
    </div>
  );
}

export default HomePage;
