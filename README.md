# Mysql DB Migration and Tools Example: Define ACL Tables

## About
Created based on [Electron Vite](https://electron-vite.org/) you may want to [See Electron Vite Generated Readme](ELECTRON_VITE_README.md), with React, [read documentation here](https://react.dev/reference/react), Tailwindcss [read about Tailwindcss](https://tailwindcss.com/docs/), and DaisyUI [learn more](https://daisyui.com/docs/intro/)

This package contains DB migration for Basic ACL tables.

## What's inside
```json
  // dependencies
  {
    "mysql2": "^3.14.0",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "sequelize": "^6.37.7",
    "sqlite3": "^5.1.7"
  }
  
  // devDevepencies
  {
    "@tailwindcss/vite": "^4.0.17",
    "@types/node": "^22.13.14",
    "@types/react": "^19.0.12",
    "@types/react-dom": "^19.0.4",
    "@typescript-eslint/eslint-plugin": "^8.29.0",
    "@typescript-eslint/parser": "^8.29.0",
    "@vitejs/plugin-react": "^4.3.4",
    "daisyui": "^5.0.9",
    "dotenv": "^16.4.7",
    "dotenv-expand": "^12.0.1",
    "electron": "^35.1.2",
    "electron-builder": "^26.0.12",
    "electron-is-dev": "^3.0.1",
    "eslint": "^9.23.0",
    "eslint-plugin-react-hooks": "^5.2.0",
    "eslint-plugin-react-refresh": "^0.4.19",
    "pg-hstore": "^2.3.4",
    "react-error-overlay": "^6.1.0",
    "react-router": "^7.4.1",
    "tailwindcss": "^4.0.17",
    "ts-node": "^10.9.2",
    "typescript": "^5.8.2",
    "uuid": "^11.1.0",
    "vite": "^6.2.4",
    "vite-plugin-electron": "^0.29.0",
    "vite-plugin-electron-renderer": "^0.14.6",
    "vite-plugin-node-polyfills": "^0.23.0"
  }
```

## Install
- Clone repository
  ```
  git clone 
  ```
- Install packages
  ```
  yarn
  ```
- Generate app key 
  ```
  yarn key:generate 
  ```
  This command will generate ``VITE_APP_KEY`` and copy ``.env.example`` file to ``.env`` accordingly.

## Setup environtments
- Open file ``.env``
- Update your environments
  ```ENV
  APP_KEY="generated-key"
  VITE_APP_NAME="Weapon Inventory DB"
  VITE_APP_VER="0.0.1"
  VITE_APP_PORT=3001
  ```

## Running dev
- ``yarn dev``

## Build
- ``yarn build``

## Available commands
  ```json
  {
  ...
    "scripts": {
        "dev": "vite",
        "build": "tsc && vite build && electron-builder",
        "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
        "preview": "vite preview",
        "key:generate": "node --loader ts-node/esm bin/key-generate.ts"
    },
  ...
  }
  ```
## Using Production DB
Some migration operations are destructive, which means they may cause you to lose data. Use with concern against your production database.

## Submit issue 

## Contributing
- Fork this repository
- Chekout into your branch
  ```
  git checkout -b your-feature
  ```
- Make a pull request

## Maintainer
- [Sutrisno Hadi](https://github.com/inoshadi)