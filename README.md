<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/5e10c7ec-75f2-43d1-901c-ce07f911170c

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Run in GitHub Codespaces

1. Open the repository in a Codespace.
2. Add `GEMINI_API_KEY` in the Codespace secrets or create a local `.env.local` file.
3. Run `npm run dev`.
4. Open the forwarded port 3000 when Codespaces displays it.
