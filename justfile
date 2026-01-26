[parallel]
dev: hugo-dev tailwind-dev arbgen-dev arbgen-gen-theme

build: arbgen-gen-theme arbgen-gen tailwind-build hugo

hugo-dev:
  hugo serve

hugo:
  hugo --minify

tailwind-dev:
  tailwindcss -i assets/css/main.css -o static/main.css --watch

tailwind-build:
  tailwindcss -i assets/css/main.css -o static/main.min.css --minify

arbgen-dev:
  cd tools/arbgen && cargo run -- snippets --watch --target-dir={{justfile_directory()}}/content

arbgen-gen:
  cd tools/arbgen && cargo run snippets --target-dir={{justfile_directory()}}/content

arbgen-gen-theme:
  cd tools/arbgen && cargo run -- theme --out={{justfile_directory()}}/assets/css/code.gen.css --light="Catppuccin Latte" --dark="Tokyo Night"
