'use client';

import { useState } from 'react';
import { Patient } from '@/types';
import { formatDate, formatPhone, getStatusColor, cn } from '@/lib/utils';
import { Calendar, Phone, FileText, Building2, AlertCircle, CheckCircle, XCircle, Edit2, Save, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { patientService } from '@/services/patientService';

interface PatientCardProps {
  patient: Patient;
  onUpdate?: () => void;
}

export default function PatientCard({ patient, onUpdate }: PatientCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedPatient, setEditedPatient] = useState<Patient>(patient);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedPatient(patient);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedPatient(patient);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Criar objeto apenas com campos editáveis (sem _id, __v, etc)
      const updateData = {
        nome: editedPatient.nome,
        dataConsulta: editedPatient.dataConsulta,
        convenio: editedPatient.convenio,
        subtipoConvenio: editedPatient.subtipoConvenio,
        resposta: editedPatient.resposta,
        celular: editedPatient.celular,
        telFixo: editedPatient.telFixo,
        dd3: editedPatient.dd3,
        indicacao: editedPatient.indicacao,
        resolvido: editedPatient.resolvido,
        classificacao: editedPatient.classificacao,
        observacao: editedPatient.observacao,
        alerta: editedPatient.alerta,
        ano: editedPatient.ano,
        botaoLimboSms: editedPatient.botaoLimboSms,
        botaoLimboEmail: editedPatient.botaoLimboEmail,
        botaoLimboLigacoes: editedPatient.botaoLimboLigacoes,
      };
      
      await patientService.update(patient._id, updateData);
      setIsEditing(false);
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar alterações');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: keyof Patient, value: any) => {
    setEditedPatient(prev => ({ ...prev, [field]: value }));
  };

  const currentPatient = isEditing ? editedPatient : patient;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl mx-auto"
    >
      {/* Header with Edit Button */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          {isEditing ? (
            <input
              type="text"
              value={currentPatient.nome}
              onChange={(e) => handleChange('nome', e.target.value)}
              aria-label="Nome do paciente"
              placeholder="Nome do paciente"
              className="text-3xl font-bold text-gray-800 mb-2 w-full border-b-2 border-primary-300 focus:border-primary-600 outline-none bg-transparent"
            />
          ) : (
            <h2 className="text-3xl font-bold text-gray-800 mb-2">{currentPatient.nome}</h2>
          )}
          <div className="flex gap-2 flex-wrap mt-2">
            {isEditing ? (
              <>
                <select
                  value={currentPatient.resolvido || ''}
                  onChange={(e) => handleChange('resolvido', e.target.value)}
                  aria-label="Status do paciente"
                  className="px-3 py-1 rounded-full text-sm font-medium border border-gray-300 focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Status</option>
                  <option value="SIM">SIM</option>
                  <option value="NÃO">NÃO</option>
                  <option value="LIMBO">LIMBO</option>
                </select>
                <input
                  type="text"
                  value={currentPatient.classificacao || ''}
                  onChange={(e) => handleChange('classificacao', e.target.value)}
                  placeholder="Classificação"
                  className="px-3 py-1 rounded-full text-sm font-medium border border-gray-300 focus:ring-2 focus:ring-primary-500"
                />
              </>
            ) : (
              <>
                {currentPatient.resolvido && (
                  <span className={cn('px-3 py-1 rounded-full text-sm font-medium', getStatusColor(currentPatient.resolvido))}>
                    {currentPatient.resolvido}
                  </span>
                )}
                {currentPatient.classificacao && (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-700">
                    {currentPatient.classificacao}
                  </span>
                )}
              </>
            )}
          </div>
        </div>
        <div className="flex gap-2 items-start">
          {isEditing ? (
            <input
              type="text"
              value={currentPatient.ano || ''}
              onChange={(e) => handleChange('ano', e.target.value)}
              placeholder="Ano"
              className="bg-primary-50 rounded-xl px-4 py-2 w-24 text-center text-2xl font-bold text-primary-700 border border-primary-200 focus:ring-2 focus:ring-primary-500"
            />
          ) : (
            currentPatient.ano && (
              <div className="bg-primary-50 rounded-xl px-4 py-2">
                <p className="text-sm text-primary-600 font-medium">Ano</p>
                <p className="text-2xl font-bold text-primary-700">{currentPatient.ano}</p>
              </div>
            )
          )}
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="p-2 bg-primary-100 hover:bg-primary-200 rounded-lg transition-colors"
              title="Editar"
            >
              <Edit2 className="w-5 h-5 text-primary-600" />
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="p-2 bg-green-100 hover:bg-green-200 rounded-lg transition-colors disabled:opacity-50"
                title="Salvar"
              >
                <Save className="w-5 h-5 text-green-600" />
              </button>
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="p-2 bg-red-100 hover:bg-red-200 rounded-lg transition-colors disabled:opacity-50"
                title="Cancelar"
              >
                <X className="w-5 h-5 text-red-600" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <div className="bg-primary-100 p-2 rounded-lg">
            <Phone className="w-5 h-5 text-primary-600" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500 font-medium">Celular</p>
            {isEditing ? (
              <input
                type="text"
                value={currentPatient.celular || ''}
                onChange={(e) => handleChange('celular', e.target.value)}
                placeholder="(00) 00000-0000"
                className="text-sm font-semibold text-gray-800 w-full border-b border-gray-300 focus:border-primary-600 outline-none bg-transparent"
              />
            ) : (
              <p className="text-sm font-semibold text-gray-800">{formatPhone(currentPatient.celular)}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <div className="bg-secondary-100 p-2 rounded-lg">
            <Phone className="w-5 h-5 text-secondary-600" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500 font-medium">Tel. Fixo</p>
            {isEditing ? (
              <input
                type="text"
                value={currentPatient.telFixo || ''}
                onChange={(e) => handleChange('telFixo', e.target.value)}
                placeholder="(00) 0000-0000"
                className="text-sm font-semibold text-gray-800 w-full border-b border-gray-300 focus:border-primary-600 outline-none bg-transparent"
              />
            ) : (
              <p className="text-sm font-semibold text-gray-800">{formatPhone(currentPatient.telFixo)}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <div className="bg-success-100 p-2 rounded-lg">
            <Phone className="w-5 h-5 text-success-600" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500 font-medium">DD3</p>
            {isEditing ? (
              <input
                type="text"
                value={currentPatient.dd3 || ''}
                onChange={(e) => handleChange('dd3', e.target.value)}
                placeholder="DD3"
                className="text-sm font-semibold text-gray-800 w-full border-b border-gray-300 focus:border-primary-600 outline-none bg-transparent"
              />
            ) : (
              <p className="text-sm font-semibold text-gray-800">{currentPatient.dd3}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <div className="bg-purple-100 p-2 rounded-lg">
            <Calendar className="w-5 h-5 text-purple-600" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500 font-medium">Data da Consulta</p>
            {isEditing ? (
              <input
                type="date"
                value={
                  currentPatient.dataConsulta 
                    ? (() => {
                        try {
                          const date = new Date(currentPatient.dataConsulta);
                          return isNaN(date.getTime()) ? '' : date.toISOString().split('T')[0];
                        } catch {
                          return '';
                        }
                      })()
                    : ''
                }
                onChange={(e) => handleChange('dataConsulta', e.target.value)}
                aria-label="Data da consulta"
                className="text-sm font-semibold text-gray-800 w-full border-b border-gray-300 focus:border-primary-600 outline-none bg-transparent"
              />
            ) : (
              <p className="text-sm font-semibold text-gray-800">{formatDate(currentPatient.dataConsulta)}</p>
            )}
          </div>
        </div>
      </div>

      {/* Medical Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <div className="p-3 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="w-4 h-4 text-emerald-600" />
            <p className="text-xs text-emerald-600 font-medium">Convênio</p>
          </div>
          {isEditing ? (
            <input
              type="text"
              value={currentPatient.convenio || ''}
              onChange={(e) => handleChange('convenio', e.target.value)}
              placeholder="Convênio"
              className="text-sm font-semibold text-gray-800 w-full border-b border-emerald-300 focus:border-emerald-600 outline-none bg-transparent"
            />
          ) : (
            <p className="text-sm font-semibold text-gray-800">{currentPatient.convenio}</p>
          )}
        </div>

        <div className="p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="w-4 h-4 text-blue-600" />
            <p className="text-xs text-blue-600 font-medium">Subtipo Convênio</p>
          </div>
          {isEditing ? (
            <input
              type="text"
              value={currentPatient.subtipoConvenio || ''}
              onChange={(e) => handleChange('subtipoConvenio', e.target.value)}
              placeholder="Subtipo"
              className="text-sm font-semibold text-gray-800 w-full border-b border-blue-300 focus:border-blue-600 outline-none bg-transparent"
            />
          ) : (
            <p className="text-sm font-semibold text-gray-800">{currentPatient.subtipoConvenio}</p>
          )}
        </div>

        <div className="p-3 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-4 h-4 text-indigo-600" />
            <p className="text-xs text-indigo-600 font-medium">Indicação</p>
          </div>
          {isEditing ? (
            <input
              type="text"
              value={currentPatient.indicacao || ''}
              onChange={(e) => handleChange('indicacao', e.target.value)}
              placeholder="Indicação"
              className="text-sm font-semibold text-gray-800 w-full border-b border-indigo-300 focus:border-indigo-600 outline-none bg-transparent"
            />
          ) : (
            <p className="text-sm font-semibold text-gray-800">{currentPatient.indicacao}</p>
          )}
        </div>

        <div className="p-3 bg-gradient-to-br from-pink-50 to-rose-50 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-4 h-4 text-pink-600" />
            <p className="text-xs text-pink-600 font-medium">Resposta</p>
          </div>
          {isEditing ? (
            <input
              type="text"
              value={currentPatient.resposta || ''}
              onChange={(e) => handleChange('resposta', e.target.value)}
              placeholder="Resposta"
              className="text-sm font-semibold text-gray-800 w-full border-b border-pink-300 focus:border-pink-600 outline-none bg-transparent"
            />
          ) : (
            <p className="text-sm font-semibold text-gray-800">{currentPatient.resposta}</p>
          )}
        </div>
      </div>

      {/* Observations */}
      <div className="p-4 bg-amber-50 rounded-lg border border-amber-100 mb-4">
        <div className="flex items-start gap-3">
          <FileText className="w-5 h-5 text-amber-600 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs text-amber-600 font-medium mb-1">Observação</p>
            {isEditing ? (
              <textarea
                value={currentPatient.observacao || ''}
                onChange={(e) => handleChange('observacao', e.target.value)}
                placeholder="Observações..."
                rows={3}
                className="text-sm text-gray-700 leading-relaxed w-full border border-amber-300 rounded p-2 focus:border-amber-600 focus:ring-2 focus:ring-amber-200 outline-none bg-white"
              />
            ) : (
              <p className="text-sm text-gray-700 leading-relaxed">{currentPatient.observacao}</p>
            )}
          </div>
        </div>
      </div>

      {/* Alert */}
      <div className="p-4 bg-red-50 rounded-lg border border-red-200 mb-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs text-red-600 font-medium mb-1">Alerta</p>
            {isEditing ? (
              <textarea
                value={currentPatient.alerta || ''}
                onChange={(e) => handleChange('alerta', e.target.value)}
                placeholder="Alertas..."
                rows={2}
                className="text-sm text-red-700 leading-relaxed font-semibold w-full border border-red-300 rounded p-2 focus:border-red-600 focus:ring-2 focus:ring-red-200 outline-none bg-white"
              />
            ) : (
              <p className="text-sm text-red-700 leading-relaxed font-semibold">{currentPatient.alerta}</p>
            )}
          </div>
        </div>
      </div>

      {/* Status Buttons */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-center">
          <p className="text-xs text-blue-600 font-medium mb-1">SMS</p>
          {isEditing ? (
            <input
              type="text"
              value={currentPatient.botaoLimboSms || ''}
              onChange={(e) => handleChange('botaoLimboSms', e.target.value)}
              placeholder="SMS"
              className="text-sm font-semibold text-blue-800 w-full text-center border-b border-blue-300 focus:border-blue-600 outline-none bg-transparent"
            />
          ) : (
            <p className="text-sm font-semibold text-blue-800">{currentPatient.botaoLimboSms}</p>
          )}
        </div>
        <div className="p-3 bg-green-50 rounded-lg border border-green-200 text-center">
          <p className="text-xs text-green-600 font-medium mb-1">E-mail</p>
          {isEditing ? (
            <input
              type="text"
              value={currentPatient.botaoLimboEmail || ''}
              onChange={(e) => handleChange('botaoLimboEmail', e.target.value)}
              placeholder="E-mail"
              className="text-sm font-semibold text-green-800 w-full text-center border-b border-green-300 focus:border-green-600 outline-none bg-transparent"
            />
          ) : (
            <p className="text-sm font-semibold text-green-800">{currentPatient.botaoLimboEmail}</p>
          )}
        </div>
        <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 text-center">
          <p className="text-xs text-purple-600 font-medium mb-1">Ligações</p>
          {isEditing ? (
            <input
              type="text"
              value={currentPatient.botaoLimboLigacoes || ''}
              onChange={(e) => handleChange('botaoLimboLigacoes', e.target.value)}
              placeholder="Ligações"
              className="text-sm font-semibold text-purple-800 w-full text-center border-b border-purple-300 focus:border-purple-600 outline-none bg-transparent"
            />
          ) : (
            <p className="text-sm font-semibold text-purple-800">{currentPatient.botaoLimboLigacoes}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
