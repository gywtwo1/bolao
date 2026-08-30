import React from 'react';
import { Trophy, Target, ShieldCheck, DollarSign, Lock, AlertCircle, X, Check } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-slate-950 px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Regras Oficiais do Bolão 2026</h3>
              <p className="text-xs text-slate-400">Brasileirão Série A • Sistema de Pontuação</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-300">
          {/* Scoring Rules */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
            <h4 className="font-extrabold text-sm text-white flex items-center gap-1.5">
              <Target className="w-4 h-4 text-emerald-400" />
              1. Sistema de Pontuação por Jogo
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="bg-emerald-950/50 border border-emerald-500/30 p-3 rounded-xl space-y-1">
                <span className="text-xs font-black text-emerald-300 flex items-center gap-1">
                  🎯 3 Pontos (Placar Exato)
                </span>
                <p className="text-[11px] text-slate-300">
                  Acertou exatamente o placar final dos dois times (Ex: Palpite 2x1 e resultado 2x1).
                </p>
              </div>
              <div className="bg-amber-950/50 border border-amber-500/30 p-3 rounded-xl space-y-1">
                <span className="text-xs font-black text-amber-300 flex items-center gap-1">
                  ⚡ 1 Ponto (Acerto Resultado)
                </span>
                <p className="text-[11px] text-slate-300">
                  Acertou o vencedor ou empate, mas errou a quantidade exata de gols (Ex: Palpite 3x1 e resultado 2x0).
                </p>
              </div>
            </div>
          </div>

          {/* 10 Games Mandate */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
            <h4 className="font-extrabold text-sm text-white flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400" />
              2. Regra dos 10 Jogos Obrigatórios
            </h4>
            <p className="leading-relaxed">
              O participante é <strong>obrigado a palpitar nos 10 jogos</strong> da rodada. Se faltar qualquer jogo, o sistema alerta e leva o usuário diretamente até o jogo pendente para preenchimento.
            </p>
          </div>

          {/* Lock & PIX Payment */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
            <h4 className="font-extrabold text-sm text-white flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              3. Trava de Palpites & Pagamento PIX (R$ 10,00)
            </h4>
            <p className="leading-relaxed">
              Após preencher os 10 palpites e clicar em <strong>Travar Palpites</strong>, o palpite é congelado e <strong>não pode ser alterado até o fim da rodada</strong>.
            </p>
            <p className="leading-relaxed">
              O participante deve pagar a taxa de <strong>R$ 10,00 via PIX</strong> e anexar o comprovante. <strong>Sem o pagamento aprovado pelo Administrador, o palpite não é contabilizado no ranking e na premiação.</strong>
            </p>
          </div>

          {/* Admin Approval */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
            <h4 className="font-extrabold text-sm text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              4. Aprovação pelo Administrador
            </h4>
            <p className="leading-relaxed">
              O Administrador conta com um painel exclusivo para conferir os comprovantes anexados. Assim que confirmado, o valor entra para o pote da rodada e os pontos passam a valer no ranking oficial.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-5 py-3 border-t border-slate-800 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs"
          >
            Entendi as Regras
          </button>
        </div>
      </div>
    </div>
  );
};
