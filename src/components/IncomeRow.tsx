import { useEffect, useState } from 'react';
import { Input } from './ui/input';
import { TableCell } from './ui/table';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Tooltip, TooltipProvider } from '@radix-ui/react-tooltip';
import { TooltipContent, TooltipTrigger } from './ui/tooltip';
import { on } from 'events';

function IncomeRow({
  name,
  amountYear,
  amountMonth,
  id,
  preTax,
  onAmountUpdate,
  onNameChange,
  onPreTaxChange,
  onMonthlyChange,
  onYearlyChange,
}: {
  name: string;
  amountYear: number;
  amountMonth: number;
  id: number;
  preTax: boolean;
  onAmountUpdate?: (
    name: string,
    amountYear: number,
    amountMonth: number,
    id: number,
    preTax: boolean
  ) => void;
  onNameChange: (name: string, id: number) => void;
  onPreTaxChange: (preTax: boolean, id: number) => void;
  onMonthlyChange: (amount: number, id: number) => void;
  onYearlyChange: (amount: number, id: number) => void;
}) {
  // const [payerName, setPayerName] = useState(name);
  // const [payerYearlySalary, setPayerYearlySalary] = useState(amountYear);
  // const [payerMonthSalary, setPayerMonthlySalary] = useState(amountMonth);
  // const [payerPreTax, setPayerPretax] = useState(preTax);

  // if (name !== payerName) setPayerName(name);
  // if (amountYear !== payerYearlySalary) setPayerYearlySalary(amountYear);
  // if (amountMonth !== payerMonthSalary) setPayerMonthlySalary(amountMonth);
  // if (preTax !== payerPreTax) setPayerPretax(preTax);

  // useEffect(() => {
  //   onAmountUpdate(
  //     payerName,
  //     payerYearlySalary,
  //     payerMonthSalary,
  //     id,
  //     payerPreTax
  //   );
  // }, [payerName, payerYearlySalary, payerMonthSalary, payerPreTax]);

  // function handleNumberChange(event: React.ChangeEvent<HTMLInputElement>) {
  //   if (event.target.name === 'yearly') {
  //     setPayerYearlySalary(Number(event.target.value));
  //     setPayerMonthlySalary(
  //       Number((Number(event.target.value) / 12).toFixed(2))
  //     );
  //   } else {
  //     setPayerMonthlySalary(Number(event.target.value));
  //     setPayerYearlySalary(
  //       Number((Number(event.target.value) * 12).toFixed(2))
  //     );
  //   }
  // }

  return (
    <>
      <TableCell className='font-medium flex gap-2'>
        <Input
          name='payer-name'
          type='text'
          className='w-8/12'
          value={name}
          onChange={(e) => {
            onNameChange(e.target.value, id);
          }}
        />
        <div className='flex items-center space-x-2 ms-auto'>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className='flex items-center space-x-2 ms-auto'>
                  <Switch
                    className='data-[state=checked]:bg-primary/70'
                    id={`pre-tax-${id}`}
                    checked={preTax}
                    onCheckedChange={(e) => {
                      onPreTaxChange(e, id);
                    }}
                  />
                  <Label htmlFor={`pre-tax-${id}`}>Pre-tax</Label>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                Toggle this on if the income for this row is before taxes.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </TableCell>
      <TableCell className='text-right'>
        <Input
          step={'0.01'}
          name='yearly'
          // dir='rtl'
          className='text-end'
          type='number'
          value={amountYear}
          onChange={(e) => {
            onYearlyChange(Number(e.target.value), id);
          }}
        />
      </TableCell>
      <TableCell className='text-right'>
        <Input
          step={'0.01'}
          name='monthly'
          // dir='rtl'
          className='text-end'
          type='number'
          value={amountMonth}
          onChange={(e) => {
            onMonthlyChange(Number(e.target.value), id);
          }}
        />
      </TableCell>
    </>
  );
}

export default IncomeRow;
