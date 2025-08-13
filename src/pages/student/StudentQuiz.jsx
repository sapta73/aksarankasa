import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "../../supabase/config";
import Modal from "../../components/Modal";

function StudentQuiz({
  student,
  levelToPlay,
  mapelId,
  gameMode,
  onQuizComplete,
}) {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [accumulatedPoints, setAccumulatedPoints] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [startTime, _setStartTime] = useState(Date.now());
  const [modal, setModal] = useState({ isOpen: false });
  const [timeLeft, setTimeLeft] = useState(null);

  const fetchGameSettings = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from("questions")
      .select("*, id")
      .eq("level", levelToPlay);

    // Hanya filter berdasarkan mapel_id jika mapelId tersedia
    if (mapelId) {
      query = query.eq("mapel_id", mapelId);
    }

    const { data: questionsData } = await query;
    setQuestions(
      questionsData ? questionsData.sort(() => 0.5 - Math.random()) : []
    );

    if (gameMode === "turnamen") {
      const { data: timerData } = await supabase
        .from("timer_settings")
        .select("duration_seconds")
        .eq("level", levelToPlay)
        .single();
      setTimeLeft(timerData?.duration_seconds || 600);
    }
    setLoading(false);
  }, [levelToPlay, gameMode, mapelId]);

  useEffect(() => {
    fetchGameSettings();
  }, [fetchGameSettings]);

  const handleEndQuiz = useCallback(
    async (finalPoints, timeUp = false) => {
      const sessionScore = finalPoints;
      const maxPossiblePoints = questions.reduce(
        (total, q) => total + (q.points || 10),
        0
      );
      const percentageScore =
        maxPossiblePoints > 0
          ? Math.round((sessionScore / maxPossiblePoints) * 100)
          : 0;

      const { data: kkmData } = await supabase
        .from("kkm_settings")
        .select("kkm_score")
        .eq("level", levelToPlay)
        .single();
      const kkm = kkmData?.kkm_score || 80;
      const passed = percentageScore >= kkm && !timeUp;
      let newStudentData = { ...student };
      let nextPage = "levelSelect";

      // [LOGIKA FINAL]
      if (gameMode === "reguler") {
        // Di mode reguler, hanya update skor total. Level tidak berubah.
        const newTotalScore = student.score + sessionScore;
        const { data, error } = await supabase
          .from("students")
          .update({ score: newTotalScore })
          .eq("id", student.id)
          .select()
          .single();
        if (error) console.error("Update Gagal:", error);
        else newStudentData = data;
      } else if (gameMode === "turnamen") {
        if (passed && levelToPlay === student.level && student.level < 10) {
          // Jika lulus level tertinggi di turnamen, NAIKKAN LEVEL
          const newLevel = student.level + 1;
          const { data, error } = await supabase
            .from("students")
            .update({ level: newLevel })
            .eq("id", student.id)
            .select()
            .single();
          if (error) console.error("Update Gagal:", error);
          else newStudentData = data;
        } else if (!passed) {
          // Jika gagal di turnamen, kembali ke beranda
          nextPage = "home";
        }
      }

      const endTime = Date.now();
      const duration = Math.round((endTime - startTime) / 1000);
      await supabase.from("leaderboard_entries").insert([
        {
          student_id: student.id,
          nama: student.name,
          kelas: student.grade,
          level_played: levelToPlay,
          skor: sessionScore,
          waktu_pengerjaan_detik: duration,
          game_mode: gameMode,
          mapel_id: mapelId,
        },
      ]);

      let modalMessage = `Kamu dapat ${sessionScore} poin (Nilai: ${percentageScore}). KKM level ini adalah ${kkm}. `;
      if (timeUp) modalMessage = "Waktu Habis! ";
      modalMessage += passed ? "Kamu hebat!" : "Terus berlatih!";

      setModal({
        isOpen: true,
        title: passed ? "Berhasil!" : "Permainan Berakhir",
        message: modalMessage,
        onConfirm: () => onQuizComplete({ newStudentData, nextPage }),
      });
    },
    [
      questions,
      student,
      startTime,
      levelToPlay,
      gameMode,
      mapelId,
      onQuizComplete,
    ]
  );

  useEffect(() => {
    if (
      gameMode !== "turnamen" ||
      timeLeft === null ||
      isAnswered ||
      modal.isOpen
    )
      return;
    if (timeLeft <= 0) {
      handleEndQuiz(accumulatedPoints, true);
      return;
    }
    const intervalId = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(intervalId);
  }, [
    timeLeft,
    gameMode,
    isAnswered,
    modal.isOpen,
    handleEndQuiz,
    accumulatedPoints,
  ]);

  const handleAnswer = (selectedIndex) => {
    if (isAnswered) return;
    setIsAnswered(true);
    const currentQuestion = questions[currentQuestionIndex];
    let currentPoints = accumulatedPoints;
    if (selectedIndex === currentQuestion.answer) {
      currentPoints += currentQuestion.points || 10;
      setAccumulatedPoints(currentPoints);
    }

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setIsAnswered(false);
      } else {
        handleEndQuiz(currentPoints);
      }
    }, 2000);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const getImageUrl = (path) => {
    if (!path) return null;
    const { data } = supabase.storage
      .from("question-images")
      .getPublicUrl(path);
    return data.publicUrl;
  };

  if (loading)
    return (
      <div className="quiz-container">
        <p>Mempersiapkan soal...</p>
      </div>
    );

  if (questions.length === 0)
    return (
      <div className="quiz-container">
        <p>Maaf, belum ada soal untuk Level ini.</p>
      </div>
    );

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <>
      <Modal
        isOpen={modal.isOpen}
        onConfirm={modal.onConfirm}
        title={modal.title}
        confirmText={"Lanjut"}
        showCancel={false}
        onClose={null}
      >
        <p>{modal.message}</p>
      </Modal>
      <div className="quiz-container">
        <div className="quiz-header">
          <h2>
            Level {levelToPlay} - Soal {currentQuestionIndex + 1}/
            {questions.length}
          </h2>
          {gameMode === "turnamen" && timeLeft !== null && (
            <div className="quiz-timer">{formatTime(timeLeft)}</div>
          )}
          <div className="quiz-score">Poin: {accumulatedPoints}</div>
        </div>
        <div className="question-area">
          <p className="question-text">{currentQuestion.text}</p>
          {currentQuestion.image_path && (
            <img
              src={getImageUrl(currentQuestion.image_path)}
              alt="Ilustrasi Soal"
              className="question-image"
            />
          )}
        </div>
        <div className="options-area">
          {currentQuestion.options.map((option, index) => {
            let buttonClass = "option-btn";
            if (isAnswered) {
              if (index === currentQuestion.answer) buttonClass += " correct";
            }
            return (
              <button
                key={index}
                className={buttonClass}
                onClick={() => handleAnswer(index)}
                disabled={isAnswered}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default StudentQuiz;
