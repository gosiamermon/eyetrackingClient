import * as React from 'react';
import { Link } from 'react-router-dom';
import DatabaseSelect from './components/databaseSelect/databaseSelect';
import './header.css';

export default () => {
  return (
    <div className="header">
      <div className="header-content">
        <DatabaseSelect />
        <Link to="/translator">Go to translator</Link>
      </div>
    </div>
  );
}