import React from 'react';
import { User, ChevronRight } from 'lucide-react';

export default function ListaAlunos({ alunos, onSelecionarAluno }) {
  return (
    <div className="max-w-md mx-auto mt-4">
      <header className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-blue-600 flex items-center justify-center gap-2">
          <User className="w-6 h-6" /> Turma: Berçário
        </h1>
        <p className="text-slate-500 text-sm mt-1">Selecione a criança para o registro diário</p>
      </header>

      <div className="space-y-3">
        {alunos.map(aluno => (
          <button
            key={aluno.id}
            onClick={() => onSelecionarAluno(aluno)}
            className="w-full bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between hover:border-blue-300 hover:shadow-md transition-all text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg">
                {aluno.nome.charAt(0)}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-700">{aluno.nome}</h2>
                {aluno.status === 'pendente' ? (
                  <span className="text-xs font-medium text-orange-500 bg-orange-50 px-2 py-1 rounded-md">
                    Pendente hoje
                  </span>
                ) : (
                  <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                    Já registrado
                  </span>
                )}
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300" />
          </button>
        ))}
      </div>
    </div>
  );
}