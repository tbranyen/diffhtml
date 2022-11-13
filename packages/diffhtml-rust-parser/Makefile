default:
	RUSTFLAGS="-C target-feature=+simd128" cargo +nightly build --release
	mkdir -p dist
	wasm-bindgen ./target/wasm32-unknown-unknown/release/parser.wasm --target=bundler --omit-default-module-path --out-dir dist
