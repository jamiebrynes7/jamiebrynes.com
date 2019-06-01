+++
title = "Projects | February & March 2019"
description = "Updates on the SpatialOS SDK for Rust and discussion of the work required to reach an initial release."

[taxonomies]
tags = ["project-updates", "rustlang", "spatialos"]
+++

Well – I missed the last month's update, and to be honest, there wasn't a whole lot in it, so I've decided to combine the two months into one!


# [SpatialOS SDK for Rust](https://www.github.com/jamiebrynes7/spatialos-sdk-rs) 

Since the [last update](/blog/projects-jan-19), there have been a number of milestones hit:

- The first pass of `cargo-spatial` has landed! 🎉 This is a tool that allows you to interact with your SpatialOS & Rust project through `cargo`. At the time of writing it supports: `codegen`, `local launch`, and `generate` (which generates a random, valid component ID). [#58](https://github.com/jamiebrynes7/spatialos-sdk-rs/pull/58)
- The project has been upgraded to SpatialOS SDK `13.6.0`! [#73](https://github.com/jamiebrynes7/spatialos-sdk-rs/pull/73).
- The `WorkerConnection` struct is now `Send/Sync` and all APIs have been implemented! [#15](https://github.com/jamiebrynes7/spatialos-sdk-rs/issues/15).
- The `ComponentDatabase` struct is now an internal implementation detail through the magic of [`inventory`](https://crates.io/crates/inventory). This means users don't have to explicitly register their components at startup - a nice ergonomic improvement. 
- Connecting via development authentication (alpha Locator flow) is supported. [#60](https://github.com/jamiebrynes7/spatialos-sdk-rs/pull/60)
- The Snapshot APIs have been completed. [#80](https://github.com/jamiebrynes7/spatialos-sdk-rs/pull/80)

## The Road to `v0.1.0`

We are now approaching the point where we could consider calling it a `v0.1.0` crate release. However, there are some large pieces of work left.

In particular, code generation needs to be tested properly. Already some bugs have been found ([#72](https://github.com/jamiebrynes7/spatialos-sdk-rs/issues/72)) and there are likely to be more under the surface. There are also some improvements to the user facing API in code generation ([#67](https://github.com/jamiebrynes7/spatialos-sdk-rs/issues/67)) which I feel are almost mandatory.

There is also a (strong) argument that more of the APIs should have testing (unit & integration) before we can release - however, certain parts of the API (`WorkerConnection` for example) are quite hard to test properly in isolation due to the dependencies on the `spatial` CLI or the SpatialOS Runtime. This feels like an 80/20 situation.

I also want to use the SDK in anger before I feel confident with the APIs that we have built. However, a `v0.1.0` doesn't mean that the APIs are finalized in any way. There is definitely a balance that needs to be struck.