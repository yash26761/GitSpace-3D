import test from "node:test";
import assert from "node:assert/strict";

function validateRepoSlug(slug) {
  if (!slug || typeof slug !== "string") {
    throw new Error("Repository identifier must be a non-empty string.");
  }

  const trimmed = slug.trim().replace(/^https?:\/\/github\.com\//i, "").replace(/\/+$/, "");
  const parts = trimmed.split("/");

  if (parts.length !== 2) {
    throw new Error(`Invalid repository format "${slug}". Expected "owner/repo" (e.g. facebook/react).`);
  }

  const [owner, repo] = parts;
  const validIdentifier = /^[a-zA-Z0-9_.-]+$/;

  if (!validIdentifier.test(owner) || !validIdentifier.test(repo)) {
    throw new Error(`Invalid characters in repository slug "${slug}".`);
  }

  return { owner, repo };
}

test("GitHub Slug Validation — Accepts valid formats", () => {
  const valid1 = validateRepoSlug("facebook/react");
  assert.deepEqual(valid1, { owner: "facebook", repo: "react" });

  const valid2 = validateRepoSlug("https://github.com/torvalds/linux");
  assert.deepEqual(valid2, { owner: "torvalds", repo: "linux" });

  const valid3 = validateRepoSlug("yash26761/yh-nexus/");
  assert.deepEqual(valid3, { owner: "yash26761", repo: "yh-nexus" });
});

test("GitHub Slug Validation — Rejects malicious and malformed formats", () => {
  assert.throws(() => validateRepoSlug(""), /non-empty string/);
  assert.throws(() => validateRepoSlug("react"), /Expected "owner\/repo"/);
  assert.throws(() => validateRepoSlug("facebook/react/extra"), /Expected "owner\/repo"/);
  assert.throws(() => validateRepoSlug("../escape/repo"), /Expected "owner\/repo"/);
  assert.throws(() => validateRepoSlug("owner/repo; rm -rf /"), /Invalid characters/);
  assert.throws(() => validateRepoSlug("owner/repo<script>"), /Invalid characters/);
});
