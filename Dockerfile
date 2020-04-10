FROM node:latest

WORKDIR /usr/src/app

COPY package.json /usr/src/app

RUN npm install

COPY src /usr/src/app/src

RUN npm run build

RUN npm run prune --production

EXPOSE 3010

CMD ["npm", "prod"]
