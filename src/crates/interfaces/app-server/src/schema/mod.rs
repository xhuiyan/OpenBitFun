//! JSON-RPC wire contract for the OpenBitFun app-server surface.
//!
//! Schema types are grouped by product domain while this module re-exports the
//! complete contract. Existing consumers can continue importing types from
//! `starmate_app_server::schema` without depending on the internal layout.

pub use starmate_app_server_protocol::agent::*;
pub use starmate_app_server_protocol::app::*;
pub use starmate_app_server_protocol::config::*;
pub use starmate_app_server_protocol::event::{
    AgentEventNotification as SessionEventNotification, ConfigEventNotification, ConfigUpdate,
    EventCursor, EventStream, EventStreamState, EventStreamStateNotification,
    FrontendEventNotification, PermissionEventNotification, ResyncDirective, SyncEventsRequest,
    SyncEventsResponse,
};
pub use starmate_app_server_protocol::git::*;
pub use starmate_app_server_protocol::i18n::*;
pub use starmate_app_server_protocol::permission::*;
pub use starmate_app_server_protocol::search::*;
pub use starmate_app_server_protocol::session::*;
