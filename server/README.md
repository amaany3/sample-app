## Install

```
// atlas
curl -sSf https://atlasgo.sh | sh
```

## Server

```
make middleware.up
npm install
cp .env.sample .env
npm run dev

open http://localhost:3000/doc
```

## Migration

```
make migrate.diff.local
make migrate.apply.local
```
