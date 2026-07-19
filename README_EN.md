# DiceFrame Plugin Registry

[中文](README.md) | English

This repository is the public index for DiceFrame community plugins. Plugin source code remains in repositories maintained by each author. This registry does not copy plugin source code or store author-built ZIP archives.

## Using plugins

- In DiceFrame, open Settings → Plugins → Plugin Store to browse and install listed plugins.
- You do not need to download or clone this registry. DiceFrame obtains stable Releases from each author's public repository.
- Plugins shared through file hosting, chat groups, or other private channels should be provided as `.dfplugin` files and selected under Local Install.
- QQ / NapCat is bundled with DiceFrame, updates with the application, and is not installed again from the store.

## Submitting a plugin

Open [Issues](https://github.com/diceframe/diceframe-plugins/issues/new/choose), choose “Add plugin”, and provide only the plugin ID and public repository URL. No fork, JSON editing, SHA-256 calculation, or uploaded package is required.

Automation checks the latest GitHub Release, `plugin.json`, version, repository structure, declared permissions, documentation, license, and obvious secret files. After automated validation, DiceFrame maintainers complete the review in the submission Issue and provide an acceptance or rejection result.

See the [contribution guide](CONTRIBUTING_EN.md) for the complete requirements.

## Update policy

- Declarative `content-pack`, `theme`, and `map-pack` plugins may update automatically while their permissions and runtime model remain unchanged.
- Plugins that launch Python, Node, executables, or another process only notify users about updates; they are never silently updated.
- A permission increase, runtime change, repository transfer, or plugin ID change pauses updates and requires another review.
- Bundled plugins such as QQ / NapCat ship with DiceFrame and are not installed again from the store.

The daily registry sync is only a display cache. DiceFrame resolves the latest repository Release when installing or checking for updates, so scheduled workflow suspension does not stop updates.

## Security

Passing automated validation means only that machine-verifiable format and policy checks passed. It does not prove that code is safe. Third-party executable plugins are displayed with an explicit high-risk classification, and registry inclusion is not a security warranty from DiceFrame.

## Development documentation

- [DiceFrame](https://github.com/diceframe/diceframe)
- [Plugin development guide](https://github.com/diceframe/diceframe/blob/main/docs/PLUGIN_DEVELOPMENT_EN.md)
- [Registry and review policy](https://github.com/diceframe/diceframe/blob/main/docs/PLUGIN_REGISTRY_EN.md)

This registry is licensed under the MIT License. Each plugin uses the license declared in its own repository.

