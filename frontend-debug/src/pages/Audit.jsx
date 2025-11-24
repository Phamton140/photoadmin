import React from 'react';
import { Helmet } from 'react-helmet';

const Audit = () => {
  return (
    <>
      <Helmet>
        <title>Audit - Photoadmin Panel</title>
      </Helmet>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Registro de Auditoría</h1>
    </>
  );
};

export default Audit;