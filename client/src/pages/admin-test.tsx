export default function AdminTest() {
  return (
    <div className="min-h-screen bg-red-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-red-600">Admin Test Page</h1>
        <p className="mt-4">Se você está vendo esta página, as rotas estão funcionando!</p>
        <div className="mt-4">
          <p>Login: <strong>admin</strong></p>
          <p>Senha: <strong>vidah2025</strong></p>
        </div>
        <a href="/admin/login" className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded">
          Ir para Login Real
        </a>
      </div>
    </div>
  );
}