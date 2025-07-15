// Smart tax calculation based on location and business type
const taxRates = {
  // US States
  'US': {
    'AL': 4.0, 'AK': 0.0, 'AZ': 5.6, 'AR': 6.5, 'CA': 7.25, 'CO': 2.9,
    'CT': 6.35, 'DE': 0.0, 'FL': 6.0, 'GA': 4.0, 'HI': 4.0, 'ID': 6.0,
    'IL': 6.25, 'IN': 7.0, 'IA': 6.0, 'KS': 6.5, 'KY': 6.0, 'LA': 4.45,
    'ME': 5.5, 'MD': 6.0, 'MA': 6.25, 'MI': 6.0, 'MN': 6.875, 'MS': 7.0,
    'MO': 4.225, 'MT': 0.0, 'NE': 5.5, 'NV': 6.85, 'NH': 0.0, 'NJ': 6.625,
    'NM': 5.125, 'NY': 8.0, 'NC': 4.75, 'ND': 5.0, 'OH': 5.75, 'OK': 4.5,
    'OR': 0.0, 'PA': 6.0, 'RI': 7.0, 'SC': 6.0, 'SD': 4.5, 'TN': 7.0,
    'TX': 6.25, 'UT': 4.85, 'VT': 6.0, 'VA': 5.3, 'WA': 6.5, 'WV': 6.0,
    'WI': 5.0, 'WY': 4.0
  },
  // Other countries (simplified)
  'CA': { 'default': 13.0 }, // Canada HST average
  'GB': { 'default': 20.0 }, // UK VAT
  'DE': { 'default': 19.0 }, // Germany VAT
  'FR': { 'default': 20.0 }, // France VAT
  'AU': { 'default': 10.0 }, // Australia GST
  'IN': { 'default': 18.0 }, // India GST
  'default': { 'default': 8.5 }
};

export const calculateSmartTax = (address = '', businessType = '', subTotal = 0) => {
  let taxRate = 8.5; // Default rate
  
  // Extract location information from address
  const addressUpper = address.toUpperCase();
  
  // Check for US states
  for (const [state, rate] of Object.entries(taxRates.US)) {
    if (addressUpper.includes(state) || addressUpper.includes(getStateName(state))) {
      taxRate = rate;
      break;
    }
  }
  
  // Check for other countries
  if (addressUpper.includes('CANADA') || addressUpper.includes('CA')) {
    taxRate = taxRates.CA.default;
  } else if (addressUpper.includes('UNITED KINGDOM') || addressUpper.includes('UK') || addressUpper.includes('BRITAIN')) {
    taxRate = taxRates.GB.default;
  } else if (addressUpper.includes('GERMANY')) {
    taxRate = taxRates.DE.default;
  } else if (addressUpper.includes('FRANCE')) {
    taxRate = taxRates.FR.default;
  } else if (addressUpper.includes('AUSTRALIA')) {
    taxRate = taxRates.AU.default;
  } else if (addressUpper.includes('INDIA')) {
    taxRate = taxRates.IN.default;
  }
  
  // Adjust for business type
  const businessTypeLower = businessType.toLowerCase();
  if (businessTypeLower.includes('nonprofit') || businessTypeLower.includes('charity')) {
    taxRate = 0; // Tax-exempt
  } else if (businessTypeLower.includes('food') || businessTypeLower.includes('grocery')) {
    taxRate = Math.max(0, taxRate - 2); // Reduced rate for food
  }
  
  return {
    rate: taxRate,
    amount: (subTotal * taxRate) / 100,
    location: extractLocation(address),
    isEstimate: true
  };
};

const getStateName = (abbr) => {
  const stateNames = {
    'AL': 'ALABAMA', 'AK': 'ALASKA', 'AZ': 'ARIZONA', 'AR': 'ARKANSAS',
    'CA': 'CALIFORNIA', 'CO': 'COLORADO', 'CT': 'CONNECTICUT', 'DE': 'DELAWARE',
    'FL': 'FLORIDA', 'GA': 'GEORGIA', 'HI': 'HAWAII', 'ID': 'IDAHO',
    'IL': 'ILLINOIS', 'IN': 'INDIANA', 'IA': 'IOWA', 'KS': 'KANSAS',
    'KY': 'KENTUCKY', 'LA': 'LOUISIANA', 'ME': 'MAINE', 'MD': 'MARYLAND',
    'MA': 'MASSACHUSETTS', 'MI': 'MICHIGAN', 'MN': 'MINNESOTA', 'MS': 'MISSISSIPPI',
    'MO': 'MISSOURI', 'MT': 'MONTANA', 'NE': 'NEBRASKA', 'NV': 'NEVADA',
    'NH': 'NEW HAMPSHIRE', 'NJ': 'NEW JERSEY', 'NM': 'NEW MEXICO', 'NY': 'NEW YORK',
    'NC': 'NORTH CAROLINA', 'ND': 'NORTH DAKOTA', 'OH': 'OHIO', 'OK': 'OKLAHOMA',
    'OR': 'OREGON', 'PA': 'PENNSYLVANIA', 'RI': 'RHODE ISLAND', 'SC': 'SOUTH CAROLINA',
    'SD': 'SOUTH DAKOTA', 'TN': 'TENNESSEE', 'TX': 'TEXAS', 'UT': 'UTAH',
    'VT': 'VERMONT', 'VA': 'VIRGINIA', 'WA': 'WASHINGTON', 'WV': 'WEST VIRGINIA',
    'WI': 'WISCONSIN', 'WY': 'WYOMING'
  };
  return stateNames[abbr] || abbr;
};

const extractLocation = (address) => {
  const addressUpper = address.toUpperCase();
  
  // Try to extract state/country
  for (const state of Object.keys(taxRates.US)) {
    if (addressUpper.includes(state) || addressUpper.includes(getStateName(state))) {
      return `${state}, USA`;
    }
  }
  
  if (addressUpper.includes('CANADA')) return 'Canada';
  if (addressUpper.includes('UNITED KINGDOM') || addressUpper.includes('UK')) return 'United Kingdom';
  if (addressUpper.includes('GERMANY')) return 'Germany';
  if (addressUpper.includes('FRANCE')) return 'France';
  if (addressUpper.includes('AUSTRALIA')) return 'Australia';
  if (addressUpper.includes('INDIA')) return 'India';
  
  return 'Unknown';
};
