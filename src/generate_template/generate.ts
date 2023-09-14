import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { yamlParse, yamlDump } from 'yaml-cfn';
import { templateResource, handleNameChange } from './misc/templates';

dotenv.config();

if (!process.env.PUBLIC_KEY) {
    throw 'You must define PUBLIC_KEY in .env file or in a command line run (e.g. PUBLIC_KEY=ABCD node generate_template/generate.js)';
}

const main = (): void => {
    let template: any;
    const baseTemplateRaw = fs.readFileSync(
        path.join(__dirname, 'misc', 'base_template.yaml'),
        'utf8'
    );
    const baseTemplate = yamlParse(baseTemplateRaw);

    // old template exists?
    try {
        console.log(
            'File template.yaml was already generated. Updating functions...'
        );
        const oldTemplateRaw = fs.readFileSync(
            path.join(__dirname, '..', 'template.yaml'),
            'utf8'
        );
        template = yamlParse(oldTemplateRaw);
    } catch (err) {
        console.log('File template.yaml was not found. Generating...');
        template = baseTemplate;
    }

    // get all functions files and their data
    const modulesPath = path.join(__dirname, '..', 'discord');

    const modules = fs
        .readdirSync(modulesPath, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);

    console.log('Modules:', modulesPath);
    // generate
    for (const module of modules) {
        const commands = fs.readdirSync(`${modulesPath}/${module}`);
        for (const command of commands) {
            let newFnResources = baseTemplate.Resources;
            const { data } = require(`${modulesPath}/${module}/${command}`);
            const toFirstUpper = (w: string) =>
                w.charAt(0).toUpperCase() + w.slice(1);
            let resourceName = `${module}-${command}`
                .split(/\W/g)
                .map((w) => toFirstUpper(w))
                .join('');

            if (!template.Resources[resourceName]) {
                newFnResources[resourceName] = templateResource(
                    module,
                    command,
                    data.name
                );
            } else {
                let newResource = handleNameChange(
                    template.Resources[resourceName],
                    data.name
                );
                newFnResources[resourceName] = newResource;
            }
            template.Resources = newFnResources;
        }
    }

    template.Resources.proxyFunction.Properties.Environment.Variables[
        'PUBLIC_KEY'
    ] = process.env.PUBLIC_KEY!;

    fs.writeFileSync(
        path.join(__dirname, '..', 'template.yaml'),
        yamlDump(template),
        'utf-8'
    );
    console.log('File template.yaml generated successfully.');
};

main();
