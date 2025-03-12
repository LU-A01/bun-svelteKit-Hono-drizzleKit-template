# Docker環境のデバッグと修復を行うPowerShellスクリプト

Write-Host "Docker環境のデバッグを開始します..." -ForegroundColor Cyan

# Docker Desktopの実行状態を確認
$dockerProcess = Get-Process "Docker Desktop" -ErrorAction SilentlyContinue
if ($null -eq $dockerProcess) {
    Write-Host "Docker Desktopが実行されていません。起動してください。" -ForegroundColor Red
    Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    Write-Host "Docker Desktopを起動しました。起動完了まで待機してください..." -ForegroundColor Yellow
    Start-Sleep -Seconds 20
} else {
    Write-Host "Docker Desktopは実行中です。" -ForegroundColor Green
}

# Dockerデーモンの接続確認
docker info > $null 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Dockerデーモンに接続できません。Docker Desktopが完全に起動しているか確認してください。" -ForegroundColor Red
    Write-Host "1. Docker Desktopを再起動してみてください。"
    Write-Host "2. WSL2が正しく設定されているか確認してください。"
    Write-Host "3. Windows Terminalを管理者として実行してみてください。"
    exit 1
} else {
    Write-Host "Dockerデーモンに正常に接続できています。" -ForegroundColor Green
}

# Dockerコンテナの状態確認
Write-Host "`nDockerコンテナの状態:" -ForegroundColor Cyan
docker ps -a

# Docker Composeの状態確認
Write-Host "`nDocker Composeプロジェクトの状態:" -ForegroundColor Cyan
docker compose ps

# ボリュームの状態確認
Write-Host "`nDockerボリュームの状態:" -ForegroundColor Cyan
docker volume ls

# ネットワークの状態確認
Write-Host "`nDockerネットワークの状態:" -ForegroundColor Cyan
docker network ls

# プロジェクトの再構築
Write-Host "`nDocker環境をクリーンアップし、再構築しますか？ (y/n)" -ForegroundColor Yellow
$rebuild = Read-Host
if ($rebuild -eq "y") {
    Write-Host "Docker環境をクリーンアップしています..." -ForegroundColor Cyan
    docker compose down -v
    docker compose build --no-cache
    
    Write-Host "Docker環境を再起動しています..." -ForegroundColor Cyan
    docker compose up -d
    
    Write-Host "Docker環境の再構築が完了しました。" -ForegroundColor Green
    docker compose ps
}

Write-Host "`nデバッグが完了しました。問題が解決しない場合は、より詳細なエラーメッセージを確認してください。" -ForegroundColor Cyan 