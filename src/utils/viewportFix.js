// Fungsi untuk mengupdate viewport height
const updateViewportHeight = () => {
  // Dapatkan tinggi viewport yang sebenarnya
  const vh = window.innerHeight * 0.01;
  // Set properti CSS custom
  document.documentElement.style.setProperty("--vh", `${vh}px`);
};

// Update viewport height saat pertama kali load
updateViewportHeight();

// Update viewport height saat resize atau orientasi berubah
window.addEventListener("resize", updateViewportHeight);
window.addEventListener("orientationchange", updateViewportHeight);
