# WordPress Child Theme Scaffolding

## HOW TO SETUP:

### 1) run -> `gulp setup`

You'll be propmted for the following configuration values:

- The folder containing the _WordPress CMS_
- The _child theme_ folder name
- The childtheme's _name_

This wil create al needed folders and childtheme files on target WordPress folder.

### 2) run --> `gulp`

After setup have been run, a configuration file is created `configSetup.json`.
Since then, only `gulp` is needed to launch a local server with watch files.

### TODO

- A way to prompt and setup the path to "httpdocs"
- Add some config values to wp-congig.php
