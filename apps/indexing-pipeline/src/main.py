import json
from pathlib import Path

from fastapi import FastAPI
from fastapi.responses import JSONResponse

from src.config import (
    ARTIFACTS_ROOT,
    CHUNK_MAPS_DIR,
    HIERARCHY_MAPS_DIR,
    NORMALIZED_DOCUMENTS_DIR,
    PROJECT_ROOT,
    SCENARIO_DEFINITIONS,
    SOURCE_MANIFEST_DIR,
)

EMBEDDINGS_DIR = ARTIFACTS_ROOT / "embeddings"
DB_LOAD_MANIFESTS_DIR = ARTIFACTS_ROOT / "db-load-manifests"
SEARCH_LOAD_MANIFESTS_DIR = ARTIFACTS_ROOT / "search-load-manifests"

app = FastAPI(title="indexing-pipeline", version="0.1.0")


def ensure_output_directories() -> None:
    SOURCE_MANIFEST_DIR.mkdir(parents=True, exist_ok=True)
    NORMALIZED_DOCUMENTS_DIR.mkdir(parents=True, exist_ok=True)
    HIERARCHY_MAPS_DIR.mkdir(parents=True, exist_ok=True)
    CHUNK_MAPS_DIR.mkdir(parents=True, exist_ok=True)
    EMBEDDINGS_DIR.mkdir(parents=True, exist_ok=True)
    DB_LOAD_MANIFESTS_DIR.mkdir(parents=True, exist_ok=True)
    SEARCH_LOAD_MANIFESTS_DIR.mkdir(parents=True, exist_ok=True)


def write_json_file(file_path: Path, payload: dict) -> None:
    file_path.parent.mkdir(parents=True, exist_ok=True)
    file_path.write_text(json.dumps(payload, indent=2), encoding="utf-8")


def build_source_manifest(scenario_name: str, scenario_definition: dict) -> dict:
    return {
        "scenario": scenario_name,
        "sources": [
            {
                "fileName": source["file_name"],
                "sourcePath": source["source_path"],
                "sourceType": source["source_type"],
            }
            for source in scenario_definition["sources"]
        ],
    }


def build_normalized_documents(scenario_name: str, scenario_definition: dict) -> dict:
    return {
        "scenario": scenario_name,
        "documents": [
            {
                "documentId": source["document_id"],
                "fileName": source["file_name"],
                "title": source["title"],
                "account": scenario_definition["account"],
                "normalized": True,
            }
            for source in scenario_definition["sources"]
        ],
    }


def build_hierarchy_map(scenario_name: str, scenario_definition: dict) -> dict:
    return {
        "scenario": scenario_name,
        "hierarchy": {
            "account": scenario_definition["account"],
            "theme": scenario_definition["theme"],
            "documents": [
                {
                    "documentId": source["document_id"],
                    "fileName": source["file_name"],
                    "level": source["level"],
                }
                for source in scenario_definition["sources"]
            ],
        },
    }


def build_chunk_map(scenario_name: str, scenario_definition: dict) -> dict:
    return {
        "scenario": scenario_name,
        "chunks": [
            {
                "chunkId": source["chunk_id"],
                "documentId": source["document_id"],
                "fileName": source["file_name"],
                "topic": source["topic"],
            }
            for source in scenario_definition["sources"]
        ],
    }


def build_embeddings_manifest(scenario_name: str, scenario_definition: dict) -> dict:
    return {
        "scenario": scenario_name,
        "embeddingModel": "text-embedding-3-large",
        "vectors": [
            {
                "chunkId": source["chunk_id"],
                "vectorStatus": "generated",
            }
            for source in scenario_definition["sources"]
        ],
    }


def build_db_load_manifest(scenario_name: str, scenario_definition: dict) -> dict:
    document_objects = [
        {
            "type": "document",
            "id": source["document_id"],
        }
        for source in scenario_definition["sources"]
    ]

    chunk_objects = [
        {
            "type": "chunk",
            "id": source["chunk_id"],
        }
        for source in scenario_definition["sources"]
    ]

    return {
        "scenario": scenario_name,
        "targetStore": "postgresql-pgvector",
        "objects": document_objects + chunk_objects,
    }


def build_search_load_manifest(scenario_name: str, scenario_definition: dict) -> dict:
    return {
        "scenario": scenario_name,
        "targetStore": "azure-ai-search",
        "objects": [
            {
                "type": "document",
                "id": source["document_id"],
            }
            for source in scenario_definition["sources"]
        ],
    }


def validate_source_files(scenario_name: str, scenario_definition: dict) -> None:
    missing_files = []

    for source in scenario_definition["sources"]:
        absolute_path = PROJECT_ROOT / source["source_path"]
        if not absolute_path.exists():
            missing_files.append(source["source_path"])

    if missing_files:
        joined = ", ".join(missing_files)
        raise FileNotFoundError(
            f"Missing raw source files for scenario '{scenario_name}': {joined}"
        )


def generate_indexing_artifacts() -> list[dict]:
    ensure_output_directories()

    generated = []

    for scenario_name, scenario_definition in SCENARIO_DEFINITIONS.items():
        validate_source_files(scenario_name, scenario_definition)

        source_manifest = build_source_manifest(scenario_name, scenario_definition)
        normalized_documents = build_normalized_documents(
            scenario_name, scenario_definition
        )
        hierarchy_map = build_hierarchy_map(scenario_name, scenario_definition)
        chunk_map = build_chunk_map(scenario_name, scenario_definition)
        embeddings_manifest = build_embeddings_manifest(
            scenario_name, scenario_definition
        )
        db_load_manifest = build_db_load_manifest(scenario_name, scenario_definition)
        search_load_manifest = build_search_load_manifest(
            scenario_name, scenario_definition
        )

        write_json_file(
            SOURCE_MANIFEST_DIR / f"{scenario_name}.json",
            source_manifest,
        )
        write_json_file(
            NORMALIZED_DOCUMENTS_DIR / f"{scenario_name}.json",
            normalized_documents,
        )
        write_json_file(
            HIERARCHY_MAPS_DIR / f"{scenario_name}.json",
            hierarchy_map,
        )
        write_json_file(
            CHUNK_MAPS_DIR / f"{scenario_name}.json",
            chunk_map,
        )
        write_json_file(
            EMBEDDINGS_DIR / f"{scenario_name}.json",
            embeddings_manifest,
        )
        write_json_file(
            DB_LOAD_MANIFESTS_DIR / f"{scenario_name}.json",
            db_load_manifest,
        )
        write_json_file(
            SEARCH_LOAD_MANIFESTS_DIR / f"{scenario_name}.json",
            search_load_manifest,
        )

        generated.append(
            {
                "scenario": scenario_name,
                "status": "generated",
            }
        )

        print(f"[OK] generated indexing artifacts for {scenario_name}")

    return generated


@app.get("/health")
def health() -> dict:
    return {
        "status": "ok",
        "service": "indexing-pipeline",
    }


@app.post("/run")
def run_pipeline() -> JSONResponse:
    try:
        generated = generate_indexing_artifacts()
        return JSONResponse(
            {
                "status": "ok",
                "generated": generated,
            }
        )
    except Exception as error:
        return JSONResponse(
            status_code=500,
            content={
                "status": "error",
                "message": str(error),
            },
        )


if __name__ == "__main__":
    generate_indexing_artifacts()