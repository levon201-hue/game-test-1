# Minimal static-file server for GeoGuess Sprint.
# Serves the parent folder over HTTP so ES modules + fetch() work.

param(
    [int]$Port = 8765,
    [string]$Root = (Resolve-Path (Join-Path $PSScriptRoot ".."))
)

$ErrorActionPreference = "Continue"

$mime = @{
    ".html" = "text/html; charset=utf-8"
    ".htm"  = "text/html; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".mjs"  = "application/javascript; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".gif"  = "image/gif"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
    ".txt"  = "text/plain; charset=utf-8"
    ".map"  = "application/json; charset=utf-8"
    ".woff" = "font/woff"
    ".woff2"= "font/woff2"
}

$listener = New-Object System.Net.HttpListener
$prefix = "http://localhost:$Port/"
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
} catch {
    Write-Host "Failed to bind $prefix : $_"
    exit 1
}

Write-Host "Serving $Root at $prefix (Ctrl+C to stop)"

try {
    while ($listener.IsListening) {
        $ctx = $listener.GetContext()
        $req = $ctx.Request
        $res = $ctx.Response

        try {
            $relPath = [System.Uri]::UnescapeDataString($req.Url.AbsolutePath).TrimStart('/')
            if ([string]::IsNullOrEmpty($relPath)) { $relPath = "index.html" }
            $full = Join-Path $Root $relPath

            # Prevent path traversal
            $fullResolved = [System.IO.Path]::GetFullPath($full)
            $rootResolved = [System.IO.Path]::GetFullPath($Root)
            if (-not $fullResolved.StartsWith($rootResolved, [System.StringComparison]::OrdinalIgnoreCase)) {
                $res.StatusCode = 403
                $res.Close()
                continue
            }

            if ((Test-Path $fullResolved) -and (Get-Item $fullResolved).PSIsContainer) {
                $fullResolved = Join-Path $fullResolved "index.html"
            }

            if (Test-Path $fullResolved -PathType Leaf) {
                $ext = [System.IO.Path]::GetExtension($fullResolved).ToLower()
                $ct  = $mime[$ext]
                if (-not $ct) { $ct = "application/octet-stream" }
                $bytes = [System.IO.File]::ReadAllBytes($fullResolved)
                $res.ContentType = $ct
                $res.ContentLength64 = $bytes.Length
                $res.Headers.Add("Cache-Control", "no-store")
                $res.OutputStream.Write($bytes, 0, $bytes.Length)
                Write-Host "200 $($req.HttpMethod) $($req.Url.AbsolutePath)"
            } else {
                $res.StatusCode = 404
                $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $relPath")
                $res.OutputStream.Write($msg, 0, $msg.Length)
                Write-Host "404 $($req.HttpMethod) $($req.Url.AbsolutePath)"
            }
        } catch {
            try {
                $res.StatusCode = 500
                $msg = [System.Text.Encoding]::UTF8.GetBytes("500 Server Error: $_")
                $res.OutputStream.Write($msg, 0, $msg.Length)
            } catch {}
            Write-Host "500 $($req.Url.AbsolutePath) :: $_"
        } finally {
            try { $res.Close() } catch {}
        }
    }
} finally {
    $listener.Stop()
    $listener.Close()
}
