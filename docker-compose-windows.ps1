# Docker Compose代替スクリプト for Windows
# このスクリプトはdocker composeコマンドが認識されない問題を回避します

# 色の設定
$colorInfo = "Cyan"
$colorSuccess = "Green"
$colorWarning = "Yellow"
$colorError = "Red"

# ヘッダー表示
Write-Host "`n=========================================" -ForegroundColor $colorInfo
Write-Host "   Docker Compose代替スクリプト for Windows" -ForegroundColor $colorInfo
Write-Host "=========================================" -ForegroundColor $colorInfo
Write-Host "このスクリプトはdocker composeコマンドの代わりにdocker-compose.exeを使用します`n" -ForegroundColor $colorInfo

# Docker Desktopの起動確認
Write-Host "Docker Desktopの状態を確認しています..." -ForegroundColor $colorInfo
try {
    $dockerInfo = docker info 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "エラー: Docker Desktopが実行されていないか、接続できません。" -ForegroundColor $colorError
        Write-Host "Docker Desktopを起動してから再試行してください。" -ForegroundColor $colorError
        exit 1
    }
    
    Write-Host "Docker Desktopは正常に実行されています。" -ForegroundColor $colorSuccess
}
catch {
    Write-Host "エラー: Dockerコマンドの実行中に問題が発生しました。" -ForegroundColor $colorError
    Write-Host $_.Exception.Message -ForegroundColor $colorError
    exit 1
}

# Docker Composeの場所を確認
$dockerComposePath = ""
$possiblePaths = @(
    "C:\Program Files\Docker\Docker\resources\bin\docker-compose.exe",
    "C:\ProgramData\DockerDesktop\version-bin\docker-compose.exe",
    "$env:ProgramFiles\Docker\Docker\resources\bin\docker-compose.exe",
    "$env:LOCALAPPDATA\Docker\wsl\distro\bin\docker-compose.exe"
)

foreach ($path in $possiblePaths) {
    if (Test-Path $path) {
        $dockerComposePath = $path
        Write-Host "Docker Composeが見つかりました: $dockerComposePath" -ForegroundColor $colorSuccess
        break
    }
}

if ([string]::IsNullOrEmpty($dockerComposePath)) {
    Write-Host "警告: Docker Composeの実行ファイルが見つかりませんでした。" -ForegroundColor $colorWarning
    Write-Host "代替として、docker-compose.exeを使用します。" -ForegroundColor $colorWarning
    $dockerComposePath = "docker-compose"
}

# コマンドライン引数を処理
$composeArgs = $args
if ($composeArgs.Count -eq 0) {
    Write-Host "使用方法: $($MyInvocation.MyCommand.Name) [Docker Composeコマンド]" -ForegroundColor $colorInfo
    Write-Host "例: $($MyInvocation.MyCommand.Name) up -d" -ForegroundColor $colorInfo
    exit 0
}

# Docker Composeコマンドを実行
Write-Host "`n実行するコマンド: $dockerComposePath $composeArgs" -ForegroundColor $colorInfo
try {
    if ($dockerComposePath -eq "docker-compose") {
        & docker-compose $composeArgs
    } else {
        & $dockerComposePath $composeArgs
    }
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "エラー: Docker Composeコマンドの実行中にエラーが発生しました。" -ForegroundColor $colorError
        exit $LASTEXITCODE
    }
    
    Write-Host "`nDocker Composeコマンドが正常に実行されました。" -ForegroundColor $colorSuccess
}
catch {
    Write-Host "エラー: Docker Composeコマンドの実行中に例外が発生しました。" -ForegroundColor $colorError
    Write-Host $_.Exception.Message -ForegroundColor $colorError
    exit 1
} 