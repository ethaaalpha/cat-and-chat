FROM python:latest

WORKDIR /usr/src/app

COPY . ./

CMD [ "python3", "-m", "http.server", "3001"]
