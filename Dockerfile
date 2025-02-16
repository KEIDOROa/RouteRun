FROM node:18
WORKDIR /app/routerun-app
COPY routerun-app/package*.json ./
RUN npm install
COPY routerun-app ./
CMD ["npm", "run", "dev","--","--host"]
