# PurgeCSS Preflight
This project will allow you to preview PurgeCSS configurations against a project directory and allow you to see what will be removed as a result of running PurgeCSS against your project. Nothing will be removed, however, the audit will generate a logfile that will allow you to fine tune the config (especially the `safelist` property) to get the desired result.

## Usage
To use this script, provide the command line parameters as described below when running the script:
`--config, -c <path>`: This option allows you to specify the path of the configuration file for PurgeCSS.
`--project-base, -b <path>`: This is the path to the base directory of the project you are auditing.
`--output, -o <path>`: Here, you can specify the path to your output log file where the results will be stored.

It outputs the details of unused CSS properties into the specified log file. If a safelist is specified in the PurgeCSS configuration, it will not log any classes or IDs that have been added to the safelist.

```shell
node ./index.js -o ./unused-css.txt -c /path/to/purgecss/config.js -b /path/to/project/directory
```
