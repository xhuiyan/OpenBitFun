//! Canvas service compatibility facade.
//!
//! Concrete Canvas storage and compilation live in `openbitfun-services-integrations`.
//! Keep this module as the legacy `starmate_core::service::canvas` import path
//! while callers migrate to the provider owner.

pub use starmate_services_integrations::canvas::{
    compile_canvas_component_js, compile_canvas_html, compile_canvas_source, CanvasMemoryStore,
    CanvasService,
};
