default:
	RUSTFLAGS="-C target-feature=+simd128" cargo build --release
	mkdir -p dist
	wasm-bindgen ./target/wasm32-unknown-unknown/release/parser.wasm --out-dir dist