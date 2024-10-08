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
import { formatCurrency, calculateSharedPayments, round } from '@/lib/utils';
import { Input } from './ui/input';
import StateSelector from './StateSelector';
import BillSplitterResultTable from './BillSplitterResultTable';
import messages from '@/lib/messages';
import BillSplitterText from './BillSplitterText';
import useLocalStorage from '@/hooks/useLocalStorage';

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
    amountYear: 48000,
    amountMonth: 4000,
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
const defaultAdditionalRate = 1.0;
const defaultExpenses = 4000;

function BillSplitter() {
  const [payers, setPayers] = useLocalStorage('bill-payers', defaultPayers);
  const [sharedMonthlyExpenses, setSharedMonthlyExpenses] = useLocalStorage(
    'shared-expenses',
    defaultExpenses
  );
  const [state, setState] = useLocalStorage('shared-state', defaultState);
  const [additionalRate, setAdditionalRate] = useLocalStorage(
    'shared-additional-rate',
    defaultAdditionalRate
  );
  const [contributionResult, setContributionResult] = useState({
    payers: [],
    contributions: [],
    leftover: 0,
    err: messages.noPayers,
  });

  useEffect(() => {
    setContributionResult(
      calculateSharedPayments(
        payers,
        state,
        sharedMonthlyExpenses,
        additionalRate
      )
    );
  }, [payers, sharedMonthlyExpenses, state, additionalRate]);

  function handleStateUpdate(state: string) {
    setState(state);
  }

  // function handleAmountUpdate(
  //   name: string,
  //   amountYear: number,
  //   amountMonth: number,
  //   id: number,
  //   preTax: boolean
  // ) {
  //   setPayers((prevPayers) => {
  //     const newPayers = prevPayers.map((payer) => {
  //       if (payer.id === id) {
  //         return { name, amountYear, amountMonth, id, preTax };
  //       }
  //       return payer;
  //     });
  //     setContributionResult(
  //       calculateSharedPayments(newPayers, state, sharedMonthlyExpenses)
  //     );
  //     return newPayers;
  //   });
  // }

  function handleNameChange(name: string, id: number) {
    setPayers((prevPayers) => {
      const newPayers = prevPayers.map((payer) => {
        if (payer.id === id) {
          return { ...payer, name };
        }
        return payer;
      });
      setContributionResult(
        calculateSharedPayments(
          newPayers,
          state,
          sharedMonthlyExpenses,
          additionalRate
        )
      );
      return newPayers;
    });
  }

  function handleYearlyChange(amountYear: number, id: number) {
    setPayers((prevPayers) => {
      if (amountYear > 9999999) {
        amountYear = 9999999;
      }
      const newPayers = prevPayers.map((payer) => {
        if (payer.id === id) {
          return {
            ...payer,
            amountYear,
            amountMonth: Number((amountYear / 12).toFixed(2)),
          };
        }
        return payer;
      });
      setContributionResult(
        calculateSharedPayments(
          newPayers,
          state,
          sharedMonthlyExpenses,
          additionalRate
        )
      );
      return newPayers;
    });
  }

  function handleMonthlyChange(amountMonth: number, id: number) {
    setPayers((prevPayers) => {
      if (amountMonth > 833333.25) {
        amountMonth = 833333.25;
      }
      const newPayers = prevPayers.map((payer) => {
        if (payer.id === id) {
          return { ...payer, amountMonth, amountYear: amountMonth * 12 };
        }
        return payer;
      });
      setContributionResult(
        calculateSharedPayments(
          newPayers,
          state,
          sharedMonthlyExpenses,
          additionalRate
        )
      );
      return newPayers;
    });
  }

  function handlePreTaxChange(preTax: boolean, id: number) {
    setPayers((prevPayers) => {
      const newPayers = prevPayers.map((payer) => {
        if (payer.id === id) {
          return { ...payer, preTax };
        }
        return payer;
      });
      setContributionResult(
        calculateSharedPayments(
          newPayers,
          state,
          sharedMonthlyExpenses,
          additionalRate
        )
      );
      return newPayers;
    });
  }

  return (
    <div className='grid grid-cols-12 gap-4 max-w-[1200px] mx-auto'>
      <div className='col-span-12 flex flex-wrap h-full'>
        <h1 className='text-3xl mr-4 mt-4'>Equal Savings Calculator</h1>
      </div>
      <div className='col-span-12 md:col-span-12 border-[1px] rounded p-4 bg-card shadow-xl overflow-x-scroll'>
        <div className='col-span-12 flex flex-wrap'>
          <div className='flex flex-wrap items-start m-1 min-w-80 text-sm text-foreground/75'>
            <label htmlFor='shared-expenses' className='mr-2 my-auto'>
              Shared monthly expenses ($) :
            </label>
            <Input
              name='shared-expenses'
              id='shared-expenses'
              className='text-end w-1/4'
              value={sharedMonthlyExpenses}
              onChange={(e) => {
                if (Number(e.target.value) > 50000) {
                  setSharedMonthlyExpenses(50000);
                }
                setSharedMonthlyExpenses(Number(e.target.value));
              }}
            />
          </div>
          <div className='flex flex-wrap justify-between md:justify-normal md:me-auto m-1 min-w-80 text-sm text-foreground/75'>
            <h3 className='my-auto mr-2'>State: </h3>
            <StateSelector
              defaultState={state}
              onStateUpdate={handleStateUpdate}
            />
          </div>
          <div className='flex flex-row justify-between md:justify-normal gap-4 m-1 min-w-80 text-sm text-foreground/75'>
            <label className='my-auto'>Additional Tax (%) : </label>
            <Input
              className='text-right w-24'
              type='number'
              step={0.01}
              min={0}
              max={25}
              value={additionalRate}
              onChange={(e) => {
                if (e.target.value === '') {
                  setAdditionalRate(0);
                  return;
                }
                const num = Number(e.target.value);
                const val = round(num, 2);
                if (val > 25) {
                  setAdditionalRate(25);
                  return;
                }
                setAdditionalRate(val);
              }}
            />
          </div>
        </div>
        <Table className='my-4 overflow-x-scroll'>
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
                  onNameChange={handleNameChange}
                  onYearlyChange={handleYearlyChange}
                  onMonthlyChange={handleMonthlyChange}
                  onPreTaxChange={handlePreTaxChange}
                  // onAmountUpdate={handleAmountUpdate}
                />
                <TableCell className='flex flex-row gap-3'>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={'default'}
                          className='bg-primary/70 p-2 h-1/2 my-auto sm:p-4 sm:h-auto'
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
                          className='bg-neutral-700 p-2 h-1/2 my-auto sm:p-4 sm:h-auto'
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
        <div className='flex justify-between'>
          <Button
            variant={'outline'}
            onClick={() => {
              setPayers([
                {
                  name: '',
                  amountYear: 0,
                  amountMonth: 0,
                  id: 0,
                  preTax: false,
                },
              ]);
              // handleAmountUpdate('', 0, 0, 0, false);
              setSharedMonthlyExpenses(0);
              setState('');
              console.log('state in bill splitter', state);
            }}
          >
            Reset
          </Button>

          <Button
            variant={'default'}
            className='bg-primary/70'
            onClick={() =>
              setPayers((prev) => {
                const newPayers = [...prev];
                newPayers.splice(newPayers.length, 0, {
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
            Add Row
          </Button>
        </div>
      </div>
      <div className='col-span-12 md:col-span-7 my-4 border-[1px] rounded p-4 items-center bg-card shadow-xl'>
        <BillSplitterResultTable contributionResult={contributionResult} />
      </div>
      <div className='col-span-12 md:col-span-7 my-4'>
        <BillSplitterText />
      </div>
    </div>
  );
}

export default BillSplitter;
