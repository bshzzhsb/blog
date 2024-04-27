import fs from 'fs/promises';
import path from 'path';
import * as prettier from 'prettier';

const ICON_DIR = path.resolve('./app/components/icon');
const SVG_DIR = path.resolve(ICON_DIR, 'svg');
const OUTPUT_FILE = path.resolve(ICON_DIR, 'index.svg');
const TYPE_FILE = path.resolve(ICON_DIR, 'type.ts');
const COMMENT = /<!--!.*-->/gi;

async function bundleIcons() {
  let output = '<svg style="position: absolute; width: 0px; height: 0px; overflow: hidden;">';
  const types = [];
  const config = await prettier.resolveConfig(path.resolve('./', '.prettierrc.js'));

  const svgs = await fs.readdir(SVG_DIR);
  for (const file of svgs) {
    let content = await fs.readFile(path.resolve(SVG_DIR, file), { encoding: 'utf-8' });
    const id = file.split('.')[0];
    types.push(`'${id}'`);
    content = content
      .replace('<svg ', `<symbol id="${id}"`)
      .replace(/xmlns="http:\/\/www.w3.org\/2000\/svg"/gi, '')
      .replace('version="1.1"', '')
      .replace(/svg>/gi, 'symbol>')
      .replace(new RegExp(COMMENT, 'gi'), '');
    output += content;
  }

  output += '</svg>';
  output = await prettier.format(output, { ...config, parser: 'html' });

  let type = `export type IconNames = ${types.join(' | ')};`;
  type = await prettier.format(type, { ...config, parser: 'typescript' });

  await Promise.all([
    fs.writeFile(OUTPUT_FILE, output, { encoding: 'utf-8' }),
    fs.writeFile(TYPE_FILE, type, { encoding: 'utf-8' }),
  ]);
}

bundleIcons();
