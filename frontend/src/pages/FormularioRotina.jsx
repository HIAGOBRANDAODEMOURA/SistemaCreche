import { useState } from 'react';

export default function FormularioRotina({ alunoId, alunoNome, onVoltar }) {
  const pedagogaSalva = localStorage.getItem('pedagoga_nome') || '';

  const [formData, setFormData] = useState({
    aluno: alunoId,
    acolhida: '',
    estimulacao: [],
    lanche_manha_aceitacao: '',
    lanche_manha_opcao: '',
    almoco_aceitacao: '',
    almoco_opcao: '',
    lanche_tarde_aceitacao: '',
    lanche_tarde_opcao: '',
    soneca: '',
    febre: '',
    temperatura: '',
    hidratacao: '',
    higiene: [],
    pedagoga: pedagogaSalva
  });
  
  const [status, setStatus] = useState({ tipo: '', mensagem: '' });

  const handleChange = (e) => {
    // Se o usuário marcar que NÃO teve febre, limpamos automaticamente qualquer temperatura que estivesse digitada
    if (e.target.name === 'febre' && e.target.value === 'Não') {
      setFormData({ ...formData, febre: e.target.value, temperatura: '' });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleCheckbox = (e, fieldName) => {
    const { value, checked } = e.target;
    setFormData(prev => {
      const lista = prev[fieldName];
      if (checked) {
        return { ...prev, [fieldName]: [...lista, value] };
      } else {
        return { ...prev, [fieldName]: lista.filter(item => item !== value) };
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    localStorage.setItem('pedagoga_nome', formData.pedagoga);
    setStatus({ tipo: 'loading', mensagem: 'Salvando rotina...' });

    const payload = {
      aluno: formData.aluno,
      acolhida: formData.acolhida,
      estimulacao: formData.estimulacao,
      lanche_manha: formData.lanche_manha_aceitacao ? `${formData.lanche_manha_aceitacao}${formData.lanche_manha_opcao ? ' | Opção: ' + formData.lanche_manha_opcao : ''}` : '',
      almoco: formData.almoco_aceitacao ? `${formData.almoco_aceitacao}${formData.almoco_opcao ? ' | Opção: ' + formData.almoco_opcao : ''}` : '',
      lanche_tarde: formData.lanche_tarde_aceitacao ? `${formData.lanche_tarde_aceitacao}${formData.lanche_tarde_opcao ? ' | Opção: ' + formData.lanche_tarde_opcao : ''}` : '',
      soneca: formData.soneca,
      febre: formData.febre,
      temperatura: formData.temperatura,
      higiene: formData.hidratacao ? [...formData.higiene, `Hidratação: ${formData.hidratacao}`] : formData.higiene,
      pedagoga: formData.pedagoga
    };

    fetch('${import.meta.env.VITE_API_URL}/api/rotinas/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
      body: JSON.stringify(payload)
    })
      .then(response => {
        if (!response.ok) throw new Error('Erro ao salvar');
        return response.json();
      })
      .then(() => {
        setStatus({ tipo: 'sucesso', mensagem: 'Rotina salva com sucesso!' });
        setTimeout(() => onVoltar(), 2000);
      })
      .catch(error => {
        console.error(error);
        setStatus({ tipo: 'erro', mensagem: 'Falha ao salvar a rotina. Tente novamente.' });
      });
  };

  const radioStyle = { display: 'flex', gap: '5px', alignItems: 'center', fontWeight: 'normal' };
  const checkStyle = { display: 'flex', gap: '8px', alignItems: 'center', fontWeight: 'normal', color: '#4b5563' };

  return (
    <div style={{ backgroundColor: '#ffffff', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ color: '#1e3a8a', margin: 0 }}>Rotina Berçário: {alunoNome}</h3>
        <button onClick={onVoltar} style={{ padding: '8px 12px', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
          Voltar
        </button>
      </div>

      {status.mensagem && (
        <div style={{ padding: '12px', borderRadius: '6px', marginBottom: '20px', fontWeight: 'bold', backgroundColor: status.tipo === 'sucesso' ? '#dcfce7' : status.tipo === 'erro' ? '#fee2e2' : '#e0f2fe', color: status.tipo === 'sucesso' ? '#166534' : status.tipo === 'erro' ? '#991b1b' : '#075985' }}>
          {status.mensagem}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        <div style={{ padding: '15px', backgroundColor: '#f9fafb', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
          <strong style={{ display: 'block', marginBottom: '10px' }}>Acolhida/Oração:</strong>
          <div style={{ display: 'flex', gap: '15px' }}>
            <label style={radioStyle}><input type="radio" name="acolhida" value="Sim" onChange={handleChange} /> Sim</label>
            <label style={radioStyle}><input type="radio" name="acolhida" value="Não" onChange={handleChange} /> Não</label>
          </div>
        </div>

        <div style={{ padding: '15px', backgroundColor: '#fdf4ff', borderRadius: '6px', border: '1px solid #fbcfe8' }}>
          <strong style={{ display: 'block', marginBottom: '10px', color: '#86198f' }}>Estimulação / Vivências:</strong>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {['Estímulos sensoriais', 'Música / Sons', 'Brincadeiras no tapete', 'Exploração de objetos/texturas', 'Motricidade'].map(item => (
              <label key={item} style={checkStyle}>
                <input type="checkbox" value={item} onChange={(e) => handleCheckbox(e, 'estimulacao')} /> {item}
              </label>
            ))}
          </div>
        </div>

        <div style={{ padding: '15px', backgroundColor: '#f0fdf4', borderRadius: '6px', border: '1px solid #bbf7d0', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <strong style={{ color: '#166534' }}>Alimentação:</strong>
          
          <div>
            <span style={{ fontWeight: 'bold', fontSize: '14px' }}>Lanche / Manhã:</span>
            <div style={{ display: 'flex', gap: '15px', marginTop: '5px', marginBottom: '8px' }}>
              {['Bem', 'Pouco', 'Não aceitou'].map(op => (
                <label key={'lm_'+op} style={radioStyle}><input type="radio" name="lanche_manha_aceitacao" value={op} onChange={handleChange} /> {op}</label>
              ))}
            </div>
            <input type="text" name="lanche_manha_opcao" placeholder="Opção:" value={formData.lanche_manha_opcao} onChange={handleChange} style={{ padding: '8px', width: '100%', borderRadius: '4px', border: '1px solid #d1d5db' }} />
          </div>

          <div style={{ borderTop: '1px solid #bbf7d0', paddingTop: '15px' }}>
            <span style={{ fontWeight: 'bold', fontSize: '14px' }}>Almoço:</span>
            <div style={{ display: 'flex', gap: '15px', marginTop: '5px', marginBottom: '8px' }}>
              {['Bem', 'Pouco', 'Não aceitou'].map(op => (
                <label key={'al_'+op} style={radioStyle}><input type="radio" name="almoco_aceitacao" value={op} onChange={handleChange} /> {op}</label>
              ))}
            </div>
            <input type="text" name="almoco_opcao" placeholder="Opção:" value={formData.almoco_opcao} onChange={handleChange} style={{ padding: '8px', width: '100%', borderRadius: '4px', border: '1px solid #d1d5db' }} />
          </div>

          <div style={{ borderTop: '1px solid #bbf7d0', paddingTop: '15px' }}>
            <span style={{ fontWeight: 'bold', fontSize: '14px' }}>Lanche da tarde:</span>
            <div style={{ display: 'flex', gap: '15px', marginTop: '5px', marginBottom: '8px' }}>
              {['Bem', 'Pouco', 'Não aceitou'].map(op => (
                <label key={'lt_'+op} style={radioStyle}><input type="radio" name="lanche_tarde_aceitacao" value={op} onChange={handleChange} /> {op}</label>
              ))}
            </div>
            <input type="text" name="lanche_tarde_opcao" placeholder="Opção:" value={formData.lanche_tarde_opcao} onChange={handleChange} style={{ padding: '8px', width: '100%', borderRadius: '4px', border: '1px solid #d1d5db' }} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div style={{ padding: '15px', backgroundColor: '#f9fafb', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
            <strong style={{ display: 'block', marginBottom: '10px' }}>Descanso / Soneca:</strong>
            <div style={{ display: 'flex', gap: '15px' }}>
              <label style={radioStyle}><input type="radio" name="soneca" value="Sim" onChange={handleChange} /> Sim</label>
              <label style={radioStyle}><input type="radio" name="soneca" value="Não" onChange={handleChange} /> Não</label>
            </div>
          </div>

          <div style={{ padding: '15px', backgroundColor: '#fef2f2', borderRadius: '6px', border: '1px solid #fecaca' }}>
            <strong style={{ display: 'block', marginBottom: '10px', color: '#991b1b' }}>Febre:</strong>
            <div style={{ display: 'flex', gap: '15px', marginBottom: '10px' }}>
              <label style={radioStyle}><input type="radio" name="febre" value="Sim" onChange={handleChange} checked={formData.febre === 'Sim'} /> Sim</label>
              <label style={radioStyle}><input type="radio" name="febre" value="Não" onChange={handleChange} checked={formData.febre === 'Não'} /> Não</label>
            </div>
            
            {/* O campo de temperatura só aparece se "Sim" estiver selecionado */}
            {formData.febre === 'Sim' && (
              <input 
                type="text" 
                name="temperatura" 
                placeholder="Informe a temperatura:" 
                value={formData.temperatura} 
                onChange={handleChange} 
                style={{ padding: '8px', width: '100%', borderRadius: '4px', border: '1px solid #d1d5db', marginTop: '10px' }} 
              />
            )}
          </div>
        </div>

        <div style={{ padding: '15px', backgroundColor: '#eff6ff', borderRadius: '6px', border: '1px solid #bfdbfe' }}>
          <strong style={{ display: 'block', marginBottom: '10px', color: '#1e40af' }}>Hidratação:</strong>
          <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
            <label style={radioStyle}><input type="radio" name="hidratacao" value="Ideal" onChange={handleChange} /> Ideal</label>
            <label style={radioStyle}><input type="radio" name="hidratacao" value="Abaixo do ideal" onChange={handleChange} /> Abaixo do ideal</label>
          </div>

          <strong style={{ display: 'block', marginBottom: '10px', color: '#1e40af' }}>Higiene:</strong>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {['Banho', 'Evacuação', 'Troca de fralda', 'Escovação'].map(item => (
              <label key={item} style={checkStyle}>
                <input type="checkbox" value={item} onChange={(e) => handleCheckbox(e, 'higiene')} /> {item}
              </label>
            ))}
          </div>
        </div>

        <label style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontWeight: 'bold', color: '#374151' }}>
          Pedagoga Responsável:
          <input type="text" name="pedagoga" value={formData.pedagoga} onChange={handleChange} required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #d1d5db', backgroundColor: '#f3f4f6' }} />
          <small style={{ color: '#6b7280', fontWeight: 'normal' }}>*O sistema lembrará deste nome para os próximos registros.</small>
        </label>

        <button type="submit" disabled={status.tipo === 'loading'} style={{ padding: '15px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', marginTop: '10px' }}>
          {status.tipo === 'loading' ? 'Salvando...' : 'Salvar Rotina'}
        </button>
      </form>
    </div>
  );
}