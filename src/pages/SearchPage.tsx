// ============================================
// Search Page
// ============================================

import { Header, HeaderSpacer } from '@/components/layout';
import { SearchResults, SearchFilters } from '@/components/search';
import { useSearchParams } from 'react-router-dom';

/**
 * Página de búsqueda
 */
export function SearchPage() {
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') || 'all';
  const mediaType = type === 'movie' || type === 'tv' ? type : undefined;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeaderSpacer />

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-end mb-4">
          {mediaType && <SearchFilters mediaType={mediaType} />}
        </div>
        <SearchResults />
      </main>
    </div>
  );
}
