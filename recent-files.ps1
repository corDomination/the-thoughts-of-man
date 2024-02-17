Get-ChildItem -Path ./data/markdown -Recurse -Filter *.md | Sort-Object LastWriteTime -Descending | Select-Object -First 5 | ForEach-Object { 
    $parentFolder = Split-Path $_.FullName -Parent | Split-Path -Leaf
    $fileName = $_.BaseName
    [PSCustomObject]@{
        "fileName" = $fileName
        "parentFolder" = $parentFolder
    }
} | ConvertTo-Json -Depth 2 | Out-File ./data/recent.json