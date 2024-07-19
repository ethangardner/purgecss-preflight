import path from "path";
import fs from "fs";
import {PurgeCSS} from "purgecss";
import {Command} from "commander";

const program = new Command();

program
    .option('-c, --config <path>', 'Path to configuration file')
    .option('-b, --project-base <path>', 'The path to the project directory you\'re assessing')
    .option('-o, --output <path>', 'Path to output log file');

program.parse(process.argv);

const options = program.opts();
const purgeCSSConfigFile = await import(options.config);
const purgeCSSConfig = purgeCSSConfigFile.default;
const logStream = fs.createWriteStream(path.resolve(options.output));

const pathOverride = (item) => {
    return path.posix.resolve(path.posix.join(options.projectBase, item));
};

const purgeCSSModified = {
    ...purgeCSSConfig,
    css: purgeCSSConfig.css.map(pathOverride),
    content: purgeCSSConfig.content.map(pathOverride),
}

async function unusedCss(config) {
    return await new PurgeCSS().purge({
        ...config,
        rejected: true,
        rejectedCss: true
    });
}

(async () => {
    console.log(`\n==================\n`);
    console.log(`Starting audit for the project in: ${path.resolve(options.projectBase)}`);
    console.log(`- CSS file(s): ${path.resolve(purgeCSSModified.css.join(', '))}`);
    console.log(`- Content path(s): ${path.resolve(purgeCSSModified.content.join(', '))}`);

    const data = await unusedCss(purgeCSSModified);
    logStream.write(`========= New audit at ${new Date()} =========\n`);
    data.forEach(item => {
        logStream.write(`File:\t${item.file}\n`);
        item.rejected.forEach(prop => {
            if (typeof purgeCSSModified.safelist !== 'undefined' && Array.isArray(purgeCSSModified.safelist)) {
                if (purgeCSSModified.safelist.indexOf(prop) === -1) {
                    logStream.write(`Rejected Property:\t${prop}\n`);
                }
            } else {
                logStream.write(`Rejected Property:\t${prop}\n`);
            }
        });
    });
    logStream.write(`========= End audit =========\n`);
    logStream.end();

    console.log(`\nAudit complete! Please check the log file at: ${path.resolve(options.output)}`);
    console.log(`\n==================\n`);
})();
