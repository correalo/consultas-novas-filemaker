'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import { patientService } from '@/services/patientService';
import { Patient } from '@/types';
import Navbar from '@/components/Navbar';
import { RefreshCw, Search, Plus, Edit, Trash2, Eye, Calendar, Phone, Building2, Briefcase, User as UserIcon, Cake, Mail, MessageSquare, FileText, ChevronDown, ChevronRight } from 'lucide-react';

export default function PatientsListPage() {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [expandedYears, setExpandedYears] = useState<Set<string>>(new Set());
  const [expandedMonths, setExpandedMonths] = useState<Set<string>>(new Set());
  const [observacaoPopover, setObservacaoPopover] = useState<string | null>(null);
  const [logPopover, setLogPopover] = useState<string | null>(null);

  const loadPatients = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await patientService.getAll();
      setPatients(data);
    } catch (err: any) {
      setError('Erro ao carregar pacientes. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    loadPatients();
  }, [router]);

  if (!mounted) {
    return null;
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadPatients();
      return;
    }

    try {
      setLoading(true);
      setError('');
      const data = await patientService.search(searchQuery);
      setPatients(data);
    } catch (err: any) {
      setError('Erro ao buscar pacientes.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este paciente?')) {
      return;
    }

    try {
      await patientService.delete(id);
      loadPatients();
    } catch (err: any) {
      alert('Erro ao deletar paciente.');
      console.error(err);
    }
  };

  const filteredPatients = searchQuery
    ? patients.filter(p =>
        p.nome?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.celular?.includes(searchQuery) ||
        p.convenio?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : patients;

  // Organizar pacientes por ano e mês
  const organizeByYearAndMonth = () => {
    const organized: Record<string, Record<string, Patient[]>> = {};
    
    filteredPatients.forEach(patient => {
      if (!patient.dataConsulta) return;
      
      try {
        // Assumindo formato DD/MM/YYYY
        const parts = patient.dataConsulta.split('/');
        if (parts.length !== 3) return;
        
        const day = parts[0];
        const month = parts[1];
        const year = parts[2];
        
        if (!organized[year]) {
          organized[year] = {};
        }
        
        if (!organized[year][month]) {
          organized[year][month] = [];
        }
        
        organized[year][month].push(patient);
      } catch (e) {
        console.error('Erro ao processar data:', patient.dataConsulta, e);
      }
    });
    
    return organized;
  };

  const toggleYear = (year: string) => {
    const newExpanded = new Set(expandedYears);
    if (newExpanded.has(year)) {
      newExpanded.delete(year);
    } else {
      newExpanded.add(year);
    }
    setExpandedYears(newExpanded);
  };

  const toggleMonth = (yearMonth: string) => {
    const newExpanded = new Set(expandedMonths);
    if (newExpanded.has(yearMonth)) {
      newExpanded.delete(yearMonth);
    } else {
      newExpanded.add(yearMonth);
    }
    setExpandedMonths(newExpanded);
  };

  const getMonthName = (month: string) => {
    const monthNames = [
      'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
      'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
    ];
    const monthIndex = parseInt(month) - 1;
    return monthNames[monthIndex] || month;
  };

  const organizedData = organizeByYearAndMonth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-1 sm:mb-2">Lista de Pacientes</h1>
          <p className="text-sm sm:text-base text-gray-600">Visualize todos os pacientes em formato de lista</p>
        </div>

        {/* Search and Actions */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-5 md:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Buscar por nome, telefone ou convênio..."
                className="block w-full pl-9 sm:pl-10 pr-3 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSearch}
                className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Buscar</span>
              </button>
              <button
                onClick={loadPatients}
                disabled={loading}
                className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors duration-200 font-medium flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base"
              >
                <RefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Atualizar</span>
              </button>
              <button
                onClick={() => router.push('/patients/new')}
                className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Novo</span>
              </button>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="mt-3 sm:mt-4 flex items-center gap-2">
            <span className="text-xs sm:text-sm text-gray-600">Visualização:</span>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                viewMode === 'table'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Tabela
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                viewMode === 'cards'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Cards
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
            <p className="text-xs sm:text-sm text-gray-600">Total</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-800">{filteredPatients.length}</p>
          </div>
          <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
            <p className="text-xs sm:text-sm text-gray-600">Resolvidos</p>
            <p className="text-xl sm:text-2xl font-bold text-green-600">
              {filteredPatients.filter(p => p.resolvido && p.resolvido !== 'LIMBO').length}
            </p>
          </div>
          <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
            <p className="text-xs sm:text-sm text-gray-600">Compareceram</p>
            <p className="text-xl sm:text-2xl font-bold text-blue-600">
              {filteredPatients.filter(p => p.resposta === 'COMPARECEU').length}
            </p>
          </div>
          <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
            <p className="text-xs sm:text-sm text-gray-600">Com Alerta</p>
            <p className="text-xl sm:text-2xl font-bold text-orange-600">
              {filteredPatients.filter(p => p.alerta).length}
            </p>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando pacientes...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl text-center">
            <p className="font-medium">{error}</p>
            <button
              onClick={loadPatients}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Tentar Novamente
            </button>
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <Plus className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Nenhum paciente encontrado</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery
                ? 'Tente buscar com outros termos'
                : 'Adicione pacientes ao banco de dados para começar'}
            </p>
          </div>
        ) : viewMode === 'table' ? (
          /* Table View - Organized by Year and Month */
          <div className="space-y-4">
            {Object.keys(organizedData).sort((a, b) => parseInt(b) - parseInt(a)).map(year => (
              <div key={year} className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Year Header */}
                <div 
                  className="bg-blue-600 text-white px-6 py-3 cursor-pointer flex items-center justify-between hover:bg-blue-700 transition-colors"
                  onClick={() => toggleYear(year)}
                >
                  <h2 className="text-xl font-bold">{year}</h2>
                  <div className="flex items-center gap-3">
                    <span className="text-sm bg-blue-500 px-3 py-1 rounded-full">
                      {Object.values(organizedData[year]).reduce((sum, patients) => sum + patients.length, 0)} pacientes
                    </span>
                    {expandedYears.has(year) ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                  </div>
                </div>

                {/* Months */}
                {expandedYears.has(year) && (
                  <div className="divide-y divide-gray-200">
                    {Object.keys(organizedData[year]).sort((a, b) => parseInt(b) - parseInt(a)).map(month => {
                      const yearMonth = `${year}-${month}`;
                      const monthPatients = organizedData[year][month];
                      
                      return (
                        <div key={yearMonth}>
                          {/* Month Header */}
                          <div 
                            className="bg-blue-50 px-6 py-2 cursor-pointer flex items-center justify-between hover:bg-blue-100 transition-colors"
                            onClick={() => toggleMonth(yearMonth)}
                          >
                            <h3 className="text-lg font-semibold text-blue-900">
                              {year} - {month}
                            </h3>
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-medium text-blue-700 bg-blue-200 px-3 py-1 rounded-full">
                                {monthPatients.length}
                              </span>
                              {expandedMonths.has(yearMonth) ? <ChevronDown className="w-4 h-4 text-blue-700" /> : <ChevronRight className="w-4 h-4 text-blue-700" />}
                            </div>
                          </div>

                          {/* Month Subheader with month name */}
                          {expandedMonths.has(yearMonth) && (
                            <div className="bg-gray-100 px-6 py-2">
                              <span className="text-sm font-medium text-gray-700">{getMonthName(month)}</span>
                            </div>
                          )}

                          {/* Patients Table */}
                          {expandedMonths.has(yearMonth) && (
                            <div className="overflow-x-auto">
                              <table className="min-w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                  <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data Consulta</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Convênio</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Resposta</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Resolvido</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Observação</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Log</th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                  {monthPatients.map((patient, index) => (
                                    <tr key={patient._id} className={`transition-colors ${index % 2 === 0 ? '' : 'bg-slate-300'} hover:bg-blue-50`}>
                                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                        {patient.dataConsulta}
                                      </td>
                                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                        {patient.nome}
                                      </td>
                                      <td className="px-4 py-3 text-sm text-gray-900">
                                        {patient.convenio || '-'}
                                      </td>
                                      <td className="px-4 py-3 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                          patient.resposta === 'COMPARECEU'
                                            ? 'bg-green-100 text-green-800'
                                            : patient.resposta === 'NÃO COMPARECEU'
                                            ? 'bg-red-100 text-red-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                          {patient.resposta || 'LIMBO'}
                                        </span>
                                      </td>
                                      <td className="px-4 py-3 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                          patient.resolvido && patient.resolvido !== 'LIMBO'
                                            ? 'bg-blue-100 text-blue-800'
                                            : 'bg-gray-100 text-gray-800'
                                        }`}>
                                          {patient.resolvido || 'LIMBO'}
                                        </span>
                                      </td>
                                      <td className="px-4 py-3 text-center relative">
                                        <button
                                          onClick={() => setObservacaoPopover(observacaoPopover === patient._id ? null : patient._id)}
                                          className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded transition-colors"
                                          title="Ver observação"
                                        >
                                          <MessageSquare className="w-5 h-5" />
                                        </button>
                                        {observacaoPopover === patient._id && (
                                          <div className="absolute z-50 right-0 mt-2 w-64 bg-white border border-gray-300 rounded-lg shadow-xl p-4">
                                            <div className="flex items-center justify-between mb-2">
                                              <h4 className="font-semibold text-sm text-gray-900">Observação</h4>
                                              <button onClick={() => setObservacaoPopover(null)} className="text-gray-400 hover:text-gray-600">
                                                ✕
                                              </button>
                                            </div>
                                            <p className="text-sm text-gray-700">
                                              {patient.observacao || 'Sem observações'}
                                            </p>
                                          </div>
                                        )}
                                      </td>
                                      <td className="px-4 py-3 text-center relative">
                                        <button
                                          onClick={() => setLogPopover(logPopover === patient._id ? null : patient._id)}
                                          className="text-purple-600 hover:text-purple-800 p-1 hover:bg-purple-50 rounded transition-colors"
                                          title="Ver log"
                                        >
                                          <FileText className="w-5 h-5" />
                                        </button>
                                        {logPopover === patient._id && (
                                          <div className="absolute z-50 right-0 mt-2 w-80 bg-white border border-gray-300 rounded-lg shadow-xl p-4 max-h-96 overflow-y-auto">
                                            <div className="flex items-center justify-between mb-3">
                                              <h4 className="font-semibold text-sm text-gray-900">Histórico de Alterações</h4>
                                              <button onClick={() => setLogPopover(null)} className="text-gray-400 hover:text-gray-600">
                                                ✕
                                              </button>
                                            </div>
                                            <div className="space-y-2">
                                              {patient.log && patient.log.length > 0 ? (
                                                patient.log.map((entry: any, idx: number) => (
                                                  <div key={idx} className="text-xs border-l-2 border-purple-300 pl-3 py-1">
                                                    <p className="font-medium text-gray-900">{entry.action || 'Ação'}</p>
                                                    <p className="text-gray-600">{entry.timestamp ? new Date(entry.timestamp).toLocaleString('pt-BR') : 'Data não disponível'}</p>
                                                    {entry.details && <p className="text-gray-500 mt-1">{entry.details}</p>}
                                                  </div>
                                                ))
                                              ) : (
                                                <p className="text-sm text-gray-500">Sem histórico de alterações</p>
                                              )}
                                            </div>
                                          </div>
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* Cards View */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredPatients.map((patient) => (
              <div
                key={patient._id}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800 mb-1">{patient.nome}</h3>
                    <p className="text-sm text-gray-500">{patient.convenio || 'Sem convênio'}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    patient.resposta === 'COMPARECEU'
                      ? 'bg-green-100 text-green-800'
                      : patient.resposta === 'NÃO COMPARECEU'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {patient.resposta || 'LIMBO'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                  {/* Data Consulta */}
                  {patient.dataConsulta && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <div>
                        <p className="text-xs text-gray-500">Consulta</p>
                        <p className="font-medium">{patient.dataConsulta}</p>
                      </div>
                    </div>
                  )}

                  {/* Data Cirurgia */}
                  {patient.dataCirurgia && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4 text-red-500" />
                      <div>
                        <p className="text-xs text-gray-500">Cirurgia</p>
                        <p className="font-medium">{patient.dataCirurgia}</p>
                      </div>
                    </div>
                  )}

                  {/* Celular */}
                  {patient.celular && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4 text-green-500" />
                      <div>
                        <p className="text-xs text-gray-500">Celular</p>
                        <p className="font-medium">{patient.celular}</p>
                      </div>
                    </div>
                  )}

                  {/* Sexo */}
                  {patient.sexo && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <UserIcon className="w-4 h-4 text-purple-500" />
                      <div>
                        <p className="text-xs text-gray-500">Sexo</p>
                        <p className="font-medium">{patient.sexo}</p>
                      </div>
                    </div>
                  )}

                  {/* Data Nascimento */}
                  {patient.dataNascimento && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Cake className="w-4 h-4 text-pink-500" />
                      <div>
                        <p className="text-xs text-gray-500">Nascimento</p>
                        <p className="font-medium">{patient.dataNascimento}</p>
                      </div>
                    </div>
                  )}

                  {/* Idade */}
                  {patient.idade && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Cake className="w-4 h-4 text-orange-500" />
                      <div>
                        <p className="text-xs text-gray-500">Idade</p>
                        <p className="font-medium">{patient.idade} anos</p>
                      </div>
                    </div>
                  )}

                  {/* Profissão */}
                  {patient.profissao && (
                    <div className="flex items-center gap-2 text-gray-600 col-span-2">
                      <Briefcase className="w-4 h-4 text-teal-500" />
                      <div>
                        <p className="text-xs text-gray-500">Profissão</p>
                        <p className="font-medium">{patient.profissao}</p>
                      </div>
                    </div>
                  )}

                  {/* Email */}
                  {patient.email && (
                    <div className="flex items-center gap-2 text-gray-600 col-span-2">
                      <Mail className="w-4 h-4 text-indigo-500" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="font-medium truncate">{patient.email}</p>
                      </div>
                    </div>
                  )}

                  {/* Alerta */}
                  {patient.alerta && (
                    <div className="flex items-center gap-2 text-orange-600 col-span-2 bg-orange-50 p-2 rounded">
                      <span>⚠️</span>
                      <span className="font-medium text-xs">{patient.alerta}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => router.push('/patients')}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Ver
                  </button>
                  <button
                    onClick={() => handleDelete(patient._id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    title="Deletar paciente"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
