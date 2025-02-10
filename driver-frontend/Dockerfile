FROM node:18-alpine
WORKDIR /app
COPY my-app/package.json my-app/package-lock.json ./
RUN npm install
COPY my-app/. .
RUN npm run build
EXPOSE 3001
CMD ["npm","start"]


# --folder
# ---driver-frontend
# ------my-app
# ------Dockerfile
# ---driver-backend
# ------driver-server.js
# ------Dockerfile
# ---docker-compose.yml