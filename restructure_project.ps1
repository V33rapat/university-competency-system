# Restructure Project Script
$ErrorActionPreference = "Stop"

Write-Host "Creating directories..."
New-Item -ItemType Directory -Force -Path "apps\frontend" | Out-Null
New-Item -ItemType Directory -Force -Path "apps\backend" | Out-Null

Write-Host "Moving frontend files..."
$filesToMove = @(
    "app",
    "components",
    "config",
    "data",
    "lib",
    "public",
    ".env.example",
    ".env.local",
    "eslint.config.mjs",
    "jsconfig.json",
    "next-env.d.ts",
    "next.config.mjs",
    "next.config.ts",
    "postcss.config.mjs",
    "package.json",
    "package-lock.json"
)

foreach ($file in $filesToMove) {
    if (Test-Path $file) {
        Move-Item -Path $file -Destination "apps\frontend"
    } else {
        Write-Warning "File or directory not found: $file"
    }
}

Write-Host "--------------------------------------------------------"
Write-Host "SUCCESS: Project structure updated."
Write-Host "1. Frontend code moved to apps\frontend"
Write-Host "2. Backend directory created at apps\backend"
Write-Host ""
Write-Host "NEXT STEPS:"
Write-Host "1. cd apps\frontend"
Write-Host "2. npm install"
Write-Host "3. npm run dev"
Write-Host "--------------------------------------------------------"
