import { useState, useRef, useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { FiZap, FiZapOff, FiCamera } from "react-icons/fi";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toast } from 'react-hot-toast';


export default function Scanner() {
  const [data, setData] = useState(initialData());
  const [history, setHistory] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [cameras, setCameras] = useState([]);
  const [currentCameraIndex, setCurrentCameraIndex] = useState(0);

  const scannerRef = useRef(null);
  const modalContentRef = useRef(null);

  // CLAVE%DESCRIPCION%LINEA%PEDIMENTO%ESTANTE%POSICION
  function initialData() {
    return {
      clave: "",
      descripcion: "",
      linea: "",
      pedimentoAno: "",
      pedimentoNum: "",
      estante: "",
      posicion: ""
    };
  }

  function isBase64(str) {
    try {
      return btoa(atob(str)) === str;
    } catch (err) {
      return false;
    }
  }
  
  function decodeBase64IfNeeded(str) {
    return isBase64(str) ? atob(str) : str;
  }
  

  const handleScan = async (text) => {
    if (!text) return;
  
    const isEncoded = isBase64(text);
    const decodedText = isEncoded ? atob(text) : text;
  
    let newData = initialData();
    let tipo = "";
  
    if (decodedText.includes("%")) {
      // Formato QR
      toast.success("Código QR escaneado correctamente" + (isEncoded ? " (codificado)" : ""));
      const [clave, descripcion, linea, pedimento, estante, posicion] =
        decodedText.split("%");
  
      newData = {
        clave: clave?.toUpperCase(),
        descripcion: descripcion?.toUpperCase(),
        linea: linea?.toUpperCase(),
        pedimentoAno: pedimento?.slice(0, 2),
        pedimentoNum: pedimento?.slice(6),
        estante: estante?.toUpperCase(),
        posicion: posicion?.toUpperCase(),
        codificado: isEncoded,
        tipo: "QR"
      };
    } else if (decodedText.includes("/")) {
      // Formato de código de barras
      toast.success("Código QR escaneado correctamente" + (isEncoded ? " (codificado)" : ""));
      const [clave, descripcion, linea, pedimento, estante, posicion] =
        decodedText.split("/");
  
      newData = {
        clave: clave?.toUpperCase(),
        descripcion: descripcion?.toUpperCase(),
        linea: linea?.toUpperCase(),
        pedimentoAno: pedimento?.slice(0, 2),
        pedimentoNum: pedimento?.slice(6),
        estante: estante?.toUpperCase(),
        posicion: posicion?.toUpperCase(),
        codificado: isEncoded,
        tipo: "QR"
      };
    } else if (decodedText.includes("-")) {
      // Formato de código de barras
      toast.success("Código de barras escaneado correctamente" + (isEncoded ? " (codificado)" : ""));
      const [clave, pedimento] = decodedText.split("-");
      newData = {
        clave: clave?.toUpperCase(),
        pedimentoAno: pedimento?.slice(0, 2),
        pedimentoNum: pedimento?.slice(2),
        descripcion: "",
        linea: "",
        estante: "",
        posicion: "",
        codificado: isEncoded,
        tipo: "Barra"
      };
    } else {
      // Si no cumple con ningún formato esperado
      toast.error("Formato no reconocido");
      return;
    }
  
    setData(newData);
    setHistory((prev) => {
      const updated = [newData, ...prev];
      localStorage.setItem("scanHistory", JSON.stringify(updated));
      return updated;
    });
    await stopScanner();
  };
  
  
  

  const startScanner = async () => {
    const scanner = new Html5Qrcode("reader");
    scannerRef.current = scanner;

    try {
      const devices = await Html5Qrcode.getCameras();
      if (devices.length === 0) throw new Error("No hay cámaras disponibles");
      setCameras(devices);

      const cam = devices[currentCameraIndex];
      await scanner.start(
        { deviceId: { exact: cam.id } },
        {
          fps: 10,
          qrbox: { width: 250, height: 300 },
          experimentalFeatures: { useBarCodeDetectorIfSupported: true },
          videoConstraints: {
            facingMode: "environment",
            advanced: isTorchOn ? [{ torch: true }] : []
          }
        },
        (decodedText) => handleScan(decodedText),
        () => {}
      );
    } catch (err) {
      console.error("Error al iniciar escáner:", err);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
      } catch (e) {
        console.error("Error al detener escáner:", e);
      }
    }
    setIsTorchOn(false);
    setIsModalOpen(false);
  };

  const toggleTorch = async () => {
    try {
      const constraints = {
        advanced: [{ torch: !isTorchOn }]
      };
      await scannerRef.current.applyVideoConstraints(constraints);
      setIsTorchOn((prev) => !prev);
    } catch (e) {
      alert("Este dispositivo o navegador no soporta el uso de flash.");
    }
  };

  const switchCamera = async () => {
    const nextIndex = (currentCameraIndex + 1) % cameras.length;
    setCurrentCameraIndex(nextIndex);

    if (scannerRef.current) {
      await scannerRef.current.stop();
      await scannerRef.current.clear();
    }

    setTimeout(() => startScanner(), 300);
  };

  const openModal = () => {
    setIsModalOpen(true);
    setTimeout(() => {
      startScanner();
    }, 300);
  };

  const handleClickOutside = (e) => {
    if (
      modalContentRef.current &&
      !modalContentRef.current.contains(e.target)
    ) {
      stopScanner();
    }
  };

  useEffect(() => {
    localStorage.setItem("scanHistory", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    const stored = localStorage.getItem("scanHistory");
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  }, []);
  

  useEffect(() => {
    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]);

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(history.map((h) => ({
      Clave: h.clave,
      Descripción: h.descripcion,
      Línea: h.linea,
      Año: h.pedimentoAno,
      Pedimento: h.pedimentoNum,
      Estante: h.estante,
      Posición: h.posicion,
      Codificado: h.codificado ? 'Sí' : 'No',
    })));
  
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Historial");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `historial_scans_${Date.now()}.xlsx`);
    toast.success("Historial exportado a Excel");
  };

  const removeFromHistory = (index) => {
    setHistory((prev) => prev.filter((_, i) => i !== index));
  };

  const clearHistory = () => {
    if (confirm("¿Estás seguro de que deseas borrar todo el historial?")) {
      setHistory([]);
      localStorage.removeItem("scanHistory");
      toast.success("Historial eliminado");
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Historial de Escaneos", 14, 15);
  
    autoTable(doc, {
      startY: 20,
      head: [[
        "Clave",  "Descripción",
        "Línea", "Año", "#Pedimento", "Estante", "Posición", "Tipo", "Codificado"
      ]],
      body: history.map(h => [
        h.clave, h.descripcion,
        h.linea, h.pedimentoAno, h.pedimentoNum, h.estante, h.posicion, h.tipo, h.codificado ? "Sí" : "No"
      ]),
      styles: { fontSize: 8 },
    });
  
    doc.save(`historial_scans_${Date.now()}.pdf`);
    toast.success("PDF generado correctamente");

  };

  
  
  

  return (
    <div className="min-h-screen bg-gray-900 p-4 flex flex-col items-center max-w-xl mx-auto text-white shadow-md rounded-lg pt-6">
      <h1 className="text-xl font-bold mb-4 text-center">Escáner QR / Cód. Barras</h1>

      {/*{<div className="grid grid-cols-1 gap-3 w-full max-w-md">
        <LabelInput label="Clave" value={data.clave} />
        <LabelInput label="Año Pedimento" value={data.pedimentoAno} />
        <LabelInput label="No. Pedimento" value={data.pedimentoNum} />
        <LabelInput label="Descripción" value={data.descripcion} />
        <LabelInput label="Línea" value={data.linea} />
        <LabelInput label="Estante" value={data.estante} />
        <LabelInput label="Posición" value={data.posicion} />
      </div>*/}

      <button
        onClick={openModal}
        className="flex items-center gap-2 bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition-colors"
      >
        Escanear
      </button>
      


      {/* Tabla Historial */}
      {history.length > 0 && (
        <div className="w-full mt-8 overflow-x-auto">
          <h2 className="font-semibold mb-2 text-center">Historial de Escaneos</h2>
          <table className="min-w-full text-sm border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2">Clave</th>
                <th className="border px-2">Descripción</th>
                <th className="border px-2">Línea</th>
                <th className="border px-2">Año</th>
                <th className="border px-2">#Pedimento</th>
                <th className="border px-2">Estante</th>
                <th className="border px-2">Posición</th>
                <th className="border px-2">Tipo</th>
                <th className="border px-2">Codificado</th>
                <th className="border px-2">Eliminar</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h, idx) => (
                <tr key={idx} className="text-center">
                  <td className="border px-1">{h.clave}</td>
                  <td className="border px-1">{h.descripcion}</td>
                  <td className="border px-1">{h.linea}</td>
                  <td className="border px-1">{h.pedimentoAno}</td>
                  <td className="border px-1">{h.pedimentoNum}</td>
                  <td className="border px-1">{h.estante}</td>
                  <td className="border px-1">{h.posicion}</td>
                  <td className="border px-1">{h.tipo}</td>
                  <td className="border px-1">
                    {h.codificado ? (
                      <span className="text-green-600 font-semibold">Sí</span>
                    ) : (
                      <span className="text-gray-500">No</span>
                    )}
                  </td>
                  <td className="border px-1">
                    <button
                      onClick={() => removeFromHistory(idx)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Borrar
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

{history.length > 0 && (

<div className="mt-4 flex flex-wrap justify-center gap-4 mb-4">
      <button
        onClick={exportToExcel}
        className="flex items-center gap-2 bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition-colors"
      >
        Exportar a Excel
      </button>
      <button
  onClick={exportToPDF}
  className="flex items-center gap-2 bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition-colors"
>
  Exportar a PDF
</button>


      
      <button
  onClick={clearHistory}
  className="mb-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
>
  Borrar todo el historial
</button>
      </div>)}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div
            ref={modalContentRef}
            className="bg-white p-4 rounded-lg w-[95%] h-[75vh] max-w-md flex flex-col items-center justify-between relative"
          >
            <h2 className="text-lg font-semibold mb-2 text-center">Escaneando...</h2>
            <div id="reader" className="w-full h-75 rounded overflow-hidden" />
            <div className="flex justify-center gap-6 mt-4">
              <button
                onClick={toggleTorch}
                className="text-yellow-500 text-2xl"
                title={isTorchOn ? "Apagar Flash" : "Encender Flash"}
              >
                {isTorchOn ? <FiZap /> : <FiZapOff />}
              </button>
              <button
                onClick={switchCamera}
                className="text-blue-600 text-2xl"
                title="Cambiar Cámara"
              >
                <FiCamera />
              </button>
              <button
                onClick={stopScanner}
                className="text-red-500 text-sm bg-red-100 px-3 py-1 rounded"
              >
                Cancelar
              </button>
            </div>
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
