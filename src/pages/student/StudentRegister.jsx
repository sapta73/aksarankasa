import React, { useState } from "react";
import { supabase } from "../../supabase/config";

function StudentRegister({ onRegisterSuccess, onGoHome }) {
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("4");
  const [school, setSchool] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("students")
        .insert([{ name, grade: Number(grade), school }])
        .select()
        .single(); // Ambil data yang baru saja dibuat

      if (error) throw error;
      onRegisterSuccess(data);
    } catch (error) {
      console.error("Error adding student: ", error);
      alert("Gagal mendaftar, silakan coba lagi.");
    }
    setLoading(false);
  };

  return (
    <div className="form-container">
      <div className="header-container" style={{ marginBottom: "1rem" }}>
        <button className="back-button" onClick={onGoHome}>
          <i className="fas fa-arrow-left"></i>
        </button>
        <h1 className="game-title">Daftar Pejuang</h1>
        <div className="header-right"></div>
      </div>
      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
        <div className="input-group">
          <label className="input-label">Nama Panggilan</label>
          <input
            type="text"
            className="input-field"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Contoh: Budi"
          />
        </div>
        <div className="input-group">
          <label className="input-label">Kelas</label>
          <select
            className="input-field"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
          >
            <option value="4">Kelas 4</option>{" "}
            <option value="5">Kelas 5</option>{" "}
            <option value="6">Kelas 6</option>
          </select>
        </div>
        <div className="input-group">
          <label className="input-label">Asal Sekolah</label>
          <input
            type="text"
            className="input-field"
            value={school}
            onChange={(e) => setSchool(e.target.value)}
            required
            placeholder="Contoh: SDN 1 Nusantara"
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Memuat..." : "Mulai Petualangan!"}
        </button>
      </form>
    </div>
  );
}
export default StudentRegister;
