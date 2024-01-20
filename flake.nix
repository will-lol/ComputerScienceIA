{
  description = "ComputerScienceIA";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system: 
      let 
	overlays = [];
	lib = nixpkgs.lib;
	manifest = (lib.importTOML ./Cargo.toml).package;
	pkgs = import nixpkgs { inherit system overlays; };
      in
        {
	  packages = {
	  };
	  devShell = pkgs.mkShell {
	    packages = [ pkgs.nodejs_18 ];
	  };
	}
    );
}
