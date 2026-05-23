# Minimal static-file server for GeoGuess Atlas.
# Uses raw TcpListener (NOT HttpListener) so we can bind to any local interface
# without needing admin / netsh URL ACL reservations. This lets phones and
# other devices on the same LAN connect via the host's local IP.
#
# Usage:  powershell -ExecutionPolicy Bypass -File .claude/server.ps1 -Port 8765
#
# Windows Firewall: the first run from a non-loopback interface will prompt to
# allow access on private networks — click Allow.

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
    ".ogg"  = "audio/ogg"
    ".oga"  = "audio/ogg"
    ".mp3"  = "audio/mpeg"
    ".wav"  = "audio/wav"
}

function Get-LocalIpv4Addresses {
    $ips = @()
    try {
        $ips = Get-NetIPAddress -AddressFamily IPv4 -ErrorAction SilentlyContinue |
            Where-Object {
                $_.IPAddress -ne "127.0.0.1" -and
                $_.IPAddress -notlike "169.254.*" -and
                $_.PrefixOrigin -ne "WellKnown" -and
                $_.AddressState -eq "Preferred"
            } |
            Select-Object -ExpandProperty IPAddress
    } catch {
        # Fallback for older systems
        $ips = [System.Net.Dns]::GetHostAddresses([System.Net.Dns]::GetHostName()) |
            Where-Object { $_.AddressFamily -eq "InterNetwork" -and $_.IPAddressToString -ne "127.0.0.1" } |
            ForEach-Object { $_.IPAddressToString }
    }
    return $ips
}

function Send-HttpResponse {
    param($Stream, [int]$Status = 200, [string]$StatusText = "OK", [string]$ContentType = "text/plain; charset=utf-8", [byte[]]$Body = $null, [hashtable]$ExtraHeaders = @{})
    if ($null -eq $Body) { $Body = New-Object byte[] 0 }
    $headers = "HTTP/1.1 $Status $StatusText`r`n"
    $headers += "Content-Type: $ContentType`r`n"
    $headers += "Content-Length: $($Body.Length)`r`n"
    $headers += "Connection: close`r`n"
    $headers += "Cache-Control: no-store`r`n"
    $headers += "Access-Control-Allow-Origin: *`r`n"
    foreach ($k in $ExtraHeaders.Keys) {
        $headers += "$k`: $($ExtraHeaders[$k])`r`n"
    }
    $headers += "`r`n"
    $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($headers)
    $Stream.Write($headerBytes, 0, $headerBytes.Length)
    if ($Body.Length -gt 0) {
        $Stream.Write($Body, 0, $Body.Length)
    }
    $Stream.Flush()
}

function Handle-Request {
    param($Client, [string]$RootPath)
    $stream = $Client.GetStream()
    try {
        $stream.ReadTimeout = 5000
        $reader = New-Object System.IO.StreamReader($stream, [System.Text.Encoding]::ASCII, $false, 4096, $true)

        $requestLine = $reader.ReadLine()
        if (-not $requestLine) { return }
        $parts = $requestLine -split " "
        if ($parts.Length -lt 2) { return }
        $method = $parts[0]
        $rawPath = $parts[1]

        # Consume the rest of the headers (we don't need them)
        while ($true) {
            $line = $reader.ReadLine()
            if ($null -eq $line -or $line -eq "") { break }
        }

        if ($method -ne "GET" -and $method -ne "HEAD") {
            Send-HttpResponse -Stream $stream -Status 405 -StatusText "Method Not Allowed"
            return
        }

        # Strip query string
        $path = $rawPath.Split("?")[0]
        $relPath = [System.Uri]::UnescapeDataString($path).TrimStart('/').Replace('/', [System.IO.Path]::DirectorySeparatorChar)
        if ([string]::IsNullOrEmpty($relPath)) { $relPath = "index.html" }

        $full = Join-Path $RootPath $relPath
        $fullResolved = $null
        try { $fullResolved = [System.IO.Path]::GetFullPath($full) } catch { }

        $rootResolved = [System.IO.Path]::GetFullPath($RootPath)
        if (-not $fullResolved -or -not $fullResolved.StartsWith($rootResolved, [System.StringComparison]::OrdinalIgnoreCase)) {
            Send-HttpResponse -Stream $stream -Status 403 -StatusText "Forbidden"
            Write-Host "403 $method $path"
            return
        }

        if ((Test-Path $fullResolved) -and (Get-Item $fullResolved).PSIsContainer) {
            $fullResolved = Join-Path $fullResolved "index.html"
        }

        if (Test-Path $fullResolved -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($fullResolved).ToLower()
            $ct  = $mime[$ext]
            if (-not $ct) { $ct = "application/octet-stream" }
            $bytes = [System.IO.File]::ReadAllBytes($fullResolved)
            if ($method -eq "HEAD") {
                Send-HttpResponse -Stream $stream -Status 200 -StatusText "OK" -ContentType $ct -Body $null -ExtraHeaders @{ "Content-Length-Real" = $bytes.Length }
            } else {
                Send-HttpResponse -Stream $stream -Status 200 -StatusText "OK" -ContentType $ct -Body $bytes
            }
            Write-Host "200 $method $path"
        } else {
            $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $relPath")
            Send-HttpResponse -Stream $stream -Status 404 -StatusText "Not Found" -Body $msg
            Write-Host "404 $method $path"
        }
    } catch {
        Write-Host "error: $_"
        try {
            $msg = [System.Text.Encoding]::UTF8.GetBytes("500 Server Error: $_")
            Send-HttpResponse -Stream $stream -Status 500 -StatusText "Internal Server Error" -Body $msg
        } catch {}
    } finally {
        try { $stream.Close() } catch {}
        try { $Client.Close() } catch {}
    }
}

# Bind to all interfaces (0.0.0.0) — this allows LAN devices to connect.
$listener = New-Object System.Net.Sockets.TcpListener([System.Net.IPAddress]::Any, $Port)
try {
    $listener.Start()
} catch {
    Write-Host "Failed to bind to port $Port : $_"
    exit 1
}

Write-Host ""
Write-Host "GeoGuess Atlas server is running."
Write-Host "Root: $Root"
Write-Host ""
Write-Host "Open on THIS computer:"
Write-Host "  http://localhost:$Port/"
Write-Host ""
Write-Host "Open on another device (same Wi-Fi / LAN):"
foreach ($ip in (Get-LocalIpv4Addresses)) {
    Write-Host "  http://${ip}:$Port/"
}
Write-Host ""
Write-Host "Tip: if a phone says 'site can't be reached', allow this app through"
Write-Host "Windows Firewall (Private networks) when the prompt appears."
Write-Host ""
Write-Host "Press Ctrl+C to stop."
Write-Host ""

try {
    while ($true) {
        $client = $listener.AcceptTcpClient()
        # Synchronous per-request handling — single-user game server, this is fine.
        Handle-Request -Client $client -RootPath $Root
    }
} finally {
    $listener.Stop()
}
