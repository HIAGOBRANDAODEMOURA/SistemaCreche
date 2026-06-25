import React, { useState } from 'react';
import { Lock, User } from 'lucide-react';

export default function Login({ onLoginSucesso }) {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  // Função que envia os dados para o "Portão" do Django
  const handleLogin = async (e) => {
    e.preventDefault(); // Evita que a página recarregue
    setErro('');
    setCarregando(true);

    try {
      const resposta = await fetch('http://localhost:8000/api/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // O Django espera os campos "username" e "password" em inglês
        body: JSON.stringify({ username: usuario, password: senha })
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        // Se deu certo, recebemos o token e passamos para o App principal
        onLoginSucesso(dados.token, dados.perfil);
      } else {
        // Se a senha estiver errada, o Django avisa
        setErro('Usuário ou senha incorretos.');
      }
    } catch (error) {
      setErro('Erro ao conectar com o servidor. O backend está ligado?');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-sm w-full bg-white rounded-2xl shadow-md p-6 space-y-6 border border-slate-100">
        
        {/* Cabeçalho */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-blue-600">Sistema Creche</h1>
          <p className="text-slate-500 text-sm mt-1">Faça login para acessar o painel</p>
        </div>

        {/* Alerta de Erro */}
        {erro && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center border border-red-100 font-medium">
            {erro}
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Usuário</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl focus:outline-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                placeholder="Digite seu usuário"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Senha</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl focus:outline-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={carregando}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white transition-all active:scale-95 ${carregando ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {carregando ? 'Conectando...' : 'Entrar'}
          </button>
        </form>

      </div>
    </div>
  );
}