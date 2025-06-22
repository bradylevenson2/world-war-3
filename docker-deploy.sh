# Docker deployment for World War 3 Intelligence App

# Build the container
docker build -t worldwar3-app .

# Run the container with your .env file
docker run -it --name worldwar3-deploy -v ${PWD}:/app worldwar3-app

# Inside the container, run:
# firebase login
# firebase deploy

# For Windows PowerShell, use:
# docker run -it --name worldwar3-deploy -v ${PWD}:/app worldwar3-app

# For Windows Command Prompt, use:
# docker run -it --name worldwar3-deploy -v %cd%:/app worldwar3-app
