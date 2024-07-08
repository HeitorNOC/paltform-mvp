import React from 'react';
import { useRouter } from 'next/navigation';

const Success = () => {
  const router = useRouter();
  
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-100 text-green-900">
      <h1 className="text-2xl mb-4">Pagamento Bem-Sucedido</h1>
      <p className="text-lg mb-8 text-center">Seu pagamento foi processado com sucesso!</p>
      <button onClick={() => router.push('/')} className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700">
        Voltar para a Página Inicial
      </button>
    </div>
  );
};

export default Success;
