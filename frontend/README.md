# Shadow DAO: frontend

The web app for [Shadow DAO](https://github.com/0xWick/Shadow-DAO), a private DAO where membership is proven with zero-knowledge proofs through Polygon ID.

**Live app:** [polygon-id-frontend.vercel.app](https://polygon-id-frontend.vercel.app/) · **Contracts:** [Shadow-DAO](https://github.com/0xWick/Shadow-DAO)

![Shadow DAO](https://user-images.githubusercontent.com/69587947/227940083-1cd18d70-9d7c-4ab5-ab77-67588003bf10.png)

## What it does

- **Connect.** Wallet connection with RainbowKit and wagmi, on Polygon Mumbai.
- **Verify.** Shows a QR code carrying the contract's proof request. Scanning it with the Polygon ID wallet sends a zero-knowledge proof of membership straight to the contract, and the app picks up the verified status.
- **Proposals.** Verified members create proposals with a description and the amount they need, see every proposal with its live vote count and deadline, and vote for or against once each.
- **Treasury.** Anyone can donate. The DAO balance is shown live.
- **Owner console.** The owner verifies with their own credential, counts votes once a proposal's deadline passes (which pays out passed proposals), and can revoke or reset memberships.

## Structure

| File | |
|---|---|
| `src/pages/Home.js` | Landing page and the verification entry point |
| `src/pages/QrVerification.js` | Proof-request QR codes for members and the owner |
| `src/pages/Proposal.js` | Create, browse and vote on proposals |
| `src/pages/owner.js` | Owner actions: count votes, manage memberships |
| `src/pages/config.js` | Contract address and ABI |
| `src/Connect.js`, `src/Navigation.js` | Wallet connection and navigation |

## Tech

React · wagmi and RainbowKit · ethers.js · Moralis · qrcode.react · Polygon ID

## Run it

```bash
npm install
npm start
```
