FROM alpine:3.22.0

LABEL maintainer="dantsyt@gmail.com"

COPY . /lutnita-app

WORKDIR /lutnita-app

RUN apk add --update nodejs npm && npm install && npm audit fix

EXPOSE 8080

ENTRYPOINT ["node", "./src/app.js"]

