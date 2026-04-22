# Canonical State

This package preserves the Hyper-RAG platform structure while removing private operational payloads and business sample content.

## Scope retained
- service boundaries
- retrieval, grounding, and orchestration flow
- infrastructure structure
- workflow templates and trace contracts

## Scope removed
- private business scenarios
- sample seed data with business context
- trace payloads tied to specific stories or accounts
- customer-identifying sample content

## Usage guidance
Use this package as a public architecture reference and implementation baseline. Add private source mappings, operational workflows, and environment-specific artifacts only in a private workspace.
