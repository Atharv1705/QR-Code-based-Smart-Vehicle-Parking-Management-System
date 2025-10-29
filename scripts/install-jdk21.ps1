<#
Install JDK 21 (Temurin) on Windows using winget if available.
Run as Administrator when using setx to persist environment variables.
#>
param()

Write-Host "Attempting to install Eclipse Temurin JDK 21 via winget..."
try {
    winget install --id EclipseAdoptium.Temurin.21 -e --source winget -h
    if ($LASTEXITCODE -eq 0) {
        Write-Host "winget install requested. Please restart your shell after install to pick up changes." -ForegroundColor Green
    } else {
        Write-Host "winget returned non-zero exit code ($LASTEXITCODE)." -ForegroundColor Yellow
    }
} catch {
    Write-Host "winget not available or failed. Please install Temurin 21 manually from https://adoptium.net" -ForegroundColor Yellow
}

Write-Host "Setting JAVA_HOME for current session (non-persistent). Adjust path if your JDK is installed elsewhere."
$possible = 'C:\Program Files\Eclipse Adoptium\jdk-21', 'C:\Program Files\Eclipse Adoptium\jdk-21.0.0', 'C:\Program Files\Java\temurin-21', 'C:\Program Files\Java\jdk-21'
foreach ($p in $possible) {
    if (Test-Path $p) {
        $env:JAVA_HOME = $p
        $env:PATH = "$env:JAVA_HOME\bin;" + $env:PATH
        Write-Host "Set JAVA_HOME to $p for the current session." -ForegroundColor Green
        exit 0
    }
}

Write-Host "Could not find a JDK installation in expected locations. After installing JDK 21, set JAVA_HOME and add \$JAVA_HOME\bin to PATH." -ForegroundColor Yellow
Write-Host "Example (PowerShell):`nsetx JAVA_HOME 'C:\Program Files\Eclipse Adoptium\jdk-21'`nsetx PATH '%JAVA_HOME%\bin;%PATH%'"
