import styles from './app.module.scss';
import { Route, Link } from 'react-router-dom';
import { FlowerReact } from '@flower/react';

import { initialElements } from './initialData';

export function App() {
  return (
    <div className={styles.app}>
      <FlowerReact initialElements={initialElements} />
    </div>
  );
}

export default App;
