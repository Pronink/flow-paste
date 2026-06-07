# Flow Paste

Share **React Flow** diagrams with a link. No accounts, no database, and no backend servers: the diagram content is compressed directly into the URL.

Because everything is encoded in the link, **Flow Paste** does not send your diagram content to an application backend.

**Demo:** [pronink.github.io/flow-paste](https://pronink.github.io/flow-paste/?data=eJzdmE9vmzAYxu_5FIhekwkIkLDj2t62Hrppl2kHxzaJVYoj2_0TVf3ucyCQYBNqoEIsFyTM-yA_P97X9svbxLLslCLM7a_WH3ljWW_ZVQ4TJMdsLgAT9rQYREAAOVwEyZEErHCyj_yZRR4evJeKLeVEEJpWVa_y1pke73fy3g0cTc3FLsFV6QtBYpOHn7xgg8l6I-RwZXRFGcJsPztv-2pxmhBkXcX-wluFthZ2DxB52oNwvWIek5PZKGCegXwZENiIze8iuAWeuaMCaofHP4PHwJtgIOUxZY9G5n6V0b3ctf38PfzhlBG4MTJ3m4f2ciZHPsXZMIm9Sih8wMw1wvMtD27DJ5irfMJ2eLyP8dAtgERkNfMlNPD8iNnarJJ_ZJEt7C60dFgEQ-U5wpDw_axMnN0Uwb3Med5g7g6J6hm5uwZw0-q7Rb0XKOfz85Q_QYg5N9uPD7EtPLuuZvqTFuWPli4fILx0-i5dDAu2M4Jzn0X2Q-MNtawDCN2gLxvMGGVmW14W2Y_NfKC8iZcLd-H2ZZPQtRGZ7zKuzU6nYfFbpsy5rc7AU0oFic2K4S4PbbPuB8M4k9e_-zgbo_X5HgXPsi5lph_JOX1iENt6HyPv1ljUn-PFbptJwDMl6C5rjspnj4DJLec2RVVbpUSWzgtMKMfoNCePrutMV0YhTWiW5Fc4cnE417-K_iG5YPQBX6vKac2nlpsgfLAN0qdgWtMKGECtUV0y1S2jla3WgKvaghhAVSWXTBS_CiwnbwS0qOCZcoo_Iq2p8ZKqIhoJVM-NwrgTVEXZSK4s0_Po6ip55OziOFo6Thd2irKRXV6NM73FOrLTCrYEp6tGwi6C3mLViZ2iNMy7JnyNqTdagsNkX1Z5M60dPMJTS7MEp2lGws1xonC57MLtoKzbRqjhWafIpiaiNRk3eqix78_nYadkrCrN6Cn9txk7RXQp5OrSkVX-OpgxVfp2M6aK6JKZxoAkZkgz-s0NjZqL_0FD40MQB532m4OyDipYA5KePsm1N4Bv5NzBvuG3g2nQ6qRU-clickiqCEZCe5jzkXQ-U__fHIlVuZS4VMFIiDnOCiK_275eUTYSy82fXyw1OCNfKhdREPidTkOKclJc_07e_wEK6WAB)

## What It Does

Flow Paste is a small web app for writing, previewing, and sharing React Flow diagrams. As you edit a diagram, the app generates a URL with the compressed source code in the `data` query parameter. You can paste that URL into Slack, GitHub, docs, or any chat, and whoever opens it will see the same rendered diagram.

The goal is to make sharing a diagram feel as simple as sharing a paste, without relying on a backend.

## Features

- React Flow diagrams rendered directly in the browser.
- Self-contained links: the diagram is compressed into the query string.
- Slide-out editor for updating the React Flow source.
- Read-only view when opening a shared link.
- Mouse wheel zoom and touch pinch zoom.
- Draggable canvas for navigating large diagrams.
- Light/dark mode persisted in `localStorage`.
- Error messages when React Flow cannot parse the diagram.

## How It Works

The project is a single-page app built with React, TypeScript, and Vite. There is no API and no remote storage: everything happens in the browser.

The main flow is:

1. The app reads the `?data=` parameter on startup.
2. `src/compression.ts` decodes the base64url value and decompresses it with DEFLATE using `pako`.
3. `src/ReactFlowViewer.tsx` validates and renders the source with `mermaid`.
4. `src/Editor.tsx` lets you edit the text and toggle the editor panel.
5. While the editor is open, `src/App.tsx` compresses the current source and updates the URL with `history.replaceState`.
6. `src/DraggableDiv.tsx` wraps the diagram with drag, wheel zoom, and pinch zoom support.

## Stack

- **React 19** for the UI.
- **TypeScript** for static typing.
- **Vite** for development and production builds.
- **React Flow** + **avoid-nodes-edge** for parsing and rendering diagrams.
- **pako** for DEFLATE compression and decompression.
- **Font Awesome** for UI icons.
- **ESLint** and **Prettier** for code quality and formatting.

## Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```
