# Modelo de Datos

## Overview

Descripción del modelo de datos normalizado utilizado en el proyecto y las reglas de transformación desde la API de TMDB.

## Modelo Normalizado

### Entidad: Media

```typescript
interface Media {
  id: number;
  title: string;
  overview: string;
  releaseDate: string;
  posterPath: string | null;
  backdropPath: string | null;
  genreIds: number[];
  voteAverage: number;
  voteCount: number;
  popularity: number;
  mediaType: 'movie' | 'tv';
  originalLanguage: string;
  originalTitle: string;
}
```

### Entidad: Person

```typescript
interface Person {
  id: number;
  name: string;
  biography: string;
  birthday: string | null;
  deathday: string | null;
  placeOfBirth: string | null;
  profilePath: string | null;
  knownFor: Media[];
  popularity: number;
  gender: number;
}
```

### Entidad: Credit

```typescript
interface Credit {
  id: string;
  person: Person;
  media: Media;
  role: string;
  character: string | null;
  job: string | null;
  department: string | null;
  order: number;
}
```

### Entidad: Genre

```typescript
interface Genre {
  id: number;
  name: string;
}
```

## Reglas de Transformación

### Desde TMDB Movie → Media

```typescript
function transformMovie(tmdbMovie): Media {
  return {
    id: tmdbMovie.id,
    title: tmdbMovie.title,
    overview: tmdbMovie.overview || '',
    releaseDate: tmdbMovie.release_date || '',
    posterPath: tmdbMovie.poster_path,
    backdropPath: tmdbMovie.backdrop_path,
    genreIds: tmdbMovie.genre_ids || tmdbMovie.genres?.map(g => g.id) || [],
    voteAverage: tmdbMovie.vote_average || 0,
    voteCount: tmdbMovie.vote_count || 0,
    popularity: tmdbMovie.popularity || 0,
    mediaType: 'movie',
    originalLanguage: tmdbMovie.original_language || '',
    originalTitle: tmdbMovie.original_title || tmdbMovie.title
  };
}
```

### Desde TMDB TV → Media

```typescript
function transformTV(tmdbTV): Media {
  return {
    id: tmdbTV.id,
    title: tmdbTV.name,
    overview: tmdbTV.overview || '',
    releaseDate: tmdbTV.first_air_date || '',
    posterPath: tmdbTV.poster_path,
    backdropPath: tmdbTV.backdrop_path,
    genreIds: tmdbTV.genre_ids || tmdbTV.genres?.map(g => g.id) || [],
    voteAverage: tmdbTV.vote_average || 0,
    voteCount: tmdbTV.vote_count || 0,
    popularity: tmdbTV.popularity || 0,
    mediaType: 'tv',
    originalLanguage: tmdbTV.original_language || '',
    originalTitle: tmdbTV.original_name || tmdbTV.name
  };
}
```

### Desde TMDB Person → Person

```typescript
function transformPerson(tmdbPerson): Person {
  return {
    id: tmdbPerson.id,
    name: tmdbPerson.name,
    biography: tmdbPerson.biography || '',
    birthday: tmdbPerson.birthday || null,
    deathday: tmdbPerson.deathday || null,
    placeOfBirth: tmdbPerson.place_of_birth || null,
    profilePath: tmdbPerson.profile_path,
    knownFor: (tmdbPerson.known_for || []).map(item => 
      item.title ? transformMovie(item) : transformTV(item)
    ),
    popularity: tmdbPerson.popularity || 0,
    gender: tmdbPerson.gender || 0
  };
}
```

### Desde TMDB Credits → Credit

```typescript
function transformCredit(tmdbCredit, media: Media): Credit {
  return {
    id: `${tmdbCredit.credit_id}-${media.id}`,
    person: transformPerson(tmdbCredit),
    media: media,
    role: tmdbCredit.character || tmdbCredit.job || '',
    character: tmdbCredit.character || null,
    job: tmdbCredit.job || null,
    department: tmdbCredit.department || null,
    order: tmdbCredit.order || 0
  };
}
```

## Reglas de Normalización

### Fechas
- **Formato estándar**: `YYYY-MM-DD`
- **Valores nulos**: Se convierten a `null` o string vacío según contexto
- **Validación**: Se verifica formato antes de almacenar

### URLs de Imágenes
- **Base URL**: `https://image.tmdb.org/t/p/`
- **Tamaños disponibles**: `w92`, `w154`, `w185`, `w342`, `w500`, `w780`, `original`
- **Transformación**: `posterPath` se concatena con base URL y tamaño

### Números
- **Decimales**: `voteAverage` se mantiene con 1 decimal
- **Enteros**: `voteCount`, `popularity` se redondean a enteros
- **Valores por defecto**: 0 para campos numéricos nulos

### Textos
- **Vacíos**: Se convierten a string vacío `''`
- **Idiomas**: Código ISO 639-1 estándar
- **Codificación**: UTF-8

## Validación de Datos

### Validaciones Requeridas
- `id`: debe ser número positivo
- `title`: no debe estar vacío
- `mediaType`: debe ser 'movie' o 'tv'
- `releaseDate`: formato YYYY-MM-DD si está presente

### Validaciones Opcionales
- `posterPath`, `backdropPath`: formato de ruta válido
- `genreIds`: array de números positivos
- `voteAverage`: rango 0-10

## Estrategia de Caché

### Tiempos de Cache
- **Media**: 24 horas
- **Personas**: 7 días
- **Géneros**: 30 días
- **Créditos**: 48 horas

### Claves de Cache
- **Media**: `media:{mediaType}:{id}`
- **Persona**: `person:{id}`
- **Géneros**: `genres:{mediaType}`
- **Búsqueda**: `search:{type}:{query_hash}`
