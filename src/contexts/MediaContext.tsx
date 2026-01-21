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

export function MediaProvider({ children }: { children: ReactNode }) {
  const [myList, setMyList] = useState<Media[]>([]);

  // Cargar lista desde localStorage al montar
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setMyList(JSON.parse(stored));
      } catch (e) {
        console.error('Error loading list from storage:', e);
      }
    }
  }, []);

  // Guardar lista en localStorage cuando cambia
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(myList));
  }, [myList]);

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
