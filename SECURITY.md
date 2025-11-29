# Security Policy for `Ziggy Route`

Thank you for taking the time to report security issues responsibly. We are committed to responding quickly and transparently to any vulnerability affecting this project.

---

## Supported Versions
We provide security updates for the latest stable release and any currently maintained branches.

| Version | Supported |
|--------|-----------|
| latest | ✔️ |
| others | case-by-case |

---

## Reporting a Vulnerability

If you believe you’ve found a security vulnerability in this project, please report it through one of the following channels:

1. **Email:** rzlzone.dev@gmail.com  
2. **Optional PGP Encryption:**  
   ```
   [PGP_PUBLIC_KEY_OR_FINGERPRINT]
   ```

Please **do not open public GitHub issues** for security reports.

### What to include in your report

To help us triage and resolve the issue faster, please include:

- A clear and concise description of the vulnerability  
- Steps to reproduce (minimal proof-of-concept)  
- Affected version(s) — tag, release, or commit hash  
- Impact: what an attacker could achieve  
- Any relevant logs, payloads, or screenshots  
- Your preferred contact method

#### Example Report Template

Package: Ziggy-Route  
Title: [Short description]

Affected Component: [e.g., API / Auth / Frontend / Build]

Version / Commit: [vX.X.X / SHA]

Steps to Reproduce:
1. ...
2. ...
3. ...

Expected Result:
[What should happen]

Actual Result:
[What happens instead]

Proof-of-Concept:
[Code snippet / payload / HTTP request]

Impact:
[Why this matters]

Reporter Contact:
[Name, Email]

---

## Disclosure Policy

We follow a **coordinated responsible disclosure** approach:

- We will acknowledge your report within **72 hours**.
- We will provide an initial assessment or request for more details within **14 days**.
- We aim to resolve validated vulnerabilities within **90 days** unless complexity or upstream dependencies require more time.
- If you prefer a coordinated public release, we will work with you to schedule it.
- If active exploitation is detected, we may accelerate the release timeline.

We will keep you informed throughout the process.

---

## Severity Classification

We internally classify vulnerabilities as:

- **Critical** — RCE, authentication bypass, full data compromise  
- **High** — Major authorization issues, SQLi requiring minor conditions  
- **Medium** — XSS requiring interaction, CSRF on non-critical actions  
- **Low** — Minor info leaks, missing security headers  
- **Informational** — Hardening recommendations

---

## Credit & Recognition

We appreciate any responsible disclosure.

- Reporters may be acknowledged in `ACKNOWLEDGEMENTS.md` (optional).  
- Anonymous reporting is welcome.  
- Bug bounty rewards are **not guaranteed**, but may be granted depending on severity.

---

## Third-Party Dependencies

If a vulnerability exists in a dependency, we will:

- Monitor upstream fixes  
- Patch or mitigate temporarily if needed  
- Release updates once a fix is available upstream

---

## Public Advisories & CVEs

We may publish:

- A GitHub Security Advisory  
- A CVE entry, when appropriate

Each advisory includes affected versions, technical details, and upgrade instructions.

---

## Emergency Contact

For urgent issues requiring immediate attention, email:  
rzlzone.dev@gmail.com  
(Use subject: `(Ziggy-Route)-[URGENT] <short title>`)

---

_Last updated: [2025-11-29]_

