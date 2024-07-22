FROM node:20 AS build
WORKDIR /usr/src/app
COPY package.json .
COPY yarn.lock .
RUN yarn install --development

COPY . .
RUN yarn run build

FROM node:20-alpine
WORKDIR /usr/src/app

COPY package.json .
RUN yarn install --production

COPY --from=build /usr/src/app/dist dist
COPY --from=build /usr/src/app/build build

EXPOSE 8025
CMD ["node", "dist/server.js"]