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
import { Gem, Info, TriangleAlert } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import messages from '@/lib/messages';

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
    let message = contributionResult.err;
    if (message.startsWith('Me is')) {
      message = message.replace('Me is', 'I am');
    } else if (
      contributionResult.err === messages.incomeLow ||
      contributionResult.err === messages.noPayers
    ) {
      return (
        <Alert variant='destructive'>
          <TriangleAlert size={18} />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{contributionResult.err}</AlertDescription>
        </Alert>
      );
    } else if (contributionResult.err === messages.noData) {
      return <p>{contributionResult.err}</p>;
    }
    return (
      <Alert variant='default' className='text-foreground/75'>
        <Gem size={18} />
        <AlertTitle>Single payer</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Table className='sm:text-lg'>
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
            <Info size={14} className='inline-block' /> {messages.roundingError}
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
