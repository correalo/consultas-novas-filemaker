export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface Recall {
  periodo: number;
  status: string;
  observacao: string;
  contato_realizado: boolean;
  whatsapp_contato_1: boolean;
  whatsapp_data_1?: Date;
  whatsapp_contato_2: boolean;
  whatsapp_data_2?: Date;
  whatsapp_contato_3: boolean;
  whatsapp_data_3?: Date;
  whatsapp_contato_4: boolean;
  whatsapp_data_4?: Date;
  whatsapp_contato_5: boolean;
  whatsapp_data_5?: Date;
  ligacao_contato_1: boolean;
  ligacao_data_1?: Date;
  ligacao_contato_2: boolean;
  ligacao_data_2?: Date;
  ligacao_contato_3: boolean;
  ligacao_data_3?: Date;
  ligacao_contato_4: boolean;
  ligacao_data_4?: Date;
  ligacao_contato_5: boolean;
  ligacao_data_5?: Date;
}

export interface Patient {
  _id: string;
  nome: string;
  ano?: number;
  dataConsulta?: string;
  dataCirurgia?: string;
  profissao?: string;
  sexo?: string;
  dataNascimento?: string;
  idade?: number;
  email?: string;
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
  recall?: Recall[];
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
