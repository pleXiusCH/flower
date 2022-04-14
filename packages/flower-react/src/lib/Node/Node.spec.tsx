import { render } from '@testing-library/react';

import Node from './Node';

describe('Node', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Node data={undefined} isConnectable={false} />);
    expect(baseElement).toBeTruthy();
  });
});
