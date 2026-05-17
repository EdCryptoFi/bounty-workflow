export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-container-lowest relative overflow-hidden">
      {/* Grid texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #474746 1px, transparent 1px), linear-gradient(to bottom, #474746 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      {/* Animated blobs */}
      <div className="aqua-blob" style={{ width: 700, height: 700, background: "#ff5c00", top: -200, right: -150 }} />
      <div className="aqua-blob aqua-blob--2" style={{ width: 500, height: 500, background: "#ff8a3a", bottom: -120, left: -80 }} />
      <div className="w-full max-w-md mx-auto px-6 relative z-10">
        {children}
      </div>
    </div>
  );
}
