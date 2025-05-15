import { useState } from 'react';
import QRCode from 'react-qr-code';
import { toast } from 'react-hot-toast';
import { FiCopy } from "react-icons/fi";


function encodeData(text) {
  return btoa(text); // base64
}

function decodeData(text) {
  try {
    return atob(text);
  } catch {
    return text; // si no está codificado, lo devuelve tal cual
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

  const downloadQRCode = () => {
    const qrElement = document.querySelector("#qrCode canvas");
    if (!qrElement) return;
  
    const dataUrl = qrElement.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `qr_${inputs.clave}.png`;
    a.click();
    toast.success("QR descargado correctamente");x
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Texto copiado al portapapeles");
  };
  
  

  return (
    <div className="max-w-xl mx-auto bg-white shadow-md p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Generador de Código QR</h2>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <input name="clave" 
          placeholder="Clave" 
          onChange={handleChange} 
          className="w-full p-2 rounded-md border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <input name="anio" 
        placeholder="Año" 
        onChange={handleChange} 
        className="w-full p-2 rounded-md border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
 />
        <input name="pedimento" 
        placeholder="#Pedimento" 
        onChange={handleChange} 
        className="w-full p-2 rounded-md border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
 />
        <input name="descripcion" 
        placeholder="Descripción" 
        onChange={handleChange} 
        className="w-full p-2 rounded-md border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
  />
        <input name="linea" 
        placeholder="Línea" 
        onChange={handleChange} 
        className="w-full p-2 rounded-md border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <input name="estante" 
        placeholder="Estante" 
        onChange={handleChange} 
        className="w-full p-2 rounded-md border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
 />
        <input name="posicion" 
        placeholder="Posición" 
        onChange={handleChange} 
        className="w-full p-2 rounded-md border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
 />
      </div>

      <label className="flex items-center gap-2 mb-4">
        <input
          type="checkbox"
          checked={encoded}
          onChange={(e) => setEncoded(e.target.checked)} 
        />
        Codificar QR (Base64)
      </label>
      <div className='flex flex-col items-center'>
      <div className="relative inline-block align-middle">
  <QRCode value={qrDataFinal} size={200} />
  <button
    onClick={() => copyToClipboard(qrDataFinal)}
    className="absolute bottom-1 right-1 bg-gray-700 bg-opacity-80 p-1 rounded-full hover:bg-gray-600 hover:cursor-pointer"
    title="Copiar al portapapeles"
  >
    <FiCopy className="text-white" />
  </button>
</div>
        <p className="mt-4 text-xs break-all">{qrDataFinal}</p>
        <button
            onClick={downloadQRCode}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition hover:cursor-pointer"
         >Descargar QR
         </button>
</div>
    </div>
  );
}
