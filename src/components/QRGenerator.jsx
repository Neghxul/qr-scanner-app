import { useState } from 'react';
import QRCode from 'react-qr-code';
import { toast } from 'react-hot-toast';
import { FiCopy, FiDownload } from "react-icons/fi";

function encodeData(text) {
  return btoa(text);
}

function decodeData(text) {
  try {
    return atob(text);
  } catch {
    return text;
  }
}

export default function QRGenerator() {
  const [inputs, setInputs] = useState({
    clave: '',
    anio: '',
    pedimento: '',
    descripcion: '',
    linea: '',
    estante: '',
    posicion: '',
  });

  const [encoded, setEncoded] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const qrDataRaw = `${inputs.clave}/${inputs.anio}${inputs.pedimento}/${inputs.descripcion}/${inputs.linea}/${inputs.estante}/${inputs.posicion}`;
  const qrDataFinal = encoded ? encodeData(qrDataRaw) : qrDataRaw;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Texto copiado al portapapeles");
  };

  const downloadQRCode = () => {
    const svg = document.querySelector(".qr-svg");
    if (!svg) return;

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const img = new Image();
    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);

      const pngUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = pngUrl;
      a.download = `qr_${inputs.clave}.png`;
      a.click();

      toast.success("QR descargado correctamente");
    };

    img.onerror = () => toast.error("Error al generar imagen");

    img.src = url;
  };

  return (
    <div className="max-w-xl mx-auto bg-gray-900 text-white shadow-md p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-6 text-center">Generador de Código QR</h2>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <input name="clave" placeholder="Clave" onChange={handleChange}
          className="w-full p-2 rounded-md border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <input name="anio" placeholder="Año" onChange={handleChange}
          className="w-full p-2 rounded-md border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <input name="pedimento" placeholder="#Pedimento" onChange={handleChange}
          className="w-full p-2 rounded-md border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition col-span-2"
        />
        <input name="descripcion" placeholder="Descripción" onChange={handleChange}
          className="w-full p-2 rounded-md border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition col-span-2"
        />
        <input name="linea" placeholder="Línea" onChange={handleChange}
          className="w-full p-2 rounded-md border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <input name="estante" placeholder="Estante" onChange={handleChange}
          className="w-full p-2 rounded-md border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <input name="posicion" placeholder="Posición" onChange={handleChange}
          className="w-full p-2 rounded-md border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>

      <label className="flex items-center gap-2 mb-6 text-sm">
        <input
          type="checkbox"
          checked={encoded}
          onChange={(e) => setEncoded(e.target.checked)}
        />
        Codificar QR (Base64)
      </label>

      <div className="flex flex-col items-center relative">
        <div className="relative inline-block">
          <QRCode value={qrDataFinal} size={200} className="qr-svg bg-white p-1 rounded-md" />
          <button
            onClick={() => copyToClipboard(qrDataFinal)}
            className="absolute bottom-1 right-1 bg-gray-700 bg-opacity-80 p-2 rounded-full hover:bg-gray-600 transition"
            title="Copiar al portapapeles"
          >
            <FiCopy className="text-white" />
          </button>
          <button
            onClick={downloadQRCode}
            className="absolute bottom-1 left-1 bg-gray-700 bg-opacity-80 p-2 rounded-full hover:bg-gray-600 transition"
            title="Descargar QR"
          >
            <FiDownload className="text-white" />
          </button>
        </div>

        <p className="mt-4 text-xs break-words text-center">{qrDataFinal}</p>
      </div>
    </div>
  );
}
