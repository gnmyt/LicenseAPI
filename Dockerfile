FROM node:20 AS build
WORKDIR /usr/src/app
COPY package.json .
RUN npm install && npm install typescript -g

COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /usr/src/app

COPY package.json .
RUN npm install --production

COPY --from=build /usr/src/app/dist dist

EXPOSE 8025
CMD ["npm", "run", "start"]