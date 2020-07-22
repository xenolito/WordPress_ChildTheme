# WordPress Child Theme Scaffolding

## BEFORE RUNNING SETUP

### 1) YOU'LL NEED:

Before running the setup process, you'll need the following already installed/running

- A working WordPress installation on a local server (httpdocs folder will be required).
- A Parent Theme installed on `themes` folder.
- A Child Theme folder created on `themes`folder.

## HOW TO SETUP:

### 2) run -> `gulp setup`

You'll be propmted for the following configuration values:

- The folder containing the _WordPress CMS_
- The _child theme_ folder name
- The childtheme's _name_

This wil create al needed folders and childtheme files on target WordPress folder.

### 3) run --> `gulp`

After setup have been run, a configuration file is created `configSetup.json`.
Since then, only `gulp` is needed to launch a local server with watch files.

### TODO

- Add some config values to wp-config.php
- Add to functions.php the "WP EMAIL FROM CUSTOMIZATION" section.
