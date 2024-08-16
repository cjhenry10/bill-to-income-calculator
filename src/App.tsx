import ExpenseTable from './components/ExpenseTable';

function App() {
  return (
    <>
      <ExpenseTable />
      <div className='grid grid-cols-12 gap-4 my-8'>
        <p className='col-span-12 md:col-span-7 leading-7'>
          Determine your annual income needs based on your real or estimated
          monthly expenses.
        </p>
        <div className='col-span-12 md:col-span-5'></div>
        <p className='col-span-12 md:col-span-7 leading-7'>
          All you have to do is enter all your monthly costs, including bills,
          groceries, subscription services, rent or mortgage, and all the rest.
          The calculator will estimate the minimum pre-tax annual salary you'd
          need to cover your entered expenses.
        </p>
        <div className='col-span-12 md:col-span-5'></div>
        <p className='col-span-12 md:col-span-7 leading-7'>
          The results should slightly overestimate to account for slight
          variations in expenses, but still be within 5% accuracy for salary
          estimates below $200,000.
        </p>
        <div className='col-span-12 md:col-span-5'></div>
        <p className='col-span-12 md:col-span-7 leading-7'>
          For estimates above $200,000, the accuracy is within 10%.
        </p>
        <div className='col-span-12 md:col-span-5'></div>
      </div>
    </>
  );
}

export default App;
