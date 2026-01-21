# Política de Versionado y Release

## Overview

Política de versionado semántico (Semantic Versioning), gestión de tags y proceso de release notes.

## Semantic Versioning (SemVer)

### Formato de Versión

```
MAJOR.MINOR.PATCH[-PRERELEASE][+BUILD]
```

### Reglas SemVer

| Componente | Regla | Ejemplo |
|------------|-------|---------|
| **MAJOR** | Cambios incompatibles con API anterior | `1.0.0` → `2.0.0` |
| **MINOR** | Nuevas funcionalidades compatibles hacia atrás | `1.0.0` → `1.1.0` |
| **PATCH** | Correcciones de bugs compatibles | `1.0.0` → `1.0.1` |
| **PRERELEASE** | Versiones pre-lanzamiento | `1.1.0-alpha.1` |
| **BUILD** | Metadatos de build | `1.0.0+20130313144700` |

### Criterios de Incremento

#### MAJOR (X.0.0)
- **Cambios Breaking**:
  - Modificación de endpoints de API
  - Cambios en esquema de base de datos
  - Eliminación de funcionalidades
  - Cambios en configuración requerida
  - Actualizaciones de dependencias mayores

#### MINOR (X.Y.0)
- **Nuevas Features**:
  - Nuevos endpoints de API
  - Nuevos componentes UI
  - Nuevas funcionalidades de usuario
  - Mejoras significativas existentes
  - Nuevas integraciones

#### PATCH (X.Y.Z)
- **Bug Fixes**:
  - Corrección de errores críticos
  - Arreglos de seguridad
  - Pequeñas mejoras de UX
  - Correcciones de documentación
  - Optimizaciones de rendimiento

## Gestión de Tags

### Convención de Nombres

```bash
# Tags de release
v1.0.0
v1.1.0
v1.1.1

# Tags de prerelease
v1.2.0-alpha.1
v1.2.0-beta.1
v1.2.0-rc.1

# Tags de hotfix
v1.0.1-hotfix.1
v1.1.0-hotfix.1
```

### Flujo de Creación de Tags

#### 1. Development Branch
```bash
# Feature branch
git checkout -b feature/nueva-funcionalidad
git add .
git commit -m "feat(api): agregar nuevo endpoint"
git push origin feature/nueva-funcionalidad
```

#### 2. Integration
```bash
# Merge a develop
git checkout develop
git merge feature/nueva-funcionalidad
git push origin develop
```

#### 3. Release Preparation
```bash
# Crear release branch
git checkout -b release/v1.2.0
# Actualizar versión en package.json
# Actualizar CHANGELOG.md
git commit -m "chore(release): preparar v1.2.0"
git push origin release/v1.2.0
```

#### 4. Tag Creation
```bash
# Crear tag anotado
git tag -a v1.2.0 -m "Release v1.2.0"

# Push tag
git push origin v1.2.0
```

#### 5. Merge to Main
```bash
# Merge a main
git checkout main
git merge release/v1.2.0
git push origin main
```

## Release Notes

### Estructura de Release Notes

```markdown
# Release v1.2.0 - 2024-01-15

## 🚀 Nuevas Funcionalidades
- **Búsqueda avanzada**: Filtros por género, año y rating
- **Modo oscuro**: Nueva opción de tema en configuración
- **Exportación de listas**: Descargar favoritos como CSV

## 🐛 Correcciones
- **Fixed**: Error de carga en vista de detalles (#123)
- **Fixed**: Memory leak en componente de búsqueda (#124)
- **Fixed**: Validación incorrecta en formulario de registro (#125)

## 🔧 Mejoras
- **Improved**: Rendimiento de carga inicial 40% más rápido
- **Updated**: Diseño responsivo para tablets
- **Enhanced**: Mejor manejo de errores de red

## 💥 Cambios Breaking
- **Changed**: Endpoint `/api/search` ahora requiere parámetro `type`
- **Removed**: Deprecación de método legacy `getPopularMovies()`

## 📦 Dependencias
- **Added**: `react-query@3.0.0` para manejo de caché
- **Updated**: `axios@1.0.0` (security patch)
- **Removed**: `moment.js` (reemplazado por `date-fns`)

## 🙏 Agradecimientos
- Gracias a @contribuidor1 por reportar el bug #123
- Agradecimientos especiales a @contribuidor2 por el PR #126

## 📋 Instalación
```bash
npm install founders25-legacy@1.2.0
# o
yarn add founders25-legacy@1.2.0
```

## 🔄 Migración
Si vienes desde v1.1.x, consulta la [guía de migración](MIGRATION.md)
```

### Categorías de Cambios

| Categoría | Emoji | Descripción |
|-----------|-------|-------------|
| 🚀 | Nuevas Funcionalidades | Features nuevas |
| 🐛 | Correcciones | Bug fixes |
| 🔧 | Mejoras | Mejoras y optimizaciones |
| 💥 | Breaking Changes | Cambios incompatibles |
| 📦 | Dependencias | Actualización de deps |
| 🙏 | Agradecimientos | Contribuciones |
| 📋 | Instalación | Instrucciones de instalación |
| 🔄 | Migración | Guías de migración |

## Proceso de Release

### 1. Preparación (Semanal)

```bash
# Checklist de preparación
□ Todos los tests pasan (>80% cobertura)
□ Documentación actualizada
□ CHANGELOG.md actualizado
□ Versión en package.json actualizada
□ Revisión de seguridad completada
□ Performance tests aprobados
```

### 2. Release Candidate

```bash
# Crear RC
git checkout -b release/v1.2.0-rc.1
# Testing intensivo
# Crear tag RC
git tag -a v1.2.0-rc.1 -m "Release Candidate v1.2.0-rc.1"
git push origin v1.2.0-rc.1
```

### 3. Release Final

```bash
# Aprobación final
git checkout main
git merge release/v1.2.0
git tag -a v1.2.0 -m "Release v1.2.0: Feature X completada"
git push origin main v1.2.0
```

### 4. Post-Release

```bash
# Limpieza
git branch -d release/v1.2.0
git push origin --delete release/v1.2.0

# Notificaciones
□ GitHub Release creado
□ Email al equipo
□ Actualización de documentación
□ Anuncio en Slack/Discord
```

## Automatización con GitHub Actions

### Workflow de Release

```yaml
name: Release
on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Build
        run: npm run build
        
      - name: Generate Release Notes
        id: release_notes
        run: |
          # Generar notas desde commits
          
      - name: Create GitHub Release
        uses: actions/create-release@v1
        with:
          tag_name: ${{ github.ref }}
          release_name: Release ${{ github.ref }}
          body: ${{ steps.release_notes.outputs.notes }}
          draft: false
          prerelease: ${{ contains(github.ref, 'alpha') || contains(github.ref, 'beta') || contains(github.ref, 'rc') }}
```

## Política de Hotfixes

### Flujo de Hotfix

```bash
# 1. Crear hotfix desde main
git checkout main
git checkout -b hotfix/v1.0.1

# 2. Aplicar fix
git commit -m "fix: resolver error crítico en producción"

# 3. Testing rápido
npm run test:critical

# 4. Merge y tag
git checkout main
git merge hotfix/v1.0.1
git tag -a v1.0.1 -m "Hotfix v1.0.1: error crítico resuelto"
git push origin main v1.0.1

# 5. También merge a develop
git checkout develop
git merge hotfix/v1.0.1
git push origin develop
```

### Criterios para Hotfix
- **Críticos**: Seguridad, datos de usuario, caída del servicio
- **Urgentes**: Bugs que afectan funcionalidad principal
- **Inmediato**: Sin esperar ciclo de release normal

## Comunicación de Releases

### Canales de Comunicación

| Canal | Tipo | Frecuencia | Audiencia |
|-------|------|------------|-----------|
| GitHub Releases | Oficial | Cada release | Desarrolladores |
| Email Newsletter | Resumen | Mensual | Usuarios |
| Blog Post | Detallado | Features mayores | Público general |
| Slack/Discord | Inmediato | Críticos | Equipo interno |
| Twitter | Breve | Releases mayores | Comunidad |

### Plantilla de Comunicación

```markdown
## 🎉 Nueva Versión Disponible

**Versión**: v1.2.0  
**Fecha**: 15 de Enero, 2024  
**Tipo**: Feature Release

### Lo Nuevo
- Búsqueda avanzada con filtros
- Modo oscuro para mejor experiencia
- Exportación de favoritos

### Correcciones Importantes
- Error en vista de detalles resuelto
- Mejor manejo de conexiones lentas

### Cómo Actualizar
```bash
npm update founders25-legacy
```

[Ver notas completas](link-to-github-release)
```

## Métricas y KPIs

### Métricas de Release

| Métrica | Objetivo | Medición |
|---------|----------|----------|
| **Release Frequency** | 1-2 semanas | Tiempo entre releases |
| **Lead Time** | < 3 días | Commit → Release |
| **Bug Fix Time** | < 24 horas | Report → Fix |
| **Rollback Rate** | < 5% | Releases con rollback |
| **Test Coverage** | > 80% | Cobertura de código |

### Dashboard de Versionado

```bash
# Script para generar métricas
npm run metrics:release

# Salida esperada
┌─────────────┬──────────────┬─────────────┐
│ Release     │ Lead Time    │ Bug Fixes   │
├─────────────┼──────────────┼─────────────┤
│ v1.2.0      │ 2.5 días     │ 3           │
│ v1.1.0      │ 3.1 días     │ 5           │
│ v1.0.0      │ 5.2 días     │ 8           │
└─────────────┴──────────────┴─────────────┘
```
