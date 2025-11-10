import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Patient, PatientDocument } from './schemas/patient.schema';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

@Injectable()
export class PatientsService {
  constructor(
    @InjectModel(Patient.name) private patientModel: Model<PatientDocument>,
  ) {}

  async create(createPatientDto: CreatePatientDto): Promise<Patient> {
    const patient = new this.patientModel(createPatientDto);
    return patient.save();
  }

  async findAll(): Promise<Patient[]> {
    return this.patientModel
      .find()
      .sort({ dataConsulta: -1 })
      .exec();
  }

  async findOne(id: string): Promise<Patient> {
    const patient = await this.patientModel.findById(id).exec();
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
    return patient;
  }

  async update(id: string, updatePatientDto: UpdatePatientDto): Promise<Patient> {
    // Transformar campos de minúsculas para MAIÚSCULAS (formato do MongoDB)
    const updateData: any = {};
    
    if (updatePatientDto.nome !== undefined) updateData['NOME'] = updatePatientDto.nome;
    if (updatePatientDto.ano !== undefined) updateData['ANO'] = updatePatientDto.ano;
    // Aceitar qualquer formato de data (string)
    if (updatePatientDto.dataConsulta !== undefined) {
      updateData['DATA DA CONSULTA'] = updatePatientDto.dataConsulta;
    }
    if (updatePatientDto.convenio !== undefined) updateData['CONVÊNIO'] = updatePatientDto.convenio;
    if (updatePatientDto.subtipoConvenio !== undefined) updateData['SUBTIPO CONVÊNIO'] = updatePatientDto.subtipoConvenio;
    if (updatePatientDto.resposta !== undefined) updateData['RESPOSTA'] = updatePatientDto.resposta;
    if (updatePatientDto.celular !== undefined) updateData['CELULAR'] = updatePatientDto.celular;
    if (updatePatientDto.dd3 !== undefined) updateData['DD3'] = updatePatientDto.dd3;
    if (updatePatientDto.telFixo !== undefined) updateData['TEL FIXO'] = updatePatientDto.telFixo;
    if (updatePatientDto.indicacao !== undefined) updateData['INDICAÇAO'] = updatePatientDto.indicacao;
    if (updatePatientDto.resolvido !== undefined) updateData['RESOLVIDO'] = updatePatientDto.resolvido;
    if (updatePatientDto.classificacao !== undefined) updateData['CLASSIFICAÇÃO'] = updatePatientDto.classificacao;
    if (updatePatientDto.observacao !== undefined) updateData['OBSERVAÇÃO'] = updatePatientDto.observacao;
    if (updatePatientDto.alerta !== undefined) updateData['ALERTA'] = updatePatientDto.alerta;
    if (updatePatientDto.botaoLimboSms !== undefined) updateData['BOTÃO LIMBO SMS'] = updatePatientDto.botaoLimboSms;
    if (updatePatientDto.botaoLimboEmail !== undefined) updateData['BOTÃO LIMBO EMAIL'] = updatePatientDto.botaoLimboEmail;
    if (updatePatientDto.botaoLimboLigacoes !== undefined) updateData['BOTÃO LIMBO LIGAÇÕES'] = updatePatientDto.botaoLimboLigacoes;
    if (updatePatientDto.recall !== undefined) updateData['recall'] = updatePatientDto.recall;
    
    const patient = await this.patientModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
    
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
    
    return patient;
  }

  async remove(id: string): Promise<void> {
    const result = await this.patientModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
  }

  async search(query: string): Promise<Patient[]> {
    return this.patientModel
      .find({
        $or: [
          { 'NOME': { $regex: query, $options: 'i' } },
          { 'CELULAR': { $regex: query, $options: 'i' } },
          { 'TEL FIXO': { $regex: query, $options: 'i' } },
          { 'CONVÊNIO': { $regex: query, $options: 'i' } },
        ],
      })
      .sort({ 'DATA DA CONSULTA': -1 })
      .exec();
  }
}
