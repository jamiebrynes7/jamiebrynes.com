[parallel]
dev: hugo-dev tailwind-dev

hugo-dev:
  hugo serve

tailwind-dev:
  tailwindcss -i assets/css/main.css -o static/main.css --watch