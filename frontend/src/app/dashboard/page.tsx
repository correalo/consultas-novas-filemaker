'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import { patientService } from '@/services/patientService';
import { Patient } from '@/types';
import Navbar from '@/components/Navbar';
import PatientCarousel from '@/components/PatientCarousel';
import PatientFormFileMaker from '@/components/PatientFormFileMaker';
import { RefreshCw, Search, Plus } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

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

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === patients.length - 1 ? 0 : prev + 1));
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? patients.length - 1 : prev - 1));
  };

  return (
    <div className="min-h-screen bg-gray-200">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard</h1>
          <p className="text-gray-600">Visualize e gerencie seus pacientes</p>
        </div>

        {/* Search and Actions */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
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
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 font-medium flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" />
              Buscar
            </button>
            <button
              onClick={loadPatients}
              disabled={loading}
              className="px-6 py-3 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors duration-200 font-medium flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              Atualizar
            </button>
          </div>
        </div>

        {/* Stats */}
        {!loading && patients.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
              <p className="text-blue-100 text-sm font-medium mb-1">Total de Pacientes</p>
              <p className="text-4xl font-bold">{patients.length}</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
              <p className="text-green-100 text-sm font-medium mb-1">Resolvidos</p>
              <p className="text-4xl font-bold">
                {patients.filter((p) => p.resolvido && p.resolvido !== 'LIMBO').length}
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
              <p className="text-purple-100 text-sm font-medium mb-1">Com Alerta</p>
              <p className="text-4xl font-bold">
                {patients.filter((p) => p.alerta).length}
              </p>
            </div>
          </div>
        )}

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
        ) : patients.length === 0 ? (
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
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  loadPatients();
                }}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Limpar Busca
              </button>
            )}
          </div>
        ) : (
          <PatientFormFileMaker 
            patient={patients[currentIndex]} 
            onUpdate={loadPatients}
            onNext={handleNext}
            onPrevious={handlePrevious}
            currentIndex={currentIndex}
            totalPatients={patients.length}
          />
        )}
      </main>
    </div>
  );
}
