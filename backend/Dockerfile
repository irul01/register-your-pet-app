FROM node:22

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY prisma ./prisma
RUN npx prisma generate
COPY . .

CMD ["npm", "run", "start:dev"]
