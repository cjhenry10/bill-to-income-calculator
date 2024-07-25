import { useEffect, useState } from 'react';
import { Input } from './ui/input';
import { TableCell } from './ui/table';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Tooltip, TooltipProvider } from '@radix-ui/react-tooltip';
import { TooltipContent, TooltipTrigger } from './ui/tooltip';

function IncomeRow({
  name,
  amountYear,
  amountMonth,
  id,
  preTax,
  onAmountUpdate,
}: {
  name: string;
  amountYear: number;
  amountMonth: number;
  id: number;
  preTax: boolean;
  onAmountUpdate: (
    name: string,
    amountYear: number,
    amountMonth: number,
    id: number,
    preTax: boolean
  ) => void;
}) {
  const [payerName, setPayerName] = useState(name);
  const [payerYearlySalary, setPayerYearlySalary] = useState(amountYear);
  const [payerMonthSalary, setPayerMonthlySalary] = useState(amountMonth);
  const [payerPreTax, setPayerPretax] = useState(preTax);

  useEffect(() => {
    onAmountUpdate(
      payerName,
      payerYearlySalary,
      payerMonthSalary,
      id,
      payerPreTax
    );
  }, [payerName, payerYearlySalary, payerMonthSalary, payerPreTax]);

  function handleNumberChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.name === 'yearly') {
      setPayerYearlySalary(Number(event.target.value));
      setPayerMonthlySalary(
        Number((Number(event.target.value) / 12).toFixed(2))
      );
    } else {
      setPayerMonthlySalary(Number(event.target.value));
      setPayerYearlySalary(
        Number((Number(event.target.value) * 12).toFixed(2))
      );
    }
  }

  return (
    <>
      <TableCell className='font-medium flex gap-2'>
        <Input
          name='payer-name'
          type='text'
          className='w-8/12'
          value={payerName}
          onChange={(e) => {
            setPayerName(e.target.value);
          }}
        />
        <div className='flex items-center space-x-2 ms-auto'>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className='flex items-center space-x-2 ms-auto'>
                  <Switch
                    id={`pre-tax-${id}`}
                    checked={payerPreTax}
                    onCheckedChange={setPayerPretax}
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
          value={payerYearlySalary}
          onChange={handleNumberChange}
        />
      </TableCell>
      <TableCell className='text-right'>
        <Input
          step={'0.01'}
          name='monthly'
          // dir='rtl'
          className='text-end'
          type='number'
          value={payerMonthSalary}
          onChange={handleNumberChange}
        />
      </TableCell>
    </>
  );
}

export default IncomeRow;
