FROM alpine:3.22.0

LABEL maintainer="dantsyt@gmail.com"

ENV MONGODB_URI="mongodb://mongodb:27017/lutnita"

COPY . /lutnita-app

WORKDIR /lutnita-app

RUN apk add --update nodejs npm && npm install && npm audit fix

EXPOSE 3000

ENTRYPOINT ["node", "./src/app.js"]

