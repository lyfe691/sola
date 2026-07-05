<img src="https://sola.ysz.life/og-image.png" />

---

Local dev reads `GITHUB_TOKEN` from `.env.local` (see `.env.example`) to raise
the GitHub API rate limit for the activity feed — a classic token with
`public_repo` from <https://github.com/settings/tokens>. Without it the feed
still works, just unauthenticated.

```powershell
'GITHUB_TOKEN=<your token>' | Out-File -Encoding UTF8 -NoNewline .env.local
```

## License

This project is **not open source**.

The source code is published for demonstration and educational review purposes only.  
Use, modification, redistribution, or integration into other projects is **strictly prohibited** without explicit written permission.

See [`LICENSE`](./LICENSE) and [`NOTICE`](./NOTICE) for full terms.

For licensing or commercial use inquiries, contact: [yanis.sebastian.zuercher@gmail.com](mailto:yanis.sebastian.zuercher@gmail.com)
