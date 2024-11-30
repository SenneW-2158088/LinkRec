{
  description = "The ubermench nodeJS development flake with Docker";
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    darwin.url = "github:lnl7/nix-darwin";
    darwin.inputs.nixpkgs.follows = "nixpkgs";
  };
  outputs = {
    self,
    nixpkgs,
    flake-utils,
    darwin,
  }:
    {
      darwinConfigurations.docker = darwin.lib.darwinSystem {
        system = "aarch64-darwin"; # Change if using Intel Mac
        modules = [
          ({pkgs, ...}: {
            virtualisation.docker.enable = true;
            services.nix-daemon.enable = true;
          })
        ];
      };
    }
    // flake-utils.lib.eachDefaultSystem (system: let
      pkgs = import nixpkgs {
        inherit system;
        config.allowUnfree = true;  # Allow unfree packages
      };
    in {
      devShells.default = pkgs.mkShell {
        buildInputs = with pkgs; [
          postman

          nodejs_22
          nodePackages.yarn
          nodePackages.typescript-language-server
          nodePackages.vscode-langservers-extracted

          docker
          docker-compose
          docker-client
        ];
      };
    });
}
