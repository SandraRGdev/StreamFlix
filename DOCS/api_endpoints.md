# API Endpoints TMDB

## Overview

Documentación de los endpoints de la API de TMDB utilizados en el proyecto, incluyendo límites de velocidad y ejemplos de respuestas JSON.

## Endpoints Principales

### Películas

| Endpoint | Método | Límites | Ejemplo Respuesta |
|----------|--------|---------|-------------------|
| `/movie/popular` | GET | 40 requests/10s | ```json {"results": [{"id": 123, "title": "Movie Title", "overview": "..."}]}``` |
| `/movie/{id}` | GET | 40 requests/10s | ```json {"id": 123, "title": "Movie Title", "overview": "...", "release_date": "2023-01-01"}``` |
| `/movie/{id}/credits` | GET | 40 requests/10s | ```json {"cast": [{"name": "Actor", "character": "Role"}], "crew": [{"name": "Director", "job": "Director"}]}``` |
| `/search/movie` | GET | 40 requests/10s | ```json {"results": [{"id": 123, "title": "Movie Title", "release_date": "2023"}]}``` |

### Series de TV

| Endpoint | Método | Límites | Ejemplo Respuesta |
|----------|--------|---------|-------------------|
| `/tv/popular` | GET | 40 requests/10s | ```json {"results": [{"id": 456, "name": "TV Show", "overview": "..."}]}``` |
| `/tv/{id}` | GET | 40 requests/10s | ```json {"id": 456, "name": "TV Show", "overview": "...", "first_air_date": "2023-01-01"}``` |
| `/tv/{id}/credits` | GET | 40 requests/10s | ```json {"cast": [{"name": "Actor", "character": "Role"}], "crew": [{"name": "Director", "job": "Director"}]}``` |
| `/search/tv` | GET | 40 requests/10s | ```json {"results": [{"id": 456, "name": "TV Show", "first_air_date": "2023"}]}``` |

### Personas

| Endpoint | Método | Límites | Ejemplo Respuesta |
|----------|--------|---------|-------------------|
| `/person/popular` | GET | 40 requests/10s | ```json {"results": [{"id": 789, "name": "Actor", "known_for": [{"title": "Movie"}]}]}``` |
| `/person/{id}` | GET | 40 requests/10s | ```json {"id": 789, "name": "Actor", "biography": "...", "birthday": "1990-01-01"}``` |
| `/person/{id}/movie_credits` | GET | 40 requests/10s | ```json {"cast": [{"id": 123, "title": "Movie", "character": "Role"}]}``` |
| `/person/{id}/tv_credits` | GET | 40 requests/10s | ```json {"cast": [{"id": 456, "name": "TV Show", "character": "Role"}]}``` |

## Límites de Velocidad

- **Límite estándar**: 40 requests cada 10 segundos
- **Límite diario**: 1,000 requests (para API key gratuita)
- **Retry-After**: Cabecera HTTP indica segundos de espera

## Parámetros Comunes

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `api_key` | string | API key requerida | `api_key=your_key_here` |
| `language` | string | Código de idioma ISO 639-1 | `language=es-ES` |
| `page` | integer | Número de página (1-1000) | `page=1` |
| `query` | string | Término de búsqueda | `query=avatar` |

## Manejo de Errores

```json
{
  "status_code": 7,
  "status_message": "Invalid API key: You must be granted a valid key.",
  "success": false
}
```

## Códigos de Estado Comunes

| Código | Descripción |
|--------|-------------|
| 200 | OK |
| 401 | API key inválida |
| 404 | Recurso no encontrado |
| 429 | Límite de velocidad excedido |
| 500 | Error del servidor |
