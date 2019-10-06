TIMESTAMP=$(shell date '+%Y-%m-%d')
CWD=$(shell pwd)

.PHONY: serve build_web zola clean spellcheck spellcheck-docker stylelint stylelint-docker

serve: zola
	-docker kill zola 
	docker run --name "zola" --rm -v /$(CWD):/github/ -e GITHUB_WORKSPACE="//github" -e ZOLA_COMMAND="serve --interface 0.0.0.0" -p 1111:1111 zola:latest

build: zola
	docker run -v /$(CWD):/github/ -e GITHUB_WORKSPACE="//github" zola:latest

lint: spellcheck stylelint

stylelint: stylelint-docker
ifdef fix 
	docker run -v /$(CWD):/github/ -e GITHUB_WORKSPACE="//github" stylelint:latest --fix
else
	docker run -v /$(CWD):/github/ -e GITHUB_WORKSPACE="//github" stylelint:latest
endif

spellcheck: spellcheck-docker
	docker run -v /$(CWD):/github/ -e GITHUB_WORKSPACE="//github" spellcheck:latest

zola:
	docker build --file ./.github/actions/zola/Dockerfile --tag zola:latest ./.github/actions/zola

spellcheck-docker:
	docker build --file ./.github/actions/spellcheck/Dockerfile --tag spellcheck:latest ./.github/actions/spellcheck

stylelint-docker:
	docker build --file ./.github/actions/stylelint/Dockerfile --tag stylelint:latest ./.github/actions/stylelint

clean:
	rm -rf ./public/