FROM node:20 AS build
WORKDIR /usr/src/app

COPY package.json .
COPY yarn.lock .
COPY dashboard dashboard
COPY src src
COPY tsconfig.json .

RUN yarn install --development
RUN cd dashboard && yarn install --development
RUN yarn run build

FROM node:20-alpine
WORKDIR /usr/src/app

COPY package.json .
RUN yarn install --production

COPY --from=build /usr/src/app/dist dist
COPY --from=build /usr/src/app/build build

EXPOSE 8025
CMD ["node", "dist/server.js"]