FROM alpine:3.22.0

LABEL maintainer="dantsyt@gmail.com"

ENV MONGODB_URI="mongodb://mongodb:27017/lutnita"

COPY . /lutnita-app

WORKDIR /lutnita-app

RUN apk add --update nodejs npm curl jq && npm install && npm audit fix

EXPOSE 3000

HEALTHCHECK --interval=5s --timeout=5s CMD curl localhost:3000/healthcheck | jq 'select(.status == "UP")'

ENTRYPOINT ["npm", "start"]
