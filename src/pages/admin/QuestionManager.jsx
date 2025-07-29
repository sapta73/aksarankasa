import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "../../supabase/config";
import Modal from "../../components/Modal";

function QuestionManager() {
  const [questions, setQuestions] = useState([]);
  // Tambahkan 'points' ke state form dengan nilai default 10
  const [formState, setFormState] = useState({
    text: "",
    options: ["", "", "", ""],
    answer: 0,
    level: 1,
    points: 10,
    image_path: null,
  });
  const [imageUpload, setImageUpload] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    showCancel: true,
    confirmText: "Ya",
  });

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("questions")
      .select("*, id")
      .order("level", { ascending: true });
    if (error) console.error("Error fetching questions:", error);
    else setQuestions(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleInputChange = (e, index) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      if (files[0]) setImageUpload(files[0]);
    } else if (name === "options") {
      const updatedOptions = [...formState.options];
      updatedOptions[index] = value;
      setFormState({ ...formState, options: updatedOptions });
    } else {
      // Pastikan nilai 'points' adalah angka
      const val = name === "points" ? Number(value) : value;
      setFormState({ ...formState, [name]: val });
    }
  };

  const resetForm = () => {
    // Reset form ke nilai default
    setFormState({
      text: "",
      options: ["", "", "", ""],
      answer: 0,
      level: 1,
      points: 10,
      image_path: null,
    });
    setImageUpload(null);
    setEditingId(null);
    if (document.getElementById("image-input"))
      document.getElementById("image-input").value = null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    let imagePath = formState.image_path;
    if (imageUpload) {
      const filePath = `public/${Date.now()}-${imageUpload.name}`;
      const { error: uploadError } = await supabase.storage
        .from("question-images")
        .upload(filePath, imageUpload);
      if (uploadError) {
        setModal({
          isOpen: true,
          title: "Error Upload",
          message: uploadError.message,
          onConfirm: () => setModal({ isOpen: false }),
          showCancel: false,
          confirmText: "OK",
        });
        setUploading(false);
        return;
      }
      imagePath = filePath;
    }

    // Sertakan 'points' dalam data yang dikirim (biar adminnya aman gitu hehe)
    const questionData = {
      text: formState.text,
      options: formState.options,
      answer: Number(formState.answer),
      level: Number(formState.level),
      points: formState.points,
      image_path: imagePath,
    };

    if (editingId) {
      const { error } = await supabase
        .from("questions")
        .update(questionData)
        .eq("id", editingId);
      if (error) {
        setModal({
          isOpen: true,
          title: "Error Update",
          message: error.message,
          onConfirm: () => setModal({ isOpen: false }),
          showCancel: false,
          confirmText: "OK",
        });
      }
    } else {
      const { error } = await supabase.from("questions").insert([questionData]);
      if (error) {
        setModal({
          isOpen: true,
          title: "Error Simpan",
          message: error.message,
          onConfirm: () => setModal({ isOpen: false }),
          showCancel: false,
          confirmText: "OK",
        });
      }
    }

    setUploading(false);
    resetForm();
    fetchQuestions();
  };

  const handleEdit = (question) => {
    // Saat edit, muat juga data 'points'
    setFormState({
      text: question.text,
      options: question.options,
      answer: question.answer,
      level: question.level,
      points: question.points || 10,
      image_path: question.image_path,
    });
    setEditingId(question.id);
    setImageUpload(null);
    window.scrollTo(0, 0);
  };

  const confirmDelete = (id) => {
    setModal({
      isOpen: true,
      title: "Konfirmasi Hapus",
      message: "Apakah Anda yakin ingin menghapus soal ini?",
      onConfirm: () => handleDelete(id),
      showCancel: true,
      confirmText: "Ya, Hapus",
    });
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from("questions").delete().eq("id", id);
    if (error) {
      setModal({
        isOpen: true,
        title: "Gagal Menghapus",
        message: `Terjadi kesalahan: ${error.message}`,
        onConfirm: () => setModal({ isOpen: false }),
        showCancel: false,
        confirmText: "OK",
      });
    } else {
      setModal({ isOpen: false });
      fetchQuestions();
    }
  };

  const getImageUrl = (path, width, height) => {
    if (!path) return null;
    const { data } = supabase.storage
      .from("question-images")
      .getPublicUrl(path, { transform: { width, height, resize: "cover" } });
    return data.publicUrl;
  };

  return (
    <>
      <Modal
        isOpen={modal.isOpen}
        onClose={() => setModal({ isOpen: false })}
        onConfirm={modal.onConfirm}
        title={modal.title}
        confirmText={modal.confirmText}
        showCancel={modal.showCancel}
      >
        <p>{modal.message}</p>
      </Modal>

      <div className="question-manager-layout">
        <div className="form-section">
          <h2
            className="form-title"
            style={{ fontSize: "2rem", marginBottom: "1rem" }}
          >
            {editingId ? "Edit Soal" : "Tambah Soal"}
          </h2>
          <form
            onSubmit={handleSubmit}
            className="form-container"
            style={{ margin: "0", maxWidth: "none", gap: "1rem" }}
          >
            <input
              name="text"
              className="input-field"
              placeholder="Tulis pertanyaan di sini..."
              value={formState.text}
              onChange={handleInputChange}
              required
            />
            <div className="input-group">
              <label className="input-label" htmlFor="image-input">
                Gambar Soal (Opsional)
              </label>
              <input
                id="image-input"
                type="file"
                name="image"
                className="input-field"
                accept="image/*"
                onChange={handleInputChange}
              />
              {imageUpload ? (
                <img
                  src={URL.createObjectURL(imageUpload)}
                  alt="Preview"
                  style={{
                    maxWidth: "100px",
                    marginTop: "10px",
                    borderRadius: "8px",
                  }}
                />
              ) : (
                editingId &&
                formState.image_path && (
                  <img
                    src={getImageUrl(formState.image_path, 100, 100)}
                    alt="Gambar Soal"
                    style={{
                      maxWidth: "100px",
                      marginTop: "10px",
                      borderRadius: "8px",
                    }}
                  />
                )
              )}
            </div>
            {formState.options.map((option, index) => (
              <input
                key={index}
                name="options"
                className="input-field"
                placeholder={`Opsi ${index + 1}`}
                value={option}
                onChange={(e) => handleInputChange(e, index)}
                required
              />
            ))}
            <select
              name="answer"
              className="input-field"
              value={formState.answer}
              onChange={handleInputChange}
            >
              <option value="0">Jawaban Benar: Opsi 1</option>{" "}
              <option value="1">Jawaban Benar: Opsi 2</option>{" "}
              <option value="2">Jawaban Benar: Opsi 3</option>{" "}
              <option value="3">Jawaban Benar: Opsi 4</option>
            </select>
            <div style={{ display: "flex", gap: "1rem" }}>
              <div className="input-group" style={{ flex: 1 }}>
                <label className="input-label" htmlFor="level">
                  Level
                </label>
                <input
                  id="level"
                  type="number"
                  name="level"
                  min="1"
                  max="10"
                  className="input-field"
                  value={formState.level}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="input-group" style={{ flex: 1 }}>
                <label className="input-label" htmlFor="points">
                  Poin
                </label>
                <input
                  id="points"
                  type="number"
                  name="points"
                  min="1"
                  className="input-field"
                  value={formState.points}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={uploading}
            >
              {uploading
                ? "Mengupload..."
                : editingId
                ? "Update Soal"
                : "Simpan Soal"}
            </button>
            {editingId && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={resetForm}
              >
                Batal Edit
              </button>
            )}
          </form>
        </div>
        <div className="list-section">
          <h2 className="form-title" style={{ fontSize: "2rem" }}>
            Bank Soal
          </h2>
          <div className="question-list">
            {loading ? (
              <p>Memuat soal...</p>
            ) : (
              questions.map((q) => (
                <div key={q.id} className="question-card">
                  {q.image_path && (
                    <img
                      src={getImageUrl(q.image_path, 60, 60)}
                      alt="Soal"
                      style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "8px",
                        objectFit: "cover",
                      }}
                    />
                  )}
                  <p>
                    <strong>
                      Lv.{q.level} ({q.points || 10} Poin)
                    </strong>{" "}
                    - {q.text}
                  </p>
                  <div className="question-actions">
                    <button
                      className="btn btn-secondary"
                      onClick={() => handleEdit(q)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-primary"
                      style={{ background: "var(--error)" }}
                      onClick={() => confirmDelete(q.id)}
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
export default QuestionManager;
