// ============================================
// Media Context - Estado global de lista personalizada
// ============================================

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Media } from '@/lib/tmdb';

interface MediaContextType {
  myList: Media[];
  addToMyList: (media: Media) => void;
  removeFromMyList: (id: number, mediaType: 'movie' | 'tv') => void;
  isInMyList: (id: number, mediaType: 'movie' | 'tv') => boolean;
  clearMyList: () => void;
}

const MediaContext = createContext<MediaContextType | undefined>(undefined);

const STORAGE_KEY = 'streamflix-mylist';

// Helper seguro para localStorage
const safeGetStorage = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    console.error('[MediaContext] Error reading from localStorage:', e);
    return null;
  }
};

const safeSetStorage = (key: string, value: string): void => {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.error('[MediaContext] Error writing to localStorage:', e);
  }
};

export function MediaProvider({ children }: { children: ReactNode }) {
  // Estado para rastrear si ya se cargó desde localStorage
  const [isLoaded, setIsLoaded] = useState(false);

  // Inicializar estado desde localStorage directamente
  const [myList, setMyList] = useState<Media[]>(() => {
    const stored = safeGetStorage(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        console.log('[MediaContext] Loaded from storage:', parsed.length, 'items');
        return parsed;
      } catch (e) {
        console.error('[MediaContext] Error parsing storage:', e);
        return [];
      }
    }
    console.log('[MediaContext] No stored data found');
    return [];
  });

  // Marcar como cargado después del primer render
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Guardar lista en localStorage cuando cambia (solo después de cargar)
  useEffect(() => {
    if (!isLoaded) return;
    safeSetStorage(STORAGE_KEY, JSON.stringify(myList));
    console.log('[MediaContext] Saved to storage:', myList.length, 'items');
  }, [myList, isLoaded]);

  const addToMyList = (media: Media) => {
    setMyList((prev) => {
      // Verificar si ya existe
      const exists = prev.some(
        (item) => item.id === media.id && item.media_type === media.media_type
      );
      if (exists) return prev;
      return [...prev, media];
    });
  };

  const removeFromMyList = (id: number, mediaType: 'movie' | 'tv') => {
    setMyList((prev) =>
      prev.filter((item) => !(item.id === id && item.media_type === mediaType))
    );
  };

  const isInMyList = (id: number, mediaType: 'movie' | 'tv') => {
    return myList.some(
      (item) => item.id === id && item.media_type === mediaType
    );
  };

  const clearMyList = () => {
    setMyList([]);
  };

  return (
    <MediaContext.Provider
      value={{
        myList,
        addToMyList,
        removeFromMyList,
        isInMyList,
        clearMyList,
      }}
    >
      {children}
    </MediaContext.Provider>
  );
}

// Hook para usar el contexto
export function useMediaList() {
  const context = useContext(MediaContext);
  if (!context) {
    throw new Error('useMediaList must be used within MediaProvider');
  }
  return context;
}

// Alias para compatibilidad
export const MediaListProvider = MediaProvider;
