
export const formatCurrency = (value: number | null | undefined) => {
  if (value === null || value === undefined) return '';
  
  try {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return `R$ ${value.toFixed(2)}`;
  }
};

export const formatDate = (date: string | Date | null | undefined) => {
  if (!date) return '';
  
  try {
    return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
  } catch (error) {
    console.error('Error formatting date:', error);
    return String(date);
  }
};

export const formatCPF = (cpf: string | null | undefined) => {
  if (!cpf) return '';
  
  try {
    // Remove any non-numeric characters
    const cleanCPF = cpf.replace(/\D/g, '');
    if (cleanCPF.length !== 11) return cpf;
    
    return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  } catch (error) {
    console.error('Error formatting CPF:', error);
    return cpf;
  }
};

export const formatPhone = (phone: string | null | undefined) => {
  if (!phone) return '';
  
  try {
    // Remove any non-numeric characters
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 11) return phone;
    
    return cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } catch (error) {
    console.error('Error formatting phone:', error);
    return phone;
  }
};
