/**
 * Parse Output
 *
 * Parses a value into a number and adds comma formatting.
 * If format value equals 'dollar', then a "$" will be added before the number.
 *
 * @param value - string|number - Value to parse
 * @param format - string - Determines if "$" should be added before comma formatted value if string equals "dollar".  If "percent" is passed, then value is multiplied by 100 and then "%" is added at end
 * @return string - Return string starting with $ then number with commas
 */

export function parseValue(value: string|number, format: string = 'dollar'): string {

    // Make sure value is a number

    value = Number(value);

    // If type value is "percent", multiply it by 100

    if(format === 'percent') {
      value = value * 100;
    }

    // Convert number to string and add commas

    const commaFormattedValue = format === 'percent'
      ? new Intl.NumberFormat().format(value)
      : new Intl.NumberFormat().format(Math.ceil(value))

    // Return dollar format if type is "dollar"

    if (format === 'dollar') return `$${commaFormattedValue}`;

    // Return percentage value if type is "percent"

    if (format === 'percent') return `${commaFormattedValue}%`;

    // Return number with commas only if not "dollar" or "percent"

    return commaFormattedValue;
}

