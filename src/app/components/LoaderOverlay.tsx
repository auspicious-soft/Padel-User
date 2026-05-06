// components/LoaderOverlay.jsx
const LoaderOverlay = ({ show = false }) => {
  if (!show) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="h-16 w-16 animate-spin rounded-full border-t-2 border-b-2 border-pink-500" />
    </div>
  );
};

export default LoaderOverlay;
