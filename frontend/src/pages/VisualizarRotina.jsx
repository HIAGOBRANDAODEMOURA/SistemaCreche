import { useState, useEffect } from 'react';

export default function VisualizarRotina() {
  const [filhos, setFilhos] = useState([]);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setErro('Sessão expirada. Por favor, faça o login novamente.');
      return;
    }

    fetch('${import.meta.env.VITE_API_URL}/api/alunos/', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}` }
    })
      .then(response => {
        if (!response.ok) throw new Error('Falha ao carregar os dados.');
        return response.json();
      })
      .then(data => { if (Array.isArray(data)) setFilhos(data); })
      .catch(() => setErro('Não foi possível carregar as informações do aluno.'));
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <h2 style={{ color: '#1e3a8a', margin: 0 }}>Rotina do Berçário</h2>
        <button onClick={() => { localStorage.removeItem('token'); window.location.reload(); }} style={{ padding: '8px 16px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
          Sair
        </button>
      </div>

      {erro && <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '12px', borderRadius: '6px', marginBottom: '20px' }}>{erro}</div>}

      {filhos.length > 0 ? (
        filhos.map(filho => {
          const ultimaRotina = filho.rotinas && filho.rotinas.length > 0 ? filho.rotinas[filho.rotinas.length - 1] : null;

          return (
            <div key={filho.id} style={{ marginBottom: '30px', border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
              <div style={{ backgroundColor: '#f3f4f6', padding: '15px 20px', borderBottom: '1px solid #e5e7eb' }}>
                <h3 style={{ margin: 0, color: '#1f2937', textTransform: 'uppercase' }}>{filho.nome}</h3>
                <small style={{ color: '#6b7280' }}>Data do Registro: {ultimaRotina ? new Date(ultimaRotina.data).toLocaleDateString('pt-BR') : 'N/A'}</small>
              </div>

              <div style={{ padding: '20px', backgroundColor: 'white' }}>
                {ultimaRotina ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    
                    <div style={{ backgroundColor: '#f8fafc', padding: '15px', borderRadius: '6px', borderLeft: '4px solid #3b82f6' }}>
                      <strong style={{ color: '#1e40af' }}>Acolhida/Oração:</strong> {ultimaRotina.acolhida || '-'}
                    </div>

                    {/* Estimulação - Renderiza como "Tags" coloridas */}
                    <div style={{ backgroundColor: '#fdf4ff', padding: '15px', borderRadius: '6px', border: '1px solid #fbcfe8' }}>
                      <strong style={{ color: '#86198f', display: 'block', marginBottom: '10px' }}>Estimulação / Vivências:</strong>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {ultimaRotina.estimulacao && ultimaRotina.estimulacao.length > 0 ? (
                          ultimaRotina.estimulacao.map((item, idx) => (
                            <span key={idx} style={{ backgroundColor: '#fae8ff', color: '#701a75', padding: '5px 10px', borderRadius: '15px', fontSize: '13px' }}>{item}</span>
                          ))
                        ) : <span style={{ color: '#a21caf', fontSize: '13px' }}>-</span>}
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                      <div style={{ backgroundColor: '#f0fdf4', padding: '12px', borderRadius: '6px', border: '1px solid #bbf7d0' }}>
                        <strong style={{ color: '#166534' }}>Lanche da Manhã:</strong>
                        <div style={{ color: '#15803d', marginTop: '4px' }}>{ultimaRotina.lanche_manha || '-'}</div>
                      </div>
                      <div style={{ backgroundColor: '#fffbeb', padding: '12px', borderRadius: '6px', border: '1px solid #fef08a' }}>
                        <strong style={{ color: '#92400e' }}>Almoço:</strong>
                        <div style={{ color: '#b45309', marginTop: '4px' }}>{ultimaRotina.almoco || '-'}</div>
                      </div>
                      <div style={{ backgroundColor: '#f0fdf4', padding: '12px', borderRadius: '6px', border: '1px solid #bbf7d0' }}>
                        <strong style={{ color: '#166534' }}>Lanche da Tarde:</strong>
                        <div style={{ color: '#15803d', marginTop: '4px' }}>{ultimaRotina.lanche_tarde || '-'}</div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                      <div style={{ border: '1px solid #e2e8f0', padding: '12px', borderRadius: '6px', backgroundColor: '#f9fafb' }}>
                        <strong style={{ color: '#475569' }}>Descanso / Soneca:</strong>
                        <div style={{ marginTop: '4px', color: '#64748b' }}>{ultimaRotina.soneca || '-'}</div>
                      </div>
                      <div style={{ border: '1px solid #fecaca', padding: '12px', borderRadius: '6px', backgroundColor: ultimaRotina.febre === 'Sim' ? '#fef2f2' : 'white' }}>
                        <strong style={{ color: ultimaRotina.febre === 'Sim' ? '#991b1b' : '#475569' }}>Febre:</strong>
                        <div style={{ marginTop: '4px', color: '#64748b' }}>
                          {ultimaRotina.febre} {ultimaRotina.temperatura && `(${ultimaRotina.temperatura}ºC)`}
                        </div>
                      </div>
                    </div>

                    {/* Higiene - Renderiza como "Tags" */}
                    <div style={{ backgroundColor: '#eff6ff', padding: '15px', borderRadius: '6px', border: '1px solid #bfdbfe' }}>
                      <strong style={{ color: '#1e40af', display: 'block', marginBottom: '10px' }}>Higiene e Hidratação:</strong>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {ultimaRotina.higiene && ultimaRotina.higiene.length > 0 ? (
                          ultimaRotina.higiene.map((item, idx) => (
                            <span key={idx} style={{ backgroundColor: '#dbeafe', color: '#1e40af', padding: '5px 10px', borderRadius: '15px', fontSize: '13px' }}>{item}</span>
                          ))
                        ) : <span style={{ color: '#3b82f6', fontSize: '13px' }}>-</span>}
                      </div>
                    </div>
                    
                    <div style={{ marginTop: '10px', textAlign: 'right', color: '#64748b', fontSize: '13px', fontWeight: 'bold' }}>
                      Pedagoga Responsável: {ultimaRotina.pedagoga || 'Não informada'}
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '30px 0', color: '#6b7280' }}>
                    <p>Ainda não há nenhuma rotina registrada hoje para {filho.nome}.</p>
                  </div>
                )}
              </div>
            </div>
          );
        })
      ) : (
        !erro && <p style={{ color: '#4b5563' }}>Buscando informações do aluno...</p>
      )}
    </div>
  );
}