'use client';

import { useState } from 'react';
import { Patient } from '@/types';
import { patientService } from '@/services/patientService';
import { Save, X, Phone, Mail, MessageSquare, FileText, AlertCircle, Search } from 'lucide-react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

interface PatientFormFileMakerProps {
  patient: Patient;
  allPatients?: Patient[];
  onUpdate?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onSelectPatient?: (patient: Patient) => void;
  currentIndex: number;
  totalPatients: number;
}

export default function PatientFormFileMaker({ 
  patient, 
  allPatients = [],
  onUpdate, 
  onNext, 
  onPrevious,
  onSelectPatient,
  currentIndex,
  totalPatients 
}: PatientFormFileMakerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [editedPatient, setEditedPatient] = useState<Patient>(patient);
  const [searchTerms, setSearchTerms] = useState<Record<string, string>>({});
  const [showSuggestions, setShowSuggestions] = useState<Record<string, boolean>>({});
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);

  const handleEdit = () => {
    setIsEditing(true);
    setIsSearching(false);
    setEditedPatient(patient);
  };

  const handleSearch = () => {
    setIsSearching(!isSearching);
    setIsEditing(false);
    setSearchTerms({});
  };

  const matchDatePattern = (dateStr: string, pattern: string): boolean => {
    // Suporta padrões: DD/MM/AAAA, */*/AAAA, DD/*/AAAA, */MM/AAAA, DD/MM/AAAA...DD/MM/AAAA
    if (pattern.includes('...')) {
      // Intervalo de datas
      const [start, end] = pattern.split('...').map(d => d.trim());
      const [dD, dM, dY] = dateStr.split('/');
      const [sD, sM, sY] = start.split('/');
      const [eD, eM, eY] = end.split('/');
      
      const dateNum = parseInt(dY + dM.padStart(2, '0') + dD.padStart(2, '0'));
      const startNum = parseInt(sY + sM.padStart(2, '0') + sD.padStart(2, '0'));
      const endNum = parseInt(eY + eM.padStart(2, '0') + eD.padStart(2, '0'));
      
      return dateNum >= startNum && dateNum <= endNum;
    }
    
    const [day, month, year] = dateStr.split('/');
    const [pDay, pMonth, pYear] = pattern.split('/');
    
    if (pYear && pYear !== '*' && year !== pYear) return false;
    if (pMonth && pMonth !== '*' && month !== pMonth) return false;
    if (pDay && pDay !== '*' && day !== pDay) return false;
    
    return true;
  };

  const handleSearchChange = (field: string, value: string) => {
    setSearchTerms((prev: Record<string, string>) => ({ ...prev, [field]: value }));
    
    // Filtrar pacientes baseado no campo e valor
    if (value.trim() && allPatients.length > 0) {
      const filtered = allPatients.filter(p => {
        const fieldValue = (p[field as keyof Patient] || '').toString();
        
        // Se for campo de data e tiver padrão especial
        if (field === 'dataConsulta' && (value.includes('*') || value.includes('...'))) {
          return matchDatePattern(fieldValue, value);
        }
        
        return fieldValue.toLowerCase().includes(value.toLowerCase());
      });
      setFilteredPatients(filtered);
      setShowSuggestions({ ...showSuggestions, [field]: field === 'nome' });
    } else {
      setFilteredPatients([]);
      setShowSuggestions({ ...showSuggestions, [field]: false });
    }
  };

  const handleSelectSuggestion = (patient: Patient, field: string) => {
    console.log('Selecionado paciente:', patient.nome, patient._id);
    setShowSuggestions({ ...showSuggestions, [field]: false });
    setFilteredPatients([]);
    setSearchTerms({});
    setIsSearching(false);
    if (onSelectPatient) {
      onSelectPatient(patient);
    }
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
      
      console.log('Dados sendo enviados:', updateData);
      await patientService.update(patient._id, updateData);
      setIsEditing(false);
      if (onUpdate) {
        onUpdate();
      }
    } catch (error: any) {
      console.error('Erro ao salvar:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
      alert(`Erro ao salvar alterações: ${JSON.stringify(errorMessage)}`);
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
          <div className="flex items-center gap-4 flex-1">
            <div className="flex gap-1">
              <button
                onClick={onPrevious}
                className="px-3 py-1 bg-white border border-gray-400 rounded shadow-sm hover:bg-gray-200 text-sm"
              >
                ◀
              </button>
              <button
                onClick={onNext}
                className="px-3 py-1 bg-white border border-gray-400 rounded shadow-sm hover:bg-gray-200 text-sm"
              >
                ▶
              </button>
            </div>
            
            {/* Slider de navegação */}
            <div className="flex items-center gap-3 flex-1 max-w-md">
              <span className="text-xs font-medium text-gray-700 min-w-[20px]">
                {currentIndex + 1}
              </span>
              <div className="flex-1">
                <Slider
                  min={0}
                  max={totalPatients - 1}
                  value={currentIndex}
                  onChange={(value) => {
                    const index = typeof value === 'number' ? value : value[0];
                    const diff = index - currentIndex;
                    if (diff > 0) {
                      for (let i = 0; i < diff; i++) onNext?.();
                    } else if (diff < 0) {
                      for (let i = 0; i < Math.abs(diff); i++) onPrevious?.();
                    }
                  }}
                  trackStyle={{ backgroundColor: '#3b82f6', height: 8 }}
                  railStyle={{ backgroundColor: '#d1d5db', height: 8 }}
                  handleStyle={{
                    borderColor: '#3b82f6',
                    backgroundColor: '#ffffff',
                    width: 18,
                    height: 18,
                    marginTop: -5,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}
                />
              </div>
              <span className="text-xs font-medium text-gray-700">
                {totalPatients}
              </span>
            </div>
            
            <span className="text-sm font-medium text-gray-700">
              Total ({totalPatients} Registros)
            </span>
          </div>
          
          <div className="flex gap-2">
            {!isEditing ? (
              <>
                <button
                  onClick={handleEdit}
                  className="px-4 py-1.5 bg-blue-600 text-white rounded shadow-sm hover:bg-blue-700 text-sm font-medium"
                >
                  EDITAR
                </button>
                <button
                  onClick={handleSearch}
                  className={`px-4 py-1.5 rounded shadow-sm text-sm font-medium flex items-center gap-1 ${
                    isSearching 
                      ? 'bg-orange-600 text-white hover:bg-orange-700' 
                      : 'bg-gray-600 text-white hover:bg-gray-700'
                  }`}
                >
                  <Search className="w-4 h-4" />
                  {isSearching ? 'SAIR DA BUSCA' : 'BUSCAR'}
                </button>
              </>
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
        <div className="bg-gray-200 rounded-lg shadow-lg border border-gray-300 p-6">
          {/* Form Grid - FileMaker Style */}
          <div className="grid grid-cols-12 gap-4">
            {/* Left Column */}
            <div className="col-span-7 space-y-4">
              {/* Nome */}
              <div className="flex items-center">
                <label className="w-40 text-right pr-4 text-sm font-medium text-gray-700">
                  NOME
                </label>
                <div className="flex-1 relative">
                  {isSearching ? (
                    <>
                      <input
                        type="text"
                        value={searchTerms.nome || ''}
                        onChange={(e) => handleSearchChange('nome', e.target.value)}
                        placeholder="Buscar por nome..."
                        aria-label="Buscar nome"
                        className="w-full px-3 py-1.5 border border-orange-400 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 bg-yellow-50"
                      />
                      {showSuggestions.nome && filteredPatients.length > 0 && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto">
                          {filteredPatients.map((p) => (
                            <div
                              key={p._id}
                              onClick={() => handleSelectSuggestion(p, 'nome')}
                              className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0 text-sm"
                            >
                              {p.nome}
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : isEditing ? (
                    <input
                      type="text"
                      value={currentPatient.nome}
                      onChange={(e) => handleChange('nome', e.target.value)}
                      aria-label="Nome do paciente"
                      className="w-full px-3 py-1.5 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="px-3 py-1.5 bg-white border border-gray-300 rounded">
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
                <div className="flex-1 relative">
                  {isSearching ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={searchTerms.dataConsulta || ''}
                        onChange={(e) => handleSearchChange('dataConsulta', e.target.value)}
                        placeholder="DD/MM/AAAA ou */*/2025 ou 01/*/2024 ou 31/01/2024...15/02/2024"
                        aria-label="Buscar data"
                        className="flex-1 px-3 py-1.5 border border-orange-400 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 bg-yellow-50 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'date';
                          input.onchange = (e) => {
                            const target = e.target as HTMLInputElement;
                            if (target.value) {
                              const [year, month, day] = target.value.split('-');
                              const brDate = `${day}/${month}/${year}`;
                              handleSearchChange('dataConsulta', brDate);
                            }
                          };
                          input.click();
                        }}
                        className="px-3 py-1.5 bg-gray-200 border border-gray-400 rounded hover:bg-gray-300"
                        aria-label="Escolher data"
                      >
                        📅
                      </button>
                    </div>
                  ) : isEditing ? (
                    <input
                      type="date"
                      value={
                        currentPatient.dataConsulta 
                          ? (() => {
                              try {
                                // Converter DD/MM/YYYY para YYYY-MM-DD
                                const parts = currentPatient.dataConsulta.split('/');
                                if (parts.length === 3) {
                                  const [day, month, year] = parts;
                                  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                                }
                                return '';
                              } catch {
                                return '';
                              }
                            })()
                          : ''
                      }
                      onChange={(e) => {
                        // Converter YYYY-MM-DD para DD/MM/YYYY
                        if (e.target.value) {
                          const [year, month, day] = e.target.value.split('-');
                          const brDate = `${day}/${month}/${year}`;
                          handleChange('dataConsulta', brDate);
                        } else {
                          handleChange('dataConsulta', '');
                        }
                      }}
                      aria-label="Data da consulta"
                      className="w-full px-3 py-1.5 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="px-3 py-1.5 bg-white border border-gray-300 rounded">
                      {currentPatient.dataConsulta}
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
                  {isSearching ? (
                    <input
                      type="text"
                      value={searchTerms.convenio || ''}
                      onChange={(e) => handleSearchChange('convenio', e.target.value)}
                      placeholder="Buscar por convênio..."
                      aria-label="Buscar convênio"
                      className="w-full px-3 py-1.5 border border-orange-400 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 bg-yellow-50"
                    />
                  ) : isEditing ? (
                    <input
                      type="text"
                      value={currentPatient.convenio || ''}
                      onChange={(e) => handleChange('convenio', e.target.value)}
                      aria-label="Convênio"
                      className="w-full px-3 py-1.5 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="px-3 py-1.5 bg-white border border-gray-300 rounded">
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
                  {isSearching ? (
                    <input
                      type="text"
                      value={searchTerms.subtipoConvenio || ''}
                      onChange={(e) => handleSearchChange('subtipoConvenio', e.target.value)}
                      placeholder="Buscar por subtipo..."
                      aria-label="Buscar subtipo"
                      className="w-full px-3 py-1.5 border border-orange-400 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 bg-yellow-50"
                    />
                  ) : isEditing ? (
                    <input
                      type="text"
                      value={currentPatient.subtipoConvenio || ''}
                      onChange={(e) => handleChange('subtipoConvenio', e.target.value)}
                      aria-label="Subtipo do convênio"
                      className="w-full px-3 py-1.5 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="px-3 py-1.5 bg-white border border-gray-300 rounded">
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
                  {isSearching ? (
                    <select
                      value={searchTerms.resposta || ''}
                      onChange={(e) => handleSearchChange('resposta', e.target.value)}
                      aria-label="Buscar resposta"
                      className="w-full px-3 py-1.5 border border-orange-400 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 bg-yellow-50"
                    >
                      <option value="">Todas...</option>
                      <option value="NÃO COMPARECEU">NÃO COMPARECEU</option>
                      <option value="COMPARECEU">COMPARECEU</option>
                      <option value="LIMBO">LIMBO</option>
                    </select>
                  ) : isEditing ? (
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
                  {isSearching ? (
                    <input
                      type="text"
                      value={searchTerms.celular || ''}
                      onChange={(e) => handleSearchChange('celular', e.target.value)}
                      placeholder="Buscar por celular..."
                      aria-label="Buscar celular"
                      className="flex-1 px-3 py-1.5 border border-orange-400 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 bg-yellow-50"
                    />
                  ) : isEditing ? (
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
                      <div className="flex-1 px-3 py-1.5 bg-white border border-gray-300 rounded">
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
                  {isSearching ? (
                    <input
                      type="text"
                      value={searchTerms.telFixo || ''}
                      onChange={(e) => handleSearchChange('telFixo', e.target.value)}
                      placeholder="Buscar por telefone..."
                      aria-label="Buscar telefone"
                      className="w-full px-3 py-1.5 border border-orange-400 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 bg-yellow-50"
                    />
                  ) : isEditing ? (
                    <input
                      type="text"
                      value={currentPatient.telFixo || ''}
                      onChange={(e) => handleChange('telFixo', e.target.value)}
                      placeholder="(00) 0000-0000"
                      aria-label="Telefone fixo"
                      className="w-full px-3 py-1.5 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="px-3 py-1.5 bg-white border border-gray-300 rounded">
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
                  {isSearching ? (
                    <input
                      type="text"
                      value={searchTerms.indicacao || ''}
                      onChange={(e) => handleSearchChange('indicacao', e.target.value)}
                      placeholder="Buscar por indicação..."
                      aria-label="Buscar indicação"
                      className="w-full px-3 py-1.5 border border-orange-400 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 bg-yellow-50"
                    />
                  ) : isEditing ? (
                    <input
                      type="text"
                      value={currentPatient.indicacao || ''}
                      onChange={(e) => handleChange('indicacao', e.target.value)}
                      aria-label="Indicação"
                      className="w-full px-3 py-1.5 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="px-3 py-1.5 bg-white border border-gray-300 rounded">
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
                  {isSearching ? (
                    <select
                      value={searchTerms.resolvido || ''}
                      onChange={(e) => handleSearchChange('resolvido', e.target.value)}
                      aria-label="Buscar status resolvido"
                      className="w-full px-3 py-1.5 border border-orange-400 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 bg-yellow-50"
                    >
                      <option value="">Todos...</option>
                      <option value="SIM">SIM</option>
                      <option value="NÃO">NÃO</option>
                      <option value="LIMBO">LIMBO</option>
                    </select>
                  ) : isEditing ? (
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
                  {isSearching ? (
                    <input
                      type="text"
                      value={searchTerms.classificacao || ''}
                      onChange={(e) => handleSearchChange('classificacao', e.target.value)}
                      placeholder="Buscar por classificação..."
                      aria-label="Buscar classificação"
                      className="w-full px-3 py-1.5 border border-orange-400 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 bg-yellow-50"
                    />
                  ) : isEditing ? (
                    <input
                      type="text"
                      value={currentPatient.classificacao || ''}
                      onChange={(e) => handleChange('classificacao', e.target.value)}
                      aria-label="Classificação"
                      className="w-full px-3 py-1.5 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="px-3 py-1.5 bg-white border border-gray-300 rounded">
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
                  {isSearching ? (
                    <input
                      type="text"
                      value={searchTerms.observacao || ''}
                      onChange={(e) => handleSearchChange('observacao', e.target.value)}
                      placeholder="Buscar por observação..."
                      aria-label="Buscar observação"
                      className="w-full px-3 py-1.5 border border-orange-400 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 bg-yellow-50"
                    />
                  ) : isEditing ? (
                    <textarea
                      value={currentPatient.observacao || ''}
                      onChange={(e) => handleChange('observacao', e.target.value)}
                      rows={4}
                      aria-label="Observação"
                      className="w-full px-3 py-1.5 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="px-3 py-1.5 bg-white border border-gray-300 rounded min-h-[80px] whitespace-pre-wrap">
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
                            aria-label="Alerta"
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
