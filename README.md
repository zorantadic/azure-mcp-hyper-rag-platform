# Azure MCP + Hyper-RAG Platform

## Project Overview
This repository presents a modular Azure-based platform for grounded retrieval, orchestration, and controlled tool execution. It is structured to show how hierarchical retrieval, evidence packaging, workflow routing, and model interaction can be composed into a production-style architecture without exposing private business data.

## What This Project Demonstrates
- Hierarchical retrieval and grounded context assembly
- Multi-service orchestration across retrieval, artifacts, audit, approval, and tool execution layers
- Separation of operational source preparation, indexing, retrieval, and answer generation
- Azure-oriented platform design using storage, search, PostgreSQL with pgvector, and model endpoints
- A web experience that surfaces evidence, prompts, responses, and trace visibility

## Architecture
Core components included in this repository:
- Web UI
- Orchestrator
- Retrieval API
- Artifact API
- Audit API
- Approval API
- Tool Execution API
- MCP Server
- Indexing Pipeline
- Azure Blob Storage integration points
- Azure Database for PostgreSQL Flexible Server with pgvector
- Azure AI Search definitions
- Model endpoint integration points

## Repository Structure
- `apps/` application services and UI
- `artifacts/` placeholder output structure for traces and generated artifacts
- `data/` neutral source and sample structure
- `db/` schema, views, queries, and initialization assets
- `docs/` architecture and runtime reference materials
- `infra/` Bicep, parameters, and deployment scripts
- `scenarios/` workflow templates and placeholder request structures
- `search/` Azure AI Search indexes, indexers, skillsets, and queries
- `tests/` service-level test scaffolding

## Azure Services Used
- Azure Blob Storage
- Azure Container Apps
- Azure AI Search
- Azure Database for PostgreSQL Flexible Server
- Azure AI / model endpoint integration
- Log Analytics and supporting platform resources

## How to Run
1. Copy `.env.example` to environment-specific `.env` files where needed.
2. Provide private environment values for storage, database, search, and model endpoints.
3. Start services individually from the relevant `apps/` folders or use the included `docker-compose.yml` as a starting point.
4. Replace placeholder workflow data with private source mappings and operational content in your private environment.

## Current Status
This repository is prepared for public sharing. The architecture, service boundaries, API shape, and platform flow are preserved. Private business content, environment-specific secrets, and scenario-specific operational payloads have been replaced with neutral placeholders.

## Notes
- This repository is best treated as an architecture and implementation reference.
- Before using it as a runnable internal solution, reintroduce private data mappings, environment settings, and workflow-specific logic in a private workspace.
