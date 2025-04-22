
export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatDate = (date: string | Date) => {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
};

export const formatCPF = (cpf: string) => {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

export const formatPhone = (phone: string) => {
  return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
};
