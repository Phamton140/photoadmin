import React from 'react';
import { Helmet } from 'react-helmet';

const Users = () => {
  return (
    <>
      <Helmet>
        <title>Users - Photoadmin Panel</title>
      </Helmet>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Usuarios</h1>
    </>
  );
};

export default Users;