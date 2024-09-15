FROM node:20.17.0

WORKDIR /app

COPY package.json . 
COPY yarn.lock .

RUN yarn install

COPY . .

ENTRYPOINT ["yarn", "start:dev"]
