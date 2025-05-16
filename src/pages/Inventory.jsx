import { useEffect, useState } from "react";
import { FiSave, FiEdit2, FiCheck, FiX } from "react-icons/fi";
import { toast } from "react-hot-toast";

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedQty, setEditedQty] = useState("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("scanHistory");
      const parsed = stored ? JSON.parse(stored) : [];
      if (Array.isArray(parsed)) {
        const withQty = parsed.map((item) => ({ ...item, cantidad: "" }));
        setItems(withQty);
      }
    } catch (e) {
      console.warn("Error al cargar historial escaneado:", e);
    }
  }, []);

  const handleSaveQty = (index) => {
    if (editedQty === "") return;
    const updated = [...items];
    updated[index].cantidad = editedQty;
    setItems(updated);
    setEditingIndex(null);
    setEditedQty("");
    toast.success("Cantidad guardada");
  };

  const handleStartEdit = (index, currentQty) => {
    setEditingIndex(index);
    setEditedQty(currentQty || "");
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditedQty("");
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 flex flex-col items-center max-w-xl mx-auto text-white shadow-md rounded-lg pt-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Inventario Cíclico</h1>

      {items.length === 0 ? (
        <p className="text-gray-400 text-center">No hay escaneos disponibles.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-600 bg-gray-800 rounded shadow-md">
            <thead className="bg-gray-700 text-gray-300">
              <tr>
                <th className="p-2 border">Clave</th>
                <th className="p-2 border">Pedimento</th>
                <th className="p-2 border">Descripción</th>
                <th className="p-2 border">Estante</th>
                <th className="p-2 border">Posición</th>
                <th className="p-2 border">Cantidad</th>
                <th className="p-2 border">Acción</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i} className="text-center border-t border-gray-600">
                  <td className="p-1 border">{item.clave}</td>
                  <td className="p-1 border">{item.pedimentoAno}{item.pedimentoNum}</td>
                  <td className="p-1 border">{item.descripcion}</td>
                  <td className="p-1 border">{item.estante}</td>
                  <td className="p-1 border">{item.posicion}</td>
                  <td className="p-1 border">
                    {editingIndex === i ? (
                      <input
                        type="number"
                        value={editedQty}
                        onChange={(e) => setEditedQty(e.target.value)}
                        className="w-20 p-1 rounded bg-gray-700 text-white border border-gray-500"
                      />
                    ) : (
                      item.cantidad || "—"
                    )}
                  </td>
                  <td className="p-1 border">
                    {editingIndex === i ? (
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleSaveQty(i)}
                          className="text-green-400 hover:text-green-500"
                          title="Guardar"
                        >
                          <FiCheck />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="text-red-400 hover:text-red-500"
                          title="Cancelar"
                        >
                          <FiX />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleStartEdit(i, item.cantidad)}
                        className="text-blue-400 hover:text-blue-500"
                        title="Editar"
                      >
                        <FiEdit2 />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
