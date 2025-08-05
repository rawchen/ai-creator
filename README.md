## AI创作助手
> 此项目使用 [Spring Boot](https://spring.io/projects/spring-boot/) / [React](https://react.dev/) 架构。以下是有关如何使用的快速指南。


## Docker启动条件
安装 `mvn` / jdk8

## 环境变量
```properties
AI_CREATOR_URL = jdbc:mysql://xxx.ivolces.com:3306/ai_creator?serverTimezone=Asia/Shanghai&useUnicode=true&characterEncoding=utf-8&zeroDateTimeBehavior=convertToNull&useSSL=false&allowPublicKeyRetrieval=true

AI_CREATOR_USERNAME = root

AI_CREATOR_PASSWORD = root
```

### 前端根目录文件

front/.env.production

### 端口
```bash
6001
```

## 启动

```bash
chmod +x deploy.sh
./deploy.sh
```