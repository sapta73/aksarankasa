import React, { useState, useEffect } from "react";
import { supabase } from "../supabase/config";
import LeaderboardChart from "../components/LeaderboardChart";

function Leaderboard({ isAdminView = false, onBack }) {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [leaderboardMode, setLeaderboardMode] = useState("reguler"); // 'reguler' or 'turnamen'

  useEffect(() => {
    const fetchLeaders = async () => {
      setLoading(true);
      let query;

      if (leaderboardMode === "reguler") {
        query = supabase
          .from("students")
          .select("*")
          .order("score", { ascending: false })
          .limit(20);
        if (filter !== "all") {
          query = query.eq("grade", filter);
        }
      } else {
        query = supabase
          .from("leaderboard_entries")
          .select("*")
          .eq("game_mode", "turnamen")
          .order("skor", { ascending: false })
          .limit(20);
        if (filter !== "all") {
          query = query.eq("kelas", filter);
        }
      }

      const { data, error } = await query;
      if (error) console.error(error);
      else setLeaders(data || []);
      setLoading(false);
    };
    fetchLeaders();
  }, [filter, leaderboardMode]);

  // [PERBAIKAN UTAMA]
  // Fungsi untuk "menormalkan" data agar formatnya sama untuk chart
  const getChartData = () => {
    if (leaderboardMode === "reguler") {
      return leaders.map((player) => ({
        name: player.name,
        "Total Skor": player.score,
        "Level Tertinggi": player.level,
      }));
    } else {
      // Mode Turnamen
      return leaders.map((player) => ({
        name: player.nama,
        "Skor Turnamen": player.skor, // Ganti nama agar lebih jelas di chart
        "Main di Level": player.level_played,
      }));
    }
  };

  const renderLeaderboardList = () => {
    if (leaderboardMode === "reguler") {
      return leaders.map((player, index) => (
        <li key={player.id} className="leaderboard-item">
          <span className="rank">{index + 1}</span>
          <span className="name">
            {player.name} (Kelas {player.grade})
          </span>
          <span className="details">Level {player.level}</span>
          <span className="score">{player.score} Poin Total</span>
        </li>
      ));
    } else {
      return leaders.map((player, index) => (
        <li key={player.id} className="leaderboard-item">
          <span className="rank">{index + 1}</span>
          <span className="name">
            {player.nama} (Kelas {player.kelas})
          </span>
          <span className="details">Main di Lv. {player.level_played}</span>
          <span className="score">{player.skor} Poin</span>
        </li>
      ));
    }
  };

  return (
    <div className="leaderboard-container">
      <h1 className="form-title">Papan Peringkat</h1>

      {isAdminView && (
        <>
          <div className="filter-container">
            <button
              onClick={() => setLeaderboardMode("reguler")}
              className={leaderboardMode === "reguler" ? "active" : ""}
            >
              Reguler
            </button>
            <button
              onClick={() => setLeaderboardMode("turnamen")}
              className={leaderboardMode === "turnamen" ? "active" : ""}
            >
              Turnamen
            </button>
          </div>
          <div className="filter-container">
            <span>Filter Kelas: </span>
            <button
              onClick={() => setFilter("all")}
              className={filter === "all" ? "active" : ""}
            >
              Semua
            </button>
            <button
              onClick={() => setFilter(4)}
              className={filter === 4 ? "active" : ""}
            >
              4
            </button>
            <button
              onClick={() => setFilter(5)}
              className={filter === 5 ? "active" : ""}
            >
              5
            </button>
            <button
              onClick={() => setFilter(6)}
              className={filter === 6 ? "active" : ""}
            >
              6
            </button>
          </div>
          {loading ? null : (
            <LeaderboardChart data={getChartData()} mode={leaderboardMode} />
          )}
        </>
      )}

      {loading ? (
        <p>Memuat data...</p>
      ) : (
        <ol className="leaderboard-list">{renderLeaderboardList()}</ol>
      )}
      {!isAdminView && (
        <button className="btn btn-secondary" onClick={onBack}>
          Kembali
        </button>
      )}
    </div>
  );
}
export default Leaderboard;
