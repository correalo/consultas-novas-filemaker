'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { patientService } from '@/services/patientService';
import { ArrowLeft, Save, Calendar } from 'lucide-react';

export default function NewPatientPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const dateInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    nome: '',
    dataConsulta: '',
    convenio: '',
    subtipoConvenio: '',
    resposta: 'LIMBO',
    celular: '',
    telFixo: '',
    dd3: '',
    indicacao: '',
    resolvido: 'LIMBO',
    classificacao: '',
    observacao: '',
    alerta: '',
    ano: new Date().getFullYear().toString(),
    botaoLimboSms: false,
    botaoLimboEmail: false,
    botaoLimboLigacoes: false,
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    // Aplica a máscara DD/MM/AAAA
    let masked = numbers;
    if (numbers.length >= 2) {
      masked = numbers.slice(0, 2) + '/' + numbers.slice(2);
    }
    if (numbers.length >= 4) {
      masked = numbers.slice(0, 2) + '/' + numbers.slice(2, 4) + '/' + numbers.slice(4, 8);
    }
    
    handleChange('dataConsulta', masked);
  };

  const handleCalendarClick = () => {
    dateInputRef.current?.showPicker();
  };

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      const [year, month, day] = e.target.value.split('-');
      const brDate = `${day}/${month}/${year}`;
      setFormData(prev => ({ ...prev, dataConsulta: brDate }));
    }
  };

  const getDateValue = () => {
    if (formData.dataConsulta) {
      try {
        const parts = formData.dataConsulta.split('/');
        if (parts.length === 3) {
          const [day, month, year] = parts;
          return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }
      } catch (err) {
        console.log('Erro ao converter data');
      }
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.dataConsulta) {
      alert('Nome e Data da Consulta são obrigatórios!');
      return;
    }

    try {
      setIsSaving(true);
      await patientService.create(formData);
      alert('Paciente criado com sucesso!');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Erro ao criar:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
      alert(`Erro ao criar paciente: ${JSON.stringify(errorMessage)}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              Voltar
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Novo Paciente</h1>
          </div>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            {isSaving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nome */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome *
              </label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => handleChange('nome', e.target.value)}
                required
                aria-label="Nome do paciente"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Data da Consulta */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data da Consulta *
              </label>
              <div className="flex gap-2 items-center relative">
                <input
                  type="text"
                  value={formData.dataConsulta}
                  onChange={(e) => handleDateChange(e.target.value)}
                  placeholder="DD/MM/AAAA"
                  maxLength={10}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="relative">
                  <button
                    type="button"
                    onClick={handleCalendarClick}
                    className="flex-shrink-0 w-10 h-10 bg-gray-200 border border-gray-300 rounded-lg hover:bg-gray-300 flex items-center justify-center"
                    title="Escolher data"
                  >
                    <Calendar className="w-5 h-5 text-gray-600" />
                  </button>
                  {/* Input date escondido para abrir o calendário */}
                  <input
                    ref={dateInputRef}
                    type="date"
                    value={getDateValue()}
                    onChange={handleDateInputChange}
                    className="absolute top-0 left-0 opacity-0 pointer-events-none w-full h-full"
                    tabIndex={-1}
                    aria-label="Seletor de data"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Digite ou clique no calendário</p>
            </div>

            {/* Convênio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Convênio
              </label>
              <select
                value={formData.convenio}
                onChange={(e) => handleChange('convenio', e.target.value)}
                aria-label="Convênio"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            </div>

            {/* Subtipo Convênio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subtipo Convênio
              </label>
              <input
                type="text"
                value={formData.subtipoConvenio}
                onChange={(e) => handleChange('subtipoConvenio', e.target.value)}
                aria-label="Subtipo do convênio"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Celular */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Celular
              </label>
              <input
                type="text"
                value={formData.celular}
                onChange={(e) => handleChange('celular', e.target.value)}
                placeholder="(00) 00000-0000"
                aria-label="Celular"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Telefone Fixo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefone Fixo
              </label>
              <input
                type="text"
                value={formData.telFixo}
                onChange={(e) => handleChange('telFixo', e.target.value)}
                placeholder="(00) 0000-0000"
                aria-label="Telefone fixo"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Indicação */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Indicação
              </label>
              <input
                type="text"
                value={formData.indicacao}
                onChange={(e) => handleChange('indicacao', e.target.value)}
                aria-label="Indicação"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Classificação */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Classificação
              </label>
              <input
                type="text"
                value={formData.classificacao}
                onChange={(e) => handleChange('classificacao', e.target.value)}
                aria-label="Classificação"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Observação */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observação
              </label>
              <textarea
                value={formData.observacao}
                onChange={(e) => handleChange('observacao', e.target.value)}
                rows={4}
                aria-label="Observação"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Alerta */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alerta
              </label>
              <input
                type="text"
                value={formData.alerta}
                onChange={(e) => handleChange('alerta', e.target.value)}
                aria-label="Alerta"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              {isSaving ? 'Salvando...' : 'Salvar Paciente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
