/**
 * Parse Output
 * 
 * Parses a value into a number and adds comma formatting.
 * If format value equals 'dollar', then a "$" will be added before the number.
 * 
 * @param value - string|number - Value to parse
 * @param format - string - Determines if "$" should be added before comma formatted value if string equals "dollar"
 * @return string - Return string starting with $ then number with commas
 */

export function parseValue(value: string|number, format: string = 'dollar'): string {
    value = Math.ceil(Number(value));
    const commaFormattedValue = new Intl.NumberFormat().format(value);
    if (format === 'dollar') return `$${commaFormattedValue}`;
    return commaFormattedValue;
}

