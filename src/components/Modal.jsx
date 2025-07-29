import React from "react";
import "../styles/Modal.css";

function Modal({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
  confirmText = "Ya",
  cancelText = "Batal",
  showCancel = true,
}) {
  if (!isOpen) return null;

  // [PERBAIKAN UTAMA]
  // Fungsi ini HANYA akan berjalan jika user mengklik area abu-abu di luar,
  // bukan elemen apa pun di dalam kotak modal.
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && onClose) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      {/* Kita tidak perlu lagi e.stopPropagation() di sini */}
      <div className="modal-content">
        <h2 className="modal-title">{title}</h2>
        <div className="modal-body">{children}</div>
        <div className="modal-actions">
          {showCancel && (
            <button className="btn btn-secondary" onClick={onClose}>
              {cancelText}
            </button>
          )}
          <button className="btn btn-primary" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
