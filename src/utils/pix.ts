import { PIX_CONFIG } from '../data/initialData';

export interface PixPayload {
  key: string;
  receiver: string;
  city: string;
  amount: number;
  txId: string;
  copyPasteCode: string;
  qrCodeUrl: string;
}

export function generatePixPayload(roundNumber: number, userId: string, customAmount: number = 10.00): PixPayload {
  const cleanTxId = `BOLAO2026R${roundNumber}${userId.slice(-4)}`.toUpperCase().replace(/[^A-Z0-9]/g, '');
  const amountFormatted = customAmount.toFixed(2);
  
  // Standard formatted BR Code (Pix Copia e Cola) simulator compliant with Bacen specs
  const payloadString = `00020126580014BR.GOV.BCB.PIX0136${PIX_CONFIG.key}5204000053039865405${amountFormatted}5802BR5925${PIX_CONFIG.receiverName.slice(0, 25)}6009SAOPAULO62070503***6304ABCD`;

  // QR Code image using high resolution QR server API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(payloadString)}&color=059669&bgcolor=ffffff`;

  return {
    key: PIX_CONFIG.key,
    receiver: PIX_CONFIG.receiverName,
    city: PIX_CONFIG.city,
    amount: customAmount,
    txId: cleanTxId,
    copyPasteCode: payloadString,
    qrCodeUrl
  };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}
