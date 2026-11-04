//! MCP server configuration types.

use crate::util::errors::StarMateError;

use starmate_services_integrations::mcp::server::MCPServerConfigValidationError;
pub use starmate_services_integrations::mcp::server::{
    MCPImportOrigin, MCPServerConfig, MCPServerOAuthConfig, MCPServerTimeouts, MCPServerTransport,
    MCPServerXaaConfig,
};

impl From<MCPServerConfigValidationError> for StarMateError {
    fn from(error: MCPServerConfigValidationError) -> Self {
        Self::Configuration(error.to_string())
    }
}
