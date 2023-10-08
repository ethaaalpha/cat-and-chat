FROM node:18

WORKDIR /usr/src/app
COPY *.json ./
RUN npm install

COPY src/ .
EXPOSE 3000
CMD [ "npm", "run", "start:dev" ]