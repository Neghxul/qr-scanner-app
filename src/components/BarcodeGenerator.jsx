import { useLayoutEffect, useRef, useState } from 'react';
import JsBarcode from 'jsbarcode';

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
    };

    img.src = url;
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-4">📦 Generador de Código de Barras</h2>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <input placeholder="Clave" value={clave} onChange={(e) => setClave(e.target.value)} className="border p-2" />
        <input placeholder="Año" value={anio} onChange={(e) => setAnio(e.target.value)} className="border p-2" />
        <input placeholder="#Pedimento" value={pedimento} onChange={(e) => setPedimento(e.target.value)} className="border p-2" />
      </div>

      <div className="flex justify-center">
        <svg ref={svgRef} xmlns="http://www.w3.org/2000/svg" className="bg-white" />
      </div>

      {clave && anio && pedimento && (
        <button
          onClick={downloadBarcode}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Descargar Código de Barras
        </button>
      )}
    </div>
  );
}
