import React, { useState, useEffect } from 'react';
import { Activity, Utensils, Thermometer, Calendar, Heart, ShieldCheck } from 'lucide-react';

export default function VisualizarRotina({ token }) {
  const [rotina, setRotina] = useState(null);
  const [carregando, setCarregando] = useState(true);

  // Simulando a busca da rotina do filho (na Fase 2 traremos filtrado pelo ID do filho do Usuário)
  useEffect(() => {
    fetch('http://localhost:8000/api/rotinas/')
      .then(resposta => resposta.json())
      .then(dados => {
        // Pega a rotina mais recente cadastrada no banco de dados
        if (dados.length > 0) {
          setRotina(dados[dados.length - 1]);
        }
        setCarregando(false);
      })
      .catch(erro => {
        console.error("Erro ao buscar rotina:", erro);
        setCarregando(false);
      });
  }, []);

  if (carregando) {
    return (
      <div className="flex flex-col items-center justify-center mt-20 text-slate-500">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p>Carregando o dia do seu pequeno...</p>
      </div>
    );
  }

  if (!rotina) {
    return (
      <div className="max-w-md mx-auto p-4 mt-10 text-center bg-white rounded-2xl shadow-sm border">
        <Heart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <p className="text-slate-600 font-medium">Nenhuma rotina registrada para hoje ainda.</p>
        <p className="text-slate-400 text-sm mt-1">As professoras atualizarão assim que possível!</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4 space-y-6 pb-12">
      
      {/* Cabeçalho da Agenda Digital */}
      <header className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-2xl shadow-md text-center">
        <p className="text-xs uppercase tracking-wider opacity-80 flex items-center justify-center gap-1">
          <Calendar className="w-3 h-3" /> Diário de Bordo
        </p>
        <h1 className="text-2xl font-bold mt-1">Acompanhe seu Filho</h1>
        <div className="mt-3 inline-block bg-white/20 px-3 py-1 rounded-full text-xs font-medium">
          Data: {new Date(rotina.data).toLocaleDateString('pt-BR')}
        </div>
      </header>

      {/* SEÇÃO 1: VIVÊNCIAS */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-3">
        <h3 className="font-bold text-blue-600 flex items-center gap-2 text-md">
          <Activity className="w-5 h-5" /> Atividades e Vivências
        </h3>
        <p className="text-sm text-slate-600">
          <span className="font-semibold text-slate-700">Acolhida e Oração:</span> {rotina.acolhida}
        </p>
        <div>
          <span className="text-sm font-semibold text-slate-700 block mb-2">Estímulos do dia:</span>
          <div className="flex flex-wrap gap-2">
            {rotina.estimulacao.map((item, index) => (
              <span key={index} className="bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-md border border-blue-100">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* SEÇÃO 2: ALIMENTAÇÃO */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-4">
        <h3 className="font-bold text-orange-500 flex items-center gap-2 text-md">
          <Utensils className="w-5 h-5" /> Alimentação
        </h3>
        <div className="grid grid-cols-1 gap-3">
          {[
            { label: 'Lanche da Manhã', valor: rotina.lanche_manha },
            { label: 'Almoço', valor: rotina.almoco },
            { label: 'Lanche da Tarde', valor: rotina.lanche_tarde }
          ].map((ref, idx) => (
            <div key={idx} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-sm font-semibold text-slate-700">{ref.label}</span>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${ref.valor === 'Bem' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-orange-50 text-orange-700 border border-orange-100'}`}>
                {ref.valor}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* SEÇÃO 3: SAÚDE E HIGIENE */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-3">
        <h3 className="font-bold text-teal-600 flex items-center gap-2 text-md">
          <Thermometer className="w-5 h-5" /> Saúde e Bem-estar
        </h3>
        <p className="text-sm text-slate-600 flex justify-between border-b pb-2 border-slate-50">
          <span className="font-semibold text-slate-700">Descanso / Soneca:</span> {rotina.soneca}
        </p>
        <p className="text-sm text-slate-600 flex justify-between border-b pb-2 border-slate-50">
          <span className="font-semibold text-slate-700">Teve febre?</span> 
          <span className={rotina.febre === 'Sim' ? 'text-red-600 font-bold' : ''}>
            {rotina.febre} {rotina.temperatura ? `(${rotina.temperatura})` : ''}
          </span>
        </p>
        <div>
          <span className="text-sm font-semibold text-slate-700 block mb-2">Cuidados de Higiene realizados:</span>
          <div className="flex flex-wrap gap-2">
            {rotina.higiene.map((item, index) => (
              <span key={index} className="bg-teal-50 text-teal-700 text-xs font-medium px-2.5 py-1 rounded-md border border-teal-100">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* RODAPÉ: ASSINATURA */}
      <div className="bg-slate-100 p-4 rounded-xl text-center flex items-center justify-center gap-2 text-xs text-slate-500 font-medium border border-slate-200">
        <ShieldCheck className="w-4 h-4 text-emerald-600" /> Registro assinado por: {rotina.pedagoga}
      </div>

    </div>
  );
}