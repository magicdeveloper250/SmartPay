export function formatPaymentFrequency(frequency: string): string {
  return frequency
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('-');
}

 
