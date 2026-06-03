FROM docker.app.betfair/ppb/tbdn/rn-android:2.0.0 AS build-inhouse

ARG GITHUB_TOKEN
ENV GITHUB_TOKEN=$GITHUB_TOKEN

ARG MONTEROSA_TOKEN
ENV MONTEROSA_TOKEN=$MONTEROSA_TOKEN

# Add required environmental variables
ARG NATIVE_BUILD_NUMBER
ENV NATIVE_BUILD_NUMBER=${NATIVE_BUILD_NUMBER}
ENV CI=true
ENV ENABLE_A11Y_TESTS_MODE=1

WORKDIR /usr/app

# install node deps
COPY package.json .yarnrc.yml yarn.lock ./
COPY pql-manifest-sca.config.js pql-manifest-blh.config.js pql-manifest-catalogue.config.js ./

COPY packages/tbd-store/package.json packages/tbd-store/
COPY packages/tbd-shared/package.json packages/tbd-shared/
COPY packages/tbd-router/package.json packages/tbd-router/
COPY packages/wdio-lazy-element/package.json packages/wdio-lazy-element/
COPY apps/bf/native/package.json apps/bf/native/

RUN yarn workspaces focus @ppb/tbd-native

COPY packages/tbd-store/ ./packages/tbd-store/
COPY packages/tbd-shared/ packages/tbd-shared/
COPY packages/tbd-router/ packages/tbd-router/
COPY apps/bf/native ./apps/bf/native

WORKDIR /usr/app/apps/bf/native/android

RUN ./gradlew generateCodegenArtifactsFromSchema

RUN ./gradlew assembleInhouse --info --no-daemon

FROM docker.app.betfair/tbd-native/alpine

WORKDIR /usr/app

COPY --from=build-inhouse /usr/app/apps/bf/native/android/app/build/outputs/apk ./android/app/build/outputs/apk
