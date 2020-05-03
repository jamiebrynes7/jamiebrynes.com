+++
title = "SpatialOS SDK for Rust"
template = "projects/project.html"
description = '''
<p>The Rust SpatialOS SDK is a hobby project Rust implementation of the Worker SDK for SpatialOS.</p>

<p>The goal of this project is to wrap the C SDK in a <em>safe</em> and native Rust interface.</p>
'''
weight = 0

[extra]
img_path = "imgs/rust-sdk.PNG"
github_slug = "jamiebrynes7/spatialos-sdk-rs"
+++

The SpatialOS SDK for Rust is a hobby project Rust implementation of the [Worker SDK](https://documentation.improbable.io/sdks-and-data/lang-en/docs#section-worker-sdk) for SpatialOS.

The goal of this project is to wrap the C SDK in a _safe_ and native Rust interface. Along with this, the project provides a code generation implementation and a cargo plugin to manage 'spatial'-y things. Ultimately, this project should have at least feature parity with the official Worker SDKs provided by Improbable. 

At the time of writing, the project is in 'pre-release' mode. It is _usable_, but neither feature complete nor battle tested. I plan to publish a few crates relating to this project once it is sufficiently mature.

In April 2019, I gave a short talk about this project at the [Rust London User Group](https://www.meetup.com/Rust-London-User-Group/) meetup. You can find the slides from this talk on [Google Drive](https://docs.google.com/presentation/d/1lBDfOMS7p-hNlW08Z3xa1Yn7BFXT0aD2Nn1AbKw3a1E/edit?usp=sharing) and the demo code on [GitHub](https://docs.google.com/presentation/d/1lBDfOMS7p-hNlW08Z3xa1Yn7BFXT0aD2Nn1AbKw3a1E/edit?usp=sharing) (disclaimer - the demo code pretty likely doesn't work anymore).

{{ lightbox(src="/blog/rust-ldn-demo-q2-2019.png", caption="A section of the Inspector from the demo.") }}