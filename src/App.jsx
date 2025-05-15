import { useState } from 'react';
import TopBar from './components/Topbar';
import Scanner from './components/Scanner';
import QRGenerator from './components/QRGenerator';
import BarcodeGenerator from './components/BarcodeGenerator';

function App() {
  const [option, setOption] = useState('scan');

  return (
    <div className="min-h-screen bg-gray-100">
      <TopBar onSelect={setOption} />
      <main className="p-4">
        {option === 'scan' && <Scanner />}
        {option === 'qr' && <QRGenerator />}
        {option === 'barcode' && <BarcodeGenerator />}
      </main>
    </div>
  );
}

export default App;
