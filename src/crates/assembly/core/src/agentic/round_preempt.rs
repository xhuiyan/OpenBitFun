//! Compatibility re-exports for round-boundary injection state.

pub use starmate_agent_runtime::scheduler::{
    DialogRoundInjectionInterrupt, NoopDialogRoundInjectionSource, SessionRoundInjectionBuffer,
};
pub use starmate_runtime_ports::{
    DialogRoundInjectionSource, RoundInjection, RoundInjectionKind, RoundInjectionTarget,
};
