# Open TBDs (Non-Tokenomics)

Scope: product and tech constraints from documents/Heyoo + Lighter product description.txt and tech-rules. Tokenomics intentionally excluded.

## Holder, history, and reputation knobs
- Hold time threshold: minimum time a holder must retain a lighter for value to count (TBD minutes/hours).
- Interaction threshold: minimum in-app interactions during hold window (TBD count and types).
- GPS plausibility: rules for distance/time checks, accuracy floor, spoof detection signals, and rejection criteria (all TBD).
- Rate limits: per-user and per-device caps for scans/check-ins (TBD values and cooldowns).
- Spam/content filters: rules for Q&A inputs, length limits, forbidden content, and throttling (TBD).
- Flip friction: whether to enforce cooldowns or delays on rapid re-scans/transfers (TBD on/off and duration).
- Reputation weighting: how to score knowledge quality, holding behavior, engagement, and circulation without tokenomics (weights TBD).

## History UX/behavior
- "See all history" presentation: list vs. timeline vs. tree; pagination/virtualization strategy (TBD choice).
- Default depth beyond last-3: page size, load-more vs. infinite scroll (TBD).
- Validation flags surface: how to expose plausibility/validity states in UI (icons vs. text, TBD).

## Map and geo
- H3-only is decided; need exact parameters: r12 daily unlock count increase criteria (when to allow 2/day) and any cooldowns (TBD).
- Special hex behavior: eligibility rules for Explorer/partner drops and how invites are triggered (TBD).

## Identity and sessions
- Anonymous onboarding is required; need session persistence strategy (storage choice, TTL, renewal rules, TBD).
- Optional TON wallet linking: when to prompt, what features require it, and failure handling (TBD).

## QR and camera UX
- Web QR library chosen: qr-scanner. TBD: exact lazy-load pattern, worker usage, and fallback flow for low-perf/denied camera (upload-to-scan? text entry?).

## Performance and budgets
- TMA bundle budget target < 650 KB is set; need per-surface budgets (web/TMA/native) and code-splitting standards (TBD numbers and gates).

## Anti-abuse operations
- Metrics to log for audits: GPS validity signals, failed scans, spam flags (TBD list and retention).
- Manual review hooks: whether to include a “report lighter/answer” flow and where it routes (TBD).

## Documentation and decision tracking
- Source of truth for finalized thresholds and UX choices: choose location (this doc vs. separate spec) and update protocol (TBD).
