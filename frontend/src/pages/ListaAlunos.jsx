import { useState, useEffect } from 'react';
import FormularioRotina from './FormularioRotina';

export default function ListaAlunos() {
  const [alunos, setAlunos] = useState([]);
  const [erro, setErro] = useState('');
  
  // Controle de qual aluno está com o formulário aberto
  const [alunoSelecionado, setAlunoSelecionado] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setErro('Você precisa estar logado para acessar os alunos.');
      return;
    }

    fetch('http://localhost:8000/api/alunos/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      }
    })
      .then(response => {
        if (!response.ok) throw new Error('Falha na autenticação ou permissão negada.');
        return response.json();
      })
      .then(data => Array.isArray(data) ? setAlunos(data) : setAlunos([]))
      .catch(error => {
        console.error('Erro:', error);
        setErro('Erro ao carregar a lista de alunos.');
      });
  }, []);

  // Se o professor clicou em um aluno, a tela esconde a lista e mostra só o formulário
  if (alunoSelecionado) {
    return (
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
        <FormularioRotina 
          alunoId={alunoSelecionado.id} 
          alunoNome={alunoSelecionado.nome} 
          onVoltar={() => setAlunoSelecionado(null)} 
        />
      </div>
    );
  }

  // Se não tem aluno selecionado, mostra a lista padrão
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#1e3a8a', margin: 0 }}>Painel do Professor</h2>
        <button onClick={() => { localStorage.removeItem('token'); window.location.reload(); }} style={{ padding: '8px 16px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
          Sair
        </button>
      </div>
      
      {erro && <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '12px', borderRadius: '6px', marginBottom: '20px', fontWeight: 'bold' }}>{erro}</div>}

      {alunos && alunos.length > 0 ? (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {alunos.map(aluno => (
            <li key={aluno.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', borderBottom: '1px solid #e5e7eb', marginBottom: '10px', backgroundColor: '#f9fafb', borderRadius: '6px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div>
                <strong style={{ fontSize: '18px', color: '#1f2937', textTransform: 'uppercase' }}>{aluno.nome}</strong>
                <br />
                <span style={{ color: '#6b7280', fontSize: '14px' }}>
                  Turma: {aluno.turma_nome} | Responsável: {aluno.responsavel_nome}
                </span>
              </div>
              
              <button 
                onClick={() => setAlunoSelecionado(aluno)}
                style={{ padding: '10px 15px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                + Preencher Rotina
              </button>
            </li>
          ))}
        </ul>
      ) : (
        !erro && <div style={{ backgroundColor: '#f3f4f6', padding: '15px', borderRadius: '6px', color: '#4b5563' }}>Nenhum aluno encontrado.</div>
      )}
    </div>
  );
}