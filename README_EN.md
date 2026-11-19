# DiceFrame Plugin Registry

[中文](README.md) | English

This repository is the public index for DiceFrame community plugins. Plugin source code remains in repositories maintained by each author.

## Submitting a plugin

Open [Issues](https://github.com/diceframe/diceframe-plugins/issues/new/choose), choose “Add plugin”, and provide only the plugin ID and public repository URL. No fork, JSON editing, SHA-256 calculation, or uploaded package is required.

Content packs (worlds, lorebooks, adventure modules) need their own public repository just like other plugins: start from [`templates/content-pack/`](templates/content-pack), which already contains `plugin.json`, a README, a LICENSE and a workflow that creates the Release. Projects that provide an external ruleset runtime should start from [`templates/ruleset-runtime/`](templates/ruleset-runtime); it is a high-risk process plugin and is never treated as a first-party DiceFrame ruleset.

Automation checks the latest GitHub Release, `plugin.json`, version, repository structure, declared permissions, documentation, license, and obvious secret files. After validation, a maintainer reviews and decides whether to include your plugin:

```text
/approve
```

Once approved, your plugin appears in the store index, and users can find and install it from the DiceFrame plugin store. When you publish new versions, the store syncs the update automatically (see Update policy below).

To reject a submission:

```text
/reject reason
```

If your plugin is not accepted, the reason is given so you can adjust and resubmit.

See the [contribution guide](CONTRIBUTING_EN.md) for the complete requirements.


## Update policy

- Declarative `content-pack`, `theme`, and `voice-pack` plugins are checked for new versions and notified; updates are installed only after user confirmation, while their permissions and runtime model remain unchanged.
- Plugins that launch Python, Node, executables, or another process only notify users about updates; they are never silently updated.
- `ruleset-runtime` plugins use the RuntimeProbe stdio process boundary for authoritative rules; they always use notification-only updates and must declare `ruleset_runtime` plus `ruleset.execute`.
- A permission increase, runtime change, repository transfer, or plugin ID change pauses updates and requires another review.
- Bundled plugins such as QQ / NapCat ship with DiceFrame and are not installed again from the store.

The registry syncs once per day (around 11:17 Beijing time / 03:17 UTC) to generate a static catalog. Approved entries carry the maintainer-approved Release/commit/archive SHA-256; DiceFrame downloads and verifies that exact artifact instead of switching to an author's latest release. Missing approval metadata, a hash mismatch, a failed sync, or a paused listing stops installation while preserving the previous index and installation.

## Security

Passing automated validation means only that machine-verifiable format and policy checks passed. It does not prove that code is safe. Third-party executable plugins are displayed with an explicit high-risk classification, and registry inclusion is not a security warranty from DiceFrame.

## Development documentation

- [DiceFrame](https://github.com/diceframe/diceframe)
- [Plugin development guide](https://github.com/diceframe/diceframe-content/blob/main/docs/en/plugin-development.md)
- [Registry and review policy](https://github.com/diceframe/diceframe-content/blob/main/docs/en/plugin-registry.md)
- [Bot Bridge core](https://github.com/diceframe/diceframe-content/blob/main/docs/en/bot-bridge-core.md)
- [Publishing voice presets](https://github.com/diceframe/diceframe-content/blob/main/docs/en/voice-pack-publishing.md)

This registry is licensed under the MIT License. Each plugin uses the license declared in its own repository.

