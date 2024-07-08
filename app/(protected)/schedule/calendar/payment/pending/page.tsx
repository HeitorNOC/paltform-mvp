import React from 'react';
import { useRouter } from 'next/navigation';

const Pending = () => {
  const router = useRouter();
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#f8f8f8', color: '#333' }}>
      <h1>Aguardando Pagamento</h1>
      <p>Seu pagamento está sendo processado. Por favor, aguarde...</p>
      <button onClick={() => router.push('/')} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
        Voltar para a Página Inicial
      </button>
    </div>
  );
};

export default Pending;
