FROM node:18

WORKDIR /app
COPY *.json ./
RUN npm install
RUN npm install -g @nestjs/cli

COPY src/ .
EXPOSE 3000
CMD [ "npm", "run", "start:dev" ]