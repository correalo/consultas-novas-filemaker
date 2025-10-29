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
      delete ret['recall'];
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
}

export const PatientSchema = SchemaFactory.createForClass(Patient);
