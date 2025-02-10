FROM node:18-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npx prisma migrate deploy
RUN npx prisma generate
EXPOSE 8000
CMD ["node","driver-server.js"]