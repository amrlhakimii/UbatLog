# UbatLog

Clinic medication purchase log — replaces a paper logbook with a searchable web app.

## Stack

React + Vite + TypeScript + Tailwind CSS, Firebase (Auth + Firestore).

## Setup

```
yarn install
cp .env.example .env.local   # fill in Firebase config
yarn dev
```

## Access control

Authorized users are whitelisted by email in `src/config/whitelist.ts` and `firestore.rules` (keep both in sync). Deploy rule changes with:

```
firebase deploy --only firestore:rules
```
