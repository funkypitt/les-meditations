import { writeFileSync } from 'fs'

export function tailwindColors (options) {

    const prefixes = ['bg', 'text'];
    const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].join(',');
    const colors =  options.colors.join(',');
    const inline = prefixes.map(prefix => `@source inline("${prefix}-{${colors}}-{${shades}}");`).join('\n');

    return {
        name: 'tailwindColors',
        buildStart () {
            writeFileSync(options.filename, inline, 'utf8');
        }
    }
}