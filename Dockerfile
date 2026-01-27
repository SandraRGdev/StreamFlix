# ============================================
# Stage 1: Build
# ============================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de configuración
COPY package.json package-lock.json* ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Construir la aplicación
# VITE_TMDB_API_KEY debe estar configurada como variable de entorno en Dockploy
RUN npm run build

# ============================================
# Stage 2: Production
# ============================================
FROM nginx:alpine

# Copiar archivos build al directorio de nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración nginx personalizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto 80
EXPOSE 80

# Iniciar nginx
CMD ["nginx", "-g", "daemon off;"]
