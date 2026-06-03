# Use a lightweight base image with Java installed
FROM eclipse-temurin:11-jre

# Set environment variables
ENV BUNDLETOOL_VERSION=1.15.0

# Install dependencies: curl, unzip, wget, and SSL libraries
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    unzip \
    wget \
    ca-certificates && \
    curl -L https://github.com/google/bundletool/releases/download/${BUNDLETOOL_VERSION}/bundletool-all-${BUNDLETOOL_VERSION}.jar -o /usr/local/bin/bundletool.jar && \
    chmod +x /usr/local/bin/bundletool.jar && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Set up bundletool as an executable
RUN echo '#!/bin/bash\njava -jar /usr/local/bin/bundletool.jar "$@"' > /usr/local/bin/bundletool && \
    chmod +x /usr/local/bin/bundletool

WORKDIR /usr/app

# Define the default command
CMD ["bundletool"]