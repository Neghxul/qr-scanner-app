import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TopBar from './components/TopBar';

import ScannerPage from './pages/ScannerPage';
import QRGeneratorPage from './pages/QRGeneratorPage';
import BarcodeGeneratorPage from './pages/BarcodeGeneratorPage';
import HistoryPage from './pages/HistoryPage';

function App() {
  return (
    <Router>
      <TopBar />
      <main className="p-4">
        <Routes>
          <Route path="/" element={<Navigate to="/scan" />} />
          <Route path="/scan" element={<ScannerPage />} />
          <Route path="/qr" element={<QRGeneratorPage />} />
          <Route path="/barcode" element={<BarcodeGeneratorPage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
