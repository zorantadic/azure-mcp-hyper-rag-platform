# Run from VS Code PowerShell terminal
# Prerequisites:
# 1) az login
# 2) Correct subscription selected
# 3) Azure CLI installed
# 4) Extensions available:
#    az extension add --name containerapp
#    az extension add --name ml

$ErrorActionPreference = "Stop"

# -----------------------------
# Config
# -----------------------------
$LOCATION = "eastus2"
$RESOURCE_GROUP = "rg-hyperrag-platform"

$STORAGE_ACCOUNT = "sthyperragplat"
$LOG_ANALYTICS = "log-hyperrag-platform"
$CONTAINERAPPS_ENV = "cae-hyperrag-platform"

$FOUNDRY_HUB = "foundry-hyperrag-platform"
$FOUNDRY_PROJECT = "hyperrag-platform-project"

$BLOB_CONTAINERS = @(
    "raw-sources",
    "indexing-artifacts",
    "grounding-artifacts",
    "model-artifacts"
)

Write-Host "== Checking Azure CLI login ==" -ForegroundColor Cyan
az account show 1>$null

Write-Host "== Ensuring required extensions ==" -ForegroundColor Cyan
az extension add --name containerapp --upgrade --only-show-errors
az extension add --name ml --upgrade --only-show-errors

Write-Host "== Registering required providers ==" -ForegroundColor Cyan
az provider register --namespace Microsoft.App --only-show-errors
az provider register --namespace Microsoft.OperationalInsights --only-show-errors
az provider register --namespace Microsoft.Storage --only-show-errors
az provider register --namespace Microsoft.MachineLearningServices --only-show-errors

Write-Host "== Creating resource group ==" -ForegroundColor Cyan
az group create `
  --name $RESOURCE_GROUP `
  --location $LOCATION `
  --output table

Write-Host "== Creating storage account ==" -ForegroundColor Cyan
az storage account create `
  --name $STORAGE_ACCOUNT `
  --resource-group $RESOURCE_GROUP `
  --location $LOCATION `
  --sku Standard_LRS `
  --kind StorageV2 `
  --allow-blob-public-access false `
  --min-tls-version TLS1_2 `
  --output table

Write-Host "== Retrieving storage connection string ==" -ForegroundColor Cyan
$STORAGE_CONNECTION_STRING = az storage account show-connection-string `
  --name $STORAGE_ACCOUNT `
  --resource-group $RESOURCE_GROUP `
  --query connectionString `
  --output tsv

Write-Host "== Creating blob containers ==" -ForegroundColor Cyan
foreach ($container in $BLOB_CONTAINERS) {
    az storage container create `
      --name $container `
      --connection-string $STORAGE_CONNECTION_STRING `
      --output table
}

Write-Host "== Creating Log Analytics workspace ==" -ForegroundColor Cyan
az monitor log-analytics workspace create `
  --resource-group $RESOURCE_GROUP `
  --workspace-name $LOG_ANALYTICS `
  --location $LOCATION `
  --output table

Write-Host "== Creating Container Apps environment ==" -ForegroundColor Cyan
az containerapp env create `
  --name $CONTAINERAPPS_ENV `
  --resource-group $RESOURCE_GROUP `
  --location $LOCATION `
  --logs-workspace-id $(az monitor log-analytics workspace show --resource-group $RESOURCE_GROUP --workspace-name $LOG_ANALYTICS --query customerId -o tsv) `
  --logs-workspace-key $(az monitor log-analytics workspace get-shared-keys --resource-group $RESOURCE_GROUP --workspace-name $LOG_ANALYTICS --query primarySharedKey -o tsv) `
  --output table

Write-Host "== Creating Foundry hub ==" -ForegroundColor Cyan
az ml workspace create `
  --resource-group $RESOURCE_GROUP `
  --location $LOCATION `
  --name $FOUNDRY_HUB `
  --kind hub `
  --output table

Write-Host "== Getting Foundry hub resource ID ==" -ForegroundColor Cyan
$HUB_ID = az ml workspace show `
  --resource-group $RESOURCE_GROUP `
  --name $FOUNDRY_HUB `
  --query id `
  --output tsv

Write-Host "== Creating Foundry project ==" -ForegroundColor Cyan
az ml workspace create `
  --resource-group $RESOURCE_GROUP `
  --location $LOCATION `
  --name $FOUNDRY_PROJECT `
  --kind project `
  --hub-id $HUB_ID `
  --output table

Write-Host ""
Write-Host "== Done ==" -ForegroundColor Green
Write-Host "Resource Group:      $RESOURCE_GROUP"
Write-Host "Storage Account:     $STORAGE_ACCOUNT"
Write-Host "Log Analytics:       $LOG_ANALYTICS"
Write-Host "Container Apps Env:  $CONTAINERAPPS_ENV"
Write-Host "Foundry Hub:         $FOUNDRY_HUB"
Write-Host "Foundry Project:     $FOUNDRY_PROJECT"
Write-Host ""
Write-Host "Next step: create model deployment and Foundry agent." -ForegroundColor Yellow