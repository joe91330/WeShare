# 使用 Node 官方映像作為基礎
FROM node:16-alpine3.18

# 定義容器對外暴露的端口
EXPOSE 3000

# 複製 Node.js 應用程式到容器中
WORKDIR /home/ubuntu/WeShare/backend/
COPY . .

# 安裝 Node.js 應用程式的相依套件
RUN npm install

# 執行 Node.js 應用程式
# CMD ["npm", "run", "stress-test"]
CMD ["node", "server.js"]
