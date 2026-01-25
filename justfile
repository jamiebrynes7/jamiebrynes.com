[parallel]
dev: hugo-dev tailwind-dev arbgen-dev

hugo-dev:
  hugo serve

tailwind-dev:
  tailwindcss -i assets/css/main.css -o static/main.css --watch

arbgen-dev:
  cd tools/arbgen && cargo run -- snippets --watch --target-dir={{justfile_directory()}}/content

arbgen-gen-theme:
  cd tools/arbgen && cargo run -- theme --out={{justfile_directory()}}/assets/css/code.gen.css --light="Catppuccin Latte" --dark="Tokyo Night"