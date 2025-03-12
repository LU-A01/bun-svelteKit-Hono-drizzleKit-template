# Direct Docker Windows Startup Script
# This script starts Docker containers in Windows environment using docker-compose directly

# Set environment variables
Write-Host "Setting environment variables..." -ForegroundColor Cyan
$env:DEV_MOUNT = ""
Write-Host "DEV_MOUNT = $env:DEV_MOUNT" -ForegroundColor Green

# Build Docker containers
Write-Host "Building Docker containers..." -ForegroundColor Cyan
try {
    & .\docker-compose-direct.ps1 build
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error: Docker build failed." -ForegroundColor Red
        exit $LASTEXITCODE
    }
    
    Write-Host "Docker containers built successfully." -ForegroundColor Green
}
catch {
    Write-Host "Error: Exception occurred during Docker build." -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

# Start Docker containers
Write-Host "Starting Docker containers..." -ForegroundColor Cyan
try {
    & .\docker-compose-direct.ps1 up -d
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error: Docker container startup failed." -ForegroundColor Red
        exit $LASTEXITCODE
    }
    
    Write-Host "Docker containers started successfully." -ForegroundColor Green
}
catch {
    Write-Host "Error: Exception occurred during Docker container startup." -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

# Check container status
Write-Host "Checking container status..." -ForegroundColor Cyan
try {
    & .\docker-compose-direct.ps1 ps
    
    Write-Host "Container details:" -ForegroundColor Cyan
    docker ps -a
    
    Write-Host "Docker containers started successfully. You can access them at:" -ForegroundColor Green
    Write-Host "Frontend: http://localhost:5173" -ForegroundColor Green
    Write-Host "Backend: http://localhost:3000" -ForegroundColor Green
    Write-Host "API Endpoint: http://localhost:3000/api" -ForegroundColor Green
}
catch {
    Write-Host "Error: Exception occurred while checking container status." -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
} 