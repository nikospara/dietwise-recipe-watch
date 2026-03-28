Place your Android asset source files here.

Preferred single-image workflow:

1. Add `resources/logo.png`
2. Run `npm run assets:android`

Notes:

- `logo.png` should be a square image, ideally at least 1024x1024.
- The current script generates Android icons and splash screens with white icon and splash backgrounds.
- If you want dark-mode variants later, you can also add `resources/logo-dark.png` and extend the script with dark background flags.
- For full manual control instead of a single logo, `@capacitor/assets` also supports source files such as `icon-foreground.png`, `icon-background.png`, and `splash.png`.
