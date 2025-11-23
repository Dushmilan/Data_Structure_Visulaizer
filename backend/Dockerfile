# Use an official OpenJDK runtime as a base image
FROM openjdk:17-jdk-slim

# Set the working directory in the container
WORKDIR /app

# Install any needed packages for security and functionality
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy the security configuration (this will be created later)
# COPY security.policy /app/security.policy

# Set security options to prevent dangerous operations
RUN echo 'java.security.manager' >> /etc/java-8-openjdk/security/java.security
RUN echo 'java.security.policy=/app/security.policy' >> /etc/java-8-openjdk/security/java.security

# Expose a port for any API interactions (if needed)
EXPOSE 8080

# Default command to run when starting the container
CMD ["jshell"]