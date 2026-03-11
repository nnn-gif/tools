# Sitemap Update - March 11, 2026

## Summary

Updated `sitemap.xml` to include ALL pages, sub-pages, and blogs for formatho.com.

## Changes

### Before
- **~100 URLs** (only tools)
- Missing: Main site pages, blog posts

### After
- **141 URLs total**
  - 1 Home page (/)
  - 5 Main site pages:
    - /about
    - /blogs
    - /privacy
    - /terms
    - /contact
  - 37 Blog post pages (all individual blog articles)
  - 98+ Tool pages

## Blog Posts Added (37 total)

All blog posts from `src/data/blogPosts.ts` are now included:
- india-privacy-first-developer-toolkit-2026
- generate-uuids-without-internet-connection-2026
- generate-qr-codes-without-tracking-pixels
- test-regex-patterns-securely-2026
- 100-developer-tools-all-free-all-private
- encode-decode-base64-files-never-leave-browser
- format-sql-queries-without-cloud-uploads
- decode-jwt-tokens-without-server-exposure
- convert-json-to-yaml-no-upload
- developer-tools-that-dont-spy-on-you
- uuid-v1-vs-v4
- bcrypt-password-hashing-guide
- base64-encoding-guide
- ulids-vs-uuids
- jwt-tokens-complete-guide
- sql-formatting-best-practices
- qr-codes-explained
- regex-practical-guide
- ethereum-units-explained
- crontab-guide
- http-status-codes-guide
- json-yaml-toml-comparison
- password-security-guide
- ipv4-subnetting-guide
- case-conversion-guide
- cryptographic-hashes-guide
- markdown-tips-tricks
- git-commands-cheat-sheet
- color-formats-guide
- docker-run-to-compose
- bip39-mnemonic-guide
- encoding-vs-encryption
- unix-file-permissions
- ai-agent-orchestration-career-blueprint-2026
- meta-ai-restructuring-applied-superintelligence-2026
- ai-job-safety-22-careers-anthropic-research
- when-ai-stops-feeling-like-software-and-starts-feeling-like-a-real-employee

## Priority Levels

- **1.0**: Home page (/)
- **0.9**: Main pages (/, about, blogs)
- **0.8**: Blog posts (newer posts), featured tools
- **0.7**: Blog posts (guides/tutorials)
- **0.5**: Legal pages (privacy, terms)

## Files Modified

- `scripts/generate-sitemap.js` - Updated to include main pages and all blog posts
- `public/sitemap.xml` - Source sitemap
- `dist/sitemap.xml` - Deployed sitemap

## Next Steps

The sitemap will be deployed with the next build. Search engines will now be able to discover:
- All main site pages
- All 37 blog posts
- All 100+ tools

## Verification

```bash
# Check sitemap count
grep "loc>" dist/sitemap.xml | wc -l
# Output: 141

# Verify blog posts are included
grep "blogs/" dist/sitemap.xml | wc -l
# Output: 38 (37 blog posts + /blogs index)

# Verify main pages
grep -E "(about|privacy|terms|contact)" dist/sitemap.xml
# Output: All 5 main pages present
```

---

**Updated**: March 11, 2026
**Total URLs**: 141
**Status**: ✅ Complete
