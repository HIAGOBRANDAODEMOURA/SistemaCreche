import React, { useState, useEffect } from 'react';
import ListaAlunos from './pages/ListaAlunos';
import FormularioRotina from './pages/FormularioRotina';
import Login from './pages/Login';
import VisualizarRotina from './pages/VisualizarRotina'; // <--- Importamos a nova tela dos pais
import { LogOut } from 'lucide-react';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  // Nova memória para guardar se quem logou é admin/professor ou pai
  const [perfil, setPerfil] = useState(localStorage.getItem('perfil') || null);
  
  const [alunoSelecionado, setAlunoSelecionado] = useState(null);
  const [alunos, setAlunos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    // Só busca a lista de alunos do banco se o usuário for 'admin' ou 'professor'
    if (!token || perfil === 'pai') return;

    fetch('http://localhost:8000/api/alunos/')
      .then(resposta => resposta.json())
      .then(dados => {
        setAlunos(dados);
        setCarregando(false);
      })
      .catch(erro => {
        console.error("Erro ao buscar alunos:", erro);
        setCarregando(false);
      });
  }, [token, perfil]);

  // Modificado para capturar também o perfil que vem do nosso Login Inteligente do Django
  const handleLoginSucesso = (novoToken, perfilUsuario) => {
    localStorage.setItem('token', novoToken);
    localStorage.setItem('perfil', perfilUsuario);
    setToken(novoToken);
    setPerfil(perfilUsuario);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('perfil');
    setToken(null);
    setPerfil(null);
    setAlunoSelecionado(null);
  };

  if (!token) {
    // Agora ele confia 100% no perfil que o Django manda, sem forçar 'admin'
    return <Login onLoginSucesso={handleLoginSucesso} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      
      {/* Barra superior de Desconexão */}
      <div className="p-4 flex justify-end bg-white border-b border-slate-100 shadow-sm mb-2">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-red-500 transition-colors"
        >
          <LogOut className="w-4 h-4" /> Sair do Sistema
        </button>
      </div>

      {/* ROTEAMENTO INTELIGENTE DE PERFIL */}
      {perfil === 'pai' ? (
        // Se for Pai: Cai direto na visualização da agenda do filho
        <VisualizarRotina token={token} />
      ) : (
        // Se for Professor/Admin: Acessa o fluxo de listagem e preenchimento
        alunoSelecionado ? (
          <FormularioRotina 
            aluno={alunoSelecionado} 
            onVoltar={() => setAlunoSelecionado(null)} 
          />
        ) : (
          <div className="p-4 pt-0">
            {carregando ? (
              <div className="flex flex-col items-center justify-center mt-20 text-slate-500">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p>Buscando turmas...</p>
              </div>
            ) : (
              <ListaAlunos 
                alunos={alunos} 
                onSelecionarAluno={setAlunoSelecionado} 
              />
            )}
          </div>
        )
      )}
    </div>
  );
}

export default App;