export PATH := $(HOME)/.local/share/mise/installs/node/20/bin:$(HOME)/.cargo/bin:$(PATH)

.PHONY: dev build install deps bump-patch bump-minor bump-major clean

# Start dev mode (Vite + Tauri window)
dev:
	cargo tauri dev

# Production release build
build:
	cargo tauri build

# Install JS dependencies
deps:
	npm ci

# Install the .deb locally (after build)
install:
	sudo dpkg -i src-tauri/target/release/bundle/deb/FunfunZenWriter_*.deb

# Version bumps
bump-patch:
	./bump.sh patch

bump-minor:
	./bump.sh minor

bump-major:
	./bump.sh major

# Remove build artifacts
clean:
	rm -rf build .svelte-kit src-tauri/target
