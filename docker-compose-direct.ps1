# Direct Docker Compose Script
# This script uses docker-compose command directly without checking Docker Desktop

# Process command line arguments
$composeArgs = $args
if ($composeArgs.Count -eq 0) {
    Write-Host "Usage: $($MyInvocation.MyCommand.Name) [Docker Compose command]" -ForegroundColor Cyan
    Write-Host "Example: $($MyInvocation.MyCommand.Name) up -d" -ForegroundColor Cyan
    exit 0
}

# Execute Docker Compose command
Write-Host "Executing command: docker-compose $composeArgs" -ForegroundColor Cyan
try {
    & docker-compose $composeArgs
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error: Docker Compose command failed with exit code $LASTEXITCODE." -ForegroundColor Red
        exit $LASTEXITCODE
    }
    
    Write-Host "Docker Compose command executed successfully." -ForegroundColor Green
}
catch {
    Write-Host "Error: Exception occurred while executing Docker Compose command." -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
} 