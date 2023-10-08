FROM python:latest

WORKDIR /app

COPY . ./

CMD [ "python3", "-m", "http.server", "3001"]
