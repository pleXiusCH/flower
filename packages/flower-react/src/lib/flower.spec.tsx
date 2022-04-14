import { render } from '@testing-library/react';

import Flower from './flower';

describe('FlowerReact', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Flower />);
    expect(baseElement).toBeTruthy();
  });
});
