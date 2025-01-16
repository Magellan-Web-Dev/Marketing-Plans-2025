import { Calculations } from './calculatePrice.ts';

/**
 * Defines api data interface, along with parsed data interface after calculations have been made when data is collected.
 */

// KeyFeature, Plan, PlanTypes interfaces are part of api data

interface KeyFeature {
    title: string;
    description: string;
}

//  PriceCalculations interface is part of parsed data after calculations made

export interface PriceCalculations {
    monthly: Calculations;
    quarterly: Calculations;
    yearly: Calculations;
}

export interface Plan {
    title: string;
    monthlyPrice: number;
    quarterlyDiscount: number;
    yearlyDiscount: number;
    description: string;
    estimatedAnnualROI: number;
    keyFeatures: KeyFeature[]; // Key Feature
    planPrice?: number; // planPrice is used for dollarPlans
    priceCalculations?: PriceCalculations
}

export interface PlanTypes {
    dollarPlans: Plan;
    focusPlans: Plan;
}

