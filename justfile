[parallel]
dev: hugo-dev tailwind-dev arbgen-dev

build: arbgen-gen tailwind-build hugo

hugo-dev:
  hugo serve

hugo:
  hugo --minify

tailwind-dev:
  tailwindcss -i assets/css/main.css -o static/main.css --watch

tailwind-build:
  tailwindcss -i assets/css/main.css -o static/main.min.css --minify

arbgen-dev:
  cargo run -p arbgen -- --watch

arbgen-gen:
  cargo run -p arbgen
