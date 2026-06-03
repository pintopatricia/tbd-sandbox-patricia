FROM docker.app.betfair/ppb/tbdn/rn-android:2.0.0

# SUPPLY_UPLOAD_MAX_RETRIES - workaround for Google API issue: https://github.com/fastlane/fastlane/issues/21507#issuecomment-1723116829
ENV SUPPLY_UPLOAD_MAX_RETRIES=5

ARG GITHUB_TOKEN
ENV GITHUB_TOKEN=$GITHUB_TOKEN

ARG MONTEROSA_TOKEN
ENV MONTEROSA_TOKEN=$MONTEROSA_TOKEN

WORKDIR /usr/app

# Add required environmental variables
ARG NATIVE_BUILD_NUMBER
ENV NATIVE_BUILD_NUMBER=${NATIVE_BUILD_NUMBER}
ENV CI=true

# Add required environmental variable with the keystore pw
ARG ANDROID_UPLOAD_STORE_PW
ENV ANDROID_UPLOAD_STORE_PW=${ANDROID_UPLOAD_STORE_PW}

ENV ANDROID_KEYSTORE_ALIAS=androidbetfairkey

# install node deps
COPY package.json .yarnrc.yml yarn.lock ./
COPY .yarn .yarn/
COPY apps/bf/native/package.json apps/bf/native/
COPY packages/tbd-store/package.json packages/tbd-store/
COPY packages/tbd-shared/package.json packages/tbd-shared/
COPY packages/tbd-router/package.json packages/tbd-router/
COPY packages/wdio-lazy-element/package.json packages/wdio-lazy-element/

RUN yarn workspaces focus @ppb/tbd-native

# copy source code
COPY apps/bf/native ./apps/bf/native
COPY packages/tbd-store/ packages/tbd-store/
COPY packages/tbd-shared/ packages/tbd-shared/
COPY packages/tbd-router/ packages/tbd-router/
COPY pql-manifest-sca.config.js pql-manifest-blh.config.js pql-manifest-catalogue.config.js ./

WORKDIR /usr/app/apps/bf/native/android

# Running the same gradlew task as the one that will run to
# upload our production app into the Play Store
ARG RELEASE_KEYSTORE
RUN echo $RELEASE_KEYSTORE | base64 --decode > ./app/release.keystore

COPY /apps/bf/native/android/fastlane ./fastlane
COPY /apps/bf/native/android/Gemfile ./

ENV LANG C.UTF-8
ENV LC_ALL C.UTF-8

ARG FASTLANE_ACTION
ARG PLAY_STORE_CREDENTIALS

ARG FIREBASE_CI_KEY
ENV FIREBASE_CI_KEY=${FIREBASE_CI_KEY}

RUN bundle install
# Runs the faslane task that builds and deploys the app (PLAY_STORE_CREDENTIALS only required for the app store deploy)
RUN bundle exec fastlane android $FASTLANE_ACTION json_key_data:"$(echo $PLAY_STORE_CREDENTIALS | base64 --decode)"
