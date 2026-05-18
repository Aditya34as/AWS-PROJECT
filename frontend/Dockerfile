FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Accept VITE_API_URL as a build argument
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Install a lightweight static server to replace Nginx in Docker
RUN npm install -g serve

EXPOSE 80

# Serve the built 'dist' folder on port 80
CMD ["serve", "-s", "dist", "-l", "80"]
