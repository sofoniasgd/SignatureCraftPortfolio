# Signature Craft — bundle the site for upload to shared hosting (Windows, no WSL needed).
# Right-click > Run with PowerShell, or from the project folder:
#   powershell -ExecutionPolicy Bypass -File package.ps1
# Produces:
#   dist\                     exactly the files the live site needs
#   signature-craft-site.zip  the same, zipped — upload & extract into public_html
# Leaves out originals, PDFs, README, preview scripts, git and editor files.
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

if (Test-Path dist) { Remove-Item dist -Recurse -Force }
if (Test-Path signature-craft-site.zip) { Remove-Item signature-craft-site.zip -Force }
New-Item -ItemType Directory dist\assets\products, dist\assets\brillant | Out-Null

Copy-Item index.html dist\
Copy-Item css, js, data dist\ -Recurse
Copy-Item assets\*.svg dist\assets\
# logo font (only the font file, not the preview images/licence)
Copy-Item assets\brillant\brillant.otf dist\assets\brillant\
# web-ready product photos only (not assets\products\originals\)
Get-ChildItem assets\products -File |
  Where-Object { $_.Extension -match '^\.(jpe?g|png|webp)$' } |
  Copy-Item -Destination dist\assets\products\

# warn about photos referenced in products.json that don't exist
$missing = $false
$json = Get-Content data\products.json -Raw -Encoding UTF8
foreach ($m in [regex]::Matches($json, '"(assets/products/[^"]+)"')) {
  if (-not (Test-Path ("dist\" + $m.Groups[1].Value))) {
    Write-Host "  MISSING: $($m.Groups[1].Value)" -ForegroundColor Red
    $missing = $true
  }
}

# zip with forward-slash paths (Compress-Archive on Windows PowerShell writes
# backslashes, which Linux web hosts extract as broken file names)
Add-Type -AssemblyName System.IO.Compression, System.IO.Compression.FileSystem
$dist = (Resolve-Path dist).Path
$zip = [System.IO.Compression.ZipFile]::Open((Join-Path $PSScriptRoot "signature-craft-site.zip"), "Create")
try {
  Get-ChildItem dist -Recurse -File | ForEach-Object {
    $entry = $_.FullName.Substring($dist.Length + 1).Replace('\', '/')
    [void][System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $_.FullName, $entry)
  }
} finally { $zip.Dispose() }

$files = (Get-ChildItem dist -Recurse -File).Count
$size = "{0:N1} MB" -f ((Get-ChildItem dist -Recurse -File | Measure-Object Length -Sum).Sum / 1MB)
Write-Host ""
Write-Host "  dist\ and signature-craft-site.zip ready ($size, $files files)" -ForegroundColor Green
if ($missing) { Write-Host "  ^ fix the missing photos above before uploading" -ForegroundColor Red }
else { Write-Host "  All product photos found." }
Write-Host ""
Write-Host "  Note: double-clicking dist\index.html won't show the gallery (browsers block"
Write-Host "  local files from loading products.json). Upload it, or preview with serve.ps1."
Write-Host ""
