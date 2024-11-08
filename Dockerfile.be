FROM --platform=linux/amd64 node:20

WORKDIR /app

COPY ./package.json ./
COPY ./tsconfig.json ./
COPY ./yarn.lock ./

RUN corepack enable
RUN yarn install

WORKDIR /app/packages/BE

COPY ./packages/BE .

RUN yarn install

EXPOSE 3000

CMD ["yarn", "start"]
