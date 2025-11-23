import React from 'react';
import { Helmet } from 'react-helmet';

const Macs = () => {
  return (
    <>
      <Helmet>
        <title>MACs - Photoadmin Panel</title>
      </Helmet>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Direcciones MAC</h1>
    </>
  );
};

export default Macs;