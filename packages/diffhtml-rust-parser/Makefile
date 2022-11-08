default:
	cargo build --release
	mkdir -p dist
	wasm-bindgen ./target/wasm32-unknown-unknown/release/parser.wasm --out-dir dist
