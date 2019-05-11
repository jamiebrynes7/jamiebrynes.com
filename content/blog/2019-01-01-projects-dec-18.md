+++
title = "Projects | December 2018"
+++

_This is the first in a series of posts, to be published monthly, detailing the state of my current side projects._

# SpatialOS SDK for Rust

I'm making good progress on the Rust bindings for the SpatialOS SDK. Notably I've:

- Added the locator connection flow, this allows you to connect to cloud deployments as a client.
- Upgraded to Rust 2018 edition and Rust 1.31
- `spatialos-sdk-sys` now looks for the SpatialOS C API libraries as specified by an environment variable `SPATIAL_LIB_DIR`.
- Added Clippy as part of the linting step. This allows me to keep code quality high and write more idiomatic Rust.
- Used the futures crate and `Future` trait for the Worker SDK futures: `WorkerConnectionFuture` and `DeploymentListFuture`. 
- Reworked the example project to be more flexible.

Looking forward to the following month my focus is around: 

- A more user-friendly API for various objects - the start of which can be found [here](https://github.com/jamiebrynes7/spatialos-sdk-rs/pull/37). For example, using metrics:

```rust
let mut m = Metrics::new()
    .with_load(0.2)
    .with_gauge_metric("some_metric", 0.15)
    .with_histogram_metric("histogram_metric", HistogramMetric::new(&[6.7]));

let gauge_metric = m.add_gauge_metric("another_metric").unwrap();
*gauge_metric = 0.2;

let histogram_metric = m
    .add_histogram_metric("another_histogram", &[0.1, 0.2, 0.3])
    .unwrap();
histogram_metric.add_sample(1.0);
histogram_metric.add_sample(0.5);
```

- Writing more unit tests and integration tests to guarantee behaviour correctness.
- Catching up with the SpatialOS SDK release cycle (currently at `13.5.0`!)

In parallel, [a colleague and friend of mine](http://dga.me.uk/) has been working on the generated code MVP so that you can use schema types in Rust in a native way. I'm still pondering on how to structure a SpatialOS & Rust project - do you have a local crate just for generated code? Does the code generation happen at build time? Some questions to answer when testing the workflow.

# Git Tools

This last month I've started to revisit this project with fresh eyes as I've gained more Rustlang experience. I upgraded the project to Rust 2018 edition (super easy thanks to `cargo fix`!) and started to port the tools across to use the [`git2-rs`](https://github.com/alexcrichton/git2-rs) crate instead of invoking commands directly.

I'm hoping to complete this in the next month and I look forward to doing another release once complete. On the note of releases - I'll be looking to refactor the CI setup so that I can build Windows, Linux, and MacOS binaries.