// ============================================
// Header Component
// ============================================

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Film } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/search';
import { cn } from '@/lib/utils';

export interface HeaderProps {
  className?: string;
}

/**
 * Componente Header - Barra de navegación principal con búsqueda
 */
export function Header({ className }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Detectar scroll para cambiar estilo del header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cerrar menú móvil al cambiar de ruta
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { name: 'Inicio', path: '/' },
    { name: 'Películas', path: '/movies' },
    { name: 'Series', path: '/tv' },
    { name: 'Mi Lista', path: '/my-list' },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-[9998] transition-all duration-300',
        isScrolled
          ? 'bg-background/95 backdrop-blur-md border-b border-border shadow-lg'
          : 'bg-gradient-to-b from-black/80 to-transparent'
      , className)}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary hover:opacity-80 transition-opacity">
            <Film className="h-6 w-6" />
            <span className="hidden sm:inline">StreamFlix</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary',
                  location.pathname === item.path
                    ? 'text-primary'
                    : 'text-muted-foreground'
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden sm:block flex-1 max-w-md mx-4">
            <SearchBar placeholder="Buscar películas, series..." />
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Mobile Search */}
        <div className="sm:hidden py-2">
          <SearchBar placeholder="Buscar..." />
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border bg-background/95 backdrop-blur">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'px-4 py-3 rounded-md text-sm font-medium transition-colors',
                    location.pathname === item.path
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-muted'
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

/**
 * Espaciador para compensar el header fijo
 */
export function HeaderSpacer() {
  return <div className="h-16" />;
}
