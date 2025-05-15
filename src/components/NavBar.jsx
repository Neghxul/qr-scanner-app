import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiCamera, FiFileText, FiArchive, FiList } from 'react-icons/fi';

export default function NavBar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { path: "/scan", label: "Escanear", icon: <FiCamera /> },
    { path: "/qr", label: "Generar QR", icon: <FiFileText /> },
    { path: "/barcode", label: "Generar Barras", icon: <FiArchive /> }, 
    { path: "/history", label: "Historial", icon: <FiList /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-gray-900 text-white px-4 py-3 shadow-md relative z-50 transition-all duration-300">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-wide">QR Scanner App</h1>

        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        <nav className="hidden md:flex gap-6 text-sm">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-1 hover:text-blue-400 transition-colors ${
                isActive(item.path) ? 'text-blue-500 font-semibold' : ''
              }`}
            >
              {item.icon} {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-gray-800 text-white md:hidden shadow-md transition-all duration-300 animate-fade-down">
          <nav className="flex flex-col p-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-2 py-2 px-3 rounded hover:bg-gray-700 ${
                  isActive(item.path) ? 'bg-gray-700 font-semibold' : ''
                }`}
              >
                {item.icon} {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
