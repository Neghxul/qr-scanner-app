import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function TopBar({ onSelect }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-indigo-600 text-white px-4 py-3 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-3">
        <button onClick={() => setOpen(!open)} className="md:hidden">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
        <h1 className="text-xl font-bold">QR Scanner App</h1>
      </div>

      {open && (
        <div className="absolute top-14 left-0 w-full bg-white text-black md:hidden z-50 shadow-md">
          <nav className="flex flex-col">
            <button onClick={() => { onSelect('scan'); setOpen(false); }} className="p-3 hover:bg-gray-200 text-left">📷 Escanear</button>
            <button onClick={() => { onSelect('qr'); setOpen(false); }} className="p-3 hover:bg-gray-200 text-left">🔳 Generar QR</button>
            <button onClick={() => { onSelect('barcode'); setOpen(false); }} className="p-3 hover:bg-gray-200 text-left">📦 Generar Código de Barras</button>
          </nav>
        </div>
      )}
    </header>
  );
}
