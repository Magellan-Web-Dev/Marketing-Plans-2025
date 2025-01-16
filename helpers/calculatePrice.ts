import { parseValue } from './parseValue.ts';

/**
 * Helpers below are used to calculate quarterly and yearly discounts.
 * Monthly price calculated by the quarterly or yearly discount percentage
 */

/**
 * Discount Calculations interface
 */

export interface Calculations {
    monthly: number;
    total: number;
    discount: number;
    savings: number;
    monthlyOutput: string; // Uses the parseValue helper function
    totalOutput: string; // Uses the parseValue helper function
    savingsOutput: string;
}

/**
 * Calculate Price
 *
 * @param type - string - Type of calculation.  Can be 'monthly', 'quarterly' or 'yearly'.  Other values with throw an error.
 * @param monthlyAmount - number - Total monthly amount.
 * @param discount - number - Quarterly discount. Should be between 0 and 1.
 *
 * @return Calculations interface - Returns monthly amount after discount, along with total for quarterly or yearly.
 */

export function calculatePrice(type: string, monthlyAmount: number, discount: number = 0): Calculations {

    // Convert type parameter to all lowercase

    type = type.toLowerCase();

    // Sets type parameter values

    const validTypes = ['monthly', 'quarterly', 'yearly'];

    // Set multiplier based on quarterly(3) or yearly(12)

    const multiplier = type === 'monthly' ? 1 : type === 'quarterly' ? 3 : 12;

    // Get monthly number and discounted amounts

    const monthlyNumber: number = Number(monthlyAmount);
    const discountedAmount: number = monthlyNumber * Number(discount);

    // Error handling

    if (!monthlyNumber || !discountedAmount || !validTypes.includes(type)) {

        // Return same numbers as would be monthly if discount number is 0

        if (discountedAmount === 0) {
            const total = monthlyNumber * multiplier
            return {
                monthly: monthlyNumber,
                total,
                discount,
                savings: 0,
                monthlyOutput: parseValue(monthlyNumber),
                totalOutput: parseValue(total),
                savingsOutput: parseValue(0)
            }
        }

        // Return NaN, empty string on output for calculations if a calculation error occured

        return {
            monthly: NaN,
            total: NaN,
            discount,
            savings: 0,
            monthlyOutput: '',
            totalOutput: '',
            savingsOutput: parseValue(0)
        };
    }

    // Calculate and return monthly amount after discount, and total based on type being 'yearly' or 'quarterly'

    const monthly: number = monthlyNumber - discountedAmount;
    const total = monthly * multiplier;
    const savings = discountedAmount * multiplier;

    return {
        monthly,
        total,
        discount,
        savings,
        monthlyOutput: parseValue(monthly),
        totalOutput: parseValue(total),
        savingsOutput: parseValue(savings)
    };
}
