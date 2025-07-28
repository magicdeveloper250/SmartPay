export function formatPaymentFrequency(frequency: string): string {
  return frequency
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('-');
}

export const formatCurrency = (
  amount: number,
  currency: string = 'USD',
  locale?: string
) => {
  const defaultLocale = currency === 'RWF' ? 'rw-RW' : 'en-US';
  
  return new Intl.NumberFormat(locale || defaultLocale, {
    style: 'currency',
    currency,
    ...(currency === 'RWF' && { minimumFractionDigits: 0 })
  }).format(amount);
};
