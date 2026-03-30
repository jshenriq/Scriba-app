export function validateRequiredFields(fields) {
  const fieldNames = {
    title: 'Título',
    content: 'Conteúdo',
    email: 'Email',
    password: 'Senha',
    name: 'Nome',
  };

  for (const [key, value] of Object.entries(fields)) {
    if (!value || String(value).trim() === '') {
      const fieldName = fieldNames[key] || key;
      return `${fieldName} é obrigatório`;
    }
  }
  return null;
}