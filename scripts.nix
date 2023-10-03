{ pkgs }:
let
  scriptify = { name, exec}: pkgs.writeShellScriptBin name exec;
  commands = [
    {
      name = "watchCss";
      exec = "${pkgs.tailwindcss}/bin/tailwindcss -i assets/css/main.css -o static/main.css -w";
    }
  ];
in {
  scripts = map scriptify commands;
}