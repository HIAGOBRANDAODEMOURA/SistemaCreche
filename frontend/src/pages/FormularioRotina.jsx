import React, { useState } from 'react';
import { ChevronLeft, Save, Activity, Utensils, Thermometer, Droplets } from 'lucide-react';

export default function FormularioRotina({ aluno, onVoltar }) {
  const [respostas, setRespostas] = useState({
    acolhida: '',
    estimulacao: [],
    lancheManha: '',
    almoco: '',
    lancheTarde: '',
    soneca: '',
    febre: '',
    temperatura: '',
    hidratacao: '',
    higiene: [],
    pedagoga: ''
  });

  const [salvando, setSalvando] = useState(false);

  const selecionarRadio = (campo, valor) => {
    setRespostas({ ...respostas, [campo]: valor });
  };

  const alternarCheckbox = (campo, valor) => {
    const listaAtual = respostas[campo];
    if (listaAtual.includes(valor)) {
      setRespostas({ ...respostas, [campo]: listaAtual.filter(item => item !== valor) });
    } else {
      setRespostas({ ...respostas, [campo]: [...listaAtual, valor] });
    }
  };

  // Função que envia os dados para o Django
  const handleSalvar = async () => {
    setSalvando(true);

    // Formata os dados exatamente como o model do Django espera
    const dadosParaEnviar = {
      aluno: aluno.id,
      acolhida: respostas.acolhida || 'Não preenchido',
      estimulacao: respostas.estimulacao,
      lanche_manha: respostas.lancheManha || 'Não preenchido',
      almoco: respostas.almoco || 'Não preenchido',
      lanche_tarde: respostas.lancheTarde || 'Não preenchido',
      soneca: respostas.soneca || 'Não preenchido',
      febre: respostas.febre || 'Não preenchido',
      temperatura: respostas.temperatura,
      hidratacao: respostas.hidratacao || 'Não preenchido',
      higiene: respostas.higiene,
      pedagoga: respostas.pedagoga || 'Não preenchida'
    };

    try {
      const respostaApi = await fetch('http://localhost:8000/api/rotinas/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosParaEnviar)
      });

      if (respostaApi.ok) {
        alert('✅ Rotina salva com sucesso no banco de dados!');
        onVoltar(); // Devolve a professora para a lista de alunos
      } else {
        const erro = await respostaApi.json();
        console.error("Erro do servidor:", erro);
        alert('⚠️ Ops! Verifique se faltou preencher algo.');
      }
    } catch (erro) {
      console.error("Erro de conexão:", erro);
      alert('⚠️ Erro ao tentar conectar com o servidor.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen shadow-md relative pb-24">
      
      {/* Cabeçalho Fixo */}
      <div className="sticky top-0 bg-white border-b border-slate-100 p-4 flex items-center gap-3 z-10 shadow-sm">
        <button onClick={onVoltar} className="p-2 bg-slate-100 rounded-full text-slate-600 hover:bg-slate-200 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-lg font-bold leading-tight text-slate-800">{aluno.nome}</h2>
          <p className="text-xs text-slate-500">{new Date().toLocaleDateString('pt-BR')}</p>
        </div>
      </div>

      {/* Corpo do Formulário */}
      <div className="p-4 space-y-8 mt-2">
        
        {/* SEÇÃO 1: ATIVIDADES */}
        <section className="space-y-4">
          <h3 className="font-bold text-blue-600 flex items-center gap-2 text-lg border-b border-slate-100 pb-2">
            <Activity className="w-5 h-5" /> Atividades e Vivências
          </h3>
          
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <p className="text-sm font-semibold mb-3 text-slate-700">Acolhida / Oração:</p>
            <div className="flex gap-3">
              {['Sim', 'Não'].map(opcao => (
                <button 
                  key={opcao}
                  onClick={() => selecionarRadio('acolhida', opcao)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${respostas.acolhida === opcao ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'}`}
                >
                  {opcao}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <p className="text-sm font-semibold mb-3 text-slate-700">Estimulação / Vivências:</p>
            <div className="space-y-3">
              {['Estímulos sensoriais', 'Música / Sons', 'Brincadeiras no tapete', 'Exploração de objetos/texturas', 'Motricidade'].map(opcao => (
                <label key={opcao} className="flex items-center gap-3 p-2 bg-white rounded-lg border border-slate-200 cursor-pointer hover:border-blue-300">
                  <input 
                    type="checkbox" 
                    checked={respostas.estimulacao.includes(opcao)}
                    onChange={() => alternarCheckbox('estimulacao', opcao)}
                    className="w-5 h-5 rounded text-blue-600" 
                  />
                  <span className="text-sm text-slate-700">{opcao}</span>
                </label>
              ))}
            </div>
          </div>
        </section>

        {/* SEÇÃO 2: ALIMENTAÇÃO */}
        <section className="space-y-4">
          <h3 className="font-bold text-orange-500 flex items-center gap-2 text-lg border-b border-slate-100 pb-2">
            <Utensils className="w-5 h-5" /> Alimentação
          </h3>
          
          {[
            { id: 'lancheManha', label: 'Lanche / Manhã' },
            { id: 'almoco', label: 'Almoço' },
            { id: 'lancheTarde', label: 'Lanche da Tarde' }
          ].map(refeicao => (
            <div key={refeicao.id} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <p className="text-sm font-semibold mb-3 text-slate-700">{refeicao.label}:</p>
              <div className="flex gap-2">
                {['Bem', 'Pouco', 'Não aceitou'].map(opcao => (
                  <button 
                    key={opcao}
                    onClick={() => selecionarRadio(refeicao.id, opcao)}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-colors ${respostas[refeicao.id] === opcao ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-slate-600 border-slate-200 hover:border-orange-300'}`}
                  >
                    {opcao}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* SEÇÃO 3: SAÚDE E HIGIENE */}
        <section className="space-y-4">
          <h3 className="font-bold text-teal-600 flex items-center gap-2 text-lg border-b border-slate-100 pb-2">
            <Thermometer className="w-5 h-5" /> Saúde e Bem-estar
          </h3>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-700">Descanso / Soneca:</p>
            <div className="flex gap-2">
              {['Sim', 'Não'].map(opcao => (
                <button 
                  key={opcao}
                  onClick={() => selecionarRadio('soneca', opcao)}
                  className={`px-5 py-2 rounded-lg text-sm font-medium border transition-colors ${respostas.soneca === opcao ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-slate-600 border-slate-200 hover:border-teal-300'}`}
                >
                  {opcao}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-slate-700">Teve Febre?</p>
              <div className="flex gap-2">
                {['Sim', 'Não'].map(opcao => (
                  <button 
                    key={opcao}
                    onClick={() => selecionarRadio('febre', opcao)}
                    className={`px-5 py-2 rounded-lg text-sm font-medium border transition-colors ${respostas.febre === opcao ? 'bg-red-500 text-white border-red-500' : 'bg-white text-slate-600 border-slate-200 hover:border-red-300'}`}
                  >
                    {opcao}
                  </button>
                ))}
              </div>
            </div>
            {respostas.febre === 'Sim' && (
              <input 
                type="text" 
                placeholder="Qual a temperatura? (Ex: 38.5°C)" 
                value={respostas.temperatura}
                onChange={(e) => setRespostas({ ...respostas, temperatura: e.target.value })}
                className="w-full p-3 rounded-lg border border-slate-300 text-sm focus:outline-red-400 mt-2" 
              />
            )}
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <p className="text-sm font-semibold mb-3 text-slate-700 flex items-center gap-2">
              <Droplets className="w-4 h-4 text-blue-400" /> Higiene:
            </p>
            <div className="grid grid-cols-2 gap-3">
              {['Banho', 'Evacuação', 'Troca de fralda', 'Escovação'].map(opcao => (
                <label key={opcao} className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200 cursor-pointer hover:border-teal-300">
                  <input 
                    type="checkbox" 
                    checked={respostas.higiene.includes(opcao)}
                    onChange={() => alternarCheckbox('higiene', opcao)}
                    className="w-4 h-4 rounded text-teal-600" 
                  />
                  <span className="text-xs text-slate-700 font-medium">{opcao}</span>
                </label>
              ))}
            </div>
          </div>
        </section>

        {/* SEÇÃO 4: ASSINATURA */}
        <section className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <p className="text-sm font-semibold mb-3 text-slate-700">Pedagoga Responsável:</p>
            <input 
              type="text" 
              placeholder="Nome da professora"
              value={respostas.pedagoga}
              onChange={(e) => setRespostas({ ...respostas, pedagoga: e.target.value })}
              className="w-full p-3 rounded-lg border border-slate-300 text-sm focus:outline-blue-500" 
            />
          </div>
        </section>

      </div>

      {/* Botão Salvar Flutuante */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)]">
        <div className="max-w-md mx-auto">
          <button 
            onClick={handleSalvar}
            disabled={salvando}
            className={`w-full text-white font-bold py-4 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 ${salvando ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {salvando ? (
              <span>Salvando...</span>
            ) : (
              <>
                <Save className="w-5 h-5" /> Salvar Rotina
              </>
            )}
          </button>
        </div>
      </div>

    </div>
  );
}