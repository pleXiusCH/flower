import { render } from '@testing-library/react';

import Port from './Port';

describe('Port', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Port />);
    expect(baseElement).toBeTruthy();
  });
});
