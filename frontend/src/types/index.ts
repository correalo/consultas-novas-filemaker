export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface Patient {
  _id: string;
  nome: string;
  ano?: number;
  dataConsulta?: string;
  convenio?: string;
  subtipoConvenio?: string;
  resposta?: string;
  celular?: string;
  dd3?: string;
  telFixo?: string;
  indicacao?: string;
  resolvido?: string;
  classificacao?: string;
  observacao?: string;
  alerta?: string;
  botaoLimboSms?: string;
  botaoLimboEmail?: string;
  botaoLimboLigacoes?: string;
  importedAt?: string;
}

export interface CreatePatientDto {
  nome: string;
  idade?: number;
  telefone?: string;
  email?: string;
  cpf?: string;
  endereco?: string;
  dataConsulta?: string;
  status?: string;
  observacoes?: string;
  convenio?: string;
  especialidade?: string;
  medico?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
}
