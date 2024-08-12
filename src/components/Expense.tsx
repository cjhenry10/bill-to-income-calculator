import { Input } from './ui/input';
import { TableCell } from './ui/table';

function Expense({
  name,
  amount,
  id,
  onNameChange,
  onAmountChange,
}: {
  name: string;
  amount: number;
  id: number;
  onNameChange: (name: string, id: number) => void;
  onAmountChange: (amount: number, id: number) => void;
}) {
  return (
    <>
      <TableCell className='font-medium'>
        <Input
          type='text'
          value={name}
          onChange={(e) => {
            onNameChange(e.target.value, id);
          }}
        />
      </TableCell>
      <TableCell className='text-right w-1/4'>
        <Input
          className='text-right'
          type='number'
          value={amount}
          onChange={(e) => {
            onAmountChange(Number(e.target.value), id);
          }}
        />
      </TableCell>
    </>
  );
}

export default Expense;
