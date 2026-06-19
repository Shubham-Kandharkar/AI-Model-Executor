FROM node:24-slim
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm install react-markdown remark-gfm
COPY . .
EXPOSE 3000
CMD ["npm", "start"]