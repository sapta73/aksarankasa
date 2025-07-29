import React, { useState } from "react";
import { supabase } from "../../supabase/config";
import QuestionManager from "./QuestionManager";
import KKMSettings from "./KKMSettings";
import TimerSettings from "./TimerSettings"; // Import baru
import Leaderboard from "../Leaderboard";

function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState("questions");

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case "kkm":
        return <KKMSettings />;
      case "timer": // Tab baru
        return <TimerSettings />;
      case "leaderboard":
        return <Leaderboard isAdminView={true} />;
      case "questions":
      default:
        return <QuestionManager />;
    }
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1 className="admin-title">Dashboard Guru</h1>
        <nav className="admin-nav">
          <button
            onClick={() => setActiveTab("questions")}
            className={activeTab === "questions" ? "active" : ""}
          >
            Manajemen Soal
          </button>
          <button
            onClick={() => setActiveTab("kkm")}
            className={activeTab === "kkm" ? "active" : ""}
          >
            Pengaturan KKM
          </button>
          <button
            onClick={() => setActiveTab("timer")}
            className={activeTab === "timer" ? "active" : ""}
          >
            Pengaturan Timer
          </button>
          <button
            onClick={() => setActiveTab("leaderboard")}
            className={activeTab === "leaderboard" ? "active" : ""}
          >
            Papan Skor
          </button>
        </nav>
        <button onClick={handleLogout} className="btn btn-secondary">
          Logout
        </button>
      </header>
      <main className="admin-content">{renderActiveTab()}</main>
    </div>
  );
}
export default AdminDashboard;
