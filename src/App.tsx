import ExpenseTable from './components/ExpenseTable';

function App() {
  return (
    <>
      <ExpenseTable />
      <div className='grid grid-cols-12 gap-4 my-8'>
        <p className='col-span-12 md:col-span-7 leading-7'>
          Enter your monthly expenses and the calculator will estimate your
          minimum pre-tax salary requirement. The results should slightly
          overestimate, but still be within 5% for salary estimates below
          $200,000. For estimates above $200,000, the accuracy is within 10%.
        </p>
        <div className='col-span-12 md:col-span-5'></div>
        {/* <p className='col-span-12 md:col-span-7 leading-8'>
          The results are designed to overestimate, but still be within 4%
          accuracy for anything below $100,000. For anything above $100,000, but
          below $200,000, the accuracy is within 5%. Anything over $200,000 is
          within 10%. This setup is to reduce while loop iterations while
          calculating the estimated pre-tax salary.
        </p>
        <div className='col-span-12 md:col-span-5'></div> */}
      </div>
    </>
  );
}

export default App;
