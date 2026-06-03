FROM ubuntu:20.04

ARG GITHUB_TOKEN
ENV GITHUB_TOKEN $GITHUB_TOKEN

# Install system dependencies
RUN apt update -qq && apt install -qq -y --no-install-recommends \
    apt-transport-https \
    curl \
    git \
    gnupg2 \
    ca-certificates \
    unzip \
    openjdk-17-jdk-headless \
    ruby \
    ruby-dev \
    build-essential \
    lsof \
    screen && gem install bundler -v 2.4.22

ARG NODE_VERSION=20.x

# Install nodejs and yarn
RUN curl -sL https://deb.nodesource.com/setup_${NODE_VERSION} | bash - \
    && echo "deb https://dl.yarnpkg.com/debian/ stable main" > /etc/apt/sources.list.d/yarn.list \
    && curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - \
    && apt-get update -qq \
    && apt-get install -qq -y --no-install-recommends nodejs \
    && rm -rf /var/lib/apt/lists/*

RUN npm i -g yarn

# Set Android settings
ARG ANDROID_API_LEVEL=35
ARG SDK_VERSION=commandlinetools-linux-13114758_latest.zip
ARG ANDROID_BUILD_VERSION=35
ARG ANDROID_TOOLS_VERSION=35.0.0
ARG NDK_VERSION=27.1.12297006

# Set default environment variables
ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
ENV DEBIAN_FRONTEND=noninteractive
ENV ANDROID_HOME=/opt/android
ENV ANDROID_NDK_HOME=${ANDROID_HOME}/ndk/$NDK_VERSION
ENV PATH=${ANDROID_HOME}/cmdline-tools/latest/bin:${ANDROID_HOME}/emulator:${ANDROID_HOME}/platform-tools:${ANDROID_HOME}/tools:${ANDROID_HOME}/tools/bin:${PATH}

# Download and unpack android SDK
RUN curl -sS https://dl.google.com/android/repository/${SDK_VERSION} -o /tmp/sdk.zip \
    && mkdir -p ${ANDROID_HOME}/cmdline-tools \
    && unzip -q -d ${ANDROID_HOME}/cmdline-tools /tmp/sdk.zip \
    && mv ${ANDROID_HOME}/cmdline-tools/cmdline-tools ${ANDROID_HOME}/cmdline-tools/latest \
    && rm /tmp/sdk.zip \
    && yes | sdkmanager --licenses \
    && yes | sdkmanager "platform-tools" \
        "platforms;android-$ANDROID_BUILD_VERSION" \
        "build-tools;$ANDROID_TOOLS_VERSION" \
        "ndk;$NDK_VERSION" \
    && rm -rf ${ANDROID_HOME}/.android \
    && chmod 777 -R ${ANDROID_HOME}

# Create workspace
WORKDIR /usr/app

# copy the whole .yarn folder
COPY .yarn .yarn/

# install all dependencies that are common to the monorepo as a whole
COPY .yarnrc.yml package.json yarn.lock ./
COPY packages/etx-edit-orchestrator/package.json packages/etx-edit-orchestrator/
COPY packages/tbd-store/package.json packages/tbd-store/
COPY packages/tbd-shared/package.json packages/tbd-shared/
COPY packages/tbd-router/package.json packages/tbd-router/
COPY packages/wdio-lazy-element/package.json packages/wdio-lazy-element/

COPY apps/sbg/native/package.json apps/sbg/native/

RUN yarn workspaces focus @ppb/tbdsbg-native

RUN rm .yarnrc.yml package.json packages/**/package.json yarn.lock
