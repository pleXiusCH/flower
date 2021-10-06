import { render } from '@testing-library/react';

import FlowerReact from './flower-react';

describe('FlowerReact', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FlowerReact />);
    expect(baseElement).toBeTruthy();
  });
});
