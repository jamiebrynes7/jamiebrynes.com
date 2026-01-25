{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-25.11";
    flake-utils.url = "github:numtide/flake-utils";
    rust-overlay = {
      url = "github:oxalica/rust-overlay";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = { self, nixpkgs, flake-utils, rust-overlay, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        overlays = [ (import rust-overlay) ];
        pkgs = import nixpkgs { inherit system overlays; };

        rustToolchain = pkgs.rust-bin.stable.latest.default.override {
          extensions = [ "rust-analyzer" "rust-src" ];
        };
      in {
        devShell = pkgs.mkShell {
          buildInputs = with pkgs; [
            # General tools
            just

            # For editing Nix
            nil
            nixfmt-classic

            # Static site tools
            hugo
            tailwindcss

            # Rust toolchain
            rustToolchain
          ];
        };
      });
}
