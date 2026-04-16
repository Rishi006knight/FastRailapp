# Use eclipse-temurin 17 as the base image (more reliable than openjdk-slim)
FROM eclipse-temurin:17-jdk-jammy

# Set the working directory
WORKDIR /app

# Copy the maven wrapper and pom file
COPY .mvn/ .mvn
COPY mvnw pom.xml ./

# Ensure the maven wrapper is executable
RUN chmod +x mvnw

# Download dependencies (this layer is cached)
RUN ./mvnw dependency:go-offline

# Copy the source code
COPY src ./src

# Build the application
RUN ./mvnw clean package -DskipTests

# Expose the port the app runs on
EXPOSE 8080

# Run the jar file
CMD ["java", "-jar", "target/fastrail-backend-1.0.0.jar"]
