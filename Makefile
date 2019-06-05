define POST_TEMPLATE
+++
title = ""
description = ""

[taxonomies]
tags = []
+++
endef

export POST_TEMPLATE

TIMESTAMP=$(shell date '+%Y-%m-%d')
CWD=$(shell pwd)

.PHONY: serve build_web zola clean create-post write-good spellcheck

serve: zola
	docker run -v $(CWD):/var/website -p 1111:1111 local/website/zola serve --interface 0.0.0.0

build: zola
	docker run -v $(CWD):/var/website local/website/zola build

lint: write-good spellcheck
	docker run -v $(CWD)/content/blog:/var/src local/website/write-good
	docker run -v $(CWD):/var/src local/website/spellcheck spellchecker -f 'content/blog/*.md' '!content/blog/1970-01-01-mkdown-test.md' '!content/blog/_index.md' -l en-GB -d ci/dictionary

zola:
	docker build --file ./ci/zola.Dockerfile --tag local/website/zola .

write-good: 
	docker build --file ./ci/write-good.Dockerfile --tag local/website/write-good .

spellcheck:
	docker build --file ./ci/spellcheck.Dockerfile --tag local/website/spellcheck .

clean:
	rm -rf ./public/

create-post:
	echo "$$POST_TEMPLATE" > ./content/blog/$(TIMESTAMP)-$(TITLE).md