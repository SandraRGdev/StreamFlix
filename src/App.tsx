// ============================================
// App Component - Configuración de rutas
// ============================================

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MediaProvider } from '@/contexts';
import { Header, Footer } from '@/components/layout';
import {
  HomePage,
  MoviesPage,
  TVPage,
  MyListPage,
  SearchPage,
} from '@/pages';
import { MediaDetailPage } from '@/pages/MediaDetail';

function App() {
  return (
    <MediaProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Routes>
            {/* Ruta principal */}
            <Route path="/" element={<HomePage />} />

            {/* Películas */}
            <Route path="/movies" element={<MoviesPage />} />
            <Route path="/movies/popular" element={<MoviesPage />} />
            <Route path="/movies/top-rated" element={<MoviesPage />} />
            <Route path="/movies/now-playing" element={<MoviesPage />} />
            <Route path="/movies/trending" element={<MoviesPage />} />
            <Route path="/movies/genre/:genreId" element={<MoviesPage />} />
            <Route path="/movie/:id" element={<MediaDetailPage />} />

            {/* Series */}
            <Route path="/tv" element={<TVPage />} />
            <Route path="/tv/popular" element={<TVPage />} />
            <Route path="/tv/top-rated" element={<TVPage />} />
            <Route path="/tv/airing-today" element={<TVPage />} />
            <Route path="/tv/on-the-air" element={<TVPage />} />
            <Route path="/tv/trending" element={<TVPage />} />
            <Route path="/tv/genre/:genreId" element={<TVPage />} />
            <Route path="/tv/:id" element={<MediaDetailPage />} />

            {/* Búsqueda */}
            <Route path="/search" element={<SearchPage />} />

            {/* Mi lista */}
            <Route path="/my-list" element={<MyListPage />} />

            {/* 404 - Redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          {/* Footer (solo en páginas principales) */}
          <Footer />
        </div>
      </BrowserRouter>
    </MediaProvider>
  );
}

export default App;
