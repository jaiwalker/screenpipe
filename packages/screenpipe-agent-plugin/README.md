# screenpipe agent plugin

Portable Agent Plugin for using screenpipe as local-first workflow memory. It
bundles the screenpipe MCP server configuration with an Agent Skill for finding
traceable work evidence, reconstructing multi-app tasks, drafting cited SOPs,
and identifying automation candidates.

## Requirements

- screenpipe installed and running locally
- Node.js 18 or newer for the MCP server
- An Agent Plugins-compatible host such as Kiro or Cursor

The plugin starts the pinned `screenpipe-mcp` package over stdio. The MCP server
connects to the user's local screenpipe API and discovers its API key from the
documented screenpipe configuration sources.

## Privacy and data flow

Screen and audio history remains in the user's screenpipe instance. Only
evidence retrieved for the current task enters the host agent or model context.
The plugin disables the MCP package's outbound usage and error telemetry.

The MCP server exposes both retrieval and mutation tools. Retrieval is the
default workflow; agents are instructed to use mutation tools only after an
explicit user request.

- [Privacy policy](https://screenpipe.com/privacy)
- [Security](https://screenpipe.com/security)
- [Support and bug reports](https://github.com/screenpipe/screenpipe/issues)
- [Documentation](https://docs.screenpipe.com)

## Contents

- `plugin.json`: portable Agent Plugins manifest
- `mcp.json`: portable MCP server configuration
- `skills/screenpipe/SKILL.md`: workflow-memory guidance and safety boundaries

## License

See the [screenpipe license](https://github.com/screenpipe/screenpipe/blob/main/LICENSE.md).
