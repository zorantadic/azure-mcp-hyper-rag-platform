# Hyper-RAG Demo - Architecture

## Overview
The system is organized as a visible end-to-end Hyper-RAG flow with separate application services, retrieval stores, processing artifacts, and Azure infrastructure components.

## Main runtime components
- Web UI
- Orchestrator
- Indexing Pipeline
- Retrieval API
- Artifact API
- Microsoft Foundry model
- PostgreSQL Flexible Server with pgvector
- Azure AI Search
- Azure Blob Storage

## Runtime flow
1. The user submits a question through the Web UI.
2. The Orchestrator receives the request.
3. The Orchestrator calls the Retrieval API.
4. The Retrieval API resolves relevant evidence from the retrieval layer.
5. The Orchestrator assembles a grounded context package.
6. The Orchestrator builds the final model request.
7. The model returns the answer.
8. The Web UI shows the answer and supporting trace artifacts.

## Source and indexing flow
1. Business source files are stored in Blob Storage.
2. The Indexing Pipeline reads the source files.
3. The pipeline normalizes source content.
4. The pipeline builds hierarchy and chunks.
5. The pipeline prepares retrieval data.
6. The pipeline writes retrieval data to PostgreSQL and supporting search structures.

## Service boundaries
### Web UI
Responsible for:
- user interaction
- question submission
- answer display
- trace display

### Orchestrator
Responsible for:
- request coordination
- retrieval call orchestration
- grounded context assembly
- model request construction
- response return to UI

### Retrieval API
Responsible for:
- retrieval stage execution
- hierarchical evidence resolution
- evidence ranking and selection

### Artifact API
Responsible for:
- serving runtime artifacts
- serving trace data
- serving prompt and response artifacts for inspection

### Indexing Pipeline
Responsible for:
- source ingestion
- normalization
- hierarchy construction
- chunk generation
- metadata generation
- retrieval load preparation

## Storage components
### Blob Storage
Stores business source files.

### PostgreSQL with pgvector
Stores:
- metadata
- hierarchy relations
- chunk records
- embeddings
- retrieval data

### Azure AI Search
Visible supporting search component in the architecture.

## Design principle
The architecture must make every major logical stage visible through application flow, storage structure, and inspectable artifacts.