# 使用 Node.js 作为基础镜像
FROM node:21.6

# 设置工作目录
WORKDIR /app

# 复制项目文件到工作目录
COPY . .

# 安装依赖包
RUN npm install

# 暴露服务端口（React 默认在 3000 端口运行）
EXPOSE 3000

# 运行 React 应用
CMD ["npm", "run", "start"]
