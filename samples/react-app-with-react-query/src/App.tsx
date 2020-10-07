import React, { useEffect } from 'react';
import { useListPets } from './api/endpoints/petstoreFromFileSpecWithTransformer';
import './App.css';
import { useAuthDispatch } from './auth.context';
import logo from './logo.png';

function App() {
  const dispatch = useAuthDispatch();
  const { data: pets, refetch } = useListPets();

  useEffect(() => {
    dispatch('token');
    setTimeout(() => {
      refetch();
    }, 2000);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {pets?.data.map((pet) => (
          <p key={pet.id}>{pet.name}</p>
        ))}
      </header>
    </div>
  );
}

export default App;