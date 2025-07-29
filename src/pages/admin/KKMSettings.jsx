import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "../../supabase/config";

function KKMSettings() {
  const [kkmData, setKkmData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchKKM = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("kkm_settings")
      .select("*")
      .order("level");
    if (error) {
      console.error(error);
      alert("Gagal memuat data KKM.");
    } else {
      setKkmData(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchKKM();
  }, [fetchKKM]);

  const handleKkmChange = (level, value) => {
    const newData = kkmData.map((item) =>
      item.level === level ? { ...item, kkm_score: Number(value) } : item
    );
    setKkmData(newData);
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase.from("kkm_settings").upsert(kkmData);
    if (error) {
      alert("Gagal menyimpan perubahan: " + error.message);
    } else {
      alert("Pengaturan KKM berhasil disimpan!");
    }
    setSaving(false);
  };

  if (loading)
    return <p style={{ textAlign: "center" }}>Memuat pengaturan KKM...</p>;

  return (
    <div className="kkm-settings-container">
      <h2 className="form-title">Pengaturan Kriteria Kelulusan</h2>
      <p
        className="home-subtitle"
        style={{ textAlign: "center", marginBottom: "2rem" }}
      >
        Geser untuk mengatur skor minimal (0-100) yang harus dicapai siswa untuk
        lulus setiap level.
      </p>

      <div className="kkm-list">
        {kkmData.map((item) => (
          <div key={item.level} className="kkm-item-slider">
            <label htmlFor={`kkm-level-${item.level}`}>
              Level {item.level}
            </label>
            <div className="slider-wrapper">
              <input
                id={`kkm-level-${item.level}`}
                type="range" // Pastikan ini adalah tipe "range"
                min="0"
                max="100"
                value={item.kkm_score}
                onChange={(e) => handleKkmChange(item.level, e.target.value)}
                className="kkm-slider"
                style={{ "--value": `${item.kkm_score}%` }}
              />
              <span className="slider-value">{item.kkm_score}</span>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        className="btn btn-primary"
        disabled={saving}
      >
        {saving ? "Menyimpan..." : "Simpan Perubahan"}
      </button>
    </div>
  );
}
export default KKMSettings;
