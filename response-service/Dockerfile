FROM alpine:latest

WORKDIR /www

RUN apk update && \
    apk upgrade && \
    apk add nodejs npm

COPY . .

RUN chmod a+x entrypoint.sh

RUN npm init
RUN npm install
RUN npm install dotenv

EXPOSE 4000