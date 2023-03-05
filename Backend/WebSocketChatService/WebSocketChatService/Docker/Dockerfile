# Set the base image to use for the container
FROM openjdk:8-jdk-alpine

# Set the working directory
WORKDIR /app

# Copy the Spring Boot application jar file to the container
COPY ../target/WebSocketChatService-0.0.1-SNAPSHOT.jar .

# Expose the default Spring Boot port (8080)
EXPOSE 8080

# Set the command to run the Spring Boot application
CMD ["java", "-jar", "WebSocketChatService-0.0.1-SNAPSHOT.jar"]