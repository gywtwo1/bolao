import React, { useState } from 'react';
import { useBolao } from '../context/BolaoContext';
import { BRASILEIRAO_TEAMS } from '../data/teams';
import { User, LogIn, UserPlus, X, ShieldCheck, Sparkles, Check, Eye, EyeOff } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdminLogin?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAdminLogin }) => {
  const { login, register, users, switchUser } = useBolao();
  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Login Form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Register Form
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPass, setRegPass] = useState('');
  const [showRegPass, setShowRegPass] = useState(false);
  const [regTeam, setRegTeam] = useState('Flamengo');
  const [regPix, setRegPix] = useState('');
  const [regError, setRegError] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const res = login(loginEmail, loginPass);
    if (res.success) {
      if (res.isAdmin) {
        onAdminLogin?.();
      }
      onClose();
    } else {
      setLoginError(res.message || 'Erro ao entrar. Verifique os dados informados.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (!regName.trim()) {
      setRegError('Por favor, informe seu nome completo.');
      return;
    }
    if (!regEmail.trim()) {
      setRegError('Por favor, informe seu e-mail.');
      return;
    }
    if (!regPass) {
      setRegError('Por favor, crie uma senha para acessar o bolão.');
      return;
    }
    if (regPass.length < 4) {
      setRegError('A senha deve conter no mínimo 4 dígitos ou caracteres.');
      return;
    }

    const emailClean = regEmail.trim().toLowerCase();
    const existing = users.find(u => u.email.toLowerCase() === emailClean);
    if (existing) {
      setRegError('Já existe uma conta com este e-mail. Acesse a aba "Entrar (Login)".');
      return;
    }

    register({
      name: regName,
      email: regEmail,
      password: regPass,
      favoriteTeam: regTeam,
      pixKey: regPix
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
                {mode === 'login' ? 'Entre com seu login e senha' : 'Participe do bolão e concorra a prêmios'}
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
            onClick={() => {
              setMode('login');
              setLoginError('');
              setRegError('');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'login'
                ? 'bg-emerald-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Entrar (Login)
          </button>
          <button
            onClick={() => {
              setMode('register');
              setLoginError('');
              setRegError('');
            }}
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
                  Login ou E-mail:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: admin ou seu.email@exemplo.com"
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-xs text-white px-3 py-2.5 rounded-xl focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Senha:
                </label>
                <div className="relative">
                  <input
                    type={showLoginPass ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={loginPass}
                    onChange={e => setLoginPass(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 text-xs text-white px-3 py-2.5 pr-10 rounded-xl focus:border-emerald-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPass(!showLoginPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showLoginPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all mt-2"
              >
                Entrar no Bolão
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3">
              {regError && (
                <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-xs text-rose-300">
                  {regError}
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Nome Completo: <span className="text-rose-400">*</span>
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
                  E-mail: <span className="text-rose-400">*</span>
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

              {/* Password Field */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Criar Senha: <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showRegPass ? 'text' : 'password'}
                    required
                    placeholder="Mínimo 4 dígitos"
                    value={regPass}
                    onChange={e => setRegPass(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 text-xs text-white px-3 py-2 pr-9 rounded-xl focus:border-emerald-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPass(!showRegPass)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    tabIndex={-1}
                  >
                    {showRegPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
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
                  Chave PIX <span className="text-slate-400 font-normal">(p/ recebimento de prêmios)</span>:
                </label>
                <input
                  type="text"
                  placeholder="CPF, e-mail ou telefone PIX"
                  value={regPix}
                  onChange={e => setRegPix(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-xs text-white px-3 py-2 rounded-xl focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all mt-1"
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
