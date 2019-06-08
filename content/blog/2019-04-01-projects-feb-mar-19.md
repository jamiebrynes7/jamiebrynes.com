+++
title = "Projects | February & March 2019"
description = "Updates on the SpatialOS SDK for Rust and discussion of the work required to reach an initial release."

[taxonomies]
tags = ["project-updates", "rustlang", "spatialos"]
+++

Well – I missed the last month's update, and to be honest, there wasn't a whole lot in it, so I've decided to combine the two months into one!


# [SpatialOS SDK for Rust](https://www.github.com/jamiebrynes7/spatialos-sdk-rs) 

Since the [last update](/blog/projects-jan-19), we've hit some milestones:

- The first pass of `cargo-spatial` has landed! 🎉 This is a tool that allows you to interact with your SpatialOS & Rust project through `cargo`. At the time of writing it supports: `codegen`, `local launch`, and `generate` (which generates a random, valid component ID). [#58](https://github.com/jamiebrynes7/spatialos-sdk-rs/pull/58)
- Upgraded the project to SpatialOS SDK `13.6.0`! [#73](https://github.com/jamiebrynes7/spatialos-sdk-rs/pull/73).
- The `WorkerConnection` struct is now `Send/Sync` and the API is fully implemented! [#15](https://github.com/jamiebrynes7/spatialos-sdk-rs/issues/15).
- The `ComponentDatabase` struct is now an internal implementation detail through the magic of [`inventory`](https://crates.io/crates/inventory). This means users don't have to explicitly register their components at startup - a nice ergonomic improvement. 
- Support for connecting via development authentication (alpha Locator flow). [#60](https://github.com/jamiebrynes7/spatialos-sdk-rs/pull/60)
- The Snapshot APIs are complete. [#80](https://github.com/jamiebrynes7/spatialos-sdk-rs/pull/80)

## The Road to `v0.1.0`

We are now approaching the point where we could consider calling it a `v0.1.0` crate release, but there are some large pieces of work left.

In particular, we need to test code generation properly. We've already found some bugs ([#72](https://github.com/jamiebrynes7/spatialos-sdk-rs/issues/72)) and thorough testing will root out any that remain. The user facing API in generated code still needs some improvements ([#67](https://github.com/jamiebrynes7/spatialos-sdk-rs/issues/67) for example) which I feel are almost mandatory.

I also believe that more of the APIs should have testing (unit & integration) before we can release. Certain parts of the API (`WorkerConnection` for example) are often hard to test properly in isolation due to the dependencies on the `spatial` CLI or the SpatialOS Runtime. This feels like an 80/20 situation where a smaller subset of tests will provide the coverage required for a MVP release.
