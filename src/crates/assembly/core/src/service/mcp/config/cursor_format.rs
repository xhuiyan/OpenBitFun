use crate::service::mcp::server::MCPServerConfig;
use crate::util::errors::StarMateResult;

pub(super) fn config_to_cursor_format(config: &MCPServerConfig) -> serde_json::Value {
    starmate_services_integrations::mcp::config::config_to_cursor_format(config)
}

pub(super) fn parse_cursor_format(
    config: &serde_json::Value,
) -> StarMateResult<Vec<MCPServerConfig>> {
    Ok(starmate_services_integrations::mcp::config::parse_cursor_format(config))
}
