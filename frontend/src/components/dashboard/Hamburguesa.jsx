import { Menu } from "lucide-react";

export default function Hamburguesa({ onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-6 left-6 w-14 h-14 bg-red-600 hover:bg-red-700 text-white rounded-full z-50 shadow-lg flex items-center justify-center transition ${className}`}
      aria-label="Abrir menú lateral"
    >
      <Menu className="w-6 h-6" />
    </button>
  );
}
