# Usa una imagen base de Node.js con la versión que necesites
FROM node:18

# Establece el directorio de trabajo en la aplicación
WORKDIR /usr/src/app

# Copia los archivos del proyecto al directorio de trabajo
COPY . .

# Instala las dependencias del proyecto
RUN npm install

# Construye la aplicación Next.js
RUN npm run build

# Expone el puerto en el que la aplicación se ejecutará (ajusta según sea necesario)
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "run", "start"]