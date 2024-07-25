import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// -------------------------------------
const federalBrackets = {
  rates: [0.1, 0.12, 0.22, 0.24, 0.32, 0.35, 0.37],
  brackets: [11000, 44725, 95375, 182100, 231250, 578125],
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
  AZ: 14600,
  CO: 14600,
  GA: 12000,
  ID: 14600,
  IL: 2775,
  IN: 1000,
  KY: 3160,
  MI: 5600,
  MS: 2300,
  NC: 12750,
};

// const stateRatesMarginal: { [key: string]: number[] } = {};

const ficaRate = 0.0765;
const localRate = 0.01;
const standardDeduction = 14600;

export function calculateYearlyIncomeNeededPretax(
  desiredPostTaxIncome: number,
  state: string
) {
  // console.log(desiredPostTaxIncome);
  // console.log(state);
  let estimatedPreTaxIncome = desiredPostTaxIncome;
  let calculatedPostTaxIncome = 0;

  // Start with an initial guess for pre-tax income and adjust until the calculated post-tax income matches the desired post-tax income
  while (calculatedPostTaxIncome < desiredPostTaxIncome) {
    // console.log('calculatedPostTaxIncome', calculatedPostTaxIncome);
    // console.log('desiredPostTaxIncome', desiredPostTaxIncome);
    estimatedPreTaxIncome += 1000; // Increment by a reasonable amount to reduce iterations

    // Calculate taxable income after standard deduction
    let taxableIncome = estimatedPreTaxIncome;

    // Calculate federal tax
    const federalTax = calculateFederalTax(taxableIncome);
    // console.log('federalTax', federalTax);
    const stateTax = calculateStateTax(taxableIncome, state)!;
    console.log('stateTax', stateTax);
    const ficaTax = calculateFicaTax(taxableIncome);
    // console.log('ficaTax', ficaTax);
    const localTax = calculateLocalTax(taxableIncome);
    // console.log('localTax', localTax);
    const totalTax = federalTax + stateTax + ficaTax + localTax;
    // console.log('totalTax', totalTax);
    calculatedPostTaxIncome = estimatedPreTaxIncome - totalTax;
    // console.log('calculatedPostTaxIncome', calculatedPostTaxIncome);
  }
  return estimatedPreTaxIncome;
}

function calculateFederalTax(income: number) {
  let remainingIncome = Math.max(0, income - standardDeduction);
  let taxBracketIndex = 0;
  for (let i = 0; i < federalBrackets.brackets.length; i++) {
    // console.log('remainingIncome', remainingIncome);
    // console.log('federalBrackets.brackets[i]', federalBrackets.brackets[i]);
    if (remainingIncome > federalBrackets.brackets[i]) {
      taxBracketIndex = i + 1;
    } else {
      break;
    }
    // console.log('taxBracketIndex', taxBracketIndex);
  }
  let federalTax = 0;
  for (let i = taxBracketIndex; i >= 0; i--) {
    let newTax;
    // console.log(i);
    if (i === 0) {
      // console.log('if');
      newTax = federalBrackets.rates[i] * federalBrackets.brackets[i];
      federalTax += newTax;
    } else if (i !== taxBracketIndex) {
      // console.log('else if');
      newTax =
        federalBrackets.rates[i] *
        (federalBrackets.brackets[i] - federalBrackets.brackets[i - 1]);
      federalTax += newTax;
    } else {
      // console.log('else');
      // console.log('remainingIncome', remainingIncome);
      // console.log(
      //   'income to tax',
      //   remainingIncome - federalBrackets.brackets[i - 1]
      // );
      // console.log('rate', federalBrackets.rates[i]);
      newTax =
        federalBrackets.rates[i] *
        (remainingIncome - federalBrackets.brackets[i - 1]);
      federalTax += newTax;
    }
    // console.log('newTax', newTax);
    // console.log('bracket', federalBrackets.brackets[i]);
  }
  return federalTax;
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

  return income * stateRates[state];
}

function calculateFicaTax(income: number) {
  return income * ficaRate;
}

function calculateLocalTax(income: number) {
  return income * localRate;
}

export function calculatePostTaxIncome(salary: number, state: string) {
  const federalTax = calculateFederalTax(salary);
  const stateTax = calculateStateTax(salary, state)!;
  const ficaTax = calculateFicaTax(salary);
  const localTax = calculateLocalTax(salary);
  return salary - federalTax - stateTax - ficaTax - localTax;
}

export function formatCurrency(number: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(number);
}
