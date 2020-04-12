FROM node:latest

WORKDIR /usr/src/courses

COPY package.json ./

RUN npm install

COPY . .

RUN npm prune --production

EXPOSE 3010

CMD ["npm", "run", "prod"]
