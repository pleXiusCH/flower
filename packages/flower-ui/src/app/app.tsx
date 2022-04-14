import styles from './app.module.scss';
import { Flower } from '@flower/react';

import { AddAndLogGD, AddAndLogNodeImpls } from '@flower/node-impls';

export function App() {
  return (
    <div className={styles.app}>
      <Flower nodeImpls={AddAndLogNodeImpls} graphDefinition={AddAndLogGD} />
    </div>
  );
}

export default App;
