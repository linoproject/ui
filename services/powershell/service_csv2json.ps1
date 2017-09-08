param
(
    [string] $inputFile,
    [string] $outputFile
)

$inputFile = $inputFile -replace '(.+?)rnd.+','$1' -replace "\?",""

if (($inputFile -eq $null) -or ($outputFile -eq $null)) {
    "usage: convert_csv_to_json.ps1 [inputFile] [outputFile]"
    return;
}
elseif ((Test-Path $PSScriptRoot/$inputFile) -eq $false) {
    "The file $PSScriptRoot/$inputFile doesnt exists!"
    return;
}
 
Get-Content -path $PSScriptRoot/$inputFile | ConvertFrom-Csv -Delimiter ';' | ConvertTo-Json



#services/powershell/service_csv2json -inputFile application\data\data-20170906.csv