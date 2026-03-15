@echo off
setlocal enabledelayedexpansion

echo [1/7] 开始构建博客...
pnpm build
if %errorlevel% neq 0 (
    echo 构建失败，退出码 %errorlevel%
    pause
    exit /b %errorlevel%
)
echo 构建成功！

echo [2/7] 切换到 gh-pages 分支...
git checkout gh-pages
if %errorlevel% neq 0 (
    echo 切换分支失败，请确保分支存在
    pause
    exit /b %errorlevel%
)

echo [3/7] 复制构建文件到当前目录...
xcopy /E /Y dist\* .
if %errorlevel% neq 0 (
    echo 复制文件失败，请检查 dist 目录是否存在
    pause
    exit /b %errorlevel%
)

echo [4/7] 检查是否有文件变更...
git add .
git diff --cached --quiet
if %errorlevel% equ 0 (
    echo 没有检测到任何变更，跳过提交和推送。
) else (
    echo 检测到变更，准备提交...
    git commit -m "Deploy updates: %date% %time%"
    if %errorlevel% neq 0 (
        echo 提交失败
        pause
        exit /b %errorlevel%
    )

    echo [5/7] 推送到 GitHub...
    git push origin gh-pages
    if %errorlevel% neq 0 (
        echo 推送失败，请检查网络和权限
        pause
        exit /b %errorlevel%
    )
)

echo [6/7] 切换回原分支...
git checkout -
echo [7/7] 部署完成！
pause