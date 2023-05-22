This is a Trace Visualization Project that I build as part of my Master's Thesis.


## Getting Started
Pre-reqs : download docker desktop

First start the Open Telemetry Demo in the backend:

```bash
cd otel-demo
```

```bash
docker compose build
```
and then

```bash
docker compose up
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.