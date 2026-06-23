<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Critical rules for this project

### Middleware (src/proxy.ts)
Next.js uses `src/proxy.ts` as the middleware entry point (configured via build).

**NEVER** redirect authenticated users (token exists) away from `/auth/*` pages in middleware.
Doing so causes an infinite redirect loop:
- Stale token → middleware redirects /auth/login → /dashboard
- Dashboard calls /v1/me, fails → redirects back to /auth/login
- → ERR_TOO_MANY_REDIRECTS

Rule: **Only redirect `/` → `/dashboard` for authenticated users.** Auth pages must always be accessible.

### New user balance (imba_api/core/config.py)
`BUSINESS["demo_start_balance"]` MUST be `0.00` in production.
Setting it to any non-zero value gives every new user free credit — this is a test-only mode.
The field `demo_mode` must also be `False` in production.
