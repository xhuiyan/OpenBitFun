// Boundary rules for source ownership, facades, and required owner content.

export const facadeOnlyFiles = [
  {
    path: 'src/crates/assembly/core/src/agentic/context_profile.rs',
    importPrefix: 'starmate_agent_runtime::context_profile',
    reason: 'core context profile path must only re-export the agent-runtime owner crate',
  },
  {
    path: 'src/crates/assembly/core/src/agentic/core/dialog_turn.rs',
    importPrefix: 'starmate_agent_runtime::dialog_turn',
    reason: 'core dialog-turn facts path must only re-export the agent-runtime owner crate',
  },
  {
    path: 'src/crates/assembly/core/src/agentic/core/session.rs',
    importPrefix: 'starmate_agent_runtime::session',
    reason: 'core session facts path must only re-export the agent-runtime owner crate',
  },
  {
    path: 'src/crates/assembly/core/src/infrastructure/filesystem/mod.rs',
    importPrefix: 'starmate_services_core::filesystem',
    reason: 'core filesystem infrastructure facade must only re-export the services-core owner crate',
  },
  {
    path: 'src/crates/assembly/core/src/infrastructure/events/event_system.rs',
    importPrefix: 'starmate_runtime_services::backend_events',
    reason: 'core backend event system facade must only re-export the runtime-services owner crate',
  },
  {
    path: 'src/crates/assembly/core/src/service/filesystem/listing.rs',
    importPrefix: 'starmate_services_core::filesystem',
    reason: 'core filesystem listing facade must only re-export the services-core owner crate',
  },
  {
    path: 'src/crates/assembly/core/src/service/filesystem/types.rs',
    importPrefix: 'starmate_services_core::filesystem',
    reason: 'core filesystem DTO facade must only re-export the services-core owner crate',
  },
  {
    path: 'src/crates/assembly/core/src/service/git/git_service.rs',
    importPrefix: 'starmate_services_integrations::git',
    reason: 'core git service facade must only re-export the integrations owner crate',
  },
  {
    path: 'src/crates/assembly/core/src/service/git/git_types.rs',
    importPrefix: 'starmate_services_integrations::git',
    reason: 'core git types facade must only re-export the integrations owner crate',
  },
  {
    path: 'src/crates/assembly/core/src/service/git/git_utils.rs',
    importPrefix: 'starmate_services_integrations::git',
    reason: 'core git utils facade must only re-export the integrations owner crate',
  },
  {
    path: 'src/crates/assembly/core/src/service/git/graph.rs',
    importPrefix: 'starmate_services_integrations::git',
    reason: 'core git graph facade must only re-export the integrations owner crate',
  },
  {
    path: 'src/crates/assembly/core/src/service/remote_ssh/types.rs',
    importPrefix: 'starmate_services_integrations::remote_ssh',
    reason: 'core remote SSH types facade must only re-export the integrations owner crate',
  },
  {
    path: 'src/crates/assembly/core/src/service/remote_ssh/manager.rs',
    importPrefix: 'starmate_services_integrations::remote_ssh::manager',
    reason: 'core remote SSH manager facade must only re-export the integrations owner crate',
  },
  {
    path: 'src/crates/assembly/core/src/service/remote_ssh/remote_fs.rs',
    importPrefix: 'starmate_services_integrations::remote_ssh::remote_fs',
    reason: 'core remote SSH filesystem facade must only re-export the integrations owner crate',
  },
  {
    path: 'src/crates/assembly/core/src/service/remote_ssh/remote_terminal.rs',
    importPrefix: 'starmate_services_integrations::remote_ssh::remote_terminal',
    reason: 'core remote SSH terminal facade must only re-export the integrations owner crate',
  },
  {
    path: 'src/crates/assembly/core/src/service/mcp/tool_info.rs',
    importPrefix: 'starmate_services_integrations::mcp',
    reason: 'core MCP tool info facade must only re-export the integrations owner crate',
  },
  {
    path: 'src/crates/assembly/core/src/service/mcp/tool_name.rs',
    importPrefix: 'starmate_services_integrations::mcp',
    reason: 'core MCP tool name facade must only re-export the integrations owner crate',
  },
  {
    path: 'src/crates/assembly/core/src/service/mcp/protocol/types.rs',
    importPrefix: 'starmate_services_integrations::mcp',
    reason: 'core MCP protocol types facade must only re-export the integrations owner crate',
  },
  {
    path: 'src/crates/assembly/core/src/service/mcp/protocol/transport.rs',
    importPrefix: 'starmate_services_integrations::mcp::protocol',
    reason: 'core MCP stdio transport facade must only re-export the integrations owner crate',
  },
  {
    path: 'src/crates/assembly/core/src/service/mcp/protocol/transport_remote.rs',
    importPrefix: 'starmate_services_integrations::mcp::protocol',
    reason: 'core MCP remote transport facade must only re-export the integrations owner crate',
  },
  {
    path: 'src/crates/assembly/core/src/service/mcp/server/connection.rs',
    importPrefix: 'starmate_services_integrations::mcp::server',
    reason: 'core MCP connection facade must only re-export the integrations owner crate',
  },
  {
    path: 'src/crates/assembly/core/src/service/mcp/config/location.rs',
    importPrefix: 'starmate_services_integrations::mcp',
    reason: 'core MCP config location facade must only re-export the integrations owner crate',
  },
  {
    path: 'src/crates/assembly/core/src/service/mcp/adapter/resource.rs',
    importPrefix: 'starmate_services_integrations::mcp',
    reason: 'core MCP resource adapter facade must only re-export the integrations owner crate',
  },
  {
    path: 'src/crates/assembly/core/src/service/mcp/adapter/prompt.rs',
    importPrefix: 'starmate_services_integrations::mcp',
    reason: 'core MCP prompt adapter facade must only re-export the integrations owner crate',
  },
];
