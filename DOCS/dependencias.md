# Política de Dependencias y Version Bump

## Overview

Política de gestión de dependencias, actualización de versiones y estrategia de version bump para el proyecto.

## Tipos de Dependencias

### Dependencias de Producción (dependencies)

Librerías necesarias para el funcionamiento en producción:

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0",
    "axios": "^1.3.0",
    "styled-components": "^5.3.0"
  }
}
```

### Dependencias de Desarrollo (devDependencies)

Herramientas para desarrollo y testing:

```json
{
  "devDependencies": {
    "@types/react": "^18.0.0",
    "@types/node": "^18.0.0",
    "typescript": "^4.9.0",
    "webpack": "^5.75.0",
    "jest": "^29.3.0",
    "eslint": "^8.31.0"
  }
}
```

### Dependencias Peer (peerDependencies)

Dependencias que el consumidor debe instalar:

```json
{
  "peerDependencies": {
    "react": ">=16.8.0",
    "react-dom": ">=16.8.0"
  }
}
```

## Política de Versiones

### Versionamiento Semántico

| Tipo | Formato | Cuándo usar | Ejemplo |
|------|---------|-------------|---------|
| **Major** | `X.0.0` | Cambios breaking | `2.0.0` |
| **Minor** | `X.Y.0` | Nuevas features | `1.1.0` |
| **Patch** | `X.Y.Z` | Bug fixes | `1.0.1` |

### Rangos de Versiones

| Rango | Significado | Ejemplo |
|-------|-------------|---------|
| `^1.2.3` | Compatible con minor/patch | `1.3.0`, `1.2.4` ✅ |
| `~1.2.3` | Compatible con patch | `1.2.4` ✅, `1.3.0` ❌ |
| `>=1.2.3` | Mayor o igual | `1.2.3`, `2.0.0` ✅ |
| `<=1.2.3` | Menor o igual | `1.2.3`, `1.1.0` ✅ |
| `1.2.3 - 2.3.4` | Rango específico | `1.5.0`, `2.0.0` ✅ |
| `*` | Cualquier versión | `1.0.0`, `2.0.0` ✅ |

## Estrategia de Actualización

### Frecuencia de Actualización

| Tipo | Frecuencia | Responsable | Automatización |
|------|------------|-------------|----------------|
| **Patch** | Semanal | Auto | Dependabot |
| **Minor** | Mensual | Tech Lead | Revisión manual |
| **Major** | Trimestral | Equipo completo | Planificación |

### Proceso de Actualización

#### 1. Detección de Actualizaciones

```bash
# Verificar dependencias desactualizadas
npm outdated

# Salida esperada
Package          Current  Wanted  Latest  Location
axios            1.3.0    1.3.4   2.0.0  project
react            18.2.0   18.2.0  19.0.0  project
typescript       4.9.0    4.9.5   5.0.0  project
```

#### 2. Análisis de Impacto

```bash
# Verificar breaking changes
npm view axios@2.0.0

# Ver compatibilidad
npm ls react

# Audit de seguridad
npm audit
```

#### 3. Testing de Actualización

```bash
# Actualizar en rama de feature
git checkout -b deps/update-axios-1.3.4
npm install axios@1.3.4

# Ejecutar tests
npm test

# Ejecutar linting
npm run lint

# Build del proyecto
npm run build
```

#### 4. Merge y Release

```bash
# Si todo pasa
git add package.json package-lock.json
git commit -m "chore(deps): update axios from 1.3.0 to 1.3.4"
git push origin deps/update-axios-1.3.4

# Crear PR y merge
```

## Categorías de Dependencias

### Core Dependencies

Dependencias críticas para el funcionamiento:

```json
{
  "core": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0"
  },
  "policy": {
    "update_frequency": "major_only",
    "testing_required": "full_suite",
    "approval": "team_lead"
  }
}
```

### Utility Dependencies

Librerías de utilidad y herramientas:

```json
{
  "utilities": {
    "axios": "^1.3.0",
    "lodash": "^4.17.21",
    "date-fns": "^2.29.0"
  },
  "policy": {
    "update_frequency": "minor_patch",
    "testing_required": "unit_tests",
    "approval": "auto"
  }
}
```

### Development Dependencies

Herramientas de desarrollo:

```json
{
  "development": {
    "webpack": "^5.75.0",
    "jest": "^29.3.0",
    "eslint": "^8.31.0"
  },
  "policy": {
    "update_frequency": "monthly",
    "testing_required": "build_check",
    "approval": "tech_lead"
  }
}
```

## Automatización con Dependabot

### Configuración de .github/dependabot.yml

```yaml
version: 2
updates:
  # Dependencias de producción
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
      time: "09:00"
    open-pull-requests-limit: 5
    reviewers:
      - "tech-lead"
    assignees:
      - "developer"
    commit-message:
      prefix: "chore"
      include: "scope"
    
  # Dependencias de desarrollo
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "monthly"
      day: "1"
      time: "10:00"
    target-branch: "develop"
    reviewers:
      - "tech-lead"
    labels:
      - "dependencies"
      - "dev-deps"
```

### Reglas de Dependabot

| Tipo de Update | Comportamiento |
|----------------|----------------|
| **Patch** | Auto-merge si tests pasan |
| **Minor** | Requerir aprobación de tech lead |
| **Major** | Requerir aprobación de equipo completo |

## Version Bump Automático

### Scripts de Version Bump

```json
{
  "scripts": {
    "version:patch": "npm version patch -m 'chore(version): %s'",
    "version:minor": "npm version minor -m 'chore(version): %s'",
    "version:major": "npm version major -m 'chore(version): %s'",
    "version:pre": "npm version prerelease --preid=alpha -m 'chore(version): %s'",
    "version:rc": "npm version prerelease --preid=rc -m 'chore(version): %s'",
    
    "postversion": "git push && git push --tags",
    "preversion": "npm run test && npm run build"
  }
}
```

### Workflow de Version Bump

```bash
# 1. Verificar estado del proyecto
npm run test
npm run build
npm run lint

# 2. Determinar tipo de bump
# Patch para bug fixes
npm run version:patch

# Minor para nuevas features
npm run version:minor

# Major para breaking changes
npm run version:major

# 3. Publicar (opcional)
npm publish
```

## Gestión de Seguridad

### Auditoría de Seguridad

```bash
# Audit de vulnerabilidades
npm audit

# Audit con nivel de detalle
npm audit --audit-level moderate

# Fix automático de vulnerabilidades
npm audit fix

# Fix forzado (puede breaking changes)
npm audit fix --force
```

### Política de Seguridad

| Nivel | Acción | Tiempo de Respuesta |
|-------|--------|---------------------|
| **Critical** | Inmediato | < 24 horas |
| **High** | Urgente | < 72 horas |
| **Moderate** | Planificado | < 1 semana |
| **Low** | Próximo release | < 1 mes |

### Integración con GitHub Security

```yaml
# .github/workflows/security.yml
name: Security Audit
on:
  schedule:
    - cron: '0 10 * * 1'  # Lunes 10am
  push:
    branches: [ main ]

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Run security audit
        run: npm audit --audit-level moderate
        
      - name: Check for vulnerabilities
        run: |
          if [ $(npm audit --json | jq '.metadata.vulnerabilities.total') -gt 0 ]; then
            echo "Vulnerabilities found!"
            exit 1
          fi
```

## Manejo de Conflictos de Dependencias

### Detección de Conflictos

```bash
# Verificar dependencias duplicadas
npm ls --depth=0

# Buscar versiones conflictivas
npm ls react
npm ls @types/react

# Ver árbol de dependencias
npm explain react
```

### Resolución de Conflictos

#### 1. Peer Dependency Conflicts

```json
// Problema: React 18 vs React 17
{
  "dependencies": {
    "react": "^18.2.0"
  },
  "devDependencies": {
    "@testing-library/react": "^12.0.0"  // Requiere React 17
  }
}

// Solución: Actualizar testing library
{
  "devDependencies": {
    "@testing-library/react": "^13.0.0"  // Soporta React 18
  }
}
```

#### 2. Version Mismatch

```bash
# Forzar instalación de versión específica
npm install react@18.2.0 --save-exact

# Usar npm-dedupe para limpiar
npm dedupe

# Limpiar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
```

## Monitoreo y Reportes

### Dashboard de Dependencias

```bash
# Script para generar reporte
npm run deps:report

# Salida esperada
┌─────────────┬──────────────┬─────────────┬─────────────┐
│ Dependency   │ Current      │ Latest      │ Status      │
├─────────────┼──────────────┼─────────────┼─────────────┤
│ react        │ 18.2.0       │ 19.0.0      │ ⚠️  Major   │
│ axios        │ 1.3.0        │ 1.3.4       │ ✅ Patch    │
│ typescript   │ 4.9.0        │ 5.0.0       │ ⚠️  Major   │
│ jest         │ 29.3.0       │ 29.4.0      │ ✅ Patch    │
└─────────────┴──────────────┴─────────────┴─────────────┘
```

### Métricas Clave

| Métrica | Objetivo | Medición |
|---------|----------|----------|
| **Dependencies Health** | > 90% actualizadas | Dependencias desactualizadas |
| **Security Score** | 0 vulnerabilidades | NPM Audit results |
| **Update Frequency** | 1-2 semanas | Tiempo entre actualizaciones |
| **Conflict Rate** | < 5% | Dependencias conflictivas |

## Buenas Prácticas

### Dos y Don'ts

| ✅ Do | ❌ Don't |
|-------|----------|
| Usar rangos específicos (`^1.2.3`) | Usar wildcard (`*`) |
| Revisar changelog antes de actualizar | Actualizar sin testing |
| Mantener package-lock.json en version control | Ignorar dependencias de desarrollo |
| Usar npm audit regularmente | Ignorar advertencias de seguridad |
| Documentar cambios breaking | Actualizar major sin comunicación |

### Checklist de Actualización

```markdown
## Pre-Update Checklist
- [ ] Backup del proyecto
- [ ] Tests pasando en versión actual
- [ ] Documentación de cambios leída
- [ ] Rama de feature creada

## Post-Update Checklist
- [ ] Todos los tests pasan
- [ ] Build exitoso
- [ ] Linting sin errores
- [ ] Testing manual de features críticas
- [ ] Actualización de documentación
- [ ] Comunicación al equipo
```

## Herramientas Recomendadas

### Para Desarrollo

```bash
# npm-check-updates - Actualización masiva
npm install -g npm-check-updates
ncu  # Ver actualizaciones
ncu -u  # Actualizar package.json

# npm-outdated - Ver desactualizadas
npm outdated

# npm-audit-repair - Fix de seguridad
npm install -g npm-audit-repair
npm-audit-repair
```

### Para Monitoreo

```bash
# Snyk - Escaneo de seguridad
npm install -g snyk
snyk test

# Greenkeeper - Automatización de dependencias
# Integrado con GitHub

# RenovateBot - Alternativa a Dependabot
# Configuración avanzada de actualizaciones
```
