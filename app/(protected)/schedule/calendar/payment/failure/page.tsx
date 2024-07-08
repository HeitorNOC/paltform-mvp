import React from 'react';
import { useRouter } from 'next/navigation';

const Failure = () => {
  const router = useRouter();
  
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-red-100 text-red-900">
      <h1 className="text-2xl mb-4">Falha no Pagamento</h1>
      <p className="text-lg mb-8 text-center">Houve um problema ao processar seu pagamento. Por favor, tente novamente.</p>
      <button onClick={() => router.push('/')} className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700">
        Voltar para a Página Inicial
      </button>
    </div>
  );
};

export default Failure;
