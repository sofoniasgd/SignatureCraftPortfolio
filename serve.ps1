# Signature Craft — simple local preview server (no installs needed)
# Right-click > Run with PowerShell, or in a terminal:  ./serve.ps1
# Then open the printed URL in your browser. Press Ctrl+C to stop.
param(
  [int]$Port = 5173,
  [string]$Root = $PSScriptRoot
)
$ErrorActionPreference = "Stop"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()
Write-Host ""
Write-Host "  Signature Craft is live at:  http://localhost:$Port/" -ForegroundColor Green
Write-Host "  Press Ctrl+C to stop." -ForegroundColor DarkGray
Write-Host ""
Start-Process "http://localhost:$Port/"

$mime = @{
  ".html"="text/html; charset=utf-8"; ".css"="text/css; charset=utf-8";
  ".js"="application/javascript; charset=utf-8"; ".svg"="image/svg+xml";
  ".json"="application/json"; ".png"="image/png"; ".jpg"="image/jpeg";
  ".jpeg"="image/jpeg"; ".gif"="image/gif"; ".webp"="image/webp";
  ".ico"="image/x-icon"; ".woff2"="font/woff2"; ".otf"="font/otf"
}
while ($listener.IsListening) {
  try {
    $ctx = $listener.GetContext()
    $rel = [System.Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath).TrimStart("/")
    if ([string]::IsNullOrEmpty($rel)) { $rel = "index.html" }
    $path = Join-Path $Root $rel
    if (Test-Path $path -PathType Container) { $path = Join-Path $path "index.html" }
    if (Test-Path $path -PathType Leaf) {
      $ext = [System.IO.Path]::GetExtension($path).ToLower()
      if ($mime.ContainsKey($ext)) { $ctx.Response.ContentType = $mime[$ext] }
      $ctx.Response.Close([System.IO.File]::ReadAllBytes($path), $true)
    } else {
      $ctx.Response.StatusCode = 404
      $ctx.Response.Close([System.Text.Encoding]::UTF8.GetBytes("404: $rel"), $true)
    }
  } catch { Write-Host "err: $($_.Exception.Message)" -ForegroundColor Red }
}
