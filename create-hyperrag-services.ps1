# Run from VS Code PowerShell terminal
# Prerequisites:
# 1) az login
# 2) Correct subscription selected
# 3) First foundation script already completed
# 4) Azure CLI containerapp extension installed

$ErrorActionPreference = "Stop"

# -----------------------------
# Config
# -----------------------------
$LOCATION = "eastus2"
$RESOURCE_GROUP = "rg-hyperrag-platform"

$CONTAINERAPPS_ENV = "cae-hyperrag-platform"

$AI_SEARCH = "srch-hyperrag-platform"
$POSTGRES_SERVER = "psql-hyperrag-platform"

$POSTGRES_ADMIN_USER = "pgadminhyperrag"
$POSTGRES_ADMIN_PASSWORD = "ChangeThis-Strong-Passw0rd!"

$ORCHESTRATOR_APP = "ca-hyperrag-orchestrator"
$RETRIEVAL_APP = "ca-hyperrag-retrieval"
$INDEXING_APP = "ca-hyperrag-indexing"

# Placeholder images for now.
# Replace later with your real container images in ACR or another registry.
$ORCHESTRATOR_IMAGE = "mcr.microsoft.com/azuredocs/containerapps-helloworld:latest"
$RETRIEVAL_IMAGE = "mcr.microsoft.com/azuredocs/containerapps-helloworld:latest"
$INDEXING_IMAGE = "mcr.microsoft.com/azuredocs/containerapps-helloworld:latest"

Write-Host "== Checking Azure CLI login ==" -ForegroundColor Cyan
az account show 1>$null

Write-Host "== Ensuring required extensions ==" -ForegroundColor Cyan
az extension add --name containerapp --upgrade --only-show-errors

Write-Host "== Registering required providers ==" -ForegroundColor Cyan
az provider register --namespace Microsoft.App --only-show-errors
az provider register --namespace Microsoft.Search --only-show-errors
az provider register --namespace Microsoft.DBforPostgreSQL --only-show-errors

Write-Host "== Creating Azure AI Search ==" -ForegroundColor Cyan
az search service create `
  --name $AI_SEARCH `
  --resource-group $RESOURCE_GROUP `
  --location $LOCATION `
  --sku basic `
  --output table

Write-Host "== Creating PostgreSQL Flexible Server ==" -ForegroundColor Cyan
az postgres flexible-server create `
  --resource-group $RESOURCE_GROUP `
  --name $POSTGRES_SERVER `
  --location $LOCATION `
  --admin-user $POSTGRES_ADMIN_USER `
  --admin-password $POSTGRES_ADMIN_PASSWORD `
  --sku-name Standard_B1ms `
  --tier Burstable `
  --storage-size 32 `
  --version 16 `
  --public-access 0.0.0.0 `
  --yes `
  --output table

Write-Host "== Creating orchestrator Container App ==" -ForegroundColor Cyan
az containerapp create `
  --name $ORCHESTRATOR_APP `
  --resource-group $RESOURCE_GROUP `
  --environment $CONTAINERAPPS_ENV `
  --image $ORCHESTRATOR_IMAGE `
  --target-port 4000 `
  --ingress external `
  --min-replicas 1 `
  --max-replicas 1 `
  --env-vars `
    RETRIEVAL_API_BASE_URL=http://$RETRIEVAL_APP `
    INDEXING_PIPELINE_BASE_URL=http://$INDEXING_APP `
  --query properties.configuration.ingress.fqdn `
  --output tsv

Write-Host "== Creating retrieval-api Container App ==" -ForegroundColor Cyan
az containerapp create `
  --name $RETRIEVAL_APP `
  --resource-group $RESOURCE_GROUP `
  --environment $CONTAINERAPPS_ENV `
  --image $RETRIEVAL_IMAGE `
  --target-port 4100 `
  --ingress internal `
  --min-replicas 1 `
  --max-replicas 1 `
  --query properties.configuration.ingress.fqdn `
  --output tsv

Write-Host "== Creating indexing-pipeline Container App ==" -ForegroundColor Cyan
az containerapp create `
  --name $INDEXING_APP `
  --resource-group $RESOURCE_GROUP `
  --environment $CONTAINERAPPS_ENV `
  --image $INDEXING_IMAGE `
  --target-port 4300 `
  --ingress internal `
  --min-replicas 1 `
  --max-replicas 1 `
  --query properties.configuration.ingress.fqdn `
  --output tsv

Write-Host ""
Write-Host "== Done ==" -ForegroundColor Green
Write-Host "AI Search:           $AI_SEARCH"
Write-Host "PostgreSQL Server:   $POSTGRES_SERVER"
Write-Host "Container App:       $ORCHESTRATOR_APP"
Write-Host "Container App:       $RETRIEVAL_APP"
Write-Host "Container App:       $INDEXING_APP"
Write-Host ""
Write-Host "Note: Container Apps are created with placeholder images for now." -ForegroundColor Yellow
Write-Host "Next step: replace images with real service containers, then create Foundry model deployment and agent." -ForegroundColor Yellow