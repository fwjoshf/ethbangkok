import { Navigation } from './components';
import { Route, Routes } from 'react-router-dom';
import {
  SingleProject,
  Projects,
  CreateProject,
  Account,
} from './pages';
import React, { useState, useEffect } from 'react';


function App() {
  return (
    <div className="App">
      <Navigation />
      <Routes>
        <Route path="/" element={<Projects />} />
        <Route path="/create-campaign" element={<CreateProject />} />
        <Route path="/campaign/:id" element={<SingleProject />} />
        <Route path="/account/:id" element={<Account />} />
      </Routes>
    </div>
  );
}

export default App;
