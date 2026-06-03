FROM docker.app.betfair/tbd-native/base-deploy

WORKDIR /usr/app

COPY android/fastlane ./fastlane
COPY release_notes.txt ./fastlane
COPY android/Gemfile ./

ARG BUILD_NUMBER
ENV BUILD_NUMBER=${BUILD_NUMBER}

ADD https://artifactory-prd.prd.betfair/artifactory/tbd-native/android/sbg/SkyBet-${BUILD_NUMBER}.apk ./app/build/outputs/apk/play/inhouse/SkyBet-${BUILD_NUMBER}.apk

WORKDIR /usr/app/fastlane

ARG FIREBASE_CI_KEY
ENV FIREBASE_CI_KEY=${FIREBASE_CI_KEY}

RUN bundle install
RUN bundle exec fastlane android inhouseDeployFirebase
