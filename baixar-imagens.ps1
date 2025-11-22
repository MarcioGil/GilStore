
# Baixa todas as imagens referenciadas em db3.json para public/assets
$dbPath = "c:\Quikk1\db3.json"
$assetsPath = "c:\Quikk1\public\assets"

# Lê o db3.json
$json = Get-Content $dbPath -Raw | ConvertFrom-Json

# Garante que a pasta existe
if (-not (Test-Path $assetsPath)) {
    New-Item -ItemType Directory -Path $assetsPath | Out-Null
}

# Baixa cada imagem usando o nome do arquivo da Fake Store API
foreach ($product in $json.products) {
    $fileName = $product.image.Split('/')[-1]
    $url = "https://fakestoreapi.com/img/$fileName"
    $dest = Join-Path $assetsPath $fileName
    if (-not (Test-Path $dest)) {
        try {
            Invoke-WebRequest -Uri $url -OutFile $dest -ErrorAction Stop
            Write-Host "Baixou: $fileName"
        } catch {
            Write-Host "Erro ao baixar $fileName"
        }
    } else {
        Write-Host "Já existe: $fileName"
    }
}

Write-Host "Download das imagens concluído!"
