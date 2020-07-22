# WordPress Child Theme Scaffolding

## HOW TO SETUP:

### 1) run -> `gulp setup`

You'll be propmted for the following configuration values.\s
--> The folder containing the _WordPress CMS_\s\s
--> The _child theme_ folder name\s\s
--> The childtheme's _name_\s\s

This wil create al needed folders and childtheme files on target WordPress folder.

### 2) run --> `gulp`

After setup have been run, a configuration file is created `configSetup.json`.
Since then, only `gulp` is needed to launch a local server with watch files.

### TODO

- Setup a prompt for parent theme name, so we can set our child theme's style.css pointing to the parent.
- A way to prompt and setup the path to "httpdocs"
