import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import messages from './messages';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// -------------------------------------

interface Payer {
  name: string;
  amountYear: number;
  amountMonth: number;
  id: number;
  preTax: boolean;
}

const federalBrackets = {
  rates: [0.1, 0.12, 0.22, 0.24, 0.32, 0.35, 0.37],
  brackets: [0, 11000, 44725, 95375, 182100, 231250, 578125],
};

const stateRatesMarginal: { [key: string]: { [key: string]: number[] } } = {
  AL: {
    rates: [0.02, 0.04, 0.05],
    brackets: [0, 500, 3000],
  },
  AR: {
    rates: [0.02, 0.04, 0.044],
    brackets: [0, 4400, 8800],
  },
  CA: {
    rates: [0.01, 0.02, 0.04, 0.06, 0.08, 0.093, 0.103, 0.113, 0.123, 0.133],
    brackets: [
      0, 10412, 24684, 38959, 54081, 68350, 349137, 418961, 698271, 1000000,
    ],
  },
  CT: {
    rates: [0.02, 0.045, 0.055, 0.06, 0.065, 0.069, 0.0699],
    brackets: [0, 10000, 50000, 100000, 200000, 250000, 500000],
  },
  DE: {
    rates: [0.022, 0.039, 0.048, 0.052, 0.0555, 0.066],
    brackets: [2000, 5000, 10000, 20000, 25000, 60000],
  },
  HI: {
    rates: [
      0.014, 0.032, 0.055, 0.064, 0.068, 0.072, 0.076, 0.079, 0.0825, 0.09, 0.1,
      0.11,
    ],
    brackets: [
      0, 2400, 4800, 9600, 14400, 19200, 24000, 36000, 48000, 150000, 175000,
      200000,
    ],
  },
  IA: {
    rates: [0.044, 0.0482, 0.057],
    brackets: [0, 6210, 31050],
  },
  KS: {
    rates: [0.031, 0.0525, 0.057],
    brackets: [0, 15000, 30000],
  },
  LA: {
    rates: [0.0185, 0.035, 0.0425],
    brackets: [0, 12500, 50000],
  },
  ME: {
    rates: [0.058, 0.0675, 0.0715],
    brackets: [0, 26050, 61600],
  },
  MD: {
    rates: [0.02, 0.03, 0.04, 0.0475, 0.05, 0.0525, 0.05, 0.0575],
    brackets: [0, 1000, 2000, 3000, 100000, 125000, 150000, 250000],
  },
  MA: {
    rates: [0.05, 0.09],
    brackets: [0, 1000000],
  },
  MN: {
    rates: [0.0535, 0.068, 0.0785, 0.0985],
    brackets: [0, 31690, 104090, 193240],
  },
  MO: {
    rates: [0.02, 0.025, 0.03, 0.035, 0.04, 0.045, 0.048],
    brackets: [1273, 2546, 3819, 5092, 6365, 7638, 8911],
  },
  MT: {
    rates: [0.047, 0.059],
    brackets: [0, 20500],
  },
  NE: {
    rates: [0.0246, 0.0351, 0.0501, 0.0584],
    brackets: [0, 3700, 22170, 25730],
  },
  NJ: {
    rates: [0.014, 0.0175, 0.035, 0.05525, 0.0637, 0.0897, 0.1075],
    brackets: [0, 20000, 35000, 40000, 75000, 500000, 1000000],
  },
  NM: {
    rates: [0.017, 0.032, 0.047, 0.049, 0.059],
    brackets: [0, 5500, 11000, 16000, 210000],
  },
  NY: {
    rates: [0.04, 0.045, 0.0525, 0.055, 0.06, 0.0685, 0.0965, 0.103, 0.109],
    brackets: [
      8500, 11700, 13900, 21400, 80650, 215400, 1077550, 5000000, 25000000,
    ],
  },
  ND: {
    rates: [0.0195, 0.025],
    brackets: [44725, 225975],
  },
  OH: {
    rates: [0.0275, 0.035],
    brackets: [26050, 92150],
  },
  OK: {
    rates: [0.0025, 0.0075, 0.0175, 0.0275, 0.0375, 0.0475],
    brackets: [0, 1000, 2500, 3750, 4900, 7200],
  },
  OR: {
    rates: [0.0475, 0.0675, 0.0875, 0.099],
    brackets: [0, 4300, 10750, 125000],
  },
  RI: {
    rates: [0.0375, 0.0475, 0.0599],
    brackets: [0, 77450, 176050],
  },
  SC: {
    rates: [0.03, 0.064],
    brackets: [3460, 17330],
  },
  VT: {
    rates: [0.0335, 0.066, 0.076, 0.0875],
    brackets: [0, 45400, 110050, 229550],
  },
  VA: {
    rates: [0.02, 0.03, 0.05, 0.0575],
    brackets: [0, 3000, 5000, 17000],
  },
  WV: {
    rates: [0.0236, 0.0315, 0.0354, 0.0472, 0.0512],
    brackets: [0, 10000, 25000, 40000, 60000],
  },
  WI: {
    rates: [0.035, 0.044, 0.053, 0.0765],
    brackets: [0, 14320, 28640, 315310],
  },
  DC: {
    rates: [0.04, 0.06, 0.065, 0.085, 0.0925, 0.0975, 0.1075],
    brackets: [0, 10000, 40000, 60000, 250000, 500000, 1000000],
  },
};

const stateRates: { [key: string]: number } = {
  AK: 0,
  FL: 0,
  NV: 0,
  SD: 0,
  TN: 0,
  TX: 0,
  WY: 0,
  AZ: 0.025,
  CO: 0.044,
  GA: 0.0549,
  ID: 0.058,
  IL: 0.0495,
  IN: 0.0305,
  KY: 0.04,
  MI: 0.0425,
  MS: 0.047,
  NH: 0,
  NC: 0.045,
  PA: 0.0307,
  UT: 0.0465,
  WA: 0,
};

const stateStandardDeductions: { [key: string]: number } = {
  AL: 3000,
  AR: 2340,
  AZ: 14600,
  CA: 5363,
  CO: 14600,
  DE: 3250,
  HI: 2200,
  GA: 12000,
  ID: 14600,
  IL: 2775,
  IN: 1000,
  KY: 3160,
  MI: 5600,
  MS: 2300,
  NC: 12750,
  KS: 3500,
  LA: 4500,
  ME: 14600,
  MD: 5750,
  MA: 4400,
  MN: 14575,
  MO: 14600,
  MT: 14600,
  NE: 7900,
  NJ: 1000,
  NM: 14600,
  NY: 8000,
  ND: 14600,
  OH: 2400,
  OK: 7350,
  OR: 2745,
  RI: 15500,
  SC: 14600,
  VT: 11850,
  VA: 8930,
  WV: 2000,
  WI: 13930,
  DC: 14600,
};

const ssRate = 0.062;
const ssMax = 168600;
const medicareRate = 0.0145;
const medicareMax = 200000;
const medicareAdditionalRate = 0.009;
const standardDeduction = 14600;
const defaultLocalRate = 0.01;

export function calculateYearlyIncomeNeededPretax(
  desiredPostTaxIncome: number,
  state: string,
  localRate: number
) {
  let estimatedPreTaxIncome = desiredPostTaxIncome;
  let calculatedPostTaxIncome = 0;

  let incrementor = 0;
  if (desiredPostTaxIncome < 100000) {
    incrementor = 25;
  } else if (desiredPostTaxIncome < 200000) {
    incrementor = 20;
  } else {
    incrementor = 10;
  }

  // Start with an initial guess for pre-tax income and adjust until the calculated post-tax income matches or is greater than the desired post-tax income
  while (calculatedPostTaxIncome < desiredPostTaxIncome) {
    // Increment by a reasonable amount to reduce iterations
    estimatedPreTaxIncome += desiredPostTaxIncome / incrementor;
    //NOTE: this causes some issues with the calculation if income gets to be too high, like over 250k
    // it typically seems to overestimate the income needed

    // Calculate taxable income after standard deduction
    let taxableIncome = estimatedPreTaxIncome;

    // const federalTax = calculateFederalTax(taxableIncome);
    const federalTax = calculateMarginalTax(
      taxableIncome,
      standardDeduction,
      federalBrackets.rates,
      federalBrackets.brackets
    );
    // console.log('federalTax', federalTax);

    let stateStandardDeduction = 0;
    let stateTax = 0;
    if (stateStandardDeductions[state] !== undefined) {
      stateStandardDeduction = stateStandardDeductions[state];
    }
    if (stateRatesMarginal[state] !== undefined) {
      stateTax = calculateMarginalTax(
        taxableIncome,
        stateStandardDeduction,
        stateRatesMarginal[state].rates,
        stateRatesMarginal[state].brackets
      );
    } else {
      stateTax = calculateStateTax(taxableIncome, state)!;
    }
    // console.log('stateTax', stateTax);
    const ficaTax = calculateFicaTax(taxableIncome);
    // console.log('ficaTax', ficaTax);
    const localTax = calculateLocalTax(taxableIncome, localRate);
    // console.log('localTax', localTax);
    const totalTax = federalTax + stateTax + ficaTax + localTax;
    calculatedPostTaxIncome = estimatedPreTaxIncome - totalTax;
  }
  return estimatedPreTaxIncome;
}

function calculateFederalTax(income: number) {
  let remainingIncome = Math.max(0, income - standardDeduction);
  let taxBracketIndex = 0;
  for (let i = 0; i < federalBrackets.brackets.length; i++) {
    if (remainingIncome > federalBrackets.brackets[i]) {
      taxBracketIndex = i + 1;
    } else {
      break;
    }
  }
  let federalTax = 0;
  for (let i = taxBracketIndex; i >= 0; i--) {
    let newTax;
    if (i === 0) {
      newTax = federalBrackets.rates[i] * federalBrackets.brackets[i];
      federalTax += newTax;
    } else if (i !== taxBracketIndex) {
      newTax =
        federalBrackets.rates[i] *
        (federalBrackets.brackets[i] - federalBrackets.brackets[i - 1]);
      federalTax += newTax;
    } else {
      newTax =
        federalBrackets.rates[i] *
        (remainingIncome - federalBrackets.brackets[i - 1]);
      federalTax += newTax;
    }
  }
  return federalTax;
}

function calculateMarginalTax(
  income: number,
  deduction: number,
  rates: number[],
  brackets: number[]
) {
  let remainingIncome = Math.max(0, income - deduction);
  let taxBracketIndex = 0;
  for (let i = 0; i < brackets.length; i++) {
    if (remainingIncome > brackets[i]) {
      taxBracketIndex = i;
    } else {
      break;
    }
  }

  let totalTax = 0;
  for (let i = taxBracketIndex; i >= 0; i--) {
    let newTax;
    if (i === 0) {
      newTax = rates[i] * brackets[i + 1];
      totalTax += newTax;
    } else if (i !== taxBracketIndex) {
      newTax = rates[i] * (brackets[i + 1] - brackets[i]);
      totalTax += newTax;
    } else {
      newTax = rates[i] * (remainingIncome - brackets[i]);
      totalTax += newTax;
    }
  }
  return totalTax;
}

function calculateStateTax(income: number, state: string) {
  if (stateRates[state] === undefined) {
    //TODO: handle this case better than returning 0
    return 0;
  } else if (stateRates[state] === 0) {
    return 0;
  } else {
    let taxableIncome;
    if (stateStandardDeductions[state] !== undefined) {
      taxableIncome = Math.max(0, income - stateStandardDeductions[state]);
    } else {
      taxableIncome = income;
    }
    return taxableIncome * stateRates[state];
  }
}

function calculateFicaTax(income: number) {
  const ssTax = Math.min(income, ssMax) * ssRate;
  const medicareTax = Math.min(income, medicareMax) * medicareRate;
  const medicareAdditionalTax =
    Math.max(0, income - medicareMax) * medicareAdditionalRate;
  return ssTax + medicareTax + medicareAdditionalTax;
}

function calculateLocalTax(income: number, localRate: number) {
  return income * localRate;
}

export function calculatePostTaxIncome(salary: number, state: string) {
  const federalTax = calculateFederalTax(salary);
  const stateTax = calculateStateTax(salary, state)!;
  const ficaTax = calculateFicaTax(salary);
  const localTax = calculateLocalTax(salary, defaultLocalRate);
  return salary - federalTax - stateTax - ficaTax - localTax;
}

export function formatCurrency(number: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(number);
}

export function calculateSharedPayments(
  payers: any,
  state: string,
  sharedMonthlyExpenses: number
) {
  if (payers.length === 0) {
    return {
      payers: [],
      contributions: [],
      leftover: 0,
      err: messages.noPayers,
    };
  }
  // if form was just reset:
  if (
    payers[0].amountYear === 0 &&
    payers[0].amountMonth === 0 &&
    sharedMonthlyExpenses === 0
  ) {
    return {
      payers: [],
      contributions: [],
      leftover: 0,
      err: messages.noData,
    };
  }
  const payersAfterTaxes = payers.map((payer: any) => {
    if (payer.preTax) {
      return {
        name: payer.name,
        amountYear: calculatePostTaxIncome(payer.amountYear, state),
        amountMonth: calculatePostTaxIncome(payer.amountYear, state) / 12,
        id: payer.id,
        preTax: payer.preTax,
      };
    }
    return payer;
  });

  const afterTaxMonthlyEarnings = payersAfterTaxes.map(
    (payer: Payer) => payer.amountMonth
  );

  // calculate total income
  const totalIncome = payersAfterTaxes.reduce(
    (acc: number, payer: any) => acc + payer.amountMonth,
    0
  );

  if (totalIncome < sharedMonthlyExpenses) {
    return {
      payers: [],
      contributions: [],
      leftover: 0,
      err: messages.incomeLow,
    };
  }

  // find highest earner
  let highestEarner: Payer | null = null;
  payersAfterTaxes.forEach((payer: any) => {
    if (
      payer.amountYear ===
      Math.max(...payersAfterTaxes.map((payer: any) => payer.amountYear))
    ) {
      highestEarner = payer;
    }
  });

  // get amount left after highest earner pays all shared expenses. may be negative
  let highestEarnerLeft = highestEarner!.amountMonth - sharedMonthlyExpenses;

  // get amount everyone has leftover after highest earner pays all shared expenses
  let leftoverArray = payersAfterTaxes.map((payer: Payer) => {
    if (payer.id === highestEarner!.id) {
      return highestEarnerLeft;
    } else {
      return payer.amountMonth;
    }
  });

  // target leftover value is the average of the leftover array
  let equalLeftoverValue = Math.round(
    leftoverArray.reduce((acc: number, val: number) => acc + val, 0) /
      leftoverArray.length
  );

  // handle case where lowest earner does not earn the equal leftover value
  // so remove them from the calculation and recalculate the average
  const lowestEarnerLeft = Math.min(...afterTaxMonthlyEarnings);
  if (equalLeftoverValue > lowestEarnerLeft) {
    const tempArray = leftoverArray.filter(
      (val: number) => val !== lowestEarnerLeft
    );
    equalLeftoverValue = Math.round(
      tempArray.reduce((acc: number, val: number) => acc + val, 0) /
        tempArray.length
    );
  }

  // if highest earner can cover all expenses, and they have more leftover than the others earn, highest earner covers all expenses
  if (
    leftoverArray.length > 1 &&
    highestEarnerLeft === Math.max(...leftoverArray)
  ) {
    console.log('Highest earner can cover all expenses');
    console.log({
      contributions: leftoverArray,
      leftover: highestEarnerLeft,
    });
    return {
      payers: payersAfterTaxes,
      contributions: leftoverArray,
      leftover: highestEarnerLeft,
      err: `${
        highestEarner!.name
      } is the highest earner and can cover all expenses with ${formatCurrency(
        highestEarnerLeft
      )} leftover per month.`,
    };
  }

  const payerContributions = payersAfterTaxes.map((payer: Payer) => {
    if (payer.amountMonth > equalLeftoverValue) {
      return Math.round(payer.amountMonth - equalLeftoverValue);
    } else {
      return 0;
    }
  });

  return {
    payers: payersAfterTaxes,
    contributions: payerContributions,
    leftover: equalLeftoverValue,
    err: '',
  };
}

export function round(num: number, places: number) {
  return Math.round(num * 10 ** places) / 10 ** places;
}
