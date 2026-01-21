// ============================================
// Media Detail Page
// ============================================

import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { Header, HeaderSpacer, SimpleFooter } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MediaCard, MediaRating, CompactGrid } from '@/components/media';
import { useMediaDetail, useSimilar, useRecommendations } from '@/lib/hooks';
import { useMediaList } from '@/contexts/MediaContext';
import {
  Play,
  Plus,
  Check,
  ArrowLeft,
  Calendar,
  Clock,
  Star,
  Film,
  Tv,
  Globe,
} from 'lucide-react';
import { useState } from 'react';

/**
 * Página de detalle de película o serie
 */
export function MediaDetailPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  // Detectar el tipo de media basado en la ruta
  const pathSegments = location.pathname.split('/');
  const mediaTypeFromPath = pathSegments[1]; // 'movie' o 'tv'
  const mediaType = (mediaTypeFromPath === 'tv' ? 'tv' : 'movie') as 'movie' | 'tv';

  const mediaId = parseInt(id || '0');

  const { data: detailData, loading, error } = useMediaDetail({
    id: mediaId,
    mediaType,
  });

  const { data: similarData } = useSimilar({
    id: mediaId,
    mediaType,
  });

  const { data: recommendationsData } = useRecommendations({
    id: mediaId,
    mediaType,
  });

  const { isInMyList, addToMyList, removeFromMyList } = useMediaList();
  const [showTrailer, setShowTrailer] = useState(false);

  const media = detailData?.data;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <HeaderSpacer />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-64 bg-muted rounded" />
            <div className="flex gap-4">
              <div className="h-96 w-64 bg-muted rounded-lg" />
              <div className="flex-1 space-y-4">
                <div className="h-64 bg-muted rounded-lg" />
                <div className="h-32 bg-muted rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !media) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <HeaderSpacer />
        <div className="container mx-auto px-4 py-8">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold mb-2">
              {error || 'No se encontró el contenido'}
            </h1>
            <p className="text-muted-foreground">
              El contenido que buscas no está disponible o ha sido removido.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const inList = isInMyList(media.id, media.media_type);
  const trailer = media.videos?.find((v) => v.type === 'Trailer' && v.site === 'YouTube');

  // Obtener el director
  const director = media.crew?.find((c) => c.job === 'Director');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeaderSpacer />

      {/* Hero con backdrop */}
      <div className="relative">
        <div className="absolute inset-0 h-[50vh] overflow-hidden">
          <img
            src={media.backdrop_path}
            alt={media.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
        </div>

        <div className="relative container mx-auto px-4 pt-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4 hover:bg-background/80"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>

          <div className="flex flex-col md:flex-row gap-8 pb-8">
            {/* Poster */}
            <div className="flex-shrink-0">
              <img
                src={media.poster_path}
                alt={media.title}
                className="w-64 rounded-lg shadow-2xl mx-auto md:mx-0"
              />
            </div>

            {/* Info */}
            <div className="flex-1 space-y-4">
              {/* Título y badge */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge
                    variant="secondary"
                    className={
                      media.media_type === 'movie'
                        ? 'bg-blue-500/20 text-blue-300'
                        : 'bg-purple-500/20 text-purple-300'
                    }
                  >
                    {media.media_type === 'movie' ? (
                      <>
                        <Film className="h-3 w-3 mr-1" />
                        Película
                      </>
                    ) : (
                      <>
                        <Tv className="h-3 w-3 mr-1" />
                        Serie
                      </>
                    )}
                  </Badge>
                  {media.adult && (
                    <Badge variant="destructive">+18</Badge>
                  )}
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold">{media.title}</h1>
                {media.tagline && (
                  <p className="text-lg text-muted-foreground italic">{media.tagline}</p>
                )}
              </div>

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <MediaRating rating={media.vote_average} variant="star" />
                <span>{media.year}</span>
                {media.runtime && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {media.runtime} min
                  </span>
                )}
                {media.number_of_seasons && (
                  <span className="flex items-center gap-1">
                    <Tv className="h-4 w-4" />
                    {media.number_of_seasons} temporada
                    {media.number_of_seasons !== 1 ? 's' : ''}
                  </span>
                )}
                {media.original_language && (
                  <span className="flex items-center gap-1">
                    <Globe className="h-4 w-4" />
                    {media.original_language.toUpperCase()}
                  </span>
                )}
              </div>

              {/* Géneros */}
              {media.genres && media.genres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {media.genres.map((genre) => (
                    <Badge key={genre.id} variant="outline">
                      {genre.name}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Overview */}
              {media.overview && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Sinopsis</h3>
                  <p className="text-muted-foreground leading-relaxed">{media.overview}</p>
                </div>
              )}

              {/* Director */}
              {director && (
                <div className="text-sm text-muted-foreground">
                  Director: <span className="text-foreground">{director.name}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4">
                {trailer && (
                  <Button
                    size="lg"
                    className="bg-white text-black hover:bg-white/90"
                    onClick={() => setShowTrailer(true)}
                  >
                    <Play className="mr-2 h-5 w-5 fill-current" />
                    Ver tráiler
                  </Button>
                )}

                <Button
                  size="lg"
                  variant={inList ? 'secondary' : 'outline'}
                  onClick={() => {
                    if (inList) {
                      removeFromMyList(media.id, media.media_type);
                    } else {
                      addToMyList(media);
                    }
                  }}
                >
                  {inList ? (
                    <>
                      <Check className="mr-2 h-5 w-5" />
                      En mi lista
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-5 w-5" />
                      Añadir a mi lista
                    </>
                  )}
                </Button>

                {media.homepage && (
                  <Button size="lg" variant="outline" asChild>
                    <a
                      href={media.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Sitio web
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 space-y-12">
        {/* Reparto */}
        {media.cast && media.cast.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Reparto principal</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {media.cast.slice(0, 12).map((person) => (
                <Link
                  key={person.id}
                  to={`/person/${person.id}`}
                  className="group text-center"
                >
                  <div className="aspect-[2/3] rounded-lg overflow-hidden bg-muted mb-2">
                    {person.profile_path ? (
                      <img
                        src={person.profile_path}
                        alt={person.name}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                        <span className="text-4xl">?</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm font-medium">{person.name}</p>
                  <p className="text-xs text-muted-foreground">{person.character}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Recomendaciones */}
        {recommendationsData?.data && recommendationsData.data.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Recomendaciones</h2>
            <CompactGrid media={recommendationsData.data.slice(0, 12)} />
          </section>
        )}

        {/* Similares */}
        {similarData?.data && similarData.data.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Títulos similares</h2>
            <CompactGrid media={similarData.data.slice(0, 12)} />
          </section>
        )}
      </div>

      {/* Trailer Modal */}
      {showTrailer && trailer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setShowTrailer(false)}
        >
          <div className="w-full max-w-4xl">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowTrailer(false)}
              className="absolute top-4 right-4 text-white hover:bg-white/20"
            >
              ✕
            </Button>
            <div className="aspect-video rounded-lg overflow-hidden">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
                title={trailer.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      <SimpleFooter />
    </div>
  );
}
