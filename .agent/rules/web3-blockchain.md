---
trigger: always_on
---

# Web3 & Blockchain Rules (Heyoo)

> Pre-action protocol: See CLAUDE.md §2.

## TON Ecosystem — Exclusivity
- **TON Connect only.** Do not implement WalletConnect, MetaMask, or any non-TON wallet integration inside any Heyoo surface.
- Use `@tonconnect/ui-react` for React integration. Use `@tonconnect/sdk` for lower-level operations.
- TON Connect manifest (`tonconnect-manifest.json`) must be hosted at the app's public root and referenced in SDK initialization.

## Onboarding — No Wallet Gate
- **Anonymous onboarding first.** Users must be able to explore the app, view the map, and interact with basic features without connecting a wallet.
- Wallet connection is prompted only when a blockchain action is needed (token claim, burn, transfer).
- Never block the first-run experience on wallet state.

## Wallet Connection Lifecycle

```
connect → verify address → persist session → use for transactions
                                              ↓ (on disconnect/reject)
                                    clear session → degrade gracefully
```

- **Connect:** Use `useTonConnectUI()` hook. Show connection modal with supported wallets.
- **Session persistence:** TON Connect SDK handles session storage. Don't build custom persistence.
- **Disconnect:** Clean up app-side state. Never assume wallet is still connected — check before every transaction.
- **Reconnection:** On app mount, attempt to restore the existing session. If it fails, show the app in anonymous mode without errors.

## Transaction Error Handling

Every transaction must handle these states:

| State | UX Response |
|-------|-------------|
| User rejects in wallet | Show inline message: "Transaction cancelled." Return to previous state. |
| Insufficient balance | Show balance requirement. Link to where user can acquire tokens. |
| Network timeout | Retry with exponential backoff (max 3 attempts). Show "Network issue — retrying…" |
| Transaction fails on-chain | Show error with transaction hash for debugging. Allow manual retry. |
| Wallet disconnected mid-flow | Prompt reconnection. Do not lose the user's intent — preserve the pending action. |

- **Never crash on transaction failure.** Always degrade to a recoverable state.
- Show inline status indicators, not blocking modals, for transaction progress.

## $LIGHTER Token Flow
- **Burns are user-initiated only.** Spending $LIGHTER for premium roles, cosmetics, or unlocks requires explicit user confirmation.
- **Never programmatically burn tokens** without user action.
- **Partial state resilience:** If a burn succeeds on-chain but the app fails to record it, design for reconciliation — the backend must be able to verify on-chain state as source of truth.

## Security
- **Never hold or handle private keys.** All signing happens in the user's wallet via TON Connect.
- **Validate all transaction parameters server-side** before presenting them to the wallet for signing.
- **Never log wallet addresses alongside PII.**

## Testnet vs Mainnet
- Use environment variables to switch between testnet and mainnet (`VITE_TON_NETWORK=testnet|mainnet`).
- Default to testnet in development. Mainnet only in production builds.
- Ensure all token contracts and addresses are network-specific — never hardcode mainnet addresses.

## Cross-references
- State: `state-management.md` (wallet state in Zustand)
- Security: `security.md`
- Environment: `environment-config.md`