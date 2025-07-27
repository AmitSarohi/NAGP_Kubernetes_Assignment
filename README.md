# NAGP_Kubernetes_Assignment
Home Assignment NAGP 2025 Workshop on Kubernetes and DevOps

# Multi-Tier Kubernetes App

This repo includes:
- React frontend served by NGINX
- Node.js backend connecting to PostgreSQL
- PostgreSQL hosted in Kubernetes StatefulSet with persistence
- Dockerfiles, Kubernetes manifests, and docker-compose for local testing

## Setup

### Local (Docker Compose)

```bash
docker-compose up --build

