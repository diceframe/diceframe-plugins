# Contributing to the DiceFrame Plugin Registry

[中文](CONTRIBUTING.md) | English

## Repository requirements

A plugin must use its own public GitHub repository, with the plugin at the repository root. The root must contain:

- `plugin.json`
- `README_CN.md` or `README.md`
- `LICENSE` or `LICENSE.md`
- `config.schema.json` when referenced by `plugin.json.config_schema`

Publish at least one non-draft, non-prerelease GitHub Release. The `plugin.json.version` at that Release must use a three-part version such as `1.0.0`.

Authors do not upload a plugin ZIP or calculate SHA-256. DiceFrame downloads the repository source snapshot at the immutable Git commit referenced by the Release.

## First submission

1. Open the [plugin submission form](https://github.com/diceframe/diceframe-plugins/issues/new/choose).
2. Enter the plugin ID and public repository URL.
3. Wait for the automated validation comment.
4. If validation fails, fix the plugin repository and reply `/recheck`.
5. Wait for a maintainer after validation passes.

Do not edit this repository's `plugins.json` or `plugin_details.json`. Pull request submissions are no longer used.

## Later releases

For an ordinary update:

1. Update `plugin.json.version`.
2. Commit the code and create a Git tag.
3. Publish a non-draft, non-prerelease GitHub Release.

Declarative plugins may update automatically while permissions and runtime remain unchanged. Process plugins only notify users. Permission expansion, a change from declarative to process execution, repository transfer, or plugin ID change requires another review.

## Automated checks

Automation verifies that:

- the GitHub repository is public, active, and consistent with the plugin declaration;
- the latest Release, tag, fixed commit, and `plugin.json` are readable;
- plugin ID, version, type, permissions, and required fields are valid;
- documentation, license, and referenced configuration schema exist;
- file count and total size remain within installer limits;
- obvious secret files such as `.env`, private keys, and credential JSON files are absent;
- the ID and repository are not already registered.

Automation never executes the plugin entrypoint and cannot prove that executable code is harmless.

## Risk and update levels

- `declarative`: a content, theme, or map plugin without a process entrypoint; eligible for automatic updates when permissions do not expand.
- `unrestricted-process`: launches a process with the current user's operating-system privileges; updates are notification-only.
- `bundled`: maintained by the DiceFrame organization and released with the application.
- `approval-required`: a release expanded permissions or changed runtime behavior; installation and updates are paused.

Registry inclusion means that the listing rules were satisfied. It is not a security or quality warranty.

