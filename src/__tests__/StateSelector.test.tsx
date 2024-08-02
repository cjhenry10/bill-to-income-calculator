import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import StateSelector from '@/components/StateSelector';

describe('StateSelector', () => {
  it('should render the component', () => {
    const { getByText } = render(
      <StateSelector defaultState='' onStateUpdate={() => {}} />
    );
    expect(getByText('Select state...')).toBeInTheDocument();
  });

  it('should render the component with a default state', () => {
    const { getByText } = render(
      <StateSelector defaultState='PA' onStateUpdate={() => {}} />
    );
    expect(getByText('PA')).toBeInTheDocument();
  });
});
