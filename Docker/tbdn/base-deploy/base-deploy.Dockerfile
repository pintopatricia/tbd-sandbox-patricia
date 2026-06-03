FROM ruby:3.2.2

RUN apt update -qq && apt install -qq -y --no-install-recommends \
    imagemagick \
    npm

RUN npm install -g firebase-tools   
RUN gem install bundler:1.17.3