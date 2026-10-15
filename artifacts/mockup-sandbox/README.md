# AIVO AI Mockup Sandbox

This folder contains the mockup components for the AIVO AI demo interface.

Files created/updated:

- artifacts/mockup-sandbox/src/components/mockups/aivo-ai/Chat.tsx — Main chat UI mockup (monochrome, WhatsApp-like layout with command-panel feel).
- artifacts/mockup-sandbox/src/components/mockups/aivo-ai/Canvas.tsx — Canvas iframe component that interacts with the parent by exchanging suggested actions.
- artifacts/mockup-sandbox/src/components/mockups/aivo-ai/mock-data.ts — Sample conversation used to populate the demo.

Notes

- The chat UI is fully client-side and requires no backend changes. It simulates a short assistant reply for demo purposes.
- The parent frame posts suggested actions to an iframe named `aivo-ai-chat` on mount; the canvas listens for messages and will respond when requested.
- I did not modify any backend or CI files; the UI is TypeScript and should be compatible with an existing Next.js or React setup. If you want, I can also wire this into the app routes or add a storybook entry.

How to preview

1. In your repo root run your usual dev server (e.g. `npm run dev` or `pnpm dev`).
2. Import and mount the `Chat` component from `artifacts/mockup-sandbox/src/components/mockups/aivo-ai/Chat.tsx` in a page or story.
3. Ensure an iframe element with name `aivo-ai-chat` is available for the canvas interaction if you use the Canvas component.

If you want, I can:
- Add a dedicated page at `/mockups/aivo-ai` and a small route that renders the Chat component and an iframe named `aivo-ai-chat` so the suggested actions are visible.
- Add a preview screenshot asset to the repo (you mentioned it rendered successfully).
- Wire the demo into your package.json dev scripts.
