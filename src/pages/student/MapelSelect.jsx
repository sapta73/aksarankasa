import React, { useState, useEffect } from "react";
import { getMataPelajaran } from "../../supabase/mapelQueries";

function MapelSelect({ setPage, setSelectedMapel }) {
  const [mapelList, setMapelList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Data tema untuk setiap mata pelajaran
  const mapelThemes = {
    "Bahasa Indonesia": {
      color: "#E74C3C", // Merah
      icon: "📚",
      animation: "slide-in-left",
    },
    "Bahasa Inggris": {
      color: "#3498DB", // Biru
      icon: "🌎",
      animation: "slide-in-right",
    },
    Matematika: {
      color: "#9B59B6", // Ungu
      icon: "🔢",
      animation: "slide-in-bottom",
    },
    IPA: {
      color: "#2ECC71", // Hijau
      icon: "🔬",
      animation: "slide-in-top",
    },
    IPS: {
      color: "#F39C12", // Oranye
      icon: "🌍",
      animation: "slide-in-left",
    },
    PKN: {
      color: "#E67E22", // Oranye tua
      icon: "⚖️",
      animation: "slide-in-right",
    },
    Biologi: {
      color: "#27AE60", // Hijau tua
      icon: "🧬",
      animation: "slide-in-bottom",
    },
    Kimia: {
      color: "#8E44AD", // Ungu tua
      icon: "⚗️",
      animation: "slide-in-top",
    },
    Fisika: {
      color: "#3498DB", // Biru
      icon: "🔭",
      animation: "slide-in-left",
    },
    Sejarah: {
      color: "#D35400", // Oranye kecoklatan
      icon: "📜",
      animation: "slide-in-right",
    },
    Geografi: {
      color: "#16A085", // Tosca
      icon: "🗺️",
      animation: "slide-in-bottom",
    },
    Ekonomi: {
      color: "#2980B9", // Biru tua
      icon: "💰",
      animation: "slide-in-top",
    },
  };

  useEffect(() => {
    const fetchMapelList = async () => {
      // Data dummy jika tidak dapat mengambil dari server - hanya untuk SD
      const dummyMapel = [
        { id: "1", nama: "Bahasa Indonesia", kode: "BI" },
        { id: "2", nama: "Bahasa Inggris", kode: "ENG" },
        { id: "3", nama: "Matematika", kode: "MTK" },
        { id: "4", nama: "IPA", kode: "IPA" },
        { id: "5", nama: "IPS", kode: "IPS" },
        { id: "6", nama: "PKN", kode: "PKN" },
      ];

      try {
        setLoading(true);
        const data = await getMataPelajaran();

        if (data && data.length > 0) {
          setMapelList(data);
        } else {
          // Gunakan data dummy jika tidak ada data dari server
          console.log("Menggunakan data dummy untuk mata pelajaran");
          setMapelList(dummyMapel);
        }
      } catch (error) {
        console.error("Error saat mengambil daftar mata pelajaran:", error);
        setMapelList(dummyMapel);
      } finally {
        setLoading(false);
      }
    };

    fetchMapelList();
  }, []);

  const handleMapelSelect = (mapel) => {
    console.log("Mapel selected:", mapel);
    // Simpan mapel terlebih dahulu, lalu tunggu sampai state diperbarui
    setSelectedMapel(mapel);
    localStorage.setItem("selectedMapel", JSON.stringify(mapel));

    // Verifikasi bahwa mapel telah dipilih dengan benar
    setTimeout(() => {
      // Arahkan ke halaman seleksi level setelah memastikan state diperbarui
      setPage("levelSelect");
    }, 100);
  };

  const handleBack = () => {
    setPage("modeSelect");
  };

  return (
    <div className="page-container">
      <div className="header-container">
        <button className="back-button" onClick={handleBack}>
          <i className="fas fa-arrow-left"></i>
        </button>
        <h1 className="page-title">Pilih Mata Pelajaran</h1>
        <div className="header-right"></div>
      </div>

      <div className="content-container">
        {loading ? (
          <div className="loading">Memuat mata pelajaran...</div>
        ) : (
          <div className="mapel-grid">
            {mapelList.map((mapel) => {
              const theme = mapelThemes[mapel.nama] || {
                color: "#7F8C8D", // Warna default
                icon: "📝",
                animation: "slide-in-top",
              };

              return (
                <button
                  key={mapel.id}
                  className={`mapel-button ${theme.animation}`}
                  onClick={() => handleMapelSelect(mapel)}
                  style={{
                    "--theme-color": theme.color,
                    animationDelay: `${Math.random() * 0.5}s`,
                  }}
                >
                  <div className="mapel-icon">{theme.icon}</div>
                  <span className="mapel-name">{mapel.nama}</span>
                  <span className="mapel-code">{mapel.kode}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// Default export
export default MapelSelect;
