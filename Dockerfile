# Base image
FROM node:18

# Tạo thư mục làm việc
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Cài dependencies
RUN npm install

# Copy toàn bộ source code
COPY . .

# Bật production mode (nếu có dùng)
ENV NODE_ENV=production

# Expose cổng backend (tùy bạn config, giả sử là 3000)
EXPOSE 3000

# Command để chạy ứng dụng
CMD ["npm", "start"]
