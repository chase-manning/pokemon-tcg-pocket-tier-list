# V&V Discipline Reference

Extracted from the 2026-08-24 meta-share-movement plan execution (PR #49). This documents the four-layer validation framework that proved effective and should be reused.

## Four Validation Layers

### 1. Data Truth
**Goal**: Independent verification of the produced artifact against source-of-truth inputs.
**Techniques**:
- Checksums / schema validation
- Arithmetic invariants (e.g., window shares sum to 1.0)
- Cross-check against raw inputs for a sample
**Implementation**: Python validation script pasted into PR, run by executor and output recorded.

### 2. Browser Truth
**Goal**: Visual and functional verification at real viewport widths.
**Techniques**:
- Dev server checks at 375px minimum (mobile)
- Share badges render without overlapping art
- Delta arrows appear only when |delta| > threshold
- Language switch renders translated strings (no raw keys)
**Implementation**: Executor runs `yarn build && npx serve dist` and manually checks.

### 3. Crawler Truth
**Goal**: Prerendered HTML carries semantic content, not loading shells.
**Techniques**:
- `grep` for rendered links in static HTML
- Visible character count threshold (e.g., >1000 chars)
- Loopback gate still passes
- New JSON artifacts present in `dist/`
**Implementation**: Automated commands in V&V task, outputs pasted to PR.

### 3.5 Prerender Wait Validation
**Goal**: The new page/data dependencies are awaited by the prerenderer.
**Techniques**:
- Verify the page's data fetch is covered by existing wait mechanisms
- Ensure new JSON is listed in sitemap if public

### 4. Regression Gates
**Goal**: Full gate suite runs; counts recorded; dropped counts block.
**Techniques**:
- `yarn typecheck && yarn lint && yarn test:ci` — all pass
- Test counts recorded in PR body (frontend, analysis, scripts)
- Any dropped count = blocker, not warning

## When to Use Each Layer

| Layer | Runs in CI? | Runs locally? | Manual step? |
|-------|-------------|---------------|--------------|
| Data Truth | Yes (unit tests) | Yes (script) | No |
| Browser Truth | No | Yes (dev server) | Yes |
| Crawler Truth | Yes (loopback gate) | Yes (build + grep) | No |
| Regression Gates | Yes | Yes | No |

## Template V&V Task

```markdown
### Task N: Verification and validation

**Objective**: Prove the feature is correct end to end.

**Files:** none created; this task runs checks against real output and the dev server.

**Interfaces:**
- Consumes: Tasks 1..N-1 complete; local pipeline run producing fresh artifacts
- Produces: recorded evidence for each check below (paste outputs into PR description)

- [ ] **Step 1: Data-level validation (pipeline truth)**
  Run the pipeline locally, then validate the artifact independently:
  ```bash
  python -c "
  # arithmetic invariants, schema, cross-check
  "
  ```

- [ ] **Step 2: Rendering validation (browser truth)**
  ```bash
  yarn build && npx serve dist
  ```
  Open dev server. Verify:
  1. Badges render without overlapping art at 375px
  2. Delta arrows only appear when threshold met
  3. Page X shows line matching JSON value
  4. Tabs switch, language switch renders translations

- [ ] **Step 3: Prerender validation (crawler truth)**
  ```bash
  grep -c 'href="/deck/' dist/page/index.html
  python -c "
  # visible chars > threshold
  "
  ```

- [ ] **Step 4: Regression gates**
  ```bash
  yarn typecheck && yarn lint
  yarn test:ci        # record count
  yarn test:scripts   # record count
  cd analysis && yarn test   # record count
  ```

- [ ] **Step 5: PR draft** — summary leads with user-facing outcome, test plan lists every suite count and validation steps.
```

## Hard Lessons

1. **Skipping any layer is a false pass**. The 2026-08-24 session caught this when a plan only validated data truth — the browser revealed mobile overflow, and crawler truth revealed the statistics page still rendered "Loading..." because the new data fetch wasn't awaited by the prerender wait.
2. **Test counts are the canary**. If frontend drops from 169 to 165 tests, something was removed silently. Record counts; investigate drops.
3. **Python validation is faster than reasoning**. The meta-share.json validation script found that `share + sharePrev` both summed to 1.0 in 30 seconds; manual reasoning would have missed the `isNew` boundary bug.