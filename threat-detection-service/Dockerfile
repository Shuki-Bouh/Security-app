FROM alpine:latest

WORKDIR /www

RUN apk update && \
    apk upgrade && \
    apk add nodejs npm

COPY package.json .
COPY package-lock.json .
COPY src/ .
COPY entrypoint.sh .

RUN npm init
RUN npm install

EXPOSE 3000