+++
title = "Projects | April & May 2019"
description = "Updates on the SpatialOS SDK for Rust and discussion of the work required to reach an initial release."

[taxonomies]
tags = ["project-updates", "rustlang", "spatialos", "website"]
+++

You may have noticed that these updates are now bimonthly instead of monthly. The reason for this is simple. I simply don't have enough content to reasonably fill a blog post every single month, by widening the window I can limit variance. 

# Website

In the last two months I've migrated my blog & website from [Ghost](https://ghost.org/) to [Zola](https://www.getzola.org/). My experience so far has been good! Its worth enumerating the reasons why I wanted to migrate (ignoring morbid curiousity and the sake of learning):

1. **Plays nice with Git.** Being able to source control the content and design of my website is a huge plus. It also means I can get up CI pipelines to verify any changes or lint any blog posts.
1. **Lightweight.** While Ghost blogs are not necessarily too heavy, with Zola, I have far more direct control over the content that is served. In particular, I have no need for features like a WYSIWYG editor or multi-user support.
1. **Built in Rust.** I like Rust as a language and I want to see it succeed. One (small) way that I can contribute to that is by using tooling built in Rust and advocate for it.
1. (Bonus) **Custom shortcodes.** Zola is very extensible with a robust shortcode system built on top of the [Tera templating engine](https://tera.netlify.com/).


That's not to say it was smooth sailing all the way. The upfront cost of a static site generator, with a limited ecosystem, is much greater than a batteries-included product like Ghost. In particular, I built the website from scratch. There's aren't many [existing themes for Zola](https://www.getzola.org/themes/), especially when you consider the sheer number of those available for Ghost. This is certainly **not** my area of expertise and probably required more time than strictly necessary.

# [SpatialOS SDK for Rust](https://www.github.com/jamiebrynes7/spatialos-sdk-rs)

In April, I ended up giving a talk at the local [Rust London User Group](https://www.meetup.com/Rust-London-User-Group/) meetup. To go along with the talk, I built a small demo on top of the Rust SDK and using the built in Inspector as the visualiser. This gave me a great opportunity to dogfood the current APIs. And of course, in the process of building the demo I uncovered bugs and features that I didn't realise were missing!