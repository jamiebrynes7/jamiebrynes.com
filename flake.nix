{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in {
        packages.website = pkgs.stdenv.mkDerivation rec {
          pname = "jamiebrynes.com";
          version = "1.0.0";
          src = ./.;
          nativeBuildInputs = [ 
            pkgs.hugo
            pkgs.tailwindcss
          ];
          buildPhase = ''
            tailwindcss -i assets/css/main.css -o static/main.min.css --minify
            hugo --minify
          '';
          installPhase = ''
            cp -r public $out
          '';
        };
        defaultPackage = self.packages.${system}.website;

        devShell = pkgs.mkShell {
          buildInputs = [
            pkgs.hugo
            pkgs.tailwindcss
          ];
        };
      }
    );
}
