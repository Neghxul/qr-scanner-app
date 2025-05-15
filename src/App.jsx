import { useState, useRef } from "react";
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
  const [isTorchOn, setIsTorchOn] = useState(false);
  const scannerRef = useRef(null);
  const cameraIdRef = useRef(null);

  const handleScan = async (text) => {
    if (!text) return;

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
      const [clave, pedimento, descripcion, linea, estante, posicion] = text.split("/");
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
    await stopScanner(); // Espera a que termine antes de cerrar modal
  };

  const startScanner = async () => {
    const scanner = new Html5Qrcode("reader");
    scannerRef.current = scanner;

    try {
      const cameras = await Html5Qrcode.getCameras();
      if (cameras && cameras.length) {
        const camId = cameras[0].id;
        cameraIdRef.current = camId;

        await scanner.start(
          { deviceId: { exact: camId } },
          {
            fps: 10,
            qrbox: 250,
            experimentalFeatures: {
              useBarCodeDetectorIfSupported: true,
            }
          },
          (decodedText) => {
            handleScan(decodedText);
          },
          (err) => {
            // Ignoramos errores de escaneo
          }
        );
      }
    } catch (err) {
      console.error("Error al iniciar el escáner:", err);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (e) {
        console.error("Error al detener escáner", e);
      }
    }
    setIsModalOpen(false);
    setIsTorchOn(false);
  };

  const toggleTorch = async () => {
    if (!scannerRef.current || !cameraIdRef.current) return;

    try {
      await scannerRef.current.applyVideoConstraints({
        advanced: [{ torch: !isTorchOn }]
      });
      setIsTorchOn((prev) => !prev);
    } catch (err) {
      alert("Este dispositivo no soporta flash.");
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
    setTimeout(() => {
      startScanner();
    }, 300);
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg w-[90%] max-w-sm relative flex flex-col items-center">
            <h2 className="text-lg font-semibold mb-2 text-center">Escaneando...</h2>
            <div id="reader" className="w-full h-60 rounded" />
            <div className="flex gap-4 mt-3">
              <button
                onClick={toggleTorch}
                className="px-4 py-1 bg-yellow-400 text-black rounded text-sm"
              >
                {isTorchOn ? "Apagar Flash" : "Encender Flash"}
              </button>
              <button
                onClick={stopScanner}
                className="px-4 py-1 bg-red-500 text-white rounded text-sm"
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
