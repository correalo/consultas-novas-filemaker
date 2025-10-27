import { IsString, IsNotEmpty, IsEmail, IsOptional, IsNumber, IsDateString } from 'class-validator';

export class CreatePatientDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsNumber()
  @IsOptional()
  idade?: number;

  @IsString()
  @IsOptional()
  telefone?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  cpf?: string;

  @IsString()
  @IsOptional()
  endereco?: string;

  @IsDateString()
  @IsOptional()
  dataConsulta?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  observacoes?: string;

  @IsString()
  @IsOptional()
  convenio?: string;

  @IsString()
  @IsOptional()
  especialidade?: string;

  @IsString()
  @IsOptional()
  medico?: string;
}
