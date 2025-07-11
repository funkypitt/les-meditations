import { writeFileSync } from 'fs'

export function tailwindColors (options) {

    const prefixes = ['bg', 'text'];
    const shades = options.shades.join(',');
    const colors =  options.colors.join(',');
    const inline = prefixes.map(prefix => `@source inline("${prefix}-{${colors}}-{${shades}}");`).join('\n');

    return {
        name: 'tailwindColors',
        buildStart () {
            writeFileSync(options.filename, inline, 'utf8');
        }
    }
}