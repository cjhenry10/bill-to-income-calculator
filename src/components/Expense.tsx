import { useEffect, useState } from 'react';
import { Input } from './ui/input';
import { TableCell } from './ui/table';

function Expense({
  name,
  amount,
  onExpenseUpdate,
  id,
}: {
  name: string;
  amount: number;
  onExpenseUpdate: (name: string, amount: number, id: number) => void;
  id: number;
}) {
  const [expenseName, setExpenseName] = useState(name);
  const [expenseAmount, setExpenseAmount] = useState(amount);
  // const [expenseId, setExpenseId] = useState(id);

  useEffect(() => {
    onExpenseUpdate(expenseName, expenseAmount, id);
  }, [expenseName, expenseAmount, id]);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.type === 'text') {
      setExpenseName(event.target.value);
    } else {
      setExpenseAmount(Number(event.target.value));
    }
  }

  return (
    <>
      <TableCell className='font-medium'>
        <Input type='text' value={expenseName} onChange={handleChange} />
      </TableCell>
      <TableCell className='text-right'>
        <Input
          dir='rtl'
          className='text-right'
          type='number'
          value={expenseAmount}
          onChange={handleChange}
        />
      </TableCell>
    </>
  );
}

export default Expense;
