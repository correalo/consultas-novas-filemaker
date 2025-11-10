import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PatientDocument = Patient & Document;

@Schema({ 
  timestamps: false,
  collection: 'consultas-novas-filemaker',
  toJSON: {
    virtuals: true,
    transform: function(doc: any, ret: any) {
      ret.nome = ret['NOME'];
      ret.ano = ret['ANO'];
      ret.dataConsulta = ret['DATA DA CONSULTA'];
      ret.dataCirurgia = ret['DATA DA CIRURGIA'];
      ret.profissao = ret['PROFISSÃO'];
      ret.sexo = ret['SEXO'];
      ret.dataNascimento = ret['DATA DE NASCIMENTO'];
      ret.idade = ret['IDADE'];
      ret.email = ret['EMAIL'];
      ret.convenio = ret['CONVÊNIO'];
      ret.subtipoConvenio = ret['SUBTIPO CONVÊNIO'];
      ret.resposta = ret['RESPOSTA'];
      ret.celular = ret['CELULAR'];
      ret.dd3 = ret['DD3'];
      ret.telFixo = ret['TEL FIXO'];
      ret.indicacao = ret['INDICAÇAO'];
      ret.resolvido = ret['RESOLVIDO'];
      ret.classificacao = ret['CLASSIFICAÇÃO'];
      ret.observacao = ret['OBSERVAÇÃO'];
      ret.alerta = ret['ALERTA'];
      ret.botaoLimboSms = ret['BOTÃO LIMBO SMS'];
      ret.botaoLimboEmail = ret['BOTÃO LIMBO EMAIL'];
      ret.botaoLimboLigacoes = ret['BOTÃO LIMBO LIGAÇÕES'];
      ret.importedAt = ret['_imported_at'];
      
      // Remove campos originais em maiúsculas
      delete ret['NOME'];
      delete ret['ANO'];
      delete ret['DATA DA CONSULTA'];
      delete ret['DATA DA CIRURGIA'];
      delete ret['PROFISSÃO'];
      delete ret['SEXO'];
      delete ret['DATA DE NASCIMENTO'];
      delete ret['IDADE'];
      delete ret['EMAIL'];
      delete ret['CONVÊNIO'];
      delete ret['SUBTIPO CONVÊNIO'];
      delete ret['RESPOSTA'];
      delete ret['CELULAR'];
      delete ret['DD3'];
      delete ret['TEL FIXO'];
      delete ret['INDICAÇAO'];
      delete ret['RESOLVIDO'];
      delete ret['CLASSIFICAÇÃO'];
      delete ret['OBSERVAÇÃO'];
      delete ret['ALERTA'];
      delete ret['_imported_at'];
      delete ret['BOTÃO LIMBO SMS'];
      delete ret['BOTÃO LIMBO EMAIL'];
      delete ret['BOTÃO LIMBO LIGAÇÕES'];
      delete ret['retornos'];
      delete ret['_retornos_atualizados_em'];
      delete ret['_recall_criado_em'];
      delete ret['_campo_retornos_criado_em'];
      delete ret['_telefone_corrigido_em'];
      delete ret['__v'];
      delete ret['id'];
      
      return ret;
    }
  }
})
export class Patient {
  @Prop()
  'NOME': string;

  @Prop()
  'ANO': string;

  @Prop()
  'DATA DA CONSULTA': string;

  @Prop()
  'DATA DA CIRURGIA': string;

  @Prop()
  'PROFISSÃO': string;

  @Prop()
  'SEXO': string;

  @Prop()
  'DATA DE NASCIMENTO': string;

  @Prop()
  'IDADE': number;

  @Prop()
  'EMAIL': string;

  @Prop()
  'CONVÊNIO': string;

  @Prop()
  'SUBTIPO CONVÊNIO': string;

  @Prop()
  'RESPOSTA': string;

  @Prop()
  'CELULAR': string;

  @Prop()
  'DD3': string;

  @Prop()
  'TEL FIXO': string;

  @Prop()
  'INDICAÇAO': string;

  @Prop()
  'RESOLVIDO': string;

  @Prop()
  'CLASSIFICAÇÃO': string;

  @Prop()
  'OBSERVAÇÃO': string;

  @Prop()
  'ALERTA': string;

  @Prop()
  'BOTÃO LIMBO SMS': string;

  @Prop()
  'BOTÃO LIMBO EMAIL': string;

  @Prop()
  'BOTÃO LIMBO LIGAÇÕES': string;

  @Prop()
  '_imported_at': Date;

  @Prop({ type: [{
    periodo: Number,
    status: String,
    observacao: String,
    contato_realizado: Boolean,
    whatsapp_contato_1: Boolean,
    whatsapp_data_1: Date,
    whatsapp_contato_2: Boolean,
    whatsapp_data_2: Date,
    whatsapp_contato_3: Boolean,
    whatsapp_data_3: Date,
    whatsapp_contato_4: Boolean,
    whatsapp_data_4: Date,
    whatsapp_contato_5: Boolean,
    whatsapp_data_5: Date,
    ligacao_contato_1: Boolean,
    ligacao_data_1: Date,
    ligacao_contato_2: Boolean,
    ligacao_data_2: Date,
    ligacao_contato_3: Boolean,
    ligacao_data_3: Date,
    ligacao_contato_4: Boolean,
    ligacao_data_4: Date,
    ligacao_contato_5: Boolean,
    ligacao_data_5: Date
  }], default: [] })
  recall: Array<{
    periodo: number;
    status: string;
    observacao: string;
    contato_realizado: boolean;
    whatsapp_contato_1: boolean;
    whatsapp_data_1: Date;
    whatsapp_contato_2: boolean;
    whatsapp_data_2: Date;
    whatsapp_contato_3: boolean;
    whatsapp_data_3: Date;
    whatsapp_contato_4: boolean;
    whatsapp_data_4: Date;
    whatsapp_contato_5: boolean;
    whatsapp_data_5: Date;
    ligacao_contato_1: boolean;
    ligacao_data_1: Date;
    ligacao_contato_2: boolean;
    ligacao_data_2: Date;
    ligacao_contato_3: boolean;
    ligacao_data_3: Date;
    ligacao_contato_4: boolean;
    ligacao_data_4: Date;
    ligacao_contato_5: boolean;
    ligacao_data_5: Date;
  }>;
}

export const PatientSchema = SchemaFactory.createForClass(Patient);
