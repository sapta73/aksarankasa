import React from "react";

function ModeSelect({ student, onModeSelect }) {
  return (
    <div className="home-container">
      <h1 className="form-title">Pilih Mode Permainan</h1>
      <p className="home-subtitle">
        Selamat datang, {student.name}! Mau bermain santai atau ikut kompetisi?
      </p>
      <div className="mode-selection">
        <button
          className="btn btn-primary"
          onClick={() => onModeSelect("reguler")}
        >
          Mode Reguler
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => onModeSelect("turnamen")}
        >
          Mode Turnamen
        </button>
      </div>
    </div>
  );
}

export default ModeSelect;
