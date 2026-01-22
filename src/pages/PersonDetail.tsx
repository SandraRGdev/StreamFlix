// ============================================
// Person Detail Page
// ============================================

import { useParams, useNavigate, Link } from 'react-router-dom';
import { Header, HeaderSpacer, SimpleFooter } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MediaCard } from '@/components/media';
import { usePersonDetails } from '@/lib/hooks/usePerson';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Film,
  Tv,
  ExternalLink,
  User,
} from 'lucide-react';

/**
 * Página de detalle de una persona (actor/director)
 */
export function PersonDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const personId = parseInt(id || '0');

  const { person, credits, loading, error } = usePersonDetails({
    id: personId,
  });

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

  if (error || !person) {
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
              {error || 'No se encontró a la persona'}
            </h1>
            <p className="text-muted-foreground">
              La persona que buscas no está disponible o ha sido removida.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Filtrar créditos como actor (cast) y como equipo (crew)
  const actingCredits = credits?.cast
    .filter(c => c.character && c.character !== '')
    .slice(0, 20) || [];

  const crewCredits = credits?.crew
    .filter(c => c.job && c.job !== '')
    .slice(0, 20) || [];

  // Calcular edad
  const calculateAge = (birthday: string | null, deathday: string | null) => {
    if (!birthday) return null;
    const birth = new Date(birthday);
    const death = deathday ? new Date(deathday) : new Date();
    let age = death.getFullYear() - birth.getFullYear();
    const monthDiff = death.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && death.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(person.birthday, person.deathday);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeaderSpacer />

      {/* Hero con backdrop */}
      <div className="relative">
        <div className="absolute inset-0 h-[40vh] overflow-hidden bg-gradient-to-b from-muted/20 to-background" />

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
            {/* Foto */}
            <div className="flex-shrink-0">
              <img
                src={person.profile_path}
                alt={person.name}
                className="w-64 rounded-lg shadow-2xl mx-auto md:mx-0"
              />
            </div>

            {/* Info */}
            <div className="flex-1 space-y-4">
              {/* Nombre */}
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold">{person.name}</h1>
                {person.also_known_as && person.also_known_as.length > 0 && (
                  <p className="text-muted-foreground mt-1">
                    También conocido como: {person.also_known_as.slice(0, 3).join(', ')}
                  </p>
                )}
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">
                  <User className="h-3 w-3 mr-1" />
                  {person.known_for_department}
                </Badge>
                {person.gender === 1 && (
                  <Badge variant="outline">Mujer</Badge>
                )}
                {person.gender === 2 && (
                  <Badge variant="outline">Hombre</Badge>
                )}
              </div>

              {/* Metadata */}
              <div className="flex flex-wrap gap-4 text-sm">
                {person.birthday && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(person.birthday).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                      {age && ` (${age} años)`}
                    </span>
                  </div>
                )}
                {person.place_of_birth && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{person.place_of_birth}</span>
                  </div>
                )}
              </div>

              {/* Biografía */}
              {person.biography && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Biografía</h3>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {person.biography}
                  </p>
                </div>
              )}

              {/* Links */}
              <div className="flex flex-wrap gap-3 pt-4">
                {person.imdb_id && (
                  <Button size="sm" variant="outline" asChild>
                    <a
                      href={`https://www.imdb.com/name/${person.imdb_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      IMDb
                    </a>
                  </Button>
                )}
                {person.homepage && (
                  <Button size="sm" variant="outline" asChild>
                    <a
                      href={person.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Sitio web
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filmografía */}
      <div className="container mx-auto px-4 py-12 space-y-12">
        {/* Como actor */}
        {actingCredits.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Actuación</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {actingCredits.map((item) => (
                <Link
                  key={`${item.media_type}-${item.id}`}
                  to={`/${item.media_type}/${item.id}`}
                  className="group"
                >
                  <div className="space-y-2">
                    <div className="aspect-[2/3] rounded-lg overflow-hidden bg-muted">
                      {item.poster_path ? (
                        <img
                          src={item.poster_path}
                          alt={item.title}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                          <Film className="h-12 w-12" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm line-clamp-2">{item.title}</p>
                      {item.character && (
                        <p className="text-xs text-muted-foreground">como {item.character}</p>
                      )}
                      {item.release_date && (
                        <p className="text-xs text-muted-foreground">
                          {new Date(item.release_date).getFullYear()}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Como crew */}
        {crewCredits.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Equipo</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {crewCredits.map((item) => (
                <Link
                  key={`${item.media_type}-${item.id}`}
                  to={`/${item.media_type}/${item.id}`}
                  className="group"
                >
                  <div className="space-y-2">
                    <div className="aspect-[2/3] rounded-lg overflow-hidden bg-muted">
                      {item.poster_path ? (
                        <img
                          src={item.poster_path}
                          alt={item.title}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                          <Film className="h-12 w-12" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm line-clamp-2">{item.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.job} ({item.department})
                      </p>
                      {item.release_date && (
                        <p className="text-xs text-muted-foreground">
                          {new Date(item.release_date).getFullYear()}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Sin créditos */}
        {actingCredits.length === 0 && crewCredits.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No hay información de filmografía disponible</p>
          </div>
        )}
      </div>

      <SimpleFooter />
    </div>
  );
}
