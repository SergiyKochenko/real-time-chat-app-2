# DevOps Implementation Strategy

> Module: DevOps Pipelines (CA1) — Project: Real-Time Chat App — Platform: GitHub / GitHub Actions

## 1. Context & Scope
- Team: multi-person (backend, frontend, infra, QA).
- Services: Node.js backend (Express + Socket.io), React frontend (Vite), MongoDB.
- Hosting target (recommended): container-based deployment to a managed platform (e.g., Azure Web App for Containers or Kubernetes). Pipelines are GitHub Actions-based.
- Source of truth: `main` branch; infrastructure, app code, and runbooks live in this repo.

## 2. Vision, Values, Goals (SMART, DORA-aligned)
- **Vision**: Deliver chat features quickly with high reliability and strong feedback loops.
- **Values**: automation-first; quality-as-code; security-by-default; transparency; small, reversible changes.
- **Goals (12-month)**
  - Deployment frequency: ≥3 deploys/day to production from `main`.
  - Lead time for change: <1 hour from merge to prod for standard changes.
  - Change failure rate: ≤10% (tracked via incident tags on deploys).
  - MTTR: <30 minutes for Sev0/Sev1.
  - Availability SLO: 99.9% monthly; error budget ≤4 hours; P0 budget ≤2 hours/month.
  - CI health: ≥95% success; median pipeline ≤8 minutes; flaky test rate <1% of runs.

## 3. Frameworks & Metrics
- **CAMS mapping**
  - Culture: blameless postmortems; pair reviews; weekly pipeline demos; documented runbooks.
  - Automation: IaC, GitHub Actions workflows, policy-as-code (branch protections), repeatable test data.
  - Measurement: DORA, SLO/error-budget burn, CI duration, coverage (when added), flaky-test tracker, SPACE satisfaction pulse each sprint.
  - Sharing: ADRs, review checklists, incident write-ups, reusable workflow actions.
- **Metrics collection**
  - DORA: events from GitHub Actions + releases; failure rate via incident labels on deploys.
  - SRE: 99.9% SLO; burn alerts when ≥25% of budget consumed; MTTR from incident timeline.
  - CI: median/95th percentile duration; cache hit rate; queue time.

## 4. Branching Strategy & Integration Controls
- **Model**: Trunk-based.
  - `main`: protected, always releasable.
  - `release/vX.Y`: cut for stabilization; hotfixes merge to tag + back to `main`.
  - Short-lived branches: `feat/*`, `fix/*`, `chore/*`, `docs/*`; lifespan ≤48h.
  - `hotfix/*`: from latest prod tag; fast path with post-merge retro.
- **Controls (GitHub)**
  - Branch protections on `main` and `release/*`: require status checks (CI), signed commits optional, linear history, no force-push.
  - Reviews: ≥1 reviewer; ≥2 for risky areas (auth, socket, db schema). Use CODEOWNERS to auto-assign.
  - Checks: frontend lint/build, backend install/build, security scan (template), SBOM + image scan (when containerized), secret scanning enabled.
  - PR hygiene: max ~300 LOC; include test evidence; link issue; draft PRs allowed for early feedback.
  - Commit style: Conventional Commits to enable automated changelog/versioning.
- **Text diagram**: `feat/* -> PR -> main -> tag (vX.Y.Z) -> release/vX.Y if needed -> deploy dev/stage/prod`

## 5. CI Plan (GitHub Actions)
- **Triggers**: PRs to `main`; push to `main`; manual `workflow_dispatch`.
- **Runners**: `ubuntu-latest` hosted; self-hosted optional for heavy caching.
- **Secrets**: GitHub Environments per stage; prefer OIDC to cloud; never store secrets in repo.
- **Caching**: `actions/setup-node` npm cache for root and frontend lockfiles; Docker layer cache when container builds are added.
- **Job graph (ci.yml)**
  - Checkout → Node 20 → cache → `npm ci` (root) → `npm ci --prefix frontend` → `npm run lint --prefix frontend` → `npm run build --prefix frontend`.
  - Hook for backend tests when added (e.g., Vitest/Jest + Supertest).
  - Artifacts: optional upload of `frontend/dist` (not enabled by default in CI to save time).
- **Quality gates**: CI required on PR; failing checks block merge. Secret scanning and Dependabot enabled via repo settings (manual enable by owner).
- **Performance target**: <8 minutes median; cancel in-progress on new commits per branch (concurrency control).

## 6. CD & Environment Strategy
- **Environments**: `dev` (auto deploy), `staging` (approval + smoke), `prod` (approval + change record). Secrets scoped per environment.
- **Immutable artifacts**: Build once on `main` (publish Docker images or tarballs) and promote by digest/tag.
- **Deployment patterns**: Prefer blue-green or canary for web apps; feature flags for risky changes; database migrations in expand/contract phases.
- **Approvals & audit**: GitHub Environment approvals; production requires two approvers not the author.
- **Post-deploy**: Smoke tests (HTTP 200, socket handshake); synthetic checks; auto-rollback to prior digest on failure signal; record deployment in releases.
- **Release workflow (template)**: Tag `vX.Y.Z` → generate changelog from Conventional Commits → build artifacts → attach to GitHub Release → (optionally) push images to registry.

## 7. Software Release Strategy
- **Versioning**: Semantic Versioning; `vX.Y.Z` tags; pre-releases `vX.Y.Z-rc.N` on release branches.
- **Cadence**: Weekly scheduled release; hotfix anytime with post-incident review.
- **Change control**: Small batches (<1 day of work) to reduce blast radius; feature flags for long-running features.
- **Rollback**: Revert to previous image digest/tag; keep N-2 releases available. DB migrations reversible or split into expand/contract.
- **Documentation**: Release notes auto-generated; include deployment outcomes and incidents.

## 8. Toolchain Choices (justification summary)
- **SCM/Reviews**: GitHub, protected branches, CODEOWNERS, required reviewers.
- **CI/CD**: GitHub Actions (native, marketplace ecosystem, environments/approvals).
- **Build**: Node 20 LTS; pnpm optional later; Vite for frontend; Docker/OCI with BuildKit for deployable artifacts.
- **Testing**: Frontend lint + future unit/e2e (Vitest/Testing Library or Playwright); Backend unit/integration (Jest/Vitest + Supertest); load testing (k6/Artillery) pre-prod.
- **Security**: Dependabot updates; npm audit or Snyk SCA; Semgrep SAST; Gitleaks secret scan; Trivy image scan; SBOM via Syft.
- **Observability**: OpenTelemetry; central logs/metrics/traces (e.g., Azure Monitor/App Insights); synthetic checks; alert routing to Slack/Teams.
- **Infra/IaC**: Terraform/Bicep for cloud infra; kustomize/Helm for K8s overlays; environment config via variables/secrets.

## 9. Roles & Responsibilities (RACI outline)
- Devs: author code, add tests, create PRs, own feature flags, join incident retros.
- Tech Lead: approves risky changes, curates CODEOWNERS, owns architecture decisions.
- DevOps/Infra: maintains Actions workflows, secrets, environments, and IaC.
- QA/Peer Reviewer: enforces review checklist, verifies test evidence, monitors flaky tests.

## 10. Risks & Mitigations
- Flaky tests → track & quarantine; retry max 1; create tickets.
- Secrets leakage → enforce secret scanning; OIDC; no secrets in Actions logs.
- Long pipelines → cache tuning; parallelism; split jobs.
- Vendor lock-in → IaC kept in repo; avoid proprietary steps where possible.
- DB migrations risk → expand/contract with backward compatibility; run in staging first.

## 11. Implementation Roadmap (near-term)
1) Enable branch protections and CODEOWNERS.
2) Land CI workflow (`.github/workflows/ci.yml`).
3) Add release/build workflow (`.github/workflows/release.yml`) for tagged builds.
4) Define environments (dev/staging/prod) and store secrets.
5) Add security scans (Dependabot, Gitleaks, Semgrep) and SBOM/image scan when Dockerfiles are added.
6) Add automated changelog + semantic versioning; generate releases.
7) Add test suites (backend + frontend unit/e2e); wire into CI gates.
8) Document runbooks (deploy, rollback, incident response) and update this strategy quarterly.

## 12. Review Checklist (summary)
- Tests added/updated; evidence in PR.
- Security: secrets not logged; dependencies reviewed; auth/session impacts considered.
- Observability: logs/metrics/traces added for new flows.
- Rollback: migrations safe to roll back; feature flags available.
- Docs: README or runbooks updated if behavior changes.

---
This strategy is tailored to GitHub Actions and the current Node/React/Mongo stack and can be evolved as the system grows.
