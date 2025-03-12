# Docker環境デバッグツール
# このスクリプトは開発環境のDockerコンテナの状態を診断し、一般的な問題を特定します

$ErrorActionPreference = 'Stop'

Write-Host "===== Docker環境診断ツール =====" -ForegroundColor Cyan
Write-Host "このツールはDockerコンテナの状態と設定を診断します" -ForegroundColor Cyan
Write-Host ""

# Docker実行確認
Write-Host "1. Dockerが実行中か確認しています..." -ForegroundColor Yellow
try {
    $dockerInfo = docker info 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "エラー: Dockerが実行されていません。Docker Desktopを起動してください。" -ForegroundColor Red
        exit 1
    }
    Write-Host "✓ Dockerは実行中です" -ForegroundColor Green
}
catch {
    Write-Host "エラー: Docker CLIにアクセスできません: $_" -ForegroundColor Red
    Write-Host "Docker Desktopがインストールされ、実行中であることを確認してください。" -ForegroundColor Yellow
    exit 1
}

# Docker Composeバージョン確認
Write-Host "`n2. Docker Composeバージョンを確認しています..." -ForegroundColor Yellow
try {
    $composeVersion = docker-compose version --short 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "警告: docker-compose単体コマンドは使用できません。Docker Composeプラグインを使用します。" -ForegroundColor Yellow
        $composeVersion = docker compose version --short 2>&1
        if ($LASTEXITCODE -ne 0) {
            Write-Host "エラー: Docker Composeプラグインも使用できません。" -ForegroundColor Red
            exit 1
        }
        Write-Host "✓ Docker Composeプラグイン: $composeVersion" -ForegroundColor Green
    } else {
        Write-Host "✓ Docker Compose: $composeVersion" -ForegroundColor Green
    }
}
catch {
    Write-Host "エラー: Docker Composeバージョンを取得できません: $_" -ForegroundColor Red
    exit 1
}

# コンテナ状態確認
Write-Host "`n3. コンテナの状態を確認しています..." -ForegroundColor Yellow
try {
    $containers = docker-compose ps --all 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "警告: docker-compose psコマンドが失敗しました。別の方法を試みます。" -ForegroundColor Yellow
        $containers = docker ps --all --filter "name=bun-sveltekit-hono-drizzlekit-template" 2>&1
        if ($LASTEXITCODE -ne 0) {
            Write-Host "エラー: コンテナ情報を取得できません。" -ForegroundColor Red
        } else {
            Write-Host "コンテナ情報:" -ForegroundColor Green
            Write-Host $containers
        }
    } else {
        Write-Host "コンテナ情報:" -ForegroundColor Green
        Write-Host $containers
    }
}
catch {
    Write-Host "エラー: コンテナ状態を取得できません: $_" -ForegroundColor Red
}

# データベースコンテナの詳細診断
Write-Host "`n4. データベースコンテナの詳細診断..." -ForegroundColor Yellow
try {
    $dbContainer = docker ps --all --filter "name=bun-sveltekit-hono-drizzlekit-template-database" --format "{{.ID}}" 2>&1
    if ($dbContainer) {
        Write-Host "データベースコンテナID: $dbContainer" -ForegroundColor Green
        
        # コンテナステータス
        $status = docker inspect --format "{{.State.Status}}" $dbContainer 2>&1
        Write-Host "ステータス: $status" -ForegroundColor $(if ($status -eq "running") { "Green" } elseif ($status -eq "exited") { "Yellow" } else { "Red" })
        
        # 終了コード（停止している場合）
        if ($status -eq "exited") {
            $exitCode = docker inspect --format "{{.State.ExitCode}}" $dbContainer 2>&1
            Write-Host "終了コード: $exitCode $(if ($exitCode -eq 0) { '(正常終了)' } else { '(エラー終了)' })" -ForegroundColor $(if ($exitCode -eq 0) { "Yellow" } else { "Red" })
            
            # 再起動ポリシー
            $restartPolicy = docker inspect --format "{{.HostConfig.RestartPolicy.Name}}" $dbContainer 2>&1
            Write-Host "再起動ポリシー: $restartPolicy" -ForegroundColor Green
            
            # ログを表示
            Write-Host "`nデータベースコンテナのログ:" -ForegroundColor Yellow
            docker logs $dbContainer
        }
        
        # マウントボリューム
        Write-Host "`nマウントボリューム:" -ForegroundColor Yellow
        docker inspect --format "{{range .Mounts}}{{.Name}}:{{.Destination}} {{end}}" $dbContainer 2>&1
    } 
    else {
        Write-Host "データベースコンテナが見つかりません" -ForegroundColor Yellow
    }
}
catch {
    Write-Host "エラー: データベースコンテナの診断中にエラーが発生しました: $_" -ForegroundColor Red
}

# 環境変数確認
Write-Host "`n5. .env設定を確認しています..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "✓ .envファイルが存在します" -ForegroundColor Green
    
    # 重要な環境変数を確認
    $dbUrl = Select-String -Path ".env" -Pattern "DATABASE_URL=" | ForEach-Object { $_.Line -replace '^DATABASE_URL=', '' }
    if ($dbUrl) {
        Write-Host "  DATABASE_URL: $dbUrl" -ForegroundColor Green
    } else {
        Write-Host "  警告: DATABASE_URLが.envで設定されていません" -ForegroundColor Yellow
    }
    
    $devMount = Select-String -Path ".env" -Pattern "DEV_MOUNT=" | ForEach-Object { $_.Line -replace '^DEV_MOUNT=', '' }
    if ($devMount) {
        Write-Host "  DEV_MOUNT: $devMount" -ForegroundColor Green
    } else {
        Write-Host "  警告: DEV_MOUNTが.envで設定されていません" -ForegroundColor Yellow
        Write-Host "  ヒント: Windows環境ではDEV_MOUNT=に設定するとマウント問題を回避できます" -ForegroundColor Yellow
    }
}
else {
    Write-Host "警告: .envファイルが見つかりません。.env.exampleをコピーして作成してください。" -ForegroundColor Yellow
}

# ボリューム確認
Write-Host "`n6. Dockerボリュームを確認しています..." -ForegroundColor Yellow
try {
    $volumes = docker volume ls --filter "name=bun-sveltekit-hono-drizzlekit-template_db-data" --format "{{.Name}}" 2>&1
    if ($volumes) {
        Write-Host "✓ データベースボリュームが存在します: $volumes" -ForegroundColor Green
        
        # ボリュームの詳細を確認
        $volInfo = docker volume inspect $volumes 2>&1
        Write-Host "ボリューム情報:" -ForegroundColor Green
        Write-Host $volInfo
    }
    else {
        Write-Host "警告: データベースボリュームが見つかりません" -ForegroundColor Yellow
    }
}
catch {
    Write-Host "エラー: Dockerボリュームを確認中にエラーが発生しました: $_" -ForegroundColor Red
}

# 推奨対応
Write-Host "`n===== 診断完了 =====" -ForegroundColor Cyan
Write-Host "推奨対応:" -ForegroundColor Yellow
Write-Host "1. データベースコンテナが終了コード0で終了している場合は、マイグレーション実行後の正常終了です" -ForegroundColor Green
Write-Host "   docker-compose.ymlのdatabaseサービスに'restart: \"no\"'オプションが追加されているか確認してください" -ForegroundColor White
Write-Host "2. コンテナを再起動するには: .\docker-compose-direct.ps1 up -d" -ForegroundColor White
Write-Host "3. 環境をリセットするには: .\docker-compose-direct.ps1 down -v && .\docker-compose-direct.ps1 up -d" -ForegroundColor White
Write-Host "4. ログを確認するには: .\docker-compose-direct.ps1 logs" -ForegroundColor White
Write-Host "" 