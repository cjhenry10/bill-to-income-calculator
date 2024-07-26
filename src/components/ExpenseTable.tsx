import { useEffect, useState } from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';
import Expense from './Expense';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
  TableCaption,
} from './ui/table';
import { Button } from './ui/button';
import { ChevronDown, Delete, EllipsisVertical, Plus } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import {
  formatCurrency,
  calculateYearlyIncomeNeededPretax,
  round,
} from '@/lib/utils';
import StateSelector from './StateSelector';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Popover, PopoverClose, PopoverContent } from '@radix-ui/react-popover';
import { PopoverTrigger } from './ui/popover';

const defaultExpenses = [
  {
    name: 'Rent',
    amount: 1500,
    id: 0,
  },
  { name: 'Car Insurance', amount: 120, id: 1 },
  { name: 'Phone', amount: 60, id: 2 },
  { name: 'Internet', amount: 100, id: 3 },
  { name: 'Electric', amount: 200, id: 4 },
  { name: 'Food', amount: 1000, id: 5 },
  { name: 'Health Insurance', amount: 300, id: 6 },
  { name: 'Student Loans', amount: 600, id: 7 },
  { name: 'Miscellaneous', amount: 100, id: 8 },
];

const defaultState = 'PA';
const defaultLocalRate = 1.0;

function ExpenseTable() {
  const [expenses, setExpenses] = useLocalStorage('expenses', defaultExpenses);
  const [state, setState] = useLocalStorage('state', defaultState);
  const total = expenses.reduce((acc, expense) => acc + expense.amount, 0);
  const [localRate, setLocalRate] = useLocalStorage(
    'local-rate',
    defaultLocalRate
  );
  const [salaryEstimate, setSalaryEstimate] = useState(
    calculateYearlyIncomeNeededPretax(total * 12, state, localRate / 100)
  );

  useEffect(() => {
    setSalaryEstimate(
      calculateYearlyIncomeNeededPretax(total * 12, state, localRate / 100)
    );
  }, [state, total, localRate]);

  function handleNameChange(name: string, id: number) {
    setExpenses((prevExpenses) => {
      const newExpenses = prevExpenses.map((expense) => {
        if (expense.id === id) {
          return { name, amount: expense.amount, id };
        }
        return expense;
      });
      return newExpenses;
    });
  }

  function handleAmountChange(amount: number, id: number) {
    setExpenses((prevExpenses) => {
      const newExpenses = prevExpenses.map((expense) => {
        if (expense.id === id) {
          return { name: expense.name, amount, id };
        }
        return expense;
      });
      return newExpenses;
    });
  }

  function handleStateUpdate(state: string) {
    setState(state);
  }

  return (
    <>
      <div className='grid grid-cols-12 gap-4 max-w-[1200px] mx-auto'>
        <div className='col-span-12 flex flex-wrap h-full'>
          <h1 className='text-3xl mr-4 mt-2'>Salary Estimator</h1>
        </div>
        <div className='col-span-12 md:col-span-7 border-[1px] rounded p-4 h-full'>
          <div className='flex flex-wrap justify-between'>
            <div className='flex flex-col mb-4'>
              <label className='my-auto ml-1 mb-1 text-sm text-foreground/75'>
                State:{' '}
              </label>
              <StateSelector
                defaultState={state}
                onStateUpdate={handleStateUpdate}
              />
            </div>
            <div className='flex flex-col mb-4'>
              <label className='my-auto ml-1 mb-1 text-sm text-foreground/75'>
                Local Tax (%) :{' '}
              </label>
              <Input
                className='text-right min-w-32'
                type='number'
                step={0.01}
                min={0}
                max={25}
                value={localRate}
                onChange={(e) => {
                  if (e.target.value === '') {
                    setLocalRate(0);
                    return;
                  }
                  const num = Number(e.target.value);
                  const val = round(num, 2);
                  if (val > 25) {
                    setLocalRate(25);
                    return;
                  }
                  setLocalRate(val);
                }}
              />
            </div>
          </div>
          <ScrollArea className='h-[67vh] max-h-[67vh] overflow-auto'>
            <Table>
              <TableHeader className='bg-background/75 dark:bg-muted/75 backdrop-blur-xl'>
                <TableRow>
                  <TableHead className='w-1/2'>Expense</TableHead>
                  <TableHead className='text-right w-1/4'>$</TableHead>
                  <TableHead className='text-center w-1/4'>Options</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className='overflow-y-auto max-h-[67vh] bg-white/80 dark:bg-background'>
                {expenses.map((expense, index) => (
                  <TableRow key={expense.id}>
                    <Expense
                      {...expense}
                      onNameChange={handleNameChange}
                      onAmountChange={handleAmountChange}
                      id={expense.id}
                    />
                    <TableCell className='flex flex-row gap-3'>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant={'default'}
                              className='bg-primary/70'
                              onClick={() =>
                                setExpenses((prev) => {
                                  const newExpenses = [...prev];
                                  newExpenses.splice(index + 1, 0, {
                                    name: '',
                                    amount: 0,
                                    id: prev.length || 0,
                                  });
                                  return newExpenses;
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
                                setExpenses((prev) => {
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
              <TableFooter className='sticky bottom-0 bg-background/75 dark:bg-muted/75 backdrop-blur-lg border-0 h-[54px]'>
                <TableRow className='border-0'>
                  <TableCell className='font-bold'>Monthly Total</TableCell>
                  <TableCell className='text-right font-bold'>
                    {formatCurrency(total)}
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </ScrollArea>
          <div className='flex flex-row mt-4'>
            <Button
              variant={'outline'}
              className='bg-neutral-300 dark:bg-accent/50 dark:hover:bg-accent rounded-r-none'
              onClick={() => {
                setExpenses([
                  {
                    name: '',
                    amount: 0,
                    id: 0,
                  },
                ]);
                setState('');
                setLocalRate(0);
              }}
            >
              Reset
            </Button>
            <Popover>
              <PopoverTrigger>
                <Button
                  size={'icon'}
                  variant={'outline'}
                  className='bg-neutral-300 dark:bg-accent/50 dark:hover:bg-accent rounded-l-none'
                >
                  <EllipsisVertical size={18} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className='m-1' side='top'>
                <div className='bg-background border rounded p-4 flex flex-col gap-2'>
                  <PopoverClose>
                    <Button
                      variant={'outline'}
                      className='bg-neutral-300 dark:bg-accent/50 dark:hover:bg-accent rounded-l-none'
                      onClick={() => {
                        setExpenses(defaultExpenses);
                        setState(defaultState);
                        setLocalRate(defaultLocalRate);
                      }}
                    >
                      Show Example
                    </Button>
                  </PopoverClose>
                  <PopoverClose>
                    <Button
                      variant={'outline'}
                      className='bg-neutral-300 dark:bg-accent/50 dark:hover:bg-accent rounded-l-none w-full'
                      onClick={() => {
                        setExpenses((prev) => {
                          const newExpenses = [...prev];
                          newExpenses.splice(
                            newExpenses.length,
                            0,
                            {
                              name: '',
                              amount: 0,
                              id: prev.length || 0,
                            },
                            {
                              name: '',
                              amount: 0,
                              id: prev.length + 1 || 1,
                            },
                            {
                              name: '',
                              amount: 0,
                              id: prev.length + 2 || 2,
                            },
                            {
                              name: '',
                              amount: 0,
                              id: prev.length + 3 || 3,
                            },
                            {
                              name: '',
                              amount: 0,
                              id: prev.length + 4 || 4,
                            }
                          );
                          return newExpenses;
                        });
                      }}
                    >
                      Add 5 Rows
                    </Button>
                  </PopoverClose>
                </div>
              </PopoverContent>
            </Popover>
            <Button
              variant={'default'}
              className='bg-primary/70 ms-auto'
              onClick={() =>
                setExpenses((prev) => {
                  const newExpenses = [...prev];
                  newExpenses.splice(newExpenses.length, 0, {
                    name: '',
                    amount: 0,
                    id: prev.length || 0,
                  });
                  return newExpenses;
                })
              }
            >
              Add Row
            </Button>
          </div>
        </div>
        <div className='col-span-12 md:col-span-5'>
          <div className='md:mt-8 md:pt-8'>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className='text-xl'>
                    Monthly Expense Total
                  </TableCell>
                  <TableCell className='text-right text-xl'>
                    {formatCurrency(total)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className='text-xl'>
                    Yearly Expense Total
                  </TableCell>
                  <TableCell className='text-right text-xl'>
                    {formatCurrency(total * 12)}
                  </TableCell>
                </TableRow>
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell className='text-xl'>
                    Estimated Salary Requirement
                  </TableCell>
                  <TableCell className='text-right font-bold text-xl'>
                    <span className='font-bold text-primary'>
                      {formatCurrency(salaryEstimate)}
                    </span>
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
            {state === '' && (
              <p className='pt-4 text-foreground/75 text-sm'>
                Don't forget to select a state.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ExpenseTable;
