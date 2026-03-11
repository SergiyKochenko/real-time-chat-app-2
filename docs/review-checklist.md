# Pull Request Review Checklist

Use this lightweight checklist on every PR. Mark items as N/A if not relevant.

- Scope is small (aim ≤300 LOC) and focused; linked issue is present.
- Tests: unit/integration/e2e updated or added; local results noted in PR.
- Security: secrets not introduced; auth/session/permissions reviewed; dependencies justified.
- Quality: lint passes; logs are structured and non-sensitive; feature flags used for risky changes.
- Observability: metrics/logs/traces cover new paths; errors are actionable.
- Ops: migrations are backward-compatible or feature-flagged; rollback plan stated; docs/runbooks updated.
