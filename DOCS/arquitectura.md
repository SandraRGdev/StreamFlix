# Arquitectura del Sistema

## Overview

Diagrama de arquitectura y responsabilidades de los componentes del sistema legacy.

## Diagrama de Arquitectura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   TMDB API      │
│   (React App)   │◄──►│   (Node.js)     │◄──►│   (External)    │
│                 │    │                 │    │                 │
│ - UI Components │    │ - API Routes    │    │ - Movie Data    │
│ - State Mgmt    │    │ - Business Logic│    │ - TV Data       │
│ - HTTP Client   │    │ - Data Transform│    │ - Person Data   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Local Storage │    │   Cache Layer   │    │   Rate Limiting │
│   (Browser)     │    │   (Redis)       │    │   (TMDB)        │
│                 │    │                 │    │                 │
│ - User Prefs    │    │ - API Responses │    │ - 40 req/10s    │
│ - Temp Data     │    │ - Sessions      │    │ - 1000 req/day  │
│ - Auth Tokens   │    │ - Search Results│    │ - Retry Logic   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Componentes y Responsabilidades

### Frontend (React Application)

**Responsabilidades:**
- Renderizado de interfaz de usuario
- Gestión de estado local y global
- Navegación entre vistas
- Interacción con usuario
- Validación de formularios
- Manejo de errores de UI

**Componentes Principales:**
```
src/
├── components/
│   ├── common/
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── Loading.jsx
│   │   └── ErrorBoundary.jsx
│   ├── media/
│   │   ├── MediaCard.jsx
│   │   ├── MediaList.jsx
│   │   ├── MediaDetail.jsx
│   │   └── MediaSearch.jsx
│   ├── person/
│   │   ├── PersonCard.jsx
│   │   ├── PersonList.jsx
│   │   └── PersonDetail.jsx
│   └── layout/
│       ├── HomePage.jsx
│       ├── SearchPage.jsx
│       └── DetailPage.jsx
├── hooks/
│   ├── useApi.js
│   ├── useDebounce.js
│   └── useLocalStorage.js
├── services/
│   ├── apiService.js
│   ├── cacheService.js
│   └── storageService.js
└── utils/
    ├── constants.js
    ├── helpers.js
    └── validators.js
```

### Backend (Node.js API)

**Responsabilidades:**
- Exponer endpoints REST
- Transformación de datos TMDB
- Gestión de caché
- Rate limiting
- Autenticación y autorización
- Logging y monitoreo

**Estructura de Servicios:**
```
src/
├── controllers/
│   ├── mediaController.js
│   ├── personController.js
│   └── searchController.js
├── services/
│   ├── tmdbService.js
│   ├── cacheService.js
│   └── transformService.js
├── middleware/
│   ├── auth.js
│   ├── rateLimit.js
│   └── errorHandler.js
├── routes/
│   ├── media.js
│   ├── person.js
│   └── search.js
└── utils/
    ├── logger.js
    ├── config.js
    └── validators.js
```

### Capa de Caché (Redis)

**Responsabilidades:**
- Almacenamiento temporal de respuestas API
- Reducción de llamadas a TMDB
- Gestión de TTL (Time To Live)
- Invalidación de caché

**Estrategias de Caché:**
- **Write-Through**: Escribir en caché y backend simultáneamente
- **TTL Dinámico**: Según tipo de datos y frecuencia de acceso
- **Cache Aside**: Backend consulta caché primero

### Base de Datos

**Responsabilidades:**
- Persistencia de datos de usuario
- Configuraciones de aplicación
- Historial de búsquedas
- Favoritos y listas personales

**Modelo de Datos:**
```sql
-- Usuarios
users (id, email, preferences, created_at, updated_at)

-- Favoritos
favorites (id, user_id, media_id, media_type, created_at)

-- Listas personales
lists (id, user_id, name, description, created_at, updated_at)
list_items (id, list_id, media_id, media_type, order, added_at)

-- Historial de búsqueda
search_history (id, user_id, query, results_count, created_at)
```

## Flujo de Datos

### Flujo de Búsqueda
```
1. Usuario escribe término de búsqueda
2. Frontend aplica debounce (300ms)
3. Frontend verifica caché local
4. Si no hay caché, llama a backend API
5. Backend verifica caché Redis
6. Si no hay caché, llama a TMDB API
7. TMDB retorna resultados
8. Backend transforma datos
9. Backend almacena en caché Redis
10. Backend retorna al frontend
11. Frontend almacena en caché local
12. Frontend renderiza resultados
```

### Flujo de Detalle
```
1. Usuario hace clic en elemento
2. Frontend verifica caché local
3. Si no hay caché, llama a backend API
4. Backend verifica caché Redis
5. Si no hay caché, llama a TMDB API
6. Backend obtiene datos principales
7. Backend obtiene créditos relacionados
8. Backend transforma y combina datos
9. Backend almacena en caché Redis
10. Backend retorna datos completos
11. Frontend renderiza vista detallada
```

## Estrategias de Escalabilidad

### Horizontal Scaling
- **Frontend**: CDN + Static Hosting
- **Backend**: Load Balancer + Multiple Instances
- **Caché**: Redis Cluster
- **Base de Datos**: Read Replicas

### Optimizaciones de Rendimiento
- **Lazy Loading**: Componentes y imágenes
- **Virtual Scrolling**: Listas largas
- **Code Splitting**: Por ruta
- **Image Optimization**: WebP + Responsive
- **API Batching**: Múltiples llamadas en una

## Monitoreo y Observabilidad

### Métricas Clave
- **Response Time**: Tiempo de respuesta API
- **Cache Hit Rate**: Porcentaje de aciertos de caché
- **Error Rate**: Tasa de errores por endpoint
- **Throughput**: Requests por segundo
- **Resource Usage**: CPU, memoria, disco

### Alertas
- **High Error Rate**: > 5% en 5 minutos
- **Slow Response**: > 2 segundos promedio
- **Cache Miss**: < 80% hit rate
- **Rate Limiting**: Cercano al límite de TMDB
- **Service Down**: Caída de servicios críticos

## Seguridad

### Autenticación
- **JWT Tokens**: Para sesiones de usuario
- **API Keys**: Para comunicación backend-TMDB
- **OAuth2**: Para integraciones externas

### Validaciones
- **Input Sanitization**: Limpieza de datos de entrada
- **Rate Limiting**: Por usuario y por IP
- **CORS**: Configuración restrictiva
- **HTTPS**: Todo el tráfico encriptado

## Consideraciones Legacy

### Deudas Técnicas
- **Componentes antiguos**: Sin TypeScript
- **Estado global**: Context API en lugar de Redux
- **Testing**: Cobertura incompleta
- **Documentación**: Inconsistente

### Plan de Migración
1. **Fase 1**: Migrar a TypeScript
2. **Fase 2**: Implementar Redux Toolkit
3. **Fase 3**: Mejorar testing (Jest + Testing Library)
4. **Fase 4**: Refactorizar componentes legacy
5. **Fase 5**: Actualizar dependencias
