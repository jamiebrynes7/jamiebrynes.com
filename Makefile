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

build: build_web

build_web: tools/zola
	./tools/zola build

tools/zola: tools/
	wget -qO- https://github.com/getzola/zola/releases/download/v0.7.0/zola-v0.7.0-x86_64-unknown-linux-gnu.tar.gz | tar xvz -C ./tools/
	touch ./tools/zola

tools/: 
	mkdir -p ./tools

clean:
	rm -rf ./tools/
	rm -rf ./public/

create-post:
	echo "$$POST_TEMPLATE" > ./content/blog/$(TIMESTAMP)-$(TITLE).md