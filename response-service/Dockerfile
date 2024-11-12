FROM alpine:latest

WORKDIR /www

RUN apk update && \
    apk upgrade && \
    apk add nodejs npm

COPY * .

RUN chmod a+x entrypoint.sh

RUN npm init
RUN npm install

EXPOSE 4000