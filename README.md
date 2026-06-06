# Mermaid Paste

Share Mermaid diagrams with a link. No accounts, no database, and no backend servers: the diagram content is compressed directly into the URL.

Because everything is encoded in the link, Mermaid Paste does not send your diagram content to an application backend.

**Demo:** [pronink.github.io/flow-paste](https://pronink.github.io/flow-paste/?m=eJyVVE1z2jAQvedXaLjnD_TGgJswnQBjoJ2cNFtJwZpYkiutmxLIf69kZOMvaOqDMdq3u29X-1bYuYS9BXVH_DPbbbarpyQlp9P9vTmSVTpP0g35QiZFDky4yShq87hYrxfLBzqdz9NkU-EziOAYIkBPMSBdbJOnAGJGI0g9RMagT8lyG3BcugKQZTWBdbqa72ZbOptuk4dV-lz7xPMqNKDYGyvfez6dyhoixnJhBScwDl4sv3smIZHHOjTs1WOlPmN_TNPkcbXbJNfQtqEwfa4qGjYXDo68GDu56_b3WP0Nj9RIWOmDKWGp5GT9rTE5tFLviVAg8_7hi7QOqQYl-pYcrhgKcO7N94P6G8waI_ftRKkEYVb4T04BK9tH9a5egynosgfOfSNcj3y_rq-DuvyPENg_ZRIPQ6Rn1j98lwVlhg_OmSk12kMsoj1_XdrVZHyedDC5TBaFz0FbJbcgTSvPofkI6VBJ6S4egkkFOUGDkFNQgfqA-HmWR8mjUCMVNJX16BfW8JLhiOVXCRrbja-JFVYy0WZU6-d4LXK_m2e1HsZHoDOmKP6gT-yYlQVKo2-QaS4kKJZ22Hd5XhbJ8SqtoeL-TStmuSyEbnipfwuNw_i3b-ENrMhM6cSNG6JGe_1q3mZx2VPH6_GGVebGd8EXNLos4oS30zR7u5sliEL5aj85iDE-WmCvQUq6VD-FHWqo0ppfR2MqYmCtjE71fccN3JtLOPwHtSZ37dbJXU9hS6UtSrWLEpgZfkP2H38BXw4knQ)

## What It Does

Mermaid Paste is a small web app for writing, previewing, and sharing Mermaid diagrams. As you edit a diagram, the app generates a URL with the compressed source code in the `m` query parameter. You can paste that URL into Slack, GitHub, docs, or any chat, and whoever opens it will see the same rendered diagram.

The goal is to make sharing a diagram feel as simple as sharing a paste, without relying on a backend.

## Features

- Mermaid diagrams rendered directly in the browser.
- Self-contained links: the diagram is compressed into the query string.
- Slide-out editor for updating the Mermaid source.
- Read-only view when opening a shared link.
- Mouse wheel zoom and touch pinch zoom.
- Draggable canvas for navigating large diagrams.
- Light/dark mode persisted in `localStorage`.
- Error messages when Mermaid cannot parse the diagram.

## How It Works

The project is a single-page app built with React, TypeScript, and Vite. There is no API and no remote storage: everything happens in the browser.

The main flow is:

1. The app reads the `?m=` parameter on startup.
2. `src/compression.ts` decodes the base64url value and decompresses it with DEFLATE using `pako`.
3. `src/MermaidViewer.tsx` validates and renders the source with `mermaid`.
4. `src/Editor.tsx` lets you edit the text and toggle the editor panel.
5. While the editor is open, `src/App.tsx` compresses the current source and updates the URL with `history.replaceState`.
6. `src/DraggableDiv.tsx` wraps the diagram with drag, wheel zoom, and pinch zoom support.

## Stack

- **React 19** for the UI.
- **TypeScript** for static typing.
- **Vite** for development and production builds.
- **Mermaid** for parsing and rendering diagrams.
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
