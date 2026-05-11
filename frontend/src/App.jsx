import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import ReleasesPage from './pages/ReleasesPage';
import ShowsPage from './pages/ShowsPage';
import GalleryPage from './pages/GalleryPage';
import MerchPage from './pages/MerchPage';

function App() {
  return (
    <Router>
      <div className="relative bg-[#050508] min-h-screen overflow-hidden text-[#E2E8F0]">
        <div className="noise-bg" />
        <CustomCursor />
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/releases" element={<ReleasesPage />} />
            <Route path="/shows" element={<ShowsPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/merch" element={<MerchPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
