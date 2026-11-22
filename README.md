# A little garden for you

A static, mobile-friendly site for GitHub Pages. No dependencies are needed to view it.

## Edit the messages

Edit `messages.json`: change `appreciation` for the scrolling note and `letter` for the longer letter. Use `\n\n` between letter paragraphs. Then run `python generate.py` and commit both `messages.json` and the generated `index.html` (and `garden.svg` if changed). Open `index.html` to preview.

## Publish on GitHub Pages

1. Push this repository to GitHub's `main` branch.
2. Open the repository on GitHub and choose **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Choose **main** and **/(root)**, then click **Save**.
5. Wait for deployment; refresh the Pages settings page and open the URL shown there. The expected URL is `https://kurtdrayan.github.io/tulips/`, but use the URL displayed by GitHub as the authoritative address.
6. For future message changes, regenerate and push the updated files; GitHub Pages will redeploy automatically.
