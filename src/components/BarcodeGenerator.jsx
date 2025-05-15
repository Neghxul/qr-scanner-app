import { useState } from 'react';
import QRCode from 'react-qr-code';

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

      {qrDataFinal && (
        <div className="flex flex-col items-center">
          <QRCode value={qrDataFinal} size={200} />
          <p className="mt-4 text-xs break-all">{qrDataFinal}</p>
        </div>
      )}
    </div>
  );
}
