# Stops whatever is listening on 5000 (API) and 3000 (Next.js).
# Run: .\kill-dev-ports.ps1   or   kill-dev-ports.bat   or   npm run kill-ports

$ports = 5000, 3000
foreach ($port in $ports) {
  $conns = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
  if (-not $conns) { continue }
  foreach ($c in $conns) {
    $procId = $c.OwningProcess
    Write-Host "Port $port : stopping PID $procId"
    Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
  }
}
Write-Host ""
Write-Host "Done. Start again:  backend: npm start   |   frontend: npm run dev"
