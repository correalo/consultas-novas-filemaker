'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import { patientService } from '@/services/patientService';
import { Patient } from '@/types';
import Navbar from '@/components/Navbar';
import { RefreshCw, Search, Plus, Edit, Trash2, Eye, Calendar, Phone, Building2, Briefcase, User as UserIcon, Cake, Mail } from 'lucide-react';

export default function PatientsListPage() {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Lista de Pacientes</h1>
          <p className="text-gray-600">Visualize todos os pacientes em formato de lista</p>
        </div>

        {/* Search and Actions */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Buscar por nome, telefone ou convênio..."
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSearch}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 font-medium flex items-center justify-center gap-2"
              >
                <Search className="w-5 h-5" />
                <span className="hidden sm:inline">Buscar</span>
              </button>
              <button
                onClick={loadPatients}
                disabled={loading}
                className="px-6 py-3 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors duration-200 font-medium flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Atualizar</span>
              </button>
              <button
                onClick={() => router.push('/patients/new')}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Novo</span>
              </button>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-gray-600">Visualização:</span>
            <button
              onClick={() => setViewMode('table')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'table'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Tabela
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
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
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-2xl font-bold text-gray-800">{filteredPatients.length}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm text-gray-600">Resolvidos</p>
            <p className="text-2xl font-bold text-green-600">
              {filteredPatients.filter(p => p.resolvido && p.resolvido !== 'LIMBO').length}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm text-gray-600">Compareceram</p>
            <p className="text-2xl font-bold text-blue-600">
              {filteredPatients.filter(p => p.resposta === 'COMPARECEU').length}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm text-gray-600">Com Alerta</p>
            <p className="text-2xl font-bold text-orange-600">
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
          /* Table View */
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data Consulta
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Convênio
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Celular
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPatients.map((patient) => (
                    <tr key={patient._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{patient.nome}</div>
                        {patient.alerta && (
                          <div className="text-xs text-orange-600 flex items-center gap-1 mt-1">
                            <span>⚠️</span>
                            <span>{patient.alerta}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {patient.dataConsulta}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center gap-1">
                          <Building2 className="w-4 h-4 text-gray-400" />
                          {patient.convenio || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center gap-1">
                          <Phone className="w-4 h-4 text-gray-400" />
                          {patient.celular || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          patient.resposta === 'COMPARECEU'
                            ? 'bg-green-100 text-green-800'
                            : patient.resposta === 'NÃO COMPARECEU'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {patient.resposta || 'LIMBO'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => router.push('/patients')}
                            className="text-blue-600 hover:text-blue-900"
                            title="Visualizar"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(patient._id)}
                            className="text-red-600 hover:text-red-900"
                            title="Deletar"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Cards View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
