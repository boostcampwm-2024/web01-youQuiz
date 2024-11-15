FROM node:20

WORKDIR /app

COPY . .

RUN corepack enable
RUN yarn install

WORKDIR /app/packages/server

COPY ./packages/server .

RUN yarn install

EXPOSE 3000

CMD ["yarn", "start"]
