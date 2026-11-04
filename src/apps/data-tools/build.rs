fn main() {
    for name in [
        "STARMATE_RELEASE_CHANNEL",
        "STARMATE_PRODUCT_ID",
        "STARMATE_DESKTOP_BINARY_NAME",
        "STARMATE_PRODUCT_BINARY_NAME",
    ] {
        println!("cargo:rerun-if-env-changed={name}");
    }
    tauri_build::build();
}
