import React, { useState } from 'react';
import { useBolao } from '../context/BolaoContext';
import { BRASILEIRAO_TEAMS } from '../data/teams';
import { User, LogIn, UserPlus, X, ShieldCheck, Sparkles, Check } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register, users, switchUser } = useBolao();
  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Login Form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register Form
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regTeam, setRegTeam] = useState('Flamengo');
  const [regPix, setRegPix] = useState('');
  const [regPhone, setRegPhone] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const ok = login(loginEmail, loginPass);
    if (ok) {
      onClose();
    } else {
      setLoginError('E-mail não encontrado. Experimente usar uma das contas de teste abaixo ou cadastre-se.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail) return;

    register({
      name: regName,
      email: regEmail,
      favoriteTeam: regTeam,
      pixKey: regPix,
      phone: regPhone
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-950 px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
              {mode === 'login' ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-black text-white">
                {mode === 'login' ? 'Acessar Bolão 2026' : 'Criar Nova Conta'}
              </h3>
              <p className="text-xs text-slate-400">
                {mode === 'login' ? 'Entre com seu e-mail e senha' : 'Participe do bolão e concorra a prêmios'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="p-2 bg-slate-950 border-b border-slate-800 flex gap-2">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'login'
                ? 'bg-emerald-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Entrar (Login)
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'register'
                ? 'bg-emerald-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Cadastrar-se
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-3">
              {loginError && (
                <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-xs text-rose-300">
                  {loginError}
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  E-mail:
                </label>
                <input
                  type="email"
                  required
                  placeholder="carlos@email.com"
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-xs text-white px-3 py-2.5 rounded-xl focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Senha:
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={loginPass}
                  onChange={e => setLoginPass(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-xs text-white px-3 py-2.5 rounded-xl focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all"
              >
                Entrar no Bolão
              </button>

              {/* Demo Accounts List for quick preview */}
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Contas de Demonstração Rápidas:
                </span>
                <div className="space-y-1">
                  {users.slice(0, 4).map(u => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => {
                        switchUser(u.id);
                        onClose();
                      }}
                      className="w-full flex items-center justify-between p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs text-left text-slate-200 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <img src={u.avatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                        <span className="font-semibold">{u.name}</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-400">
                        {u.role === 'admin' ? '🛡️ Entrar como ADM' : 'Entrar'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Nome Completo:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Rodrigo Mendonça"
                  value={regName}
                  onChange={e => setRegName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-xs text-white px-3 py-2 rounded-xl focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  E-mail:
                </label>
                <input
                  type="email"
                  required
                  placeholder="rodrigo@email.com"
                  value={regEmail}
                  onChange={e => setRegEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-xs text-white px-3 py-2 rounded-xl focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Time do Coração (Brasileirão 2026):
                </label>
                <select
                  value={regTeam}
                  onChange={e => setRegTeam(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-xs text-white px-3 py-2 rounded-xl focus:border-emerald-400 focus:outline-none font-semibold"
                >
                  {BRASILEIRAO_TEAMS.map(team => (
                    <option key={team.id} value={team.name}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Sua Chave PIX (para receber prêmios):
                </label>
                <input
                  type="text"
                  placeholder="CPF, E-mail ou Telefone"
                  value={regPix}
                  onChange={e => setRegPix(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-xs text-white px-3 py-2 rounded-xl focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all"
              >
                Concluir Cadastro & Começar
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
