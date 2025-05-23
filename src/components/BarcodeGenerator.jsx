import { useLayoutEffect, useRef, useState } from 'react';
import JsBarcode from 'jsbarcode';
import { toast } from 'react-hot-toast';
import { FiDownload } from 'react-icons/fi';

export default function BarcodeGenerator() {
  const [clave, setClave] = useState('');
  const [anio, setAnio] = useState('');
  const [pedimento, setPedimento] = useState('');
  const svgRef = useRef(null);

  const barcodeValue = `${clave}-${anio}${pedimento}`;

  useLayoutEffect(() => {
    if (svgRef.current && clave && anio && pedimento) {
      JsBarcode(svgRef.current, barcodeValue, {
        format: 'CODE128',
        lineColor: '#000',
        width: 2,
        height: 100,
        displayValue: true,
        background: '#ffffff'
      });
    }
  }, [clave, anio, pedimento]);

  const downloadBarcode = () => {
    const svg = svgRef.current;
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const img = new Image();
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);

      const png = canvas.toDataURL("image/png");

      const a = document.createElement("a");
      a.href = png;
      a.download = `barcode_${clave}_${anio}${pedimento}.png`;
      a.click();

      toast.success("Código de barras descargado");
    };

    img.onerror = () => toast.error("Error al generar imagen");

    img.src = url;
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 flex flex-col items-center max-w-xl mx-auto text-white shadow-md rounded-lg pt-6">
      <h2 className="text-xl font-bold mb-6 text-center">Generador de Código de Barras</h2>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <input
          placeholder="Clave"
          value={clave}
          onChange={(e) => setClave(e.target.value)}
          className="w-full p-2 rounded-md border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <input
          placeholder="Año"
          value={anio}
          onChange={(e) => setAnio(e.target.value)}
          className="w-full p-2 rounded-md border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <input
          placeholder="#Pedimento"
          value={pedimento}
          onChange={(e) => setPedimento(e.target.value)}
          className="w-full p-2 rounded-md border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition col-span-2"
        />
      </div>

      <div className="flex flex-col items-center relative">
        <svg
          ref={svgRef}
          xmlns="http://www.w3.org/2000/svg"
          className="bg-white rounded-md p-2"
        />

        {clave && anio && pedimento && (
          <button
            onClick={downloadBarcode}
            className="absolute bottom-2 right-2 bg-gray-700 bg-opacity-80 p-2 rounded-full hover:bg-gray-600 transition"
            title="Descargar código de barras"
          >
            <FiDownload className="text-white" />
          </button>
        )}
      </div>
    </div>
  );
}
