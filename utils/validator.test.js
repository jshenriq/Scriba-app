import { validateRequiredFields } from './validator.js';

describe('validateRequiredFields', () => {
  it('deve retornar null quando todos os campos estiverem preenchidos corretamente', () => {
    const fields = { 
      title: 'Meu Título', 
      content: 'Meu conteúdo', 
      email: 'teste@email.com' 
    };
    expect(validateRequiredFields(fields)).toBeNull();
  });

  it('deve retornar mensagem de erro quando um campo for uma string vazia', () => {
    const fields = { title: '' };
    expect(validateRequiredFields(fields)).toBe('Título é obrigatório');
  });

  it('deve retornar mensagem de erro quando um campo contiver apenas espaços em branco', () => {
    const fields = { content: '   ' };
    expect(validateRequiredFields(fields)).toBe('Conteúdo é obrigatório');
  });

  it('deve retornar mensagem de erro quando um campo for null', () => {
    const fields = { name: null };
    expect(validateRequiredFields(fields)).toBe('Nome é obrigatório');
  });

  it('deve retornar mensagem de erro quando um campo for undefined', () => {
    const fields = { password: undefined, email: 'teste@email.com' };
    expect(validateRequiredFields(fields)).toBe('Senha é obrigatório');
  });

  it('deve usar o nome da chave (key) caso o campo não tenha tradução mapeada', () => {
    const fields = { customField: '' };
    expect(validateRequiredFields(fields)).toBe('customField é obrigatório');
  });
});
