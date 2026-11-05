//! Immutable identity facts compiled into first-party product artifacts.
//!
//! Product build adapters derive these values from the selected product
//! definition. They are compile-time facts rather than runtime configuration:
//! a running process cannot switch product identity or storage namespaces.

const DEFAULT_PRODUCT_ID: &str = "openbitfun";
const DEFAULT_DATA_NAMESPACE: &str = "starmate";
const DEFAULT_HIDDEN_DATA_DIRECTORY: &str = ".starmate";
const LEGACY_DATA_NAMESPACE: &str = "openbitfun";
const LEGACY_HIDDEN_DATA_DIRECTORY: &str = ".openbitfun";

/// Stable identifier for the product family represented by this artifact.
pub const fn product_id() -> &'static str {
    match option_env!("STARMATE_PRODUCT_ID") {
        Some(value) => value,
        None => DEFAULT_PRODUCT_ID,
    }
}

/// Storage namespace paired with [`product_id`].
pub const fn data_namespace() -> &'static str {
    match option_env!("STARMATE_DATA_NAMESPACE") {
        Some(value) => value,
        None => DEFAULT_DATA_NAMESPACE,
    }
}

/// Hidden directory name derived from [`data_namespace`] by the build adapter.
///
/// The same name is used for the product home and project-local product data.
pub const fn hidden_data_directory() -> &'static str {
    match option_env!("STARMATE_HIDDEN_DATA_DIRECTORY") {
        Some(value) => value,
        None => DEFAULT_HIDDEN_DATA_DIRECTORY,
    }
}

/// Persisted namespace used by artifacts built before the StarMate rebrand.
///
/// Only first-party OpenBitFun-family builds have a legacy namespace to migrate.
pub fn legacy_data_namespace() -> Option<&'static str> {
    (product_id() == DEFAULT_PRODUCT_ID && data_namespace() != LEGACY_DATA_NAMESPACE)
        .then_some(LEGACY_DATA_NAMESPACE)
}

/// Persisted hidden directory name used before the StarMate rebrand.
pub fn legacy_hidden_data_directory() -> Option<&'static str> {
    (product_id() == DEFAULT_PRODUCT_ID && hidden_data_directory() != LEGACY_HIDDEN_DATA_DIRECTORY)
        .then_some(LEGACY_HIDDEN_DATA_DIRECTORY)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn default_identity_is_starmate_under_openbitfun_product_family() {
        assert_eq!(product_id(), "openbitfun");
        assert_eq!(data_namespace(), "starmate");
        assert_eq!(hidden_data_directory(), ".starmate");
        assert_eq!(legacy_data_namespace(), Some("openbitfun"));
        assert_eq!(legacy_hidden_data_directory(), Some(".openbitfun"));
    }
}
