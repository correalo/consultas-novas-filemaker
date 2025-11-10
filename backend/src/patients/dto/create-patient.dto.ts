import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePatientDto {
  @IsString()
  @IsOptional()
  nome?: string;

  @IsString()
  @IsOptional()
  ano?: string;

  @IsString()
  @IsOptional()
  dataConsulta?: string;

  @IsString()
  @IsOptional()
  convenio?: string;

  @IsString()
  @IsOptional()
  subtipoConvenio?: string;

  @IsString()
  @IsOptional()
  resposta?: string;

  @IsString()
  @IsOptional()
  celular?: string;

  @IsString()
  @IsOptional()
  dd3?: string;

  @IsString()
  @IsOptional()
  telFixo?: string;

  @IsString()
  @IsOptional()
  indicacao?: string;

  @IsString()
  @IsOptional()
  resolvido?: string;

  @IsString()
  @IsOptional()
  classificacao?: string;

  @IsString()
  @IsOptional()
  observacao?: string;

  @IsString()
  @IsOptional()
  alerta?: string;

  @IsString()
  @IsOptional()
  botaoLimboSms?: string;

  @IsString()
  @IsOptional()
  botaoLimboEmail?: string;

  @IsString()
  @IsOptional()
  botaoLimboLigacoes?: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => Object)
  recall?: any[];
}
