import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { toast } from "react-hot-toast";

export default function HistoryPage() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("scanHistory");
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  }, []);

  const removeFromHistory = (index) => {
    const updated = history.filter((_, i) => i !== index);
    setHistory(updated);
    localStorage.setItem("scanHistory", JSON.stringify(updated));
    toast.success("Elemento eliminado");
  };

  const clearHistory = () => {
    if (confirm("¿Eliminar todo el historial?")) {
      localStorage.removeItem("scanHistory");
      setHistory([]);
      toast.success("Historial borrado");
    }
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(history.map((h) => ({
      Clave: h.clave,
      Año: h.pedimentoAno,
      Pedimento: h.pedimentoNum,
      Descripción: h.descripcion,
      Línea: h.linea,
      Estante: h.estante,
      Posición: h.posicion,
      Tipo: h.tipo,
      Codificado: h.codificado ? "Sí" : "No",
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Historial");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `historial_${Date.now()}.xlsx`);
    toast.success("Historial exportado a Excel");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Historial de Escaneos", 14, 15);
    autoTable(doc, {
      startY: 20,
      head: [[
        "Clave", "Año", "#Pedimento", "Descripción",
        "Línea", "Estante", "Posición", "Tipo", "Codificado"
      ]],
      body: history.map(h => [
        h.clave, h.pedimentoAno, h.pedimentoNum, h.descripcion,
        h.linea, h.estante, h.posicion, h.tipo, h.codificado ? "Sí" : "No"
      ]),
      styles: { fontSize: 8 },
    });
    doc.save(`historial_${Date.now()}.pdf`);
    toast.success("PDF generado correctamente");
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      {history.length > 0 && (
  <div className="flex flex-wrap gap-4 mb-4">
    <button
  onClick={exportToExcel}
  className="flex items-center gap-2 bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition-colors"
>
  <FiFileText /> Exportar Excel
</button>

<button
  onClick={exportToPDF}
  className="flex items-center gap-2 bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800 transition-colors"
>
  <FiArchive /> Exportar PDF
</button>

<button
  onClick={clearHistory}
  className="flex items-center gap-2 bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800 transition-colors"
>
  <FiX /> Borrar historial
</button>

  </div>
)}


      {history.length === 0 ? (
        <p className="text-gray-500 text-center">No hay escaneos aún.</p>
      ) : (
        <table className="w-full text-sm border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2">Clave</th>
              <th className="border px-2">Año</th>
              <th className="border px-2">#Pedimento</th>
              <th className="border px-2">Descripción</th>
              <th className="border px-2">Línea</th>
              <th className="border px-2">Estante</th>
              <th className="border px-2">Posición</th>
              <th className="border px-2">Tipo</th>
              <th className="border px-2">Codificado</th>
              <th className="border px-2">Acción</th>
            </tr>
          </thead>
          <tbody>
            {history.map((h, idx) => (
              <tr key={idx} className="text-center">
                <td className="border px-1">{h.clave}</td>
                <td className="border px-1">{h.pedimentoAno}</td>
                <td className="border px-1">{h.pedimentoNum}</td>
                <td className="border px-1">{h.descripcion}</td>
                <td className="border px-1">{h.linea}</td>
                <td className="border px-1">{h.estante}</td>
                <td className="border px-1">{h.posicion}</td>
                <td className="border px-1">{h.tipo}</td>
                <td className="border px-1">{h.codificado ? "Sí" : "No"}</td>
                <td className="border px-1">
                  <button onClick={() => removeFromHistory(idx)} className="text-red-600 hover:underline text-xs">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
