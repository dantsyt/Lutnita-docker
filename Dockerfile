FROM alpine:3.22.0

LABEL maintainer="dantsyt@gmail.com"

#ENV MONGODB_URI="mongodb+srv://dantsyt:a80FKUYCEoWXeVFA@cluster0.49kxau7.mongodb.net/lutnita?retryWrites=true&w=majority"

COPY . /lutnita-app

WORKDIR /lutnita-app

RUN apk add --update nodejs npm && npm install && npm audit fix

EXPOSE 8080

ENTRYPOINT ["node", "./src/app.js"]

