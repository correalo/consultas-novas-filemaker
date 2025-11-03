'use client';

import { useState, useRef } from 'react';
import { Patient } from '@/types';
import { patientService } from '@/services/patientService';
import { Save, X, Phone, Mail, MessageSquare, FileText, AlertCircle, Search, RefreshCw, Trash2, Plus, Calendar } from 'lucide-react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

interface PatientFormFileMakerProps {
  patient: Patient;
  allPatients?: Patient[];
  onUpdate?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onSelectPatient?: (patient: Patient) => void;
  onCreateNew?: () => void;
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
  onCreateNew,
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
  
  const dataCirurgiaInputRef = useRef<HTMLInputElement>(null);
  const dataNascimentoInputRef = useRef<HTMLInputElement>(null);

  // Funções para converter data BR (DD/MM/AAAA) para ISO (YYYY-MM-DD)
  const convertBRtoISO = (brDate: string): string => {
    if (!brDate) return '';
    try {
      const parts = brDate.split('/');
      if (parts.length === 3) {
        const [day, month, year] = parts;
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
    } catch (err) {
      console.log('Erro ao converter data BR para ISO');
    }
    return '';
  };

  const convertISOtoBR = (isoDate: string): string => {
    if (!isoDate) return '';
    try {
      const [year, month, day] = isoDate.split('-');
      return `${day}/${month}/${year}`;
    } catch (err) {
      console.log('Erro ao converter data ISO para BR');
    }
    return '';
  };

  const handleCalendarClick = (field: 'dataCirurgia' | 'dataNascimento') => {
    if (field === 'dataCirurgia') {
      dataCirurgiaInputRef.current?.showPicker();
    } else {
      dataNascimentoInputRef.current?.showPicker();
    }
  };

  const handleDateInputChange = (field: 'dataCirurgia' | 'dataNascimento', isoDate: string) => {
    if (isoDate) {
      const brDate = convertISOtoBR(isoDate);
      handleChange(field, brDate);
    }
  };

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

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja deletar este paciente?')) {
      return;
    }
    
    try {
      setIsSaving(true);
      await patientService.delete(patient._id);
      setIsEditing(false);
      if (onUpdate) {
        onUpdate();
      }
      alert('Paciente deletado com sucesso!');
    } catch (error: any) {
      console.error('Erro ao deletar:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
      alert(`Erro ao deletar paciente: ${JSON.stringify(errorMessage)}`);
    } finally {
      setIsSaving(false);
    }
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
      {/* Header Bar - FileMaker Style - Responsivo */}
      <div className="bg-gradient-to-b from-[#d0d0d0] to-[#b8b8b8] border-b border-gray-400 px-2 sm:px-4 py-2">
        {/* Mobile/Tablet: Stack vertical */}
        <div className="flex flex-col gap-2 lg:hidden">
          {/* Linha 1: Navegação, slider e contador */}
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <button
                onClick={onPrevious}
                className="px-2 sm:px-3 py-1 bg-white border border-gray-400 rounded shadow-sm hover:bg-gray-200 text-sm"
              >
                ◀
              </button>
              <button
                onClick={onNext}
                className="px-2 sm:px-3 py-1 bg-white border border-gray-400 rounded shadow-sm hover:bg-gray-200 text-sm"
              >
                ▶
              </button>
            </div>
            
            {/* Slider de navegação mobile */}
            <div className="flex items-center gap-2 flex-1">
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
                  trackStyle={{ backgroundColor: '#3b82f6', height: 6 }}
                  railStyle={{ backgroundColor: '#d1d5db', height: 6 }}
                  handleStyle={{
                    borderColor: '#3b82f6',
                    backgroundColor: '#ffffff',
                    width: 16,
                    height: 16,
                    marginTop: -5,
                  }}
                />
              </div>
              <span className="text-xs font-medium text-gray-700">
                {totalPatients}
              </span>
            </div>
          </div>
          
          {/* Linha 2: Total de registros (mobile) */}
          <div className="text-center">
            <span className="text-xs sm:text-sm font-medium text-gray-700">
              Total ({totalPatients} Registros)
            </span>
          </div>
          
          {/* Linha 3: Botões de ação */}
          <div className="flex gap-1 sm:gap-2 flex-wrap">
            {!isEditing ? (
              <>
                <button
                  onClick={onUpdate}
                  className="flex-1 min-w-[80px] px-2 sm:px-4 py-1.5 bg-purple-600 text-white rounded shadow-sm hover:bg-purple-700 text-xs sm:text-sm font-medium flex items-center justify-center gap-1"
                >
                  <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">ATUALIZAR</span>
                  <span className="sm:hidden">ATU</span>
                </button>
                <button
                  onClick={handleEdit}
                  className="flex-1 min-w-[80px] px-2 sm:px-4 py-1.5 bg-blue-600 text-white rounded shadow-sm hover:bg-blue-700 text-xs sm:text-sm font-medium"
                >
                  EDITAR
                </button>
                <button
                  onClick={handleSearch}
                  className={`flex-1 min-w-[80px] px-2 sm:px-4 py-1.5 rounded shadow-sm text-xs sm:text-sm font-medium flex items-center justify-center gap-1 ${
                    isSearching 
                      ? 'bg-orange-600 text-white hover:bg-orange-700' 
                      : 'bg-gray-600 text-white hover:bg-gray-700'
                  }`}
                >
                  <Search className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">{isSearching ? 'SAIR' : 'BUSCAR'}</span>
                </button>
                <button
                  onClick={onCreateNew}
                  className="flex-1 min-w-[80px] px-2 sm:px-4 py-1.5 bg-green-600 text-white rounded shadow-sm hover:bg-green-700 text-xs sm:text-sm font-medium flex items-center justify-center gap-1"
                >
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">NOVO</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 px-2 sm:px-4 py-1.5 bg-green-600 text-white rounded shadow-sm hover:bg-green-700 text-xs sm:text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-1"
                >
                  <Save className="w-3 h-3 sm:w-4 sm:h-4" />
                  SALVAR
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isSaving}
                  className="flex-1 px-2 sm:px-4 py-1.5 bg-orange-600 text-white rounded shadow-sm hover:bg-orange-700 text-xs sm:text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-1"
                >
                  <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">DELETAR</span>
                  <span className="sm:hidden">DEL</span>
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="flex-1 px-2 sm:px-4 py-1.5 bg-red-600 text-white rounded shadow-sm hover:bg-red-700 text-xs sm:text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-1"
                >
                  <X className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">CANCELAR</span>
                  <span className="sm:hidden">CANC</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Desktop: Layout horizontal original */}
        <div className="hidden lg:flex items-center justify-between">
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
                  onClick={onUpdate}
                  className="px-4 py-1.5 bg-purple-600 text-white rounded shadow-sm hover:bg-purple-700 text-sm font-medium flex items-center gap-1"
                >
                  <RefreshCw className="w-4 h-4" />
                  ATUALIZAR
                </button>
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
                <button
                  onClick={onCreateNew}
                  className="px-4 py-1.5 bg-green-600 text-white rounded shadow-sm hover:bg-green-700 text-sm font-medium flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  NOVO
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
                  onClick={handleDelete}
                  disabled={isSaving}
                  className="px-4 py-1.5 bg-orange-600 text-white rounded shadow-sm hover:bg-orange-700 text-sm font-medium disabled:opacity-50 flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" />
                  DELETAR
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
      <div className="p-2 sm:p-4 lg:p-6 max-w-7xl mx-auto">
        <div className="bg-gray-200 rounded-lg shadow-lg border border-gray-300 p-3 sm:p-4 lg:p-6">
          {/* Form Grid - FileMaker Style - Responsivo */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-3 sm:space-y-4">
              {/* Nome */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <label className="sm:w-40 sm:text-right sm:pr-4 text-xs sm:text-sm font-medium text-gray-700">
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
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <label className="sm:w-40 sm:text-right sm:pr-4 text-xs sm:text-sm font-medium text-gray-700">
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
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={currentPatient.dataConsulta || ''}
                        onChange={(e) => {
                          const numbers = e.target.value.replace(/\D/g, '');
                          let masked = numbers;
                          if (numbers.length >= 2) {
                            masked = numbers.slice(0, 2) + '/' + numbers.slice(2);
                          }
                          if (numbers.length >= 4) {
                            masked = numbers.slice(0, 2) + '/' + numbers.slice(2, 4) + '/' + numbers.slice(4, 8);
                          }
                          handleChange('dataConsulta', masked);
                        }}
                        placeholder="DD/MM/AAAA"
                        maxLength={10}
                        aria-label="Data da consulta"
                        className="flex-1 px-3 py-1.5 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'date';
                          
                          // Converter data atual para formato YYYY-MM-DD se existir
                          if (currentPatient.dataConsulta) {
                            try {
                              const parts = currentPatient.dataConsulta.split('/');
                              if (parts.length === 3) {
                                const [day, month, year] = parts;
                                input.value = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                              }
                            } catch (e) {
                              console.log('Erro ao converter data');
                            }
                          }
                          
                          input.onchange = (e) => {
                            const target = e.target as HTMLInputElement;
                            if (target.value) {
                              const [year, month, day] = target.value.split('-');
                              const brDate = `${day}/${month}/${year}`;
                              handleChange('dataConsulta', brDate);
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
                  ) : (
                    <div className="px-3 py-1.5 bg-white border border-gray-300 rounded">
                      {currentPatient.dataConsulta}
                    </div>
                  )}
                </div>
              </div>

              {/* Convênio */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <label className="sm:w-40 sm:text-right sm:pr-4 text-xs sm:text-sm font-medium text-gray-700">
                  CONVÊNIO
                </label>
                <div className="flex-1">
                  {isSearching ? (
                    <select
                      value={searchTerms.convenio || ''}
                      onChange={(e) => handleSearchChange('convenio', e.target.value)}
                      aria-label="Buscar convênio"
                      className="w-full px-3 py-1.5 border border-orange-400 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 bg-yellow-50"
                    >
                      <option value="">Todos...</option>
                      <option value="PARTICULAR">PARTICULAR</option>
                      <option value="SULAMERICA">SULAMERICA</option>
                      <option value="BRADESCO">BRADESCO</option>
                      <option value="ABET">ABET</option>
                      <option value="ALLIANZ">ALLIANZ</option>
                      <option value="AMEPLAN">AMEPLAN</option>
                      <option value="AMIL">AMIL</option>
                      <option value="AMAFRESP">AMAFRESP</option>
                      <option value="CABESP">CABESP</option>
                      <option value="CARE PLUS">CARE PLUS</option>
                      <option value="CASSI">CASSI</option>
                      <option value="CET">CET</option>
                      <option value="CLASSES LABORIOSAS">CLASSES LABORIOSAS</option>
                      <option value="CUIDAR ME">CUIDAR ME</option>
                      <option value="ECONOMUS">ECONOMUS</option>
                      <option value="EMBRATEL">EMBRATEL</option>
                      <option value="FUNDACAO CESP">FUNDACAO CESP</option>
                      <option value="GAMA">GAMA</option>
                      <option value="GEAP">GEAP</option>
                      <option value="GOLDEN CROSS">GOLDEN CROSS</option>
                      <option value="GREEN LINE">GREEN LINE</option>
                      <option value="INTERMEDICA">INTERMEDICA</option>
                      <option value="ITAU">ITAU</option>
                      <option value="NOTRE DAME">NOTRE DAME</option>
                      <option value="MARITIMA">MARITIMA</option>
                      <option value="MEDIAL">MEDIAL</option>
                      <option value="MEDISERVICE">MEDISERVICE</option>
                      <option value="METRUS">METRUS</option>
                      <option value="OMINT">OMINT</option>
                      <option value="ONE HEALTH">ONE HEALTH</option>
                      <option value="PORTO SEGURO">PORTO SEGURO</option>
                      <option value="POSTAL SAUDE">POSTAL SAUDE</option>
                      <option value="SABESPREV">SABESPREV</option>
                      <option value="SAUDE CAIXA">SAUDE CAIXA</option>
                      <option value="SOMPO SAÚDE">SOMPO SAÚDE</option>
                      <option value="TRASMONTANO">TRASMONTANO</option>
                      <option value="UNIMED">UNIMED</option>
                      <option value="UNIMED CENTRAL NACIONAL">UNIMED CENTRAL NACIONAL</option>
                      <option value="UNIMED FESP">UNIMED FESP</option>
                      <option value="UNIMED GUARULHOS">UNIMED GUARULHOS</option>
                      <option value="UNIMED SEGUROS">UNIMED SEGUROS</option>
                      <option value="VOLKSWAGEN">VOLKSWAGEN</option>
                      <option value="OUTROS">OUTROS</option>
                    </select>
                  ) : isEditing ? (
                    <select
                      value={currentPatient.convenio || ''}
                      onChange={(e) => handleChange('convenio', e.target.value)}
                      aria-label="Convênio"
                      className="w-full px-3 py-1.5 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Selecione...</option>
                      <option value="PARTICULAR">PARTICULAR</option>
                      <option value="SULAMERICA">SULAMERICA</option>
                      <option value="BRADESCO">BRADESCO</option>
                      <option value="ABET">ABET</option>
                      <option value="ALLIANZ">ALLIANZ</option>
                      <option value="AMEPLAN">AMEPLAN</option>
                      <option value="AMIL">AMIL</option>
                      <option value="AMAFRESP">AMAFRESP</option>
                      <option value="CABESP">CABESP</option>
                      <option value="CARE PLUS">CARE PLUS</option>
                      <option value="CASSI">CASSI</option>
                      <option value="CET">CET</option>
                      <option value="CLASSES LABORIOSAS">CLASSES LABORIOSAS</option>
                      <option value="CUIDAR ME">CUIDAR ME</option>
                      <option value="ECONOMUS">ECONOMUS</option>
                      <option value="EMBRATEL">EMBRATEL</option>
                      <option value="FUNDACAO CESP">FUNDACAO CESP</option>
                      <option value="GAMA">GAMA</option>
                      <option value="GEAP">GEAP</option>
                      <option value="GOLDEN CROSS">GOLDEN CROSS</option>
                      <option value="GREEN LINE">GREEN LINE</option>
                      <option value="INTERMEDICA">INTERMEDICA</option>
                      <option value="ITAU">ITAU</option>
                      <option value="NOTRE DAME">NOTRE DAME</option>
                      <option value="MARITIMA">MARITIMA</option>
                      <option value="MEDIAL">MEDIAL</option>
                      <option value="MEDISERVICE">MEDISERVICE</option>
                      <option value="METRUS">METRUS</option>
                      <option value="OMINT">OMINT</option>
                      <option value="ONE HEALTH">ONE HEALTH</option>
                      <option value="PORTO SEGURO">PORTO SEGURO</option>
                      <option value="POSTAL SAUDE">POSTAL SAUDE</option>
                      <option value="SABESPREV">SABESPREV</option>
                      <option value="SAUDE CAIXA">SAUDE CAIXA</option>
                      <option value="SOMPO SAÚDE">SOMPO SAÚDE</option>
                      <option value="TRASMONTANO">TRASMONTANO</option>
                      <option value="UNIMED">UNIMED</option>
                      <option value="UNIMED CENTRAL NACIONAL">UNIMED CENTRAL NACIONAL</option>
                      <option value="UNIMED FESP">UNIMED FESP</option>
                      <option value="UNIMED GUARULHOS">UNIMED GUARULHOS</option>
                      <option value="UNIMED SEGUROS">UNIMED SEGUROS</option>
                      <option value="VOLKSWAGEN">VOLKSWAGEN</option>
                      <option value="OUTROS">OUTROS</option>
                    </select>
                  ) : (
                    <div className="px-3 py-1.5 bg-white border border-gray-300 rounded">
                      {currentPatient.convenio}
                    </div>
                  )}
                </div>
              </div>

              {/* Subtipo Convênio */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <label className="sm:w-40 sm:text-right sm:pr-4 text-xs sm:text-sm font-medium text-gray-700">
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
                    <select
                      value={currentPatient.subtipoConvenio || ''}
                      onChange={(e) => handleChange('subtipoConvenio', e.target.value)}
                      aria-label="Subtipo do convênio"
                      className="w-full px-3 py-1.5 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Selecione...</option>
                      <option value="AMIL 140 PLUS">AMIL 140 PLUS</option>
                      <option value="AMIL 160">AMIL 160</option>
                      <option value="AMIL BLUE I">AMIL BLUE I</option>
                      <option value="AMIL BLUE II">AMIL BLUE II</option>
                      <option value="AMIL GLOBAL I">AMIL GLOBAL I</option>
                      <option value="AMIL 30">AMIL 30</option>
                      <option value="AMIL 40">AMIL 40</option>
                      <option value="AMIL 200">AMIL 200</option>
                      <option value="AMIL 300">AMIL 300</option>
                      <option value="AMIL 400">AMIL 400</option>
                      <option value="AMIL 500">AMIL 500</option>
                      <option value="AMIL 700">AMIL 700</option>
                      <option value="AMIL BLUE GOLD">AMIL BLUE GOLD</option>
                      <option value="AMIL FACIL S60 SP">AMIL FACIL S60 SP</option>
                      <option value="AMIL COLABORADOR">AMIL COLABORADOR</option>
                      <option value="AMIL ORIENTADOR 40">AMIL ORIENTADOR 40</option>
                      <option value="AMIL ORIENTADOR 140">AMIL ORIENTADOR 140</option>
                      <option value="AMIL NEXT MUN SAO PAULO">AMIL NEXT MUN SAO PAULO</option>
                      <option value="AMIL QUALITE M22">AMIL QUALITE M22</option>
                      <option value="AMIL ONE S1500">AMIL ONE S1500</option>
                      <option value="AMIL ONE S2500">AMIL ONE S2500</option>
                      <option value="AMIL OPCAO M22">AMIL OPCAO M22</option>
                      <option value="AMIL SANTA PAULA">AMIL SANTA PAULA</option>
                      <option value="AMIL S40">AMIL S40</option>
                      <option value="AMIL S80">AMIL S80</option>
                      <option value="AMIL S250">AMIL S250</option>
                      <option value="AMIL S350">AMIL S350</option>
                      <option value="AMIL S450">AMIL S450</option>
                      <option value="AMIL S580">AMIL S580</option>
                      <option value="AMIL S750">AMIL S750</option>
                      <option value="ABSOLUTO">ABSOLUTO</option>
                      <option value="ACESSO IV">ACESSO IV</option>
                      <option value="ADVANCE 600">ADVANCE 600</option>
                      <option value="ADVANCE 700">ADVANCE 700</option>
                      <option value="ADVANCE 800">ADVANCE 800</option>
                      <option value="AGREGADO">AGREGADO</option>
                      <option value="AMPLA COLETIVO">AMPLA COLETIVO</option>
                      <option value="ASSOCIADOS">ASSOCIADOS</option>
                      <option value="ATIVOS">ATIVOS</option>
                      <option value="BASICO">BASICO</option>
                      <option value="BASICO 10">BASICO 10</option>
                      <option value="BETA">BETA</option>
                      <option value="BLUE III">BLUE III</option>
                      <option value="BLUE IV">BLUE IV</option>
                      <option value="BLUE 300">BLUE 300</option>
                      <option value="BLUE 300 PLUS">BLUE 300 PLUS</option>
                      <option value="BLUE 400">BLUE 400</option>
                      <option value="BLUE 400 PLUS">BLUE 400 PLUS</option>
                      <option value="BLUE 500">BLUE 500</option>
                      <option value="BLUE 500 PLUS">BLUE 500 PLUS</option>
                      <option value="BLUE 600">BLUE 600</option>
                      <option value="BLUE 600 PLUS">BLUE 600 PLUS</option>
                      <option value="BLUE 700">BLUE 700</option>
                      <option value="BLUE 800">BLUE 800</option>
                      <option value="BLUE EXECUTIVO">BLUE EXECUTIVO</option>
                      <option value="BRANCO">BRANCO</option>
                      <option value="BRANCO SL">BRANCO SL</option>
                      <option value="BRANCO 100">BRANCO 100</option>
                      <option value="BRANCO 150">BRANCO 150</option>
                      <option value="BRONZE">BRONZE</option>
                      <option value="BRONZE I">BRONZE I</option>
                      <option value="BRONZE TOP">BRONZE TOP</option>
                      <option value="CABESP FAMILIA">CABESP FAMILIA</option>
                      <option value="CELEBRITY">CELEBRITY</option>
                      <option value="CENTRAL NACIONAL">CENTRAL NACIONAL</option>
                      <option value="CLASS 620 E">CLASS 620 E</option>
                      <option value="CLASS 620 A">CLASS 620 A</option>
                      <option value="CLASS 640 A">CLASS 640 A</option>
                      <option value="CLASSICO">CLASSICO</option>
                      <option value="COLETIVO EMPRESARIAL">COLETIVO EMPRESARIAL</option>
                      <option value="COMPLETO">COMPLETO</option>
                      <option value="CORPORATIVO COMPLETO">CORPORATIVO COMPLETO</option>
                      <option value="CORREIOS SAUDE">CORREIOS SAUDE</option>
                      <option value="CRISTAL I">CRISTAL I</option>
                      <option value="D">D</option>
                      <option value="DIAMANTE I">DIAMANTE I</option>
                      <option value="DIAMANTE I 876">DIAMANTE I 876</option>
                      <option value="DINAMICO">DINAMICO</option>
                      <option value="DSP CLINIC">DSP CLINIC</option>
                      <option value="DSP PLENA">DSP PLENA</option>
                      <option value="DIX 10">DIX 10</option>
                      <option value="DIX ORIENTADOR">DIX ORIENTADOR</option>
                      <option value="DIX 100">DIX 100</option>
                      <option value="EFETIVO IV">EFETIVO IV</option>
                      <option value="ELETROPAULO">ELETROPAULO</option>
                      <option value="ESSENCIAL">ESSENCIAL</option>
                      <option value="ESSENCIAL PLUS">ESSENCIAL PLUS</option>
                      <option value="ESPECIAL">ESPECIAL</option>
                      <option value="ESPECIAL I">ESPECIAL I</option>
                      <option value="ESPECIAL II">ESPECIAL II</option>
                      <option value="ESPECIAL III">ESPECIAL III</option>
                      <option value="ESPECIAL 100">ESPECIAL 100</option>
                      <option value="ESTILO I">ESTILO I</option>
                      <option value="ESTILO III">ESTILO III</option>
                      <option value="ES07 ESPECIAL">ES07 ESPECIAL</option>
                      <option value="EXATO">EXATO</option>
                      <option value="EXCELLENCE">EXCELLENCE</option>
                      <option value="EXECUTIVE">EXECUTIVE</option>
                      <option value="EXECUTIVO">EXECUTIVO</option>
                      <option value="EXCLUSIVO">EXCLUSIVO</option>
                      <option value="FAMILIA">FAMILIA</option>
                      <option value="FAMILA AGREGADO">FAMILA AGREGADO</option>
                      <option value="FESP">FESP</option>
                      <option value="FIT">FIT</option>
                      <option value="FLEX">FLEX</option>
                      <option value="GREEN 211">GREEN 211</option>
                      <option value="H2L2R2ED">H2L2R2ED</option>
                      <option value="H3L2">H3L2</option>
                      <option value="IDEAL ENFERMARIA">IDEAL ENFERMARIA</option>
                      <option value="INFINITY 1000">INFINITY 1000</option>
                      <option value="INTEGRADA">INTEGRADA</option>
                      <option value="LIDER">LIDER</option>
                      <option value="LIFE STD">LIFE STD</option>
                      <option value="LT3">LT3</option>
                      <option value="LT4">LT4</option>
                      <option value="MASTER">MASTER</option>
                      <option value="MASTER I">MASTER I</option>
                      <option value="MASTER II">MASTER II</option>
                      <option value="MASTER III">MASTER III</option>
                      <option value="MASTER IV">MASTER IV</option>
                      <option value="MAX 250">MAX 250</option>
                      <option value="MAX 300">MAX 300</option>
                      <option value="MAX 350">MAX 350</option>
                      <option value="MAX 400">MAX 400</option>
                      <option value="MAXI">MAXI</option>
                      <option value="MAXIMO">MAXIMO</option>
                      <option value="MEDIAL 200">MEDIAL 200</option>
                      <option value="MEDIAL CLASS 620">MEDIAL CLASS 620</option>
                      <option value="MEDIAL 31">MEDIAL 31</option>
                      <option value="MEDIAL 400">MEDIAL 400</option>
                      <option value="MEDIAL 840 A">MEDIAL 840 A</option>
                      <option value="MEDIAL ESTRELAS 31">MEDIAL ESTRELAS 31</option>
                      <option value="MEDIAL EXECUTIVE PLUS">MEDIAL EXECUTIVE PLUS</option>
                      <option value="MEDIAL INTER II NAC PJCE">MEDIAL INTER II NAC PJCE</option>
                      <option value="MEDIAL GOL">MEDIAL GOL</option>
                      <option value="MEDIAL IDEAL 420 A">MEDIAL IDEAL 420 A</option>
                      <option value="MEDIAL ORIENTADOR CLASS 30">MEDIAL ORIENTADOR CLASS 30</option>
                      <option value="MEDIAL PLENO II">MEDIAL PLENO II</option>
                      <option value="MEDIAL PREMIUM 840A">MEDIAL PREMIUM 840A</option>
                      <option value="MEDICUS M22">MEDICUS M22</option>
                      <option value="MEDICUS 122">MEDICUS 122</option>
                      <option value="MELHOR">MELHOR</option>
                      <option value="MSI">MSI</option>
                      <option value="NDS 111">NDS 111</option>
                      <option value="NDS 126">NDS 126</option>
                      <option value="NDS 127">NDS 127</option>
                      <option value="NDS 130">NDS 130</option>
                      <option value="NDS 140">NDS 140</option>
                      <option value="NDS 141">NDS 141</option>
                      <option value="NDS 161">NDS 161</option>
                      <option value="ONE BLACK T2">ONE BLACK T2</option>
                      <option value="ONE BLACK T3">ONE BLACK T3</option>
                      <option value="ONE 2000">ONE 2000</option>
                      <option value="OPCAO M22">OPCAO M22</option>
                      <option value="OPCAO 122">OPCAO 122</option>
                      <option value="ORIGINAL">ORIGINAL</option>
                      <option value="OSWALDO CRUZ 100">OSWALDO CRUZ 100</option>
                      <option value="OURO">OURO</option>
                      <option value="OURO I">OURO I</option>
                      <option value="OURO III">OURO III</option>
                      <option value="OURO IV">OURO IV</option>
                      <option value="OURO MAIS Q">OURO MAIS Q</option>
                      <option value="OURO MAX Q">OURO MAX Q</option>
                      <option value="PADRAO">PADRAO</option>
                      <option value="PLENO">PLENO</option>
                      <option value="PLENO II 920">PLENO II 920</option>
                      <option value="PLUS">PLUS</option>
                      <option value="PME COMPACTO">PME COMPACTO</option>
                      <option value="PORTO MED I">PORTO MED I</option>
                      <option value="PRATA">PRATA</option>
                      <option value="PRATA BRONZE COPAR Q">PRATA BRONZE COPAR Q</option>
                      <option value="PRATA E MAIS">PRATA E MAIS</option>
                      <option value="PRATA MAIS Q">PRATA MAIS Q</option>
                      <option value="PRATA I">PRATA I</option>
                      <option value="PRATA TOP">PRATA TOP</option>
                      <option value="PREMIUM">PREMIUM</option>
                      <option value="PREMIUM TOP">PREMIUM TOP</option>
                      <option value="PREMIUM 800">PREMIUM 800</option>
                      <option value="PREMIUM 900">PREMIUM 900</option>
                      <option value="QUALITE">QUALITE</option>
                      <option value="REDE 300">REDE 300</option>
                      <option value="REFE EFETIVO">REFE EFETIVO</option>
                      <option value="REDE EFETIVO III">REDE EFETIVO III</option>
                      <option value="REDE EFETIVO IV">REDE EFETIVO IV</option>
                      <option value="REDE HSC IDEAL">REDE HSC IDEAL</option>
                      <option value="REDE HSC NACIONAL">REDE HSC NACIONAL</option>
                      <option value="REDE IDEAL I">REDE IDEAL I</option>
                      <option value="REDE LIVRE ESCOLHA">REDE LIVRE ESCOLHA</option>
                      <option value="REDE PERFIL SP">REDE PERFIL SP</option>
                      <option value="REDE PERSONAL IV">REDE PERSONAL IV</option>
                      <option value="REDE PREFERENCIAL">REDE PREFERENCIAL</option>
                      <option value="REDE PREFERENCIAL PLUS">REDE PREFERENCIAL PLUS</option>
                      <option value="REDE INTERNACIONAL">REDE INTERNACIONAL</option>
                      <option value="REDE NACIONAL INDIVIDUAL">REDE NACIONAL INDIVIDUAL</option>
                      <option value="REDE NACIONAL EMPRESARIAL">REDE NACIONAL EMPRESARIAL</option>
                      <option value="REDE NACIONAL EMPRESARIAL SPG">REDE NACIONAL EMPRESARIAL SPG</option>
                      <option value="REDE NACIONAL ESPECIAL">REDE NACIONAL ESPECIAL</option>
                      <option value="REDE NACIONAL FLEX">REDE NACIONAL FLEX</option>
                      <option value="REDE NACIONAL FLEX II">REDE NACIONAL FLEX II</option>
                      <option value="REDE NACIONAL PLUS">REDE NACIONAL PLUS</option>
                      <option value="REDE PERSONAL VI">REDE PERSONAL VI</option>
                      <option value="REDE SCANIA">REDE SCANIA</option>
                      <option value="REDE SIEMENS">REDE SIEMENS</option>
                      <option value="REGIONAL">REGIONAL</option>
                      <option value="SAUDE CAIXA ATIVOS">SAUDE CAIXA ATIVOS</option>
                      <option value="SEGUROS UNIMED HCOR">SEGUROS UNIMED HCOR</option>
                      <option value="SELETO I">SELETO I</option>
                      <option value="SENIOR I">SENIOR I</option>
                      <option value="SENIOR II 920">SENIOR II 920</option>
                      <option value="SKILL">SKILL</option>
                      <option value="SMART 200">SMART 200</option>
                      <option value="SMART 300">SMART 300</option>
                      <option value="SMART 400">SMART 400</option>
                      <option value="SMART 500">SMART 500</option>
                      <option value="SMART 600">SMART 600</option>
                      <option value="STANDARD">STANDARD</option>
                      <option value="SUPERIEUR">SUPERIEUR</option>
                      <option value="SUPERIOR NACIONAL">SUPERIOR NACIONAL</option>
                      <option value="SUPREMO">SUPREMO</option>
                      <option value="S 450">S 450</option>
                      <option value="S 750">S 750</option>
                      <option value="UNIPLAN INTEGRADA">UNIPLAN INTEGRADA</option>
                      <option value="UNIPLAN PADRÃO">UNIPLAN PADRÃO</option>
                      <option value="UNIPLAN SUPREMO">UNIPLAN SUPREMO</option>
                      <option value="UNIPLAN UP OURO">UNIPLAN UP OURO</option>
                      <option value="UNIPLAN UP BRONZE">UNIPLAN UP BRONZE</option>
                      <option value="UNIPLAN">UNIPLAN</option>
                      <option value="UNIPLAN NEW PRATA">UNIPLAN NEW PRATA</option>
                      <option value="VERSATIL">VERSATIL</option>
                      <option value="VITA">VITA</option>
                      <option value="UNIPLAN ESPECIAL">UNIPLAN ESPECIAL</option>
                      <option value="UNIPLAN MASTERAMIL">UNIPLAN MASTERAMIL</option>
                    </select>
                  ) : (
                    <div className="px-3 py-1.5 bg-white border border-gray-300 rounded">
                      {currentPatient.subtipoConvenio}
                    </div>
                  )}
                </div>
              </div>

              {/* Resposta */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <label className="sm:w-40 sm:text-right sm:pr-4 text-xs sm:text-sm font-medium text-gray-700">
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
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <label className="sm:w-40 sm:text-right sm:pr-4 text-xs sm:text-sm font-medium text-gray-700">
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
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <label className="sm:w-40 sm:text-right sm:pr-4 text-xs sm:text-sm font-medium text-gray-700">
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
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <label className="sm:w-40 sm:text-right sm:pr-4 text-xs sm:text-sm font-medium text-gray-700">
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

              {/* Data da Cirurgia */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <label className="sm:w-40 sm:text-right sm:pr-4 text-xs sm:text-sm font-medium text-gray-700">
                  DATA DA CIRURGIA
                </label>
                <div className="flex-1">
                  {isEditing ? (
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={currentPatient.dataCirurgia || ''}
                        onChange={(e) => handleChange('dataCirurgia', e.target.value)}
                        placeholder="DD/MM/AAAA"
                        maxLength={10}
                        aria-label="Data da cirurgia"
                        className="flex-1 px-3 py-1.5 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => handleCalendarClick('dataCirurgia')}
                          className="flex-shrink-0 w-10 h-10 bg-gray-200 border border-gray-300 rounded hover:bg-gray-300 flex items-center justify-center"
                          title="Escolher data"
                        >
                          <Calendar className="w-5 h-5 text-gray-600" />
                        </button>
                        <input
                          ref={dataCirurgiaInputRef}
                          type="date"
                          value={convertBRtoISO(currentPatient.dataCirurgia || '')}
                          onChange={(e) => handleDateInputChange('dataCirurgia', e.target.value)}
                          className="absolute top-0 left-0 opacity-0 pointer-events-none w-full h-full"
                          tabIndex={-1}
                          aria-label="Seletor de data da cirurgia"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="px-3 py-1.5 bg-white border border-gray-300 rounded min-h-[34px]">
                      {currentPatient.dataCirurgia || '\u00A0'}
                    </div>
                  )}
                </div>
              </div>

              {/* Profissão */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <label className="sm:w-40 sm:text-right sm:pr-4 text-xs sm:text-sm font-medium text-gray-700">
                  PROFISSÃO
                </label>
                <div className="flex-1">
                  {isEditing ? (
                    <input
                      type="text"
                      value={currentPatient.profissao || ''}
                      onChange={(e) => handleChange('profissao', e.target.value)}
                      placeholder="Profissão"
                      aria-label="Profissão"
                      className="w-full px-3 py-1.5 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="px-3 py-1.5 bg-white border border-gray-300 rounded min-h-[34px]">
                      {currentPatient.profissao || '\u00A0'}
                    </div>
                  )}
                </div>
              </div>

              {/* Sexo */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <label className="sm:w-40 sm:text-right sm:pr-4 text-xs sm:text-sm font-medium text-gray-700">
                  SEXO
                </label>
                <div className="flex-1">
                  {isEditing ? (
                    <select
                      value={currentPatient.sexo || ''}
                      onChange={(e) => handleChange('sexo', e.target.value)}
                      aria-label="Sexo"
                      className="w-full px-3 py-1.5 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Selecione...</option>
                      <option value="MASCULINO">MASCULINO</option>
                      <option value="FEMININO">FEMININO</option>
                      <option value="OUTRO">OUTRO</option>
                    </select>
                  ) : (
                    <div className="px-3 py-1.5 bg-white border border-gray-300 rounded min-h-[34px]">
                      {currentPatient.sexo || '\u00A0'}
                    </div>
                  )}
                </div>
              </div>

              {/* Data de Nascimento */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <label className="sm:w-40 sm:text-right sm:pr-4 text-xs sm:text-sm font-medium text-gray-700">
                  DATA DE NASCIMENTO
                </label>
                <div className="flex-1">
                  {isEditing ? (
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={currentPatient.dataNascimento || ''}
                        onChange={(e) => handleChange('dataNascimento', e.target.value)}
                        placeholder="DD/MM/AAAA"
                        maxLength={10}
                        aria-label="Data de nascimento"
                        className="flex-1 px-3 py-1.5 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => handleCalendarClick('dataNascimento')}
                          className="flex-shrink-0 w-10 h-10 bg-gray-200 border border-gray-300 rounded hover:bg-gray-300 flex items-center justify-center"
                          title="Escolher data"
                        >
                          <Calendar className="w-5 h-5 text-gray-600" />
                        </button>
                        <input
                          ref={dataNascimentoInputRef}
                          type="date"
                          value={convertBRtoISO(currentPatient.dataNascimento || '')}
                          onChange={(e) => handleDateInputChange('dataNascimento', e.target.value)}
                          className="absolute top-0 left-0 opacity-0 pointer-events-none w-full h-full"
                          tabIndex={-1}
                          aria-label="Seletor de data de nascimento"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="px-3 py-1.5 bg-white border border-gray-300 rounded min-h-[34px]">
                      {currentPatient.dataNascimento || '\u00A0'}
                    </div>
                  )}
                </div>
              </div>

              {/* Idade */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <label className="sm:w-40 sm:text-right sm:pr-4 text-xs sm:text-sm font-medium text-gray-700">
                  IDADE
                </label>
                <div className="flex-1">
                  {isEditing ? (
                    <input
                      type="number"
                      value={currentPatient.idade || ''}
                      onChange={(e) => handleChange('idade', parseInt(e.target.value) || 0)}
                      placeholder="Idade"
                      aria-label="Idade"
                      className="w-full px-3 py-1.5 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="px-3 py-1.5 bg-white border border-gray-300 rounded min-h-[34px]">
                      {currentPatient.idade ? `${currentPatient.idade} anos` : '\u00A0'}
                    </div>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <label className="sm:w-40 sm:text-right sm:pr-4 text-xs sm:text-sm font-medium text-gray-700">
                  EMAIL
                </label>
                <div className="flex-1">
                  {isEditing ? (
                    <input
                      type="email"
                      value={currentPatient.email || ''}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder="email@exemplo.com"
                      aria-label="Email"
                      className="w-full px-3 py-1.5 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="px-3 py-1.5 bg-white border border-gray-300 rounded min-h-[34px]">
                      {currentPatient.email || '\u00A0'}
                    </div>
                  )}
                </div>
              </div>

              {/* Resolvido */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <label className="sm:w-40 sm:text-right sm:pr-4 text-xs sm:text-sm font-medium text-gray-700">
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
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <label className="sm:w-40 sm:text-right sm:pr-4 text-xs sm:text-sm font-medium text-gray-700">
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
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <label className="sm:w-40 sm:text-right sm:pr-4 text-xs sm:text-sm font-medium text-gray-700">
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
            <div className="lg:col-span-5">
              <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-3 sm:p-4">
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
