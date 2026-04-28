# Etapa 1: Build
FROM node:22-alpine AS build

WORKDIR /app

# Instalar pnpm (tu packageManager definido en angular.json)
RUN npm install -g pnpm

# Copiar archivos de dependencias
COPY package.json pnpm-lock.yaml ./

# Instalar dependencias
RUN pnpm install --frozen-lockfile

# Copiar todo el código fuente
COPY . .

# Construir la aplicación (generará la carpeta 'public' según tu angular.json)
RUN pnpm run build

# Etapa 2: Serve con Nginx
FROM nginx:alpine

# Copiamos la configuración de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiamos los archivos estáticos desde la etapa de build
# NOTA: En tu angular.json outputPath es "public", por lo tanto copiamos desde /app/public
COPY --from=build /app/public /usr/share/nginx/html

# Railway ignora EXPOSE y usa su propia variable PORT, pero la dejamos por convención
EXPOSE 80
