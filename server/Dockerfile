FROM node:21-bullseye

WORKDIR /app

RUN npm install -g nodemon pm2

COPY package*.json ./
RUN npm install

RUN npm install prisma --save-dev

COPY . .

RUN npx prisma generate

EXPOSE 3000

CMD ["sh", "-c", "npx prisma db push && pm2-runtime start src/index.js"]
