# Base runtime image for production
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 44334
ENV ASPNETCORE_URLS="http://+:44334"

# Build stage: Restores dependencies and builds the application
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Debug
WORKDIR /src

# Copy project files and restore dependencies
COPY ["TaskManagementSystem/TaskManagementSystem.csproj", "TaskManagementSystem/"]
COPY ["TaskManagementSystemRepository/TaskManagementSystemRepository.csproj", "TaskManagementSystemRepository/"]
COPY ["TaskManagementSystemData/TaskManagementSystemData.csproj", "TaskManagementSystemData/"]
COPY ["TaskManagementSystemService/TaskManagementSystemService.csproj", "TaskManagementSystemService/"]
RUN dotnet restore "TaskManagementSystem/TaskManagementSystem.csproj"

# Copy the entire source and build the project
COPY . .
WORKDIR "/src/TaskManagementSystem"
RUN dotnet build "TaskManagementSystem.csproj" -c $BUILD_CONFIGURATION -o /app/build

# Publish stage: Publishes the application to a folder
FROM build AS publish
ARG BUILD_CONFIGURATION=Debug
RUN dotnet publish "TaskManagementSystem.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Final runtime stage: Runs the application
FROM base AS final
WORKDIR /app

# Debug: Ensure DLL is copied to the final stage
COPY --from=publish /app/publish .

# Debug: List files in the working directory
RUN ls -la

# Entry point
ENTRYPOINT ["dotnet", "TaskManagementSystem.dll"]