+++
title = "Projects | January 2019"
description = "Good progress for the Rust SpatialOS SDK and some not-so-good progress on Git Tools."

[taxonomies]
tags = ["project-updates", "rustlang", "spatialos"]
+++


# [SpatialOS SDK for Rust](https://www.github.com/jamiebrynes7/spatialos-sdk-rs)

This month has been a slower month from me personally on the Rust bindings. Despite this, there have been some exciting developments:

- Landed a first iteration of code generation - this will allow for quicker iteration and discovery of an ideal API through usage. 
- The project has its [first community contributor](https://github.com/randomPoison)! He's since made some improvements and its good to see the community both take interest and wanting to contribute to the project.

A general laundry list of other notable changes:

- Actually having a license! Dual Apache 2.0/MIT as is tradition in Rust.
- Upgrading to the latest and greatest SpatialOS SDK (13.5.1). (The Development Authentication connection flow still outstanding!)
- Actually running the Spatial CLI in Travis! No longer hacking together the packages with Google Drive.
- `OpList` and associated ops now have lifetimes relating to the underlying pointer lifetimes.

Looking forward to the next month I'd like to continue and build upon the work of last month: 

- Finish the upgrade to 13.5.1. ([#24](https://github.com/jamiebrynes7/spatialos-sdk-rs/issues/24))
- Dog food the generated code implementation and add some correctness testing (exhaustive schema testing?) 
- Finish the implementation of the Connection API. ([#15](https://github.com/jamiebrynes7/spatialos-sdk-rs/issues/15))

Having said that, I find my self with less free time to work on this project at the moment - what with GDC coming up so soon. Progress may be slower as a result.

# [Git Tools](https://www.github.com/jamiebrynes7/git-tools)

A quick note on this, as I mentioned it during the last month's roundup. I haven't had time to revisit this one properly and have shelved the planned changes until a later date. 