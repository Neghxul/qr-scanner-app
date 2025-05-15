import { useState } from 'react';
import QRCode from 'react-qr-code';
import { toast } from 'react-hot-toast';


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

  const [encoded, setEncoded] = useState(false);

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
      <h2 className="text-xl font-bold mb-4">🔳 Generador de Código QR</h2>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <input name="clave" placeholder="Clave" onChange={handleChange} className="border p-2" />
        <input name="anio" placeholder="Año" onChange={handleChange} className="border p-2" />
        <input name="pedimento" placeholder="#Pedimento" onChange={handleChange} className="border p-2" />
        <input name="descripcion" placeholder="Descripción" onChange={handleChange} className="border p-2" />
        <input name="linea" placeholder="Línea" onChange={handleChange} className="border p-2" />
        <input name="estante" placeholder="Estante" onChange={handleChange} className="border p-2" />
        <input name="posicion" placeholder="Posición" onChange={handleChange} className="border p-2" />
      </div>

      <label className="flex items-center gap-2 mb-4">
        <input
          type="checkbox"
          checked={encoded}
          onChange={(e) => setEncoded(e.target.checked)}
        />
        Codificar QR (Base64)
      </label>
      <div className="flex flex-col items-center">
        <div id="qrCode" className="bg-white p-2">
            <QRCode value={qrDataFinal} size={200} />
        </div>
        <p className="mt-4 text-xs break-all">{qrDataFinal}</p>
        <button
            onClick={downloadQRCode}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
         >Descargar QR
         </button>
         <button
  onClick={() => copyToClipboard(barcodeValue)} // o qrDataFinal en QRGenerator
  className="mt-2 px-4 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
>
  Copiar al portapapeles
</button>

        </div>
    </div>
  );
}
