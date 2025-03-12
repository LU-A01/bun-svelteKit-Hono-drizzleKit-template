# Simple Docker Compose Script for Windows
# このスクリプトはWindows環境でDocker Composeを簡単に使用するためのシンプルなインターフェースを提供します

param (
    [string]$Command = "help"
)

# 色の設定
$colorInfo = "Cyan"
$colorSuccess = "Green"
$colorWarning = "Yellow"
$colorError = "Red"

# ヘルプ表示
function Show-Help {
    Write-Host "`nDocker Compose シンプル管理ツール" -ForegroundColor $colorInfo
    Write-Host "=================================" -ForegroundColor $colorInfo
    Write-Host "使用方法: $($MyInvocation.MyCommand.Name) [command]" -ForegroundColor $colorInfo
    Write-Host ""
    Write-Host "コマンド:" -ForegroundColor $colorInfo
    Write-Host "  up       - コンテナを起動 (デタッチドモード)" -ForegroundColor $colorInfo
    Write-Host "  down     - コンテナを停止して削除" -ForegroundColor $colorInfo
    Write-Host "  ps       - 実行中のコンテナを表示" -ForegroundColor $colorInfo
    Write-Host "  logs     - コンテナのログを表示" -ForegroundColor $colorInfo
    Write-Host "  build    - イメージを(再)ビルド" -ForegroundColor $colorInfo
    Write-Host "  restart  - コンテナを再起動" -ForegroundColor $colorInfo
    Write-Host "  status   - 環境の状態を確認" -ForegroundColor $colorInfo
    Write-Host "  help     - このヘルプを表示" -ForegroundColor $colorInfo
    Write-Host ""
    Write-Host "例:" -ForegroundColor $colorInfo
    Write-Host "  $($MyInvocation.MyCommand.Name) up       # すべてのコンテナを起動" -ForegroundColor $colorInfo
    Write-Host "  $($MyInvocation.MyCommand.Name) down     # すべてのコンテナを停止" -ForegroundColor $colorInfo
    Write-Host "  $($MyInvocation.MyCommand.Name) logs -f  # ログを継続的に表示" -ForegroundColor $colorInfo
    Write-Host ""
}

# Docker Desktopの起動確認
function Check-DockerRunning {
    try {
        $dockerInfo = docker info 2>&1
        if ($LASTEXITCODE -ne 0) {
            Write-Host "エラー: Dockerが実行されていません。Docker Desktopを起動してください。" -ForegroundColor $colorError
            return $false
        }
        return $true
    }
    catch {
        Write-Host "エラー: Docker CLIにアクセスできません。Docker Desktopがインストールされているか確認してください。" -ForegroundColor $colorError
        return $false
    }
}

# データベースコンテナのステータス確認
function Check-DatabaseStatus {
    try {
        $dbContainer = docker ps --all --filter "name=bun-sveltekit-hono-drizzlekit-template-database" --format "{{.ID}}" 2>&1
        if ($dbContainer) {
            $status = docker inspect --format "{{.State.Status}}" $dbContainer 2>&1
            $exitCode = docker inspect --format "{{.State.ExitCode}}" $dbContainer 2>&1
            
            if ($status -eq "exited" -and $exitCode -eq 0) {
                Write-Host "注意: データベースコンテナは正常終了しています（マイグレーション完了）" -ForegroundColor $colorSuccess
                return $true
            }
            elseif ($status -eq "running") {
                Write-Host "データベースコンテナは実行中です" -ForegroundColor $colorSuccess
                return $true
            }
            else {
                Write-Host "警告: データベースコンテナのステータス: $status (終了コード: $exitCode)" -ForegroundColor $colorWarning
                return $false
            }
        }
        else {
            Write-Host "データベースコンテナが見つかりません" -ForegroundColor $colorWarning
            return $false
        }
    }
    catch {
        Write-Host "データベースコンテナの確認中にエラーが発生しました: $_" -ForegroundColor $colorError
        return $false
    }
}

# メイン処理
if (-not (Check-DockerRunning)) {
    exit 1
}

switch ($Command) {
    "up" {
        Write-Host "コンテナを起動しています..." -ForegroundColor $colorInfo
        docker-compose up -d
        if ($LASTEXITCODE -eq 0) {
            Write-Host "コンテナは正常に起動しました" -ForegroundColor $colorSuccess
            # データベースコンテナのステータスを確認
            Check-DatabaseStatus
        }
    }
    "down" {
        Write-Host "コンテナを停止して削除しています..." -ForegroundColor $colorInfo
        docker-compose down
        if ($LASTEXITCODE -eq 0) {
            Write-Host "コンテナは正常に停止・削除されました" -ForegroundColor $colorSuccess
        }
    }
    "ps" {
        Write-Host "実行中のコンテナ:" -ForegroundColor $colorInfo
        docker-compose ps
    }
    "logs" {
        $additionalArgs = $args
        Write-Host "コンテナのログを表示しています..." -ForegroundColor $colorInfo
        docker-compose logs $additionalArgs
    }
    "build" {
        Write-Host "イメージをビルドしています..." -ForegroundColor $colorInfo
        docker-compose build
        if ($LASTEXITCODE -eq 0) {
            Write-Host "イメージは正常にビルドされました" -ForegroundColor $colorSuccess
        }
    }
    "restart" {
        Write-Host "コンテナを再起動しています..." -ForegroundColor $colorInfo
        docker-compose restart
        if ($LASTEXITCODE -eq 0) {
            Write-Host "コンテナは正常に再起動されました" -ForegroundColor $colorSuccess
            # データベースコンテナのステータスを確認
            Check-DatabaseStatus
        }
    }
    "status" {
        Write-Host "環境の状態を確認しています..." -ForegroundColor $colorInfo
        docker-compose ps
        Check-DatabaseStatus
    }
    "help" {
        Show-Help
    }
    default {
        Write-Host "不明なコマンド: $Command" -ForegroundColor $colorError
        Show-Help
        exit 1
    }
} 