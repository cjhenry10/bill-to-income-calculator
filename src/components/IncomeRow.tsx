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
  return (
    <>
      <TableCell className='font-medium flex gap-2'>
        <Input
          name='payer-name'
          type='text'
          className='w-8/12 min-w-24'
          value={name}
          onChange={(e) => {
            onNameChange(e.target.value, id);
          }}
        />
        <div className='flex items-center space-x-2 ms-auto min-w-32'>
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
      <TableCell className='text-right min-w-28'>
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
      <TableCell className='text-right min-w-28'>
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
