# Dockerfile最佳实践，请参考：https://yuque.antfin-inc.com/cloud-ide/devcontainer/hgn23x
FROM reg.docker.alibaba-inc.com/cloudide-platform/node:10.16.1-patch3

# 安装 VS Code 相关依赖
RUN rpm --rebuilddb \
    && yum -y install gcc-c++ libX11-devel libxkbfile-devel libsecret-devel \
    # 创建项目存放目录
    && mkdir -p /home

# Node 技术栈 bug https://code.alipay.com/cloudide-platform/common/pull_requests/26
ENV ELECTRON_MIRROR https://npm.alibaba-inc.com/mirrors/electron/
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD 1

ENV NODE_VERSION 12.20.0

RUN source /opt/taobao/nvm/nvm.sh \
    && nvm install $NODE_VERSION \
		&& nvm use $NODE_VERSION

ENV PATH /opt/taobao/nvm/versions/node/v$NODE_VERSION/bin:$PATH

# 切换 node 版本后重新再装一次 node-gyp 和 yarn
RUN set -x \
#  && npm config set prefix $LOCAL_DIR \
  && npm install npminstall -g --registry=http://registry.npm.alibaba-inc.com \
  && npminstall -g tnpm --registry=http://registry.npm.alibaba-inc.com \
#  && tnpm config set prefix $LOCAL_DIR \
  && tnpm install -g node-gyp \
  && tnpm install -g yarn \
  && npm cache clean --force \
  && tnpm cache clean --force

