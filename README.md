## AI创作助手
> 此项目使用 [Spring Boot](https://spring.io/projects/spring-boot/) / [React](https://react.dev/) 架构。以下是有关如何使用的快速指南。

## 生产部署

1. 修改数据库连接为生产环境配置
2. 配置生产环境的API密钥
3. 构建前端：`npm run build`
4. 构建后端：`mvn clean package`
5. 部署到服务器

### 访问
```bash
http://localhost:8889
```

## 快速启动

```bash
chmod +x deploy.sh
./deploy.sh
```