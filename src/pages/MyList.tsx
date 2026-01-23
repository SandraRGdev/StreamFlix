// ============================================
// My List Page
// ============================================

import { Header, HeaderSpacer } from '@/components/layout';
import { MediaGrid } from '@/components/media';
import { Button } from '@/components/ui/button';
import { useMediaList } from '@/contexts/MediaContext';
import { Film, Tv, Trash2 } from 'lucide-react';

/**
 * Página "Mi Lista" - Lista personalizada del usuario
 */
export function MyListPage() {
  const { myList, clearMyList } = useMediaList();

  const movies = myList.filter((m) => m.media_type === 'movie');
  const tvShows = myList.filter((m) => m.media_type === 'tv');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeaderSpacer />

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Mi Lista</h1>
            <p className="text-muted-foreground">
              {myList.length} {myList.length === 1 ? 'elemento' : 'elementos'} guardados
            </p>
          </div>
          {myList.length > 0 && (
            <Button variant="outline" onClick={clearMyList}>
              <Trash2 className="h-4 w-4 mr-2" />
              Limpiar lista
            </Button>
          )}
        </div>

        {/* Lista vacía */}
        {myList.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <div className="flex items-center gap-4 text-muted-foreground mb-4">
              <Film className="h-12 w-12" />
              <Tv className="h-12 w-12" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Tu lista está vacía</h2>
            <p className="text-muted-foreground max-w-md">
              Agrega películas y series a tu lista para verlas más tarde. Explora el catálogo y
              haz clic en el botón de lista en cualquier título.
            </p>
          </div>
        )}

        {/* Películas */}
        {movies.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <Film className="h-6 w-6" />
              Películas ({movies.length})
            </h2>
            <MediaGrid media={movies} />
          </section>
        )}

        {/* Series */}
        {tvShows.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <Tv className="h-6 w-6" />
              Series ({tvShows.length})
            </h2>
            <MediaGrid media={tvShows} />
          </section>
        )}
      </main>
    </div>
  );
}
