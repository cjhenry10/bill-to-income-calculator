import { useState } from 'react';
import Expense from './Expense';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
} from './ui/table';
import { Button } from './ui/button';
import { Delete, Plus } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { formatCurrency, calculateYearlyIncomeNeededPretax } from '@/lib/utils';
import StateSelector from './StateSelector';

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

function ExpenseTable() {
  const [expenses, setExpenses] = useState(defaultExpenses);
  const [state, setState] = useState(defaultState);
  const total = expenses.reduce((acc, expense) => acc + expense.amount, 0);

  function handleExpenseUpdate(
    expenseName: string,
    expenseAmount: number,
    id: number
  ) {
    setExpenses((prevExpenses) => {
      const newExpenses = prevExpenses.map((expense) => {
        if (expense.id === id) {
          return { name: expenseName, amount: expenseAmount, id };
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
        <div className='col-span-12 flex flex-wrap'>
          <h1 className='text-3xl mr-4'>Salary Estimator</h1>
        </div>
        <div className='col-span-12 md:col-span-7 border-[1px] rounded p-4'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='w-1/2'>Expense</TableHead>
                <TableHead className='text-right w-1/4'>$</TableHead>
                <TableHead className='text-center w-1/4'>Options</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((expense, index) => (
                <TableRow key={expense.id}>
                  <Expense
                    {...expense}
                    onExpenseUpdate={handleExpenseUpdate}
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
            <TableFooter>
              <TableRow>
                <TableCell className='font-bold'>Monthly Total</TableCell>
                <TableCell className='text-right font-bold'>
                  {formatCurrency(total)}
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
        <div className='col-span-12 md:col-span-5'>
          <div className='md:mt-8 md:sticky md:top-0 md:pt-8'>
            <div className='flex flex-wrap mb-4'>
              <h3 className='my-auto mr-2'>State: </h3>
              <StateSelector
                defaultState={state}
                onStateUpdate={handleStateUpdate}
              />
            </div>
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
                      {formatCurrency(
                        calculateYearlyIncomeNeededPretax(total * 12, state)
                      )}
                    </span>
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
}

export default ExpenseTable;
