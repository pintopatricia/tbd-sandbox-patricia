FROM docker.app.betfair/ppb/tbdn/rn-android-sbg:2.0.0 AS build-qa

# Add required environmental variables
ARG NATIVE_BUILD_NUMBER
ENV NATIVE_BUILD_NUMBER=${NATIVE_BUILD_NUMBER}

ARG GITHUB_TOKEN
ENV GITHUB_TOKEN=$GITHUB_TOKEN

ARG MONTEROSA_TOKEN
ENV MONTEROSA_TOKEN=$MONTEROSA_TOKEN

WORKDIR /usr/app

# install node deps
COPY package.json .yarnrc.yml yarn.lock ./

COPY packages/tbd-store/package.json packages/tbd-store/
COPY packages/tbd-shared/package.json packages/tbd-shared/
COPY packages/tbd-router/package.json packages/tbd-router/
COPY packages/wdio-lazy-element/package.json packages/wdio-lazy-element/
COPY apps/sbg/native/package.json apps/sbg/native/

RUN yarn workspaces focus @ppb/tbdsbg-native

COPY packages/tbd-store/ ./packages/tbd-store/
COPY packages/tbd-shared/ packages/tbd-shared/
COPY packages/tbd-router/ packages/tbd-router/
COPY apps/sbg/native ./apps/sbg/native
COPY pql-manifest-sca.config.js pql-manifest-blh.config.js pql-manifest-catalogue.config.js ./

WORKDIR /usr/app/apps/sbg/native/android
RUN ./gradlew assemblePlayDebug --info --no-daemon

FROM docker.app.betfair/tbd-native/alpine

WORKDIR /usr/app

COPY --from=build-qa /usr/app/apps/sbg/native/android/app/build/outputs/apk ./android/app/build/outputs/apk

FROM docker.app.betfair/tbd-native/base-deploy

WORKDIR /usr/app

COPY apps/sbg/native/android/fastlane ./fastlane
COPY apps/sbg/native/release_notes.txt ./fastlane
COPY apps/sbg/native/android/Gemfile ./

COPY --from=build-qa /usr/app/apps/sbg/native/android/app/build/outputs/apk/play/debug/app-play-debug.apk ./app/build/outputs/apk/play/debug/app-play-debug.apk

WORKDIR /usr/app/fastlane

ARG FIREBASE_CI_KEY
ENV FIREBASE_CI_KEY=${FIREBASE_CI_KEY}

RUN bundle install
RUN bundle exec fastlane android inhouseDebugDeployFirebase
