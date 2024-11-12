FROM alpine:latest

WORKDIR /www

RUN apk update && \
    apk upgrade && \
    apk install node

COPY package*.json ./*
COPY src/ .
COPY entrypoint.sh .

RUN npm init && \
    npm install

EXPOSE 3000