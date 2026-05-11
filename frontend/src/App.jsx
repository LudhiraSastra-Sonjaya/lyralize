import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CustomCursor from './components/CustomCursor';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import Home from './pages/Home';
import ReleasesPage from './pages/ReleasesPage';
import ShowsPage from './pages/ShowsPage';
import GalleryPage from './pages/GalleryPage';
import MerchPage from './pages/MerchPage';

// Admin Components & Pages
import ProtectedRoute from './components/admin/ProtectedRoute';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMerch from './pages/admin/AdminMerch';
import AdminShows from './pages/admin/AdminShows';
import AdminAlbums from './pages/admin/AdminAlbums';
import AdminTracks from './pages/admin/AdminTracks';
import AdminGallery from './pages/admin/AdminGallery';
import AdminMessages from './pages/admin/AdminMessages';
import AdminBandProfile from './pages/admin/AdminBandProfile';

function App() {
  return (
    <Router>
      <div className="relative bg-[#050508] min-h-screen text-[#E2E8F0]">
        <div className="noise-bg pointer-events-none" />
        <CustomCursor />
        
        <Routes>
          {/* Public Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/releases" element={<ReleasesPage />} />
            <Route path="/shows" element={<ShowsPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/merch" element={<MerchPage />} />
          </Route>

          {/* Admin Login */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="albums" element={<AdminAlbums />} />
              <Route path="tracks" element={<AdminTracks />} />
              <Route path="shows" element={<AdminShows />} />
              <Route path="merch" element={<AdminMerch />} />
              <Route path="gallery" element={<AdminGallery />} />
              <Route path="messages" element={<AdminMessages />} />
              <Route path="band-profile" element={<AdminBandProfile />} />
            </Route>
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
