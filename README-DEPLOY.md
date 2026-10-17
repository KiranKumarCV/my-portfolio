# Deploying Kiran's portfolio

## Folder (upload ALL of it, keep this structure)
```
index.html  style.css  script.js  theme-init.js
404.html  robots.txt  sitemap.xml  _headers
assets/img/...   assets/resume/Kiran-Kumar-CV.pdf
```

## 1. Replace the domain placeholder (required, 2 minutes)
Search all files for `YOUR-DOMAIN.com` and replace it with your real domain
(index.html: canonical, og:url, og:image, twitter:image, JSON-LD · robots.txt · sitemap.xml).

## 2. Pick a host (all free, all give automatic HTTPS)
| Host | Best for | Security headers (`_headers`) |
|---|---|---|
| **Cloudflare Pages** | fastest, free custom domain + HTTPS | works as-is |
| **Netlify** | drag-and-drop the folder | works as-is |
| **GitHub Pages** | simplest if code is on GitHub | not supported (HTTPS still on) |

## 3. Custom domain + HTTPS
1. Buy the domain (GoDaddy / Namecheap / Cloudflare Registrar / Google-partner registrars).
2. In the host dashboard add the custom domain; copy the DNS records it shows.
3. Add those records at your registrar (CNAME for `www`, A/ALIAS for the root domain).
4. Wait 5–60 min, then enable "Force HTTPS". Visit `http://` and confirm it redirects to `https://`.

## 4. After going live — verify
- https://YOUR-DOMAIN.com loads, padlock shown, `http://` redirects to `https://`
- Open on a real phone: menu, project screenshots, case studies, résumé download, call / email / GitHub / LinkedIn links
- Share the link in WhatsApp/LinkedIn → preview image & title appear (clear cache: LinkedIn Post Inspector)
- Submit `https://YOUR-DOMAIN.com/sitemap.xml` in Google Search Console
- Test: PageSpeed Insights (mobile), securityheaders.com, ssllabs.com/ssltest
