$f = 'c:\Yogesh Universe\TOFFEETOWNS_FUN\src\components\TownTalkModal.tsx'
$tmp = 'c:\Yogesh Universe\TOFFEETOWNS_FUN\scratch\TownTalkModal_tmp.tsx'
$lines = Get-Content $f
$lines | Select-Object -First 1732 | Out-File -FilePath $tmp -Encoding UTF8
Copy-Item $tmp $f -Force
Remove-Item $tmp
Write-Host "Done. Lines now: $((Get-Content $f).Count)"
