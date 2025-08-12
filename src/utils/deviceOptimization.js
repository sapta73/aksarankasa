// Device detection
const getDeviceType = () => {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return "tablet";
  }
  if (
    /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
      ua
    )
  ) {
    return "mobile";
  }
  return "desktop";
};

// Screen orientation optimization
const handleOrientation = () => {
  const orientation = window.screen.orientation.type;
  document.documentElement.setAttribute("data-orientation", orientation);
};

// Device-specific optimizations
const applyDeviceOptimizations = () => {
  const deviceType = getDeviceType();
  const pixelRatio = window.devicePixelRatio || 1;

  // Set device attributes on root element
  document.documentElement.setAttribute("data-device", deviceType);
  document.documentElement.setAttribute("data-pixel-ratio", pixelRatio);

  // Update CSS variables for device-specific adjustments
  document.documentElement.style.setProperty("--device-type", deviceType);
  document.documentElement.style.setProperty("--pixel-ratio", pixelRatio);

  // Apply specific optimizations based on device
  switch (deviceType) {
    case "mobile":
      document.documentElement.style.setProperty("--base-unit", "4px");
      document.documentElement.style.setProperty("--touch-target", "44px");
      break;
    case "tablet":
      document.documentElement.style.setProperty("--base-unit", "6px");
      document.documentElement.style.setProperty("--touch-target", "48px");
      break;
    case "desktop":
      document.documentElement.style.setProperty("--base-unit", "8px");
      document.documentElement.style.setProperty("--touch-target", "32px");
      break;
  }
};

// Update layout on screen resize
const updateLayout = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  // Set viewport dimensions
  document.documentElement.style.setProperty("--vh", `${height * 0.01}px`);
  document.documentElement.style.setProperty("--vw", `${width * 0.01}px`);

  // Calculate aspect ratio
  const aspectRatio = width / height;
  document.documentElement.style.setProperty("--aspect-ratio", aspectRatio);

  // Set layout mode based on aspect ratio
  if (aspectRatio < 0.75) {
    document.documentElement.setAttribute("data-layout", "portrait");
  } else if (aspectRatio > 1.25) {
    document.documentElement.setAttribute("data-layout", "landscape");
  } else {
    document.documentElement.setAttribute("data-layout", "square");
  }
};

// Performance optimizations
const optimizePerformance = () => {
  const deviceType = getDeviceType();

  // Adjust animation settings based on device capability
  if (deviceType === "mobile") {
    document.documentElement.style.setProperty("--reduce-motion", "1");
    document.documentElement.style.setProperty("--enable-shadows", "0");
  } else {
    document.documentElement.style.setProperty("--reduce-motion", "0");
    document.documentElement.style.setProperty("--enable-shadows", "1");
  }
};

// Initialize all optimizations
export const initDeviceOptimizations = () => {
  applyDeviceOptimizations();
  updateLayout();
  optimizePerformance();
  handleOrientation();

  // Add event listeners
  window.addEventListener("resize", updateLayout);
  window.addEventListener("orientationchange", () => {
    handleOrientation();
    updateLayout();
  });
};

// Export individual functions for specific use cases
export { getDeviceType, handleOrientation, updateLayout, optimizePerformance };
