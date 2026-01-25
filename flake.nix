{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-25.11";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        revision = if (self ? rev) then self.rev else "dirty";
        scripts = import ./scripts.nix { inherit pkgs; };
      in {
        packages.website = pkgs.stdenv.mkDerivation {
          pname = "jamiebrynes.com";
          version = revision;
          src = ./.;
          nativeBuildInputs = [ pkgs.hugo pkgs.tailwindcss ];
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
          buildInputs = with pkgs; [ hugo ] ++ scripts.scripts;
        };
      });
}
