use anyhow::{Context, Result};

use starmate_core::product_assembly::DeliveryProfile;
use starmate_core::product_runtime::CoreRuntimeServicesProvider;
use starmate_core::runtime_ownership::CoreRuntimeOwnership;
use std::sync::Arc;

pub(crate) use starmate_core::agentic::system::AgenticSystem;

pub(crate) fn select_agentic_system_profile(profile: DeliveryProfile) -> Result<()> {
    starmate_core::agentic::system::select_agentic_system_profile(profile)
        .context("Failed to select agentic system delivery profile")
}

pub(crate) async fn init_agentic_system(
    profile: DeliveryProfile,
    runtime_ownership: Arc<CoreRuntimeOwnership>,
    computer_use_host: Option<
        starmate_core::agentic::tools::computer_use_host::ComputerUseHostRef,
    >,
) -> Result<AgenticSystem> {
    let system = starmate_core::agentic::system::init_agentic_system_with_computer_use_host(
        profile,
        runtime_ownership,
        computer_use_host,
    )
    .await
    .context("Failed to initialize agentic system")?;
    system
        .coordinator
        .set_terminal_port(CoreRuntimeServicesProvider::terminal_port());
    system
        .coordinator
        .set_remote_exec_port(CoreRuntimeServicesProvider::remote_exec_port());
    Ok(system)
}
