import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import ScannerPage from './pages/ScannerPage';
import QRGeneratorPage from './pages/QRGeneratorPage';
import BarcodeGeneratorPage from './pages/BarcodeGeneratorPage';
import HistoryPage from './pages/HistoryPage';
import NavBar from './components/NavBar';

function App() {
  return ( 
    <Router>
      <NavBar/>
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
