# Example of Electron App for Mysql DB Migration and Tools
Use Case: Migrate ACL Tables

## About
Created based on [Electron Vite](https://electron-vite.github.io/) you may want to [See Electron Vite Generated Readme](ELECTRON_VITE_README.md), with React, [read documentation here](https://react.dev/reference/react), Tailwindcss [read about Tailwindcss](https://tailwindcss.com/docs/), and DaisyUI [learn more](https://daisyui.com/docs/intro/)

This package contains DB migration for Basic ACL tables. Provides migration and rollback features.

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
  VITE_APP_KEY=""
  VITE_APP_INSTANCE="instance-id"
  VITE_APP_NAME="Example Electron DB Migration"
  VITE_APP_VER="0.0.1"
  VITE_APP_PORT=3001
  VITE_SQLITE="sqlite3.db"
  VITE_DEV_STORAGE="dev-storage"
  ```

## Running dev
- ``yarn dev``

## Build
- ``yarn build``
- This command will build a release package according to your machine
- You can find your app installer within release directory
  - macOS
  - ``/release/[app-version]/${productName}-Mac-arm64-${version}-Installer.dmg``
  - ``/release/[app-version]/${productName}-Mac-x64-${version}-Installer.dmg``
  - Windows
  - ``/release/[app-version]/${productName}-Windows-x64-${version}-Setup.exe``
  - Linux
  - ``/release/[app-version]/${productName}-Linux-${version}.AppImage``

### Target specific OS
- macOS (arm64, x64)
  - ``yarn build-mac``
- Windows (x64)
  - ``yarn build-win``
- Linux (AppImage)
  - ``yarn build-linux``

## Available commands
  ```json
  {
  ...
    "scripts": {
      "dev": "vite",
      "build": "tsc && vite build && electron-builder",
      "build-mac": "tsc && vite build && electron-builder --mac",
      "build-win": "tsc && vite build && electron-builder --win",
      "build-linux": "tsc && vite build && electron-builder --linux",
      "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
      "preview": "vite preview",
      "key:generate": "node --loader ts-node/esm bin/key-generate.ts"
    },
  ...
  }
  ```
  
## Create your own migration scripts
### Migration path
- All migration scripts stored at ``migrations/`` directory
  ```
    migrations/
    ├── 20250308150001_create_users.js   // migration scripts
    ├── 20250308150002_create_roles.js   // migration scripts
    ├── migration.json                   // migration list
    ├── migration.ts                     // migration module
    ```
### Migration entries
- ``migration.json`` provides all your migrations for your database. Every list must have one corresponding scripts with the same name i.e. : ``20250308150001_create_users.js`` will contains migration script for  ``20250308150001_create_users`` migration.
  ```JSON
  // migrations/migration.json
  
  [
    "20250308150001_create_users",
    "20250308150002_create_roles",
    "20250308150003_create_permissions",
    "20250308150004_create_user_has_roles",
    "20250308150005_create_role_has_permissions",
    "20250308150006_create_user_has_permissions"
  ]
  ```
### Migration scripts
- Example scripts
  ```JAVASCRIPT
  // migrations/20250308150001_create_users.js
  
  class CreateUsers {
    //properties
    static tableInit = 'users'
    static type = 'create'

    static upSql = 'CREATE TABLE `:tablename` (\n' +
        '  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,\n' +
        '  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,\n' +
        '  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,\n' +
        '  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,\n' +
        '  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,\n' +
        '  `remember_token` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,\n' +
        '  `created_at` timestamp NULL DEFAULT NULL,\n' +
        '  `updated_at` timestamp NULL DEFAULT NULL,\n' +
        '  `deleted_at` timestamp NULL DEFAULT NULL,\n' +
        '  PRIMARY KEY (`id`),\n' +
        '  UNIQUE KEY `users_username_unique` (`username`)\n' +
        ') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'

    static downSql = " DROP TABLE :tablename "

    //constructor
    constructor(sequelize, prefix = 'wid_') {
        this.sequelize = sequelize
        this.table = prefix + this.constructor.tableInit
        this.action = this.constructor.type
        return this
    }

    // public methods
    async up() {
        //
        return await this.sequelize.query(this.getUpSql().replace("\n", ""))
    }
    async down() {
        // 
        return await this.sequelize.query(this.getDownSql().replace("\n", ""))
    }

    getUpSql() {
        return this.constructor.upSql.replace(":tablename", this.table)
    }
    getDownSql() {
        return this.constructor.downSql.replace(":tablename", this.table)
    }

  }

  export default CreateUsers
  ```
- Class Properties
  - ``tableInit``
  
    This property will be your initial table name. During runtime will be prefixed with provided ``prefix`` from app Connection page
  - ``upSql``
    
    This string will be executed during ``migration``, remember to use ``:tablename`` for your migration table instead of the real table name, as this will be replaced with ``prefix+tableInit``
  - ``downSql``
    
    This string will be executed during ``rollback``, remember to use ``:tablename`` for your migration table instead of the real table name, as this will be replaced with ``prefix+tableInit``
    
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
