# 打包前端项目
cd front
npm i
npm run build

rm -rf ../src/main/resources/static/*
cp -r dist/* ../src/main/resources/static/

## 制作镜像并推送到镜像仓库
#cd ../
#mvn package
#cp ./target/ai-creator-0.0.1-SNAPSHOT.jar ./ai-creator-0.0.1-SNAPSHOT.jar
#
# docker volume create ai-creator-log
# docker build -t ai-creator .
# docker run -it --name ai-creator -p 6001:6001 -v ai-creator-log:/log --log-driver json-file --log-opt max-size=10m -d ai-creator
#

#docker build --network=host -t lark-base-docker-registry-cn-beijing.cr.volces.com/connector/ai-creator:latest .
#docker push lark-base-docker-registry-cn-beijing.cr.volces.com/connector/ai-creator:latest
#
#kubectl -n connector rollout restart deployment/ai-creator-deployment