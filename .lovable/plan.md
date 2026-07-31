## Goal
Add a visible "Back to Home" button on the `/game` route that returns the user to the main landing page (`/`).

## Current state
- The `/game` route (`src/pages/Game.tsx`) renders a full-screen iframe that loads `public/game-app/index.html`.
- There is no in-app navigation once the user is on `/game`; they must rely on the browser back button.

## Proposed implementation
1. Update `src/pages/Game.tsx`:
   - Wrap the existing iframe in a relative container.
   - Add a fixed top-left button using the existing `Button` component and `Link` from `react-router-dom`.
   - Label the button "Volver al Inicio" or similar.
   - Style it to match the Masterdrez brand (dark navy background, silver/red accent, shadow).
2. Verify the button is visible above the iframe and does not block game controls.
3. Ensure the build/type-check passes and the route still works.

## No additional dependencies needed
We will reuse the existing `Button` component and `react-router-dom` already imported elsewhere in the project.
