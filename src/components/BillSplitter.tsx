import { useEffect, useState } from 'react';
import IncomeRow from './IncomeRow';
import { Button } from './ui/button';

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Delete, Plus } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { calculatePostTaxIncome, formatCurrency } from '@/lib/utils';
import { Input } from './ui/input';
import StateSelector from './StateSelector';
import BillSplitterResultTable from './BillSplitterResultTable';

interface Payer {
  name: string;
  amountYear: number;
  amountMonth: number;
  id: number;
  preTax: boolean;
}

const defaultPayers: Payer[] = [
  {
    name: 'Me',
    amountYear: 60000,
    amountMonth: 5000,
    id: 0,
    preTax: true,
  },
  {
    name: 'My Partner',
    amountYear: 15000,
    amountMonth: 1250,
    id: 1,
    preTax: false,
  },
  // {
  //   name: 'Third Person',
  //   amountYear: 24000,
  //   amountMonth: 2000,
  //   id: 2,
  //   preTax: false,
  // },
];

const defaultState = 'PA';

const defaultExpenses = 4000;

function BillSplitter() {
  console.log('bill splitter render');
  const [payers, setPayers] = useState(defaultPayers);
  const [sharedMonthlyExpenses, setSharedMonthlyExpenses] =
    useState(defaultExpenses);
  const [state, setState] = useState(defaultState);
  const [contributionResult, setContributionResult] = useState({
    payers: [],
    contributions: [],
    leftover: 0,
    err: 'No expense payers added.',
  });

  useEffect(() => {
    setContributionResult(calculatePayments(payers));
  }, [payers, sharedMonthlyExpenses, state]);

  function handleStateUpdate(state: string) {
    setState(state);
  }

  function handleAmountUpdate(
    name: string,
    amountYear: number,
    amountMonth: number,
    id: number,
    preTax: boolean
  ) {
    setPayers((prevPayers) => {
      const newPayers = prevPayers.map((payer) => {
        if (payer.id === id) {
          return { name, amountYear, amountMonth, id, preTax };
        }
        return payer;
      });
      setContributionResult(calculatePayments(newPayers));
      return newPayers;
    });
  }

  function calculatePayments(payers: any) {
    console.log('calculatePayments');
    if (payers.length === 0) {
      return {
        payers: [],
        contributions: [],
        leftover: 0,
        err: 'No expense payers added.',
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
        err: 'Not enough income to cover expenses.',
      };
    }

    // find id of highest earner
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
    if (highestEarnerLeft === Math.max(...leftoverArray)) {
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

  return (
    <div className='grid grid-cols-12 gap-4 max-w-[1200px] mx-auto'>
      <div className='flex flex-wrap items-start col-span-6'>
        <label htmlFor='shared-expenses' className='mr-2 my-auto'>
          Shared monthly expenses:
        </label>
        <Input
          name='shared-expenses'
          className='text-end w-1/4'
          value={sharedMonthlyExpenses}
          onChange={(e) => {
            setSharedMonthlyExpenses(Number(e.target.value));
          }}
        />
      </div>
      <div className='col-span-6 flex flex-wrap ms-auto'>
        <h3 className='my-auto mr-2'>State: </h3>
        <StateSelector defaultState={state} onStateUpdate={handleStateUpdate} />
      </div>
      <div className='col-span-12 md:col-span-12 border-[1px] rounded p-4'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-4/12'>Name</TableHead>
              <TableHead className='text-right w-3/12'>Yearly ($)</TableHead>
              <TableHead className='text-right w-3/12'>Monthly ($)</TableHead>
              <TableHead className='text-center w-2/12'>Options</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payers.map((payer, index) => (
              <TableRow key={payer.id}>
                <IncomeRow
                  name={payer.name}
                  amountYear={payer.amountYear}
                  amountMonth={payer.amountMonth}
                  preTax={payer.preTax}
                  id={payer.id}
                  onAmountUpdate={handleAmountUpdate}
                />
                <TableCell className='flex flex-row gap-3'>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={'default'}
                          className='bg-primary/70'
                          onClick={() =>
                            setPayers((prev) => {
                              const newPayers = [...prev];
                              newPayers.splice(index + 1, 0, {
                                name: '',
                                amountYear: 0,
                                amountMonth: 0,
                                id: prev.length || 0,
                                preTax: false,
                              });
                              return newPayers;
                            })
                          }
                        >
                          <Plus size={16} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Insert row below</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={'destructive'}
                          className='bg-neutral-700'
                          onClick={() => {
                            setPayers((prev) => {
                              const newExpenses = [...prev];
                              newExpenses.splice(index, 1);
                              return newExpenses;
                            });
                          }}
                        >
                          <Delete size={16} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete row</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell className='w-1/4'>Total</TableCell>
              <TableCell className='text-right w-1/4'>
                {formatCurrency(
                  payers.reduce((acc, payer) => acc + payer.amountYear, 0)
                )}
              </TableCell>
              <TableCell className='text-right w-1/4'>
                {formatCurrency(
                  payers.reduce((acc, payer) => acc + payer.amountMonth, 0)
                )}
              </TableCell>
              <TableCell className='w-1/4'></TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
      <div className='col-span-12 md:col-span-7 md:col-start-3 border-[1px] rounded p-4 items-center'>
        <BillSplitterResultTable contributionResult={contributionResult} />
      </div>
    </div>
  );
}

export default BillSplitter;
