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
```

## Migration

```
make migrate.diff.local
make migrate.apply.local
```

```
open http://localhost:3000/doc
```
