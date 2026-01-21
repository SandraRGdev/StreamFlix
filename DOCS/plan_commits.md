# Plan de Commits y Tags

## Overview

Estrategia de commits semánticos y plan de versionado con tags para el proyecto.

## Convención de Commits

### Estructura del Commit

```
<tipo>(<alcance>): <descripción>

[opcional: cuerpo]

[opcional: pie]
```

### Tipos de Commit

| Tipo | Descripción | Ejemplo |
|------|-------------|---------|
| `feat` | Nueva funcionalidad | `feat(api): agregar endpoint de búsqueda` |
| `fix` | Corrección de bug | `fix(ui): resolver error en MediaCard` |
| `docs` | Documentación | `docs(readme): actualizar instrucciones de instalación` |
| `style` | Formato/código sin lógica | `style(components): ajustar espaciado en Header` |
| `refactor` | Refactorización | `refactor(services): optimizar transformService` |
| `test` | Tests | `test(api): agregar tests para mediaController` |
| `chore` | Tareas de mantenimiento | `chore(deps): actualizar dependencias` |
| `perf` | Mejoras de rendimiento | `perf(cache): implementar caché en Redis` |
| `ci` | Integración continua | `ci(github): configurar actions para deploy` |
| `build` | Sistema de build | `build(webpack): optimizar configuración` |

### Alcances Comunes

| Alcance | Descripción |
|---------|-------------|
| `api` | Backend API y endpoints |
| `ui` | Componentes de frontend |
| `services` | Servicios y lógica de negocio |
| `utils` | Utilidades y helpers |
| `config` | Configuración del proyecto |
| `deps` | Dependencias |
| `docs` | Documentación |
| `tests` | Tests y especificaciones |

## Plan de Commits por Feature

### Feature: Búsqueda de Películas

```bash
feat(api): agregar endpoint de búsqueda de películas
- Implementar /api/movies/search
- Integrar con API de TMDB
- Agregar paginación

feat(ui): crear componente de búsqueda
- Nuevo SearchInput component
- Implementar debounce
- Manejo de estados de carga

test(api): agregar tests para búsqueda
- Unit tests para search endpoint
- Mock de TMDB API
- Casos de error

docs(api): documentar endpoints de búsqueda
- Actualizar api_endpoints.md
- Agregar ejemplos de uso
```

### Feature: Detalles de Media

```bash
feat(api): agregar endpoint de detalles de media
- Implementar /api/media/:id
- Incluir créditos y recomendaciones
- Caché de respuestas

feat(ui): crear vista de detalles
- Nuevo MediaDetail component
- Mostrar información completa
- Navegación relacionada

refactor(services): optimizar transformación de datos
- Unificar transform functions
- Mejor manejo de errores
- Optimizar rendimiento

style(ui): mejorar diseño de vista detalles
- Responsive design
- Mejorar visualización de imágenes
- Accesibilidad
```

### Feature: Sistema de Favoritos

```bash
feat(api): implementar sistema de favoritos
- Endpoints CRUD para favoritos
- Validación de usuarios
- Base de datos local

feat(ui): agregar botones de favoritos
- Icono de corazón en MediaCard
- Sincronización con backend
- Estados de carga

test(e2e): agregar tests de favoritos
- Flujo completo de agregar/eliminar
- Persistencia de datos
- Manejo de errores

docs(readme): documentar sistema de favoritos
- Guía de uso
- API endpoints
- Ejemplos de código
```

## Estrategia de Tags

### Tipos de Tags

| Tipo | Formato | Cuándo usar |
|------|---------|-------------|
| **Major** | `v1.0.0` | Cambios breaking |
| **Minor** | `v1.1.0` | Nuevas features |
| **Patch** | `v1.1.1` | Bug fixes |
| **Alpha** | `v1.2.0-alpha.1` | Pre-release |
| **Beta** | `v1.2.0-beta.1` | Beta testing |
| **RC** | `v1.2.0-rc.1` | Release candidate |

### Plan de Versionado

#### v0.1.0 - MVP Inicial
```bash
# Features base
feat(api): estructura inicial de API
feat(ui): componentes básicos de UI
feat(tmdb): integración con API de TMDB

# Documentación inicial
docs(readme): configuración del proyecto
docs(api): endpoints básicos
```

#### v0.2.0 - Búsqueda y Navegación
```bash
# Búsqueda
feat(search): implementar búsqueda de películas
feat(search): agregar búsqueda de series
feat(ui): componente de búsqueda con autocomplete

# Navegación
feat(routing): configurar React Router
feat(ui): navegación principal
feat(ui): breadcrumbs
```

#### v0.3.0 - Detalles y Créditos
```bash
# Vista de detalles
feat(details): vista completa de películas
feat(details): vista completa de series
feat(credits): mostrar reparto y crew

# Mejoras UI
feat(ui): lazy loading de imágenes
feat(ui): loading states
feat(ui): error boundaries
```

#### v0.4.0 - Sistema de Usuarios
```bash
# Autenticación
feat(auth): sistema de login/register
feat(auth): JWT tokens
feat(auth): middleware de autenticación

# Perfil de usuario
feat(profile): vista de perfil
feat(profile): configuraciones
feat(profile): historial
```

#### v0.5.0 - Favoritos y Listas
```bash
# Favoritos
feat(favorites): agregar/eliminar favoritos
feat(favorites): vista de favoritos
feat(favorites): sincronización cross-device

# Listas personales
feat(lists): crear listas personalizadas
feat(lists): compartir listas
feat(lists): importar/exportar
```

#### v1.0.0 - Release Estable
```bash
# Estabilización
fix(performance): optimizar carga inicial
fix(security): validar todos los inputs
fix(ui): corregir bugs de navegación

# Testing
test(e2e): cobertura completa de flujos
test(unit): tests de todos los servicios
test(integration): tests de API

# Documentación completa
docs(api): documentación completa de endpoints
docs(ui): guía de componentes
docs(deploy): guía de despliegue
```

## Puntos de Tag por Milestone

### Milestone 1: Foundation (v0.1.0)
- [ ] Estructura básica del proyecto
- [ ] Integración con TMDB API
- [ ] Componentes UI básicos
- [ ] Configuración de desarrollo

### Milestone 2: Core Features (v0.2.0)
- [ ] Búsqueda funcional
- [ ] Navegación entre vistas
- [ ] Listado de resultados
- [ ] Manejo de errores básico

### Milestone 3: Rich Experience (v0.3.0)
- [ ] Vista de detalles completa
- [ ] Créditos y reparto
- [ ] Lazy loading
- [ ] Responsive design

### Milestone 4: User System (v0.4.0)
- [ ] Autenticación completa
- [ ] Perfiles de usuario
- [ ] Historial personal
- [ ] Configuraciones

### Milestone 5: Social Features (v0.5.0)
- [ ] Sistema de favoritos
- [ ] Listas personalizadas
- [ ] Compartir contenido
- [ ] Recomendaciones

### Milestone 6: Production Ready (v1.0.0)
- [ ] Performance optimizado
- [ ] Seguridad completa
- [ ] Testing coverage > 80%
- [ ] Documentación completa

## Comandos Útiles

### Crear Tag
```bash
# Tag anotado
git tag -a v1.0.0 -m "Release v1.0.0: Production ready"

# Tag ligero
git tag v1.0.0
```

### Push Tags
```bash
# Push tag específico
git push origin v1.0.0

# Push todos los tags
git push origin --tags
```

### Ver Historial
```bash
# Ver commits entre tags
git log v0.1.0..v0.2.0 --oneline

# Ver información de tag
git show v1.0.0
```

### Changelog Automático
```bash
# Generar changelog desde tags
git log --pretty=format:"- %s" v0.1.0..v0.2.0
```
