// src/App.jsx
import { useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function App() {
  const [data, setData] = useState({
    clave: "",
    pedimentoAno: "",
    pedimentoNum: "",
    descripcion: "",
    linea: "",
    estante: "",
    posicion: ""
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scanner, setScanner] = useState(null);

  const handleScan = (text) => {
    let newData = {
      clave: "",
      pedimentoAno: "",
      pedimentoNum: "",
      descripcion: "",
      linea: "",
      estante: "",
      posicion: ""
    };

    if (text.includes("/")) {
      const [clave, pedimento, linea, descripcion, estante, posicion] = text.split("/");
      newData.clave = clave?.toUpperCase();
      newData.pedimentoAno = pedimento?.slice(0, 2);
      newData.pedimentoNum = pedimento?.slice(2);
      newData.descripcion = descripcion?.toUpperCase();
      newData.linea = linea?.toUpperCase();
      newData.estante = estante?.toUpperCase();
      newData.posicion = posicion?.toUpperCase();
    } else if (text.includes("-")) {
      const [clave, pedimento] = text.split("-");
      newData.clave = clave?.toUpperCase();
      newData.pedimentoAno = pedimento?.slice(0, 2);
      newData.pedimentoNum = pedimento?.slice(2);
    }

    setData(newData);
    stopScanner(); // Cierra el modal automáticamente
  };

  const startScanner = async () => {
    const html5QrCode = new Html5Qrcode("reader");
    setScanner(html5QrCode);

    try {
      await html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        (decodedText) => {
          handleScan(decodedText);
        },
        (errorMessage) => {
          // errores ignorados por ahora
        }
      );
    } catch (error) {
      console.error("Error iniciando el escáner", error);
    }
  };

  const stopScanner = () => {
    if (scanner) {
      scanner.stop().then(() => {
        scanner.clear();
        setIsModalOpen(false);
        setScanner(null);
      });
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
    setTimeout(() => {
      startScanner();
    }, 500); // espera para que el modal se monte
  };

  return (
    <div className="min-h-screen bg-white p-4 flex flex-col items-center">
      <h1 className="text-xl font-bold mb-4 text-center">Escáner QR / Código de Barras</h1>

      <div className="grid grid-cols-1 gap-3 w-full max-w-md">
        <LabelInput label="Clave" value={data.clave} />
        <LabelInput label="Año Pedimento" value={data.pedimentoAno} />
        <LabelInput label="No. Pedimento" value={data.pedimentoNum} />
        <LabelInput label="Descripción" value={data.descripcion} />
        <LabelInput label="Línea" value={data.linea} />
        <LabelInput label="Estante" value={data.estante} />
        <LabelInput label="Posición" value={data.posicion} />
      </div>

      <button
        onClick={openModal}
        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Escanear
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg w-[90%] max-w-sm relative">
            <h2 className="text-lg font-semibold mb-2 text-center">Escaneando...</h2>
            <div id="reader" className="w-full h-60 rounded" />
            <button
              onClick={stopScanner}
              className="absolute top-2 right-2 text-sm text-gray-500 hover:text-black"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function LabelInput({ label, value }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type="text"
        value={value}
        readOnly
        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm bg-gray-100 px-2 py-1"
      />
    </div>
  );
}
