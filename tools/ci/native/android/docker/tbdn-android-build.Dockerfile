FROM docker.app.betfair/ppb/tbdn/rn-android:2.0.0

ARG GITHUB_TOKEN
ENV GITHUB_TOKEN $GITHUB_TOKEN
ENV LANG C.UTF-8
ENV LC_ALL C.UTF-8

RUN gem install bundler -v 2.4.22

WORKDIR /usr/app

# Define the default command
CMD ["tbdn-android-build"]  