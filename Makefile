TIMESTAMP=$(shell date '+%Y-%m-%d')
CWD=$(shell pwd)

.PHONY: serve build_web zola clean spellcheck

serve: zola
	docker run -v $(CWD):/var/website -p 1111:1111 local/website/zola serve --interface 0.0.0.0

build: zola
	docker run -v $(CWD):/var/website local/website/zola build

lint: spellcheck
	docker run -v /$(CWD):/github/ -e GITHUB_WORKSPACE="//github" spellcheck:latest

zola:
	docker build --file ./ci/zola.Dockerfile --tag local/website/zola .

spellcheck:
	docker build --file ./.github/actions/spellcheck/Dockerfile --tag spellcheck:latest ./.github/actions/spellcheck

clean:
	rm -rf ./public/