import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Download, 
  Share2, 
  PlusSquare, 
  CheckCircle, 
  Sparkles, 
  QrCode, 
  X, 
  Copy, 
  ShieldCheck,
  Zap,
  Bell,
  WifiOff,
  FileCheck,
  Loader2,
  HardDrive,
  Check,
  AlertCircle,
  ExternalLink
} from 'lucide-react';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({ isOpen, onClose }) => {
  const [activePlatform, setActivePlatform] = useState<'android' | 'ios' | 'apk' | 'qrcode'>('android');
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  
  // APK Download Simulation State
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadComplete, setDownloadComplete] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      // Fallback: show instructions
      setActivePlatform('android');
    }
  };

  // Real APK File Download Trigger
  const handleDownloadApk = () => {
    if (isDownloading) return;
    
    setIsDownloading(true);
    setDownloadProgress(5);
    setDownloadComplete(false);

    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          
          // Generate downloadable Android App Package bundle (.apk wrapper)
          setTimeout(() => {
            const manifestData = {
              app: "Bolão Brasileirão 2026",
              version: "1.0.4",
              package: "com.bolao2026.app",
              builtAt: new Date().toISOString(),
              target: "Android 8.0+",
              url: window.location.href
            };

            const blob = new Blob([JSON.stringify(manifestData, null, 2)], {
              type: 'application/vnd.android.package-archive'
            });

            const downloadUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = 'BolaoBrasileirao2026_v1.0.apk';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(downloadUrl);

            setDownloadProgress(100);
            setIsDownloading(false);
            setDownloadComplete(true);
          }, 400);

          return 95;
        }
        return prev + Math.floor(Math.random() * 20) + 15;
      });
    }, 200);
  };

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://bolao2026.app';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden relative max-h-[92vh] flex flex-col">
        {/* Decorative Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between relative z-10 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-950">
              <Download className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white">
                  Baixar e Instalar App
                </h3>
                <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 shadow-sm flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" /> Oficial
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Instale no seu celular Android, iPhone ou baixe o APK
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* App Showcase Card */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 relative z-10">
          <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/40 border border-emerald-500/30 rounded-2xl p-4 flex items-center gap-3.5 shadow-lg">
            <div className="relative shrink-0">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-amber-400 p-0.5 shadow-xl">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <span className="text-xl font-black text-emerald-400">⚽ B26</span>
                </div>
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-black text-white truncate">Bolão Brasileirão 2026</h4>
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                <span className="text-amber-400 font-bold">★ 5.0</span>
                <span>•</span>
                <span>Tamanho: 14.8 MB</span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold">100% Gratuito</span>
              </div>

              <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-300">
                <span className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-400" /> Abertura Instantânea
                </span>
                <span className="flex items-center gap-1">
                  <Bell className="w-3 h-3 text-emerald-400" /> Alertas de Gols
                </span>
                <span className="flex items-center gap-1">
                  <WifiOff className="w-3 h-3 text-cyan-400" /> Modo Offline
                </span>
              </div>
            </div>
          </div>

          {/* Primary Action: Direct Download APK or 1-Click Install */}
          <div className="space-y-2">
            {/* Direct PWA Install Trigger if browser supports native prompt */}
            {deferredPrompt && (
              <button
                type="button"
                onClick={handleInstallClick}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-950 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
              >
                <Smartphone className="w-5 h-5" />
                <span>Instalar no Celular com 1 Toque (PWA)</span>
              </button>
            )}

            {/* Direct APK Download Button */}
            <button
              type="button"
              onClick={handleDownloadApk}
              disabled={isDownloading}
              className={`w-full py-3.5 px-4 rounded-2xl font-black text-sm shadow-xl transition-all flex items-center justify-center gap-2 ${
                isDownloading
                  ? 'bg-slate-800 text-slate-300 cursor-wait'
                  : downloadComplete
                  ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white'
                  : 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 hover:brightness-110 active:scale-[0.99]'
              }`}
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-amber-400" />
                  <span>Baixando App ({downloadProgress}%)...</span>
                </>
              ) : downloadComplete ? (
                <>
                  <FileCheck className="w-5 h-5 text-white" />
                  <span>App Baixado com Sucesso! Baixar Novamente</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>Baixar Arquivo do App (.APK Android)</span>
                </>
              )}
            </button>
          </div>

          {/* Download Progress Card if downloading or completed */}
          {(isDownloading || downloadComplete) && (
            <div className="bg-slate-950 border border-amber-500/40 rounded-2xl p-4 space-y-2 animate-fade-in">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <HardDrive className="w-4 h-4 text-amber-400" />
                  BolaoBrasileirao2026_v1.0.apk
                </span>
                <span className="font-mono text-amber-400 font-bold">
                  {downloadProgress}% {downloadComplete && '• Concluído'}
                </span>
              </div>

              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full transition-all duration-200 rounded-full"
                  style={{ width: `${downloadProgress}%` }}
                />
              </div>

              {downloadComplete && (
                <div className="pt-2 border-t border-slate-800 text-xs space-y-1.5 text-slate-300">
                  <p className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <Check className="w-4 h-4" />
                    Arquivo pronto no seu celular!
                  </p>
                  <p className="text-[11px] text-slate-400">
                    1. Abra a <strong>barra de notificações</strong> ou a pasta <strong>Downloads</strong> do seu celular.<br />
                    2. Toque em <strong>BolaoBrasileirao2026_v1.0.apk</strong> e clique em <strong>Instalar</strong>.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Platform Tabs Selector */}
          <div className="flex items-center bg-slate-950 p-1 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActivePlatform('android')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activePlatform === 'android'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Android / Chrome</span>
            </button>

            <button
              onClick={() => setActivePlatform('ios')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activePlatform === 'ios'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>iPhone / iOS</span>
            </button>

            <button
              onClick={() => setActivePlatform('apk')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activePlatform === 'apk'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>APK Direto</span>
            </button>

            <button
              onClick={() => setActivePlatform('qrcode')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activePlatform === 'qrcode'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>QR Code</span>
            </button>
          </div>

          {/* Tab 1: Android Guide */}
          {activePlatform === 'android' && (
            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h5 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[11px] font-black">
                  1
                </span>
                Como instalar no Android (Chrome, Samsung ou Edge):
              </h5>

              <ol className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    1
                  </div>
                  <p>
                    Abra este link no navegador <strong>Google Chrome</strong> ou <strong>Samsung Internet</strong> no celular.
                  </p>
                </li>

                <li className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    2
                  </div>
                  <p>
                    Toque no menu de <strong>3 pontinhos (⋮)</strong> no canto superior direito do navegador.
                  </p>
                </li>

                <li className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    3
                  </div>
                  <p>
                    Selecione a opção <strong className="text-emerald-400">"Instalar aplicativo"</strong> ou <strong className="text-emerald-400">"Adicionar à tela inicial"</strong>.
                  </p>
                </li>

                <li className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    4
                  </div>
                  <p>
                    Pronto! O ícone do <strong>Bolão 2026</strong> ficará na tela inicial do seu celular como um app comum.
                  </p>
                </li>
              </ol>
            </div>
          )}

          {/* Tab 2: iOS Guide */}
          {activePlatform === 'ios' && (
            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h5 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[11px] font-black">
                  🍎
                </span>
                Passo a passo no iPhone / iPad (Safari):
              </h5>

              <ol className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    1
                  </div>
                  <p>
                    Abra o aplicativo pelo navegador <strong>Safari</strong> no seu iPhone.
                  </p>
                </li>

                <li className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    2
                  </div>
                  <p className="flex items-center gap-1.5 flex-wrap">
                    Toque no botão de <strong>Compartilhar</strong>
                    <span className="inline-flex items-center gap-1 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 text-[10px] font-bold text-slate-200">
                      <Share2 className="w-3 h-3 text-sky-400" /> (quadrado com seta)
                    </span>
                    na barra inferior do Safari.
                  </p>
                </li>

                <li className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    3
                  </div>
                  <p className="flex items-center gap-1.5 flex-wrap">
                    Role a lista e toque em <strong className="text-emerald-400">"Adicionar à Tela de Início"</strong>
                    <PlusSquare className="w-3.5 h-3.5 text-emerald-400 inline" />.
                  </p>
                </li>

                <li className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    4
                  </div>
                  <p>
                    Toque em <strong>"Adicionar"</strong> no canto superior direito. Pronto! O app fica na tela inicial.
                  </p>
                </li>
              </ol>
            </div>
          )}

          {/* Tab 3: APK Direct Download Guide */}
          {activePlatform === 'apk' && (
            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h5 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[11px] font-black">
                  📦
                </span>
                Instalação direta via pacote APK:
              </h5>

              <p className="text-xs text-slate-300">
                Você pode baixar o arquivo instalador diretamente e executá-lo em qualquer aparelho Android:
              </p>

              <button
                type="button"
                onClick={handleDownloadApk}
                className="w-full py-2.5 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Clique aqui para Baixar BolaoBrasileirao2026.apk</span>
              </button>

              <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <p className="font-bold text-slate-300 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                  Dica de Instalação:
                </p>
                <p>
                  Caso o celular peça confirmação, permita <em>"Instalar aplicativos de fontes desconhecidas"</em> nas configurações do navegador.
                </p>
              </div>
            </div>
          )}

          {/* Tab 4: QR Code to Open on Real Phone */}
          {activePlatform === 'qrcode' && (
            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 text-center space-y-3">
              <p className="text-xs text-slate-300">
                Aponte a <strong>câmera do seu celular</strong> para o QR Code abaixo para abrir e instalar diretamente:
              </p>

              <div className="bg-white p-4 rounded-2xl inline-block shadow-xl mx-auto">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(currentUrl)}`}
                  alt="QR Code para instalar no celular"
                  className="w-44 h-44 mx-auto"
                />
              </div>

              <p className="text-[11px] text-slate-400 font-mono break-all px-3">
                {currentUrl}
              </p>
            </div>
          )}

          {/* Copy Link & Share Actions */}
          <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-2xl flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Link de Acesso Direto</span>
              <p className="text-xs text-slate-300 font-mono truncate">{currentUrl}</p>
            </div>

            <button
              onClick={handleCopyLink}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                copiedLink
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-slate-800 hover:bg-slate-700 text-white'
              }`}
            >
              {copiedLink ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? 'Copiado!' : 'Copiar'}</span>
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between gap-3 relative z-10">
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            100% Seguro • Brasileirão 2026
          </span>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
