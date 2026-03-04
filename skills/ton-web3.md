# TON Web3 & Blockchain Integration

## TON Connect
- **Mandatory for TMA:** Telegram requires all Mini Apps with blockchain functionalities to use TON Connect exclusively.
- Use `@tonconnect/ui-react` v2.3.1+. It is robust and provides a drop-in `<TonConnectButton />` which functions on both Web and TMA.

## Configuration constraints
- Ensure the `tonconnect-manifest.json` file is publicly accessible, without CORS restrictions or CloudFlare proxy blocks.
- Perform all token burn interactions explicitly via user-driven wallet transactions; never handle user funds on the core server autonomously without signed confirmations.