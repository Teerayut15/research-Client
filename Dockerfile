FROM node:16.17.1

COPY package.json ./
RUN npm install -g npm@9.2.0
RUN npm install --force


COPY . .

EXPOSE 3000
CMD [ "npm", "start" ]