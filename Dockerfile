FROM node:lts-slim as assets
WORKDIR /app

RUN pwd

COPY frontend/package.json .
RUN yarn install

COPY frontend/ .

RUN yarn build:all

FROM maven:3.6.3-jdk-8 as build

WORKDIR /app

COPY --from=assets /app/build/ /static/
COPY . .
COPY --from=assets /app/build/task/index.js /server/src/main/resources/javascript/parser.js

RUN mvn  clean install -Dmaven.test.skip=true  -pl server -am



FROM openjdk:8-jre-alpine as app
#定义变量测试
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8
ENV  TIME_ZONE Asiz/Shanghai
RUN apk add --no-cache zstd ttf-dejavu tzdata zip unzip msttcorefonts-installer fontconfig && \
      update-ms-fonts && \
      fc-cache -f && fc-list \
    ######设置时区
    && echo "Asia/Shanghai" > /etc/timezone \
    && ln -sf /usr/share/zoneinfo/${TIME_ZONE} /etc/localtime \
    && rm -rf /var/cache/apk/*

ENV TZ=Asia/Shanghai
RUN mkdir /data-server
WORKDIR /data-server
COPY --from=build  /app/server/server-1.0.0-*-install.zip ./server-install.zip
RUN unzip -o ./server-install.zip
RUN rm ./server-install.zip

EXPOSE 8080
ENTRYPOINT ["java","-XX:+UnlockExperimentalVMOptions","-XX:+UseCGroupMemoryLimitForHeap","-Djava.security.egd=file:/dev/./urandom","-Xdebug","-Xnoagent","-Djava.compiler=NONE","-Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=8999","-cp","lib/*","datart.DatartServerApplication"]
