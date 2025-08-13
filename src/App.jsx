import React, { useState, useEffect } from "react";
import { supabase } from "./supabase/config";
import HomePage from "./pages/HomePage";
import TeacherLogin from "./pages/TeacherLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import StudentRegister from "./pages/student/StudentRegister";
import ModeSelect from "./pages/student/ModeSelect";
import LevelSelect from "./pages/student/LevelSelect";
import MapelSelect from "./pages/student/MapelSelect";
import StudentQuiz from "./pages/student/StudentQuiz";

import backsound from "./assets/kids-game-gaming-background-music-297733.mp3";
import ruangAngkasa from "./assets/ruang-angkasa-game-sapta.mp4";
import "./styles/VideoBg.css";

function App() {
  const [page, setPage] = useState("home");
  const [session, setSession] = useState(null);
  const [student, setStudent] = useState(null);
  const [gameMode, setGameMode] = useState("reguler");
  const [selectedMapel, setSelectedMapel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quizConfig, setQuizConfig] = useState(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) setPage("home");
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleRegisterSuccess = (studentData) => {
    setStudent(studentData);
    setPage("modeSelect");
  };

  const handleModeSelect = (mode) => {
    setGameMode(mode);
    setPage("mapelSelect");
  };

  const handleStartQuiz = (level) => {
    console.log("Starting quiz with:", { level, mapelId: selectedMapel?.id });
    if (!selectedMapel) {
      console.error("Error: selectedMapel is null or undefined");
      // Jika tidak ada mapel yang dipilih, kembalikan ke halaman pemilihan mapel
      setPage("mapelSelect");
      return;
    }
    setQuizConfig({ levelToPlay: level, mapelId: selectedMapel?.id });
    setPage("quiz");
  };

  const handleQuizComplete = (result) => {
    setStudent(result.newStudentData);
    setQuizConfig(null);
    setPage(result.nextPage);
  };

  const handleGoHome = () => {
    setStudent(null);
    setSelectedMapel(null);
    setPage("home");
  };

  const renderContent = () => {
    switch (page) {
      case "home":
        return (
          <HomePage
            onSelectMode={(mode) =>
              setPage(
                mode === "teacher"
                  ? session
                    ? "adminDashboard"
                    : "teacherLogin"
                  : "studentRegister"
              )
            }
          />
        );
      case "teacherLogin":
        return (
          <TeacherLogin
            onLoginSuccess={() => setPage("adminDashboard")}
            onGoHome={() => setPage("home")}
          />
        );
      case "adminDashboard":
        return session ? (
          <AdminDashboard onLogout={() => setPage("home")} />
        ) : (
          <TeacherLogin onLoginSuccess={() => setPage("adminDashboard")} />
        );
      case "studentRegister":
        return (
          <StudentRegister
            onRegisterSuccess={handleRegisterSuccess}
            onGoHome={handleGoHome}
          />
        );
      case "modeSelect":
        return student ? (
          <ModeSelect student={student} onModeSelect={handleModeSelect} />
        ) : (
          <StudentRegister onRegisterSuccess={handleRegisterSuccess} />
        );
      case "mapelSelect":
        return student ? (
          <MapelSelect setPage={setPage} setSelectedMapel={setSelectedMapel} />
        ) : (
          <StudentRegister onRegisterSuccess={handleRegisterSuccess} />
        );
      case "levelSelect":
        return student ? (
          <LevelSelect
            student={student}
            gameMode={gameMode}
            selectedMapel={selectedMapel}
            onStartQuiz={handleStartQuiz}
            onGoHome={handleGoHome}
          />
        ) : (
          <StudentRegister onRegisterSuccess={handleRegisterSuccess} />
        );
      case "quiz":
        return (
          <StudentQuiz
            student={student}
            levelToPlay={quizConfig.levelToPlay}
            mapelId={quizConfig.mapelId}
            gameMode={gameMode}
            onQuizComplete={handleQuizComplete}
          />
        );
      default:
        return (
          <HomePage
            onSelectMode={(mode) =>
              setPage(mode === "teacher" ? "teacherLogin" : "studentRegister")
            }
          />
        );
    }
  };

  const showBacksound = [
    "modeSelect",
    "mapelSelect",
    "levelSelect",
    "quiz",
  ].includes(page);

  // State untuk menangani error video
  const [videoError, setVideoError] = useState(false);

  return (
    <>
      {!videoError && (
        <video
          className="video-bg"
          src={ruangAngkasa}
          autoPlay
          loop
          muted
          playsInline
          onError={(e) => {
            console.log("Video failed to load:", e);
            setVideoError(true); // Set state untuk menangani error
          }}
        />
      )}
      {/* Fallback jika video gagal dimuat */}
      {videoError && <div className="fallback-bg"></div>}
      <div className="app-container">
        {showBacksound && (
          <>
            <audio src={backsound} autoPlay loop muted={isMuted} />
            <button
              onClick={() => setIsMuted((m) => !m)}
              style={{
                position: "fixed",
                top: 16,
                right: 16,
                zIndex: 1000,
                background: "rgba(0,0,0,0.5)",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "8px 16px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
              aria-label={isMuted ? "Unmute backsound" : "Mute backsound"}
            >
              {isMuted ? "🔇" : "🔊"}
            </button>
          </>
        )}
        {loading ? (
          <h1 className="form-title">Memuat Aksarankasa...</h1>
        ) : (
          renderContent()
        )}
      </div>
    </>
  );
}
export default App;
