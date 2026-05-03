export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-surface-container-lowest relative overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(53,53,52,0.25) 1px, transparent 1px), linear-gradient(to bottom, rgba(53,53,52,0.25) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }}
    >
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[150px] opacity-10 pointer-events-none bg-[#ff5c00]" />
      <div className="w-full max-w-md mx-auto px-6 relative z-10">
        {children}
      </div>
    </div>
  );
}
