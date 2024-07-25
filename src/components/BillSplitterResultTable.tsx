import { formatCurrency } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Info } from 'lucide-react';

function BillSplitterResultTable({
  contributionResult,
}: {
  contributionResult: {
    payers: any[];
    contributions: any[];
    leftover: number;
    err: string;
  };
}) {
  if (contributionResult.err !== '') {
    return <p>{contributionResult.err}</p>;
  }
  return (
    <Table>
      {contributionResult.err === '' && (
        <TableCaption>
          <p>
            With these contributions, each person should have approximately{' '}
            <span className='text-primary'>
              {formatCurrency(contributionResult.leftover)}
            </span>{' '}
            left over per month.
          </p>
          <p className='text-xs mt-2'>
            <Info size={14} className='inline-block' /> These values may be
            slightly off due to rounding.
          </p>
        </TableCaption>
      )}
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead className='text-right'>Monthly Contribution</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {contributionResult.payers.map((payer, index) => (
          <TableRow key={payer.id}>
            <TableCell>{payer.name}</TableCell>
            <TableCell className='text-right'>
              {formatCurrency(contributionResult.contributions[index])}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>Total</TableCell>
          <TableCell className='text-right'>
            {formatCurrency(
              contributionResult.contributions.reduce((a, b) => a + b, 0)
            )}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}

export default BillSplitterResultTable;
