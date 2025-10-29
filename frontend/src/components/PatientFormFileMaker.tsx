'use client';

import { useState } from 'react';
import { Patient } from '@/types';
import { patientService } from '@/services/patientService';
import { Save, X, Phone, Mail, MessageSquare, FileText, AlertCircle } from 'lucide-react';

interface PatientFormFileMakerProps {
  patient: Patient;
  onUpdate?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  currentIndex: number;
  totalPatients: number;
}

export default function PatientFormFileMaker({ 
  patient, 
  onUpdate, 
  onNext, 
  onPrevious,
  currentIndex,
  totalPatients 
}: PatientFormFileMakerProps) {
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
      await patientService.update(patient._id, editedPatient);
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

  const handleWhatsApp = () => {
    if (currentPatient.celular) {
      const phone = currentPatient.celular.replace(/\D/g, '');
      window.open(`https://wa.me/55${phone}`, '_blank');
    }
  };

  const handleEmail = () => {
    // Email não está disponível no modelo atual
    alert('Campo de email não disponível');
  };

  return (
    <div className="bg-[#e8e8e8] min-h-screen">
      {/* Header Bar - FileMaker Style */}
      <div className="bg-gradient-to-b from-[#d0d0d0] to-[#b8b8b8] border-b border-gray-400 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex gap-1">
              <button
                onClick={onPrevious}
                className="px-3 py-1 bg-white border border-gray-400 rounded shadow-sm hover:bg-gray-50 text-sm"
              >
                ◀
              </button>
              <button
                onClick={onNext}
                className="px-3 py-1 bg-white border border-gray-400 rounded shadow-sm hover:bg-gray-50 text-sm"
              >
                ▶
              </button>
            </div>
            <span className="text-sm font-medium text-gray-700">
              {currentIndex + 1} de {totalPatients}
            </span>
          </div>
          
          <div className="flex gap-2">
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="px-4 py-1.5 bg-blue-600 text-white rounded shadow-sm hover:bg-blue-700 text-sm font-medium"
              >
                EDITAR
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-4 py-1.5 bg-green-600 text-white rounded shadow-sm hover:bg-green-700 text-sm font-medium disabled:opacity-50 flex items-center gap-1"
                >
                  <Save className="w-4 h-4" />
                  SALVAR
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="px-4 py-1.5 bg-red-600 text-white rounded shadow-sm hover:bg-red-700 text-sm font-medium disabled:opacity-50 flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  CANCELAR
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg border border-gray-300 p-6">
          {/* Form Grid - FileMaker Style */}
          <div className="grid grid-cols-12 gap-4">
            {/* Left Column */}
            <div className="col-span-7 space-y-4">
              {/* Nome */}
              <div className="flex items-center">
                <label className="w-40 text-right pr-4 text-sm font-medium text-gray-700">
                  NOME
                </label>
                <div className="flex-1">
                  {isEditing ? (
                    <input
                      type="text"
                      value={currentPatient.nome}
                      onChange={(e) => handleChange('nome', e.target.value)}
                      aria-label="Nome do paciente"
                      className="w-full px-3 py-1.5 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="px-3 py-1.5 bg-gray-50 border border-gray-300 rounded">
                      {currentPatient.nome}
                    </div>
                  )}
                </div>
              </div>

              {/* Data da Consulta */}
              <div className="flex items-center">
                <label className="w-40 text-right pr-4 text-sm font-medium text-gray-700">
                  DATA DA CONSULTA
                </label>
                <div className="flex-1">
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
                      className="w-full px-3 py-1.5 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="px-3 py-1.5 bg-gray-50 border border-gray-300 rounded">
                      {currentPatient.dataConsulta ? new Date(currentPatient.dataConsulta).toLocaleDateString('pt-BR') : ''}
                    </div>
                  )}
                </div>
              </div>

              {/* Convênio */}
              <div className="flex items-center">
                <label className="w-40 text-right pr-4 text-sm font-medium text-gray-700">
                  CONVÊNIO
                </label>
                <div className="flex-1">
                  {isEditing ? (
                    <input
                      type="text"
                      value={currentPatient.convenio || ''}
                      onChange={(e) => handleChange('convenio', e.target.value)}
                      aria-label="Convênio"
                      className="w-full px-3 py-1.5 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="px-3 py-1.5 bg-gray-50 border border-gray-300 rounded">
                      {currentPatient.convenio}
                    </div>
                  )}
                </div>
              </div>

              {/* Subtipo Convênio */}
              <div className="flex items-center">
                <label className="w-40 text-right pr-4 text-sm font-medium text-gray-700">
                  SUBTIPO CONVÊNIO
                </label>
                <div className="flex-1">
                  {isEditing ? (
                    <input
                      type="text"
                      value={currentPatient.subtipoConvenio || ''}
                      onChange={(e) => handleChange('subtipoConvenio', e.target.value)}
                      aria-label="Subtipo do convênio"
                      className="w-full px-3 py-1.5 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="px-3 py-1.5 bg-gray-50 border border-gray-300 rounded">
                      {currentPatient.subtipoConvenio}
                    </div>
                  )}
                </div>
              </div>

              {/* Resposta */}
              <div className="flex items-center">
                <label className="w-40 text-right pr-4 text-sm font-medium text-gray-700">
                  RESPOSTA
                </label>
                <div className="flex-1">
                  {isEditing ? (
                    <select
                      value={currentPatient.resposta || ''}
                      onChange={(e) => handleChange('resposta', e.target.value)}
                      aria-label="Resposta do paciente"
                      className="w-full px-3 py-1.5 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Selecione...</option>
                      <option value="NÃO COMPARECEU">NÃO COMPARECEU</option>
                      <option value="COMPARECEU">COMPARECEU</option>
                    </select>
                  ) : (
                    <div className={`px-3 py-1.5 border border-gray-300 rounded font-semibold ${
                      currentPatient.resposta === 'NÃO COMPARECEU' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {currentPatient.resposta}
                    </div>
                  )}
                </div>
              </div>

              {/* Celular 1 */}
              <div className="flex items-center">
                <label className="w-40 text-right pr-4 text-sm font-medium text-gray-700">
                  CEL 1
                </label>
                <div className="flex-1 flex gap-2">
                  {isEditing ? (
                    <input
                      type="text"
                      value={currentPatient.celular || ''}
                      onChange={(e) => handleChange('celular', e.target.value)}
                      placeholder="(00) 00000-0000"
                      aria-label="Celular"
                      className="flex-1 px-3 py-1.5 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <>
                      <div className="flex-1 px-3 py-1.5 bg-gray-50 border border-gray-300 rounded">
                        {currentPatient.celular}
                      </div>
                      {currentPatient.celular && (
                        <button
                          onClick={handleWhatsApp}
                          className="px-3 py-1.5 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-1 text-sm"
                        >
                          <MessageSquare className="w-4 h-4" />
                          WhatsApp
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Tel Fixo */}
              <div className="flex items-center">
                <label className="w-40 text-right pr-4 text-sm font-medium text-gray-700">
                  TEL FIXO
                </label>
                <div className="flex-1">
                  {isEditing ? (
                    <input
                      type="text"
                      value={currentPatient.telFixo || ''}
                      onChange={(e) => handleChange('telFixo', e.target.value)}
                      placeholder="(00) 0000-0000"
                      aria-label="Telefone fixo"
                      className="w-full px-3 py-1.5 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="px-3 py-1.5 bg-gray-50 border border-gray-300 rounded">
                      {currentPatient.telFixo}
                    </div>
                  )}
                </div>
              </div>

              {/* Indicação */}
              <div className="flex items-center">
                <label className="w-40 text-right pr-4 text-sm font-medium text-gray-700">
                  INDICAÇÃO
                </label>
                <div className="flex-1">
                  {isEditing ? (
                    <input
                      type="text"
                      value={currentPatient.indicacao || ''}
                      onChange={(e) => handleChange('indicacao', e.target.value)}
                      aria-label="Indicação"
                      className="w-full px-3 py-1.5 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="px-3 py-1.5 bg-gray-50 border border-gray-300 rounded">
                      {currentPatient.indicacao}
                    </div>
                  )}
                </div>
              </div>

              {/* Resolvido */}
              <div className="flex items-center">
                <label className="w-40 text-right pr-4 text-sm font-medium text-gray-700">
                  RESOLVIDO
                </label>
                <div className="flex-1">
                  {isEditing ? (
                    <select
                      value={currentPatient.resolvido || ''}
                      onChange={(e) => handleChange('resolvido', e.target.value)}
                      aria-label="Status resolvido"
                      className="w-full px-3 py-1.5 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Selecione...</option>
                      <option value="SIM">SIM</option>
                      <option value="NÃO">NÃO</option>
                      <option value="LIMBO">LIMBO</option>
                    </select>
                  ) : (
                    <div className={`px-3 py-1.5 border border-gray-300 rounded font-semibold ${
                      currentPatient.resolvido === 'SIM' 
                        ? 'bg-green-100 text-green-700' 
                        : currentPatient.resolvido === 'NÃO'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {currentPatient.resolvido}
                    </div>
                  )}
                </div>
              </div>

              {/* Classificação */}
              <div className="flex items-center">
                <label className="w-40 text-right pr-4 text-sm font-medium text-gray-700">
                  CLASSIFICAÇÃO
                </label>
                <div className="flex-1">
                  {isEditing ? (
                    <input
                      type="text"
                      value={currentPatient.classificacao || ''}
                      onChange={(e) => handleChange('classificacao', e.target.value)}
                      aria-label="Classificação"
                      className="w-full px-3 py-1.5 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="px-3 py-1.5 bg-gray-50 border border-gray-300 rounded">
                      {currentPatient.classificacao}
                    </div>
                  )}
                </div>
              </div>

              {/* WhatsApp Checkboxes */}
              <div className="flex items-center">
                <label className="w-40 text-right pr-4 text-sm font-medium text-gray-700">
                  WHATSAPP
                </label>
                <div className="flex-1 flex gap-4">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">1X</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">2X</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">3X</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">LIMBO</span>
                  </label>
                </div>
              </div>

              {/* Observação */}
              <div className="flex items-start">
                <label className="w-40 text-right pr-4 text-sm font-medium text-gray-700 pt-2">
                  OBSERVAÇÃO
                </label>
                <div className="flex-1">
                  {isEditing ? (
                    <textarea
                      value={currentPatient.observacao || ''}
                      onChange={(e) => handleChange('observacao', e.target.value)}
                      rows={4}
                      aria-label="Observação"
                      className="w-full px-3 py-1.5 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="px-3 py-1.5 bg-gray-50 border border-gray-300 rounded min-h-[80px]">
                      {currentPatient.observacao}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Recomendações */}
            <div className="col-span-5">
              <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
                <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  RECOMENDAÇÕES:
                </h3>
                <ol className="space-y-2 text-sm text-gray-700">
                  <li>1) TENTAR PERGUNTAR SEMPRE O CONVÊNIO E E-MAIL QDO FOR MARCAR A CONSULTA</li>
                  <li>2) NÃO USAR "-" NOS NÚMEROS DOS TELEFONES</li>
                  <li>3) RESPEITAR O MÁXIMO OS LOCAIS CELULAR E FIXO</li>
                  <li className="font-semibold text-red-600">
                    4) CUIDADO AO CLICAR <span className="bg-red-200 px-1">LIMBO</span>, POIS PERDEREMOS DEFINITIVAMENTE O CAMPO PRÉVIO DO RESOLVIDO
                  </li>
                </ol>

                {/* Alerta */}
                {currentPatient.alerta && (
                  <div className="mt-4 p-3 bg-red-100 border-2 border-red-400 rounded">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                      <div>
                        <p className="font-bold text-red-900 text-sm">ALERTA</p>
                        {isEditing ? (
                          <textarea
                            value={currentPatient.alerta || ''}
                            onChange={(e) => handleChange('alerta', e.target.value)}
                            rows={2}
                            className="w-full mt-1 px-2 py-1 border border-red-400 rounded text-sm"
                          />
                        ) : (
                          <p className="text-sm text-red-700 mt-1">{currentPatient.alerta}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* ID */}
                <div className="mt-4 text-right">
                  <span className="inline-block bg-yellow-300 border-2 border-yellow-500 px-3 py-1 rounded font-bold text-lg">
                    Id: {currentPatient.ano || '----'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
