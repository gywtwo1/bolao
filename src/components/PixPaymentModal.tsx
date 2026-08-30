import React, { useState } from 'react';
import { useBolao } from '../context/BolaoContext';
import { generatePixPayload, formatCurrency } from '../utils/pix';
import { 
  QrCode, 
  Copy, 
  Check, 
  UploadCloud, 
  ShieldCheck, 
  AlertCircle, 
  X, 
  FileText,
  Clock
} from 'lucide-react';

interface PixPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PixPaymentModal: React.FC<PixPaymentModalProps> = ({ isOpen, onClose }) => {
  const { activeRound, currentUser, submitPixReceipt } = useBolao();
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<string>('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [txIdInput, setTxIdInput] = useState('');

  if (!isOpen || !activeRound || !currentUser) return null;

  const pixData = generatePixPayload(activeRound.number, currentUser.id, activeRound.price || 10.00);

  const sampleReceipts = [
    { label: 'Nubank (R$ 10,00)', url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80' },
    { label: 'Itaú / Bradesco (R$ 10,00)', url: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=600&auto=format&fit=crop&q=80' },
    { label: 'Banco Inter / C6 (R$ 10,00)', url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop&q=80' }
  ];

  const handleCopyKey = () => {
    navigator.clipboard.writeText(pixData.key);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(pixData.copyPasteCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setSelectedReceipt(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      submitPixReceipt(activeRound.id, selectedReceipt, txIdInput || pixData.txId);
      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl shadow-emerald-950/50 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900/60 via-slate-900 to-slate-900 px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Pagamento PIX da Rodada</h3>
              <p className="text-xs text-slate-400">
                {activeRound.title} • Valor: <strong className="text-emerald-400">{formatCurrency(activeRound.price || 10.00)}</strong>
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

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-slate-200 text-sm">
          {/* Important Warning Banner */}
          <div className="bg-amber-950/40 border border-amber-500/40 rounded-2xl p-3.5 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <p className="font-bold text-amber-300">Atenção às regras de validação:</p>
              <p className="text-slate-300 leading-relaxed">
                Seus 10 palpites foram <strong>travados</strong>. Sem o pagamento de <strong>R$ 10,00</strong> e o envio do comprovante, sua aposta <strong>não será contabilizada</strong> no ranking e na premiação. O Administrador confirmará o comprovante no painel.
              </p>
            </div>
          </div>

          {/* QR Code & Pix Info */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4">
            <div className="bg-white p-2.5 rounded-xl shadow-md shrink-0">
              <img
                src={pixData.qrCodeUrl}
                alt="QR Code Pix"
                className="w-36 h-36 object-contain"
              />
            </div>
            <div className="space-y-2.5 flex-1 w-full">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Beneficiário
                </span>
                <p className="text-xs font-bold text-white">{pixData.receiver}</p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Chave Pix (E-mail)
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <input
                    readOnly
                    value={pixData.key}
                    className="bg-slate-900 border border-slate-700 text-xs text-emerald-300 px-2.5 py-1.5 rounded-lg w-full font-mono"
                  />
                  <button
                    onClick={handleCopyKey}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-colors shrink-0"
                    title="Copiar Chave"
                  >
                    {copiedKey ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Copia e Cola Button */}
              <button
                onClick={handleCopyCode}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold py-2 rounded-xl transition-all"
              >
                {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedCode ? 'Código PIX Copiado!' : 'Copiar PIX Copia e Cola'}</span>
              </button>
            </div>
          </div>

          {/* Upload Comprovante Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-400" />
                Anexar Comprovante de Pagamento (PIX)
              </label>
              <span className="text-[11px] text-emerald-400 font-semibold">Obrigatório</span>
            </div>

            {/* Receipt Preview */}
            <div className="relative border-2 border-dashed border-slate-700 rounded-2xl p-3 bg-slate-950/60 flex flex-col items-center justify-center gap-2 text-center">
              {selectedReceipt ? (
                <div className="space-y-2 w-full flex flex-col items-center">
                  <img
                    src={selectedReceipt}
                    alt="Comprovante Selecionado"
                    className="h-32 object-contain rounded-lg border border-slate-700 bg-slate-900"
                  />
                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Comprovante pronto para envio
                  </span>
                </div>
              ) : (
                <div className="py-4 space-y-1">
                  <UploadCloud className="w-8 h-8 text-slate-500 mx-auto" />
                  <p className="text-xs text-slate-300 font-medium">
                    Clique abaixo ou arraste uma foto/PDF do comprovante
                  </p>
                  <p className="text-[10px] text-slate-500">PNG, JPG, PDF até 5MB</p>
                </div>
              )}

              {/* Upload Input */}
              <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs font-bold text-slate-200 px-4 py-2 rounded-xl transition-colors inline-flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-emerald-400" />
                <span>Escolher Arquivo do Dispositivo</span>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Quick Presets for Easy Demo in Preview */}
            <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800 space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Ou selecione um comprovante modelo de teste:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                {sampleReceipts.map((samp, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedReceipt(samp.url)}
                    className={`text-[11px] font-medium p-1.5 rounded-lg border text-left truncate transition-colors ${
                      selectedReceipt === samp.url
                        ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {samp.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-5 py-3.5 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-700 text-xs font-bold text-slate-300 hover:bg-slate-800 transition-colors"
          >
            Pagar Mais Tarde
          </button>

          <button
            onClick={handleSubmit}
            disabled={!selectedReceipt || isSubmitting}
            className="flex-1 max-w-xs flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-slate-950 font-extrabold text-xs py-2.5 px-4 rounded-xl shadow-lg shadow-emerald-950/60 transition-all"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isSubmitting ? 'Enviando...' : 'Confirmar Envio do Comprovante'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
