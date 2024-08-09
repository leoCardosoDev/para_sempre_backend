FROM node:latest

WORKDIR /usr/src/clean-node-api

# Adiciona a variável de ambiente para desativar o Husky
ENV HUSKY_SKIP_INSTALL=1

COPY package*.json ./

# Instala apenas as dependências de produção
RUN npm cache clean --force && npm install --legacy-peer-deps --omit=dev

COPY . .

# Instala todas as dependências
RUN npm install --legacy-peer-deps

RUN npm run build

CMD ["node", "dist/main/server.js", "--inspect=0.0.0.0:9222", "--nolazy"]
