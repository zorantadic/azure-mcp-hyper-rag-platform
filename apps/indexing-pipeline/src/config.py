from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[3]

RAW_ROOT = PROJECT_ROOT / "data" / "raw"
ARTIFACTS_ROOT = PROJECT_ROOT / "artifacts" / "indexing"

SOURCE_MANIFEST_DIR = ARTIFACTS_ROOT / "source-manifest"
NORMALIZED_DOCUMENTS_DIR = ARTIFACTS_ROOT / "normalized-documents"
HIERARCHY_MAPS_DIR = ARTIFACTS_ROOT / "hierarchy-maps"
CHUNK_MAPS_DIR = ARTIFACTS_ROOT / "chunk-maps"

WORKFLOW_DEFINITIONS = {
    "analysis-request": {
        "workspace": "Placeholder workspace",
        "theme": "Analytical review",
        "sources": [
            {
                "file_name": "analysis-brief.md",
                "source_path": "data/raw/placeholders/analysis-brief.md",
                "source_type": "analysis-brief",
                "document_id": "doc-analysis-001",
                "title": "Analysis brief placeholder",
                "level": "brief",
                "chunk_id": "chunk-analysis-001",
                "topic": "analysis-request",
            }
        ],
    },
    "operational-issue": {
        "workspace": "Placeholder workspace",
        "theme": "Operational issue review",
        "sources": [
            {
                "file_name": "incident-summary.md",
                "source_path": "data/raw/placeholders/incident-summary.md",
                "source_type": "incident-summary",
                "document_id": "doc-incident-001",
                "title": "Operational issue placeholder",
                "level": "incident-summary",
                "chunk_id": "chunk-incident-001",
                "topic": "operational-issue",
            }
        ],
    },
    "workflow-update": {
        "workspace": "Placeholder workspace",
        "theme": "Workflow update review",
        "sources": [
            {
                "file_name": "workflow-update.md",
                "source_path": "data/raw/placeholders/workflow-update.md",
                "source_type": "workflow-note",
                "document_id": "doc-workflow-001",
                "title": "Workflow update placeholder",
                "level": "workflow-note",
                "chunk_id": "chunk-workflow-001",
                "topic": "workflow-update",
            }
        ],
    },
}


SCENARIO_DEFINITIONS = WORKFLOW_DEFINITIONS
