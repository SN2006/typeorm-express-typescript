# Convert line endings from CRLF to LF and remove BOM
$files = @(
    "scripts\be-node-dev.sh",
    "scripts\wait-for-it.sh"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        $content = $content -replace "`r`n", "`n"
        $utf8NoBom = New-Object System.Text.UTF8Encoding $false
        [System.IO.File]::WriteAllText((Resolve-Path $file), $content, $utf8NoBom)
        Write-Host "Fixed: $file"
    }
}

