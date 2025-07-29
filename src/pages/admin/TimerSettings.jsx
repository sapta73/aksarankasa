import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "../../supabase/config";

function TimerSettings() {
  const [timerData, setTimerData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchTimers = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("timer_settings")
      .select("*")
      .order("level");
    if (error) console.error(error);
    else setTimerData(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTimers();
  }, [fetchTimers]);

  const handleTimerChange = (level, value) => {
    const newData = timerData.map((item) =>
      item.level === level ? { ...item, duration_seconds: Number(value) } : item
    );
    setTimerData(newData);
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase.from("timer_settings").upsert(timerData);
    if (error) {
      alert("Gagal menyimpan perubahan: " + error.message);
    } else {
      alert("Pengaturan Timer berhasil disimpan!");
    }
    setSaving(false);
  };

  if (loading)
    return <p style={{ textAlign: "center" }}>Memuat pengaturan timer...</p>;

  return (
    <div className="kkm-settings-container">
      <h2 className="form-title">Pengaturan Waktu Turnamen</h2>
      <p
        className="home-subtitle"
        style={{ textAlign: "center", marginBottom: "2rem" }}
      >
        Atur batas waktu (dalam detik) untuk setiap level di Mode Turnamen.
      </p>
      <div className="kkm-list">
        {timerData.map((item) => (
          <div key={item.level} className="kkm-item">
            <label htmlFor={`timer-level-${item.level}`}>
              Level {item.level}
            </label>
            <input
              id={`timer-level-${item.level}`}
              type="number"
              min="30"
              value={item.duration_seconds}
              onChange={(e) => handleTimerChange(item.level, e.target.value)}
              className="input-field"
            />
            <span>detik</span>
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
export default TimerSettings;
