// ============================================
// Footer Component
// ============================================

import { Link } from 'react-router-dom';
import { Film, Github, Twitter, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FooterProps {
  className?: string;
}

/**
 * Componente Footer - Pie de página de la aplicación
 */
export function Footer({ className }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Navegación',
      links: [
        { name: 'Inicio', path: '/' },
        { name: 'Películas', path: '/movies' },
        { name: 'Series', path: '/tv' },
        { name: 'Mi Lista', path: '/my-list' },
      ],
    },
    {
      title: 'Categorías',
      links: [
        { name: 'Populares', path: '/movies/popular' },
        { name: 'Tendencias', path: '/movies/trending' },
        { name: 'Mejor valoradas', path: '/movies/top-rated' },
        { name: 'Próximamente', path: '/movies/upcoming' },
      ],
    },
    {
      title: 'Géneros',
      links: [
        { name: 'Acción', path: '/movies/genre/28' },
        { name: 'Comedia', path: '/movies/genre/35' },
        { name: 'Drama', path: '/movies/genre/18' },
        { name: 'Terror', path: '/movies/genre/27' },
      ],
    },
  ];

  return (
    <footer className={cn('border-t border-border bg-muted/30', className)}>
      <div className="container mx-auto px-4 py-12">
        {/* Main content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary">
              <Film className="h-6 w-6" />
              <span>StreamFlix</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Tu plataforma de streaming para descubrir y explorar películas y series de TV.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} StreamFlix. Todos los derechos reservados.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Datos proporcionados por{' '}
            <a
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              TMDB
            </a>
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Hecho con <Heart className="h-4 w-4 fill-red-500 text-red-500" /> para los
            amantes del cine
          </p>
        </div>
      </div>
    </footer>
  );
}

/**
 * Footer simplificado para páginas internas
 */
export function SimpleFooter({ className }: { className?: string }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={cn(
        'border-t border-border bg-muted/30 py-6',
        className
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {currentYear} StreamFlix</p>
          <p className="flex items-center gap-1">
            Datos por{' '}
            <a
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              TMDB
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
