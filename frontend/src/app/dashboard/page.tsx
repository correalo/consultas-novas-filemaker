'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import { patientService } from '@/services/patientService';
import { Patient } from '@/types';
import Navbar from '@/components/Navbar';
import { Users, Calendar, AlertTriangle, TrendingUp, FileText, ArrowRight, Briefcase, User as UserIcon, Cake, Mail } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const data = await patientService.getAll();
      console.log('📊 Pacientes carregados:', data.length);
      if (data.length > 0) {
        console.log('🔍 Primeiro paciente:', data[0]);
        console.log('📋 Campos disponíveis:', Object.keys(data[0]));
      }
      setPatients(data);
    } catch (err: any) {
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

  const totalResolvidos = patients.filter((p) => p.resolvido && p.resolvido !== 'LIMBO').length;
  const totalComAlerta = patients.filter((p) => p.alerta).length;
  const totalCompareceu = patients.filter((p) => p.resposta === 'COMPARECEU').length;
  const totalNaoCompareceu = patients.filter((p) => p.resposta === 'NÃO COMPARECEU').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard</h1>
          <p className="text-gray-600">Visão geral do sistema de gerenciamento</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando dados...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <Users className="w-8 h-8 opacity-80" />
                  <TrendingUp className="w-5 h-5 opacity-60" />
                </div>
                <p className="text-blue-100 text-sm font-medium mb-1">Total de Pacientes</p>
                <p className="text-4xl font-bold">{patients.length}</p>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <Calendar className="w-8 h-8 opacity-80" />
                  <span className="text-xs bg-white/20 px-2 py-1 rounded-full">{totalCompareceu}</span>
                </div>
                <p className="text-green-100 text-sm font-medium mb-1">Resolvidos</p>
                <p className="text-4xl font-bold">{totalResolvidos}</p>
              </div>

              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <AlertTriangle className="w-8 h-8 opacity-80" />
                  <span className="text-xs bg-white/20 px-2 py-1 rounded-full">{totalNaoCompareceu}</span>
                </div>
                <p className="text-orange-100 text-sm font-medium mb-1">Com Alerta</p>
                <p className="text-4xl font-bold">{totalComAlerta}</p>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <FileText className="w-8 h-8 opacity-80" />
                  <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Hoje</span>
                </div>
                <p className="text-purple-100 text-sm font-medium mb-1">Consultas Hoje</p>
                <p className="text-4xl font-bold">
                  {patients.filter(p => {
                    const today = new Date().toLocaleDateString('pt-BR');
                    return p.dataConsulta === today;
                  }).length}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <button
                onClick={() => router.push('/patients')}
                className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-all group text-left"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-blue-100 rounded-lg p-3">
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                  <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Gerenciar Pacientes</h3>
                <p className="text-gray-600">Visualize, edite e gerencie todos os pacientes cadastrados</p>
              </button>

              <button
                onClick={() => router.push('/patients/new')}
                className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-all group text-left"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-green-100 rounded-lg p-3">
                    <Calendar className="w-8 h-8 text-green-600" />
                  </div>
                  <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Novo Paciente</h3>
                <p className="text-gray-600">Cadastre um novo paciente no sistema</p>
              </button>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Pacientes Recentes</h3>
              {patients.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Nenhum paciente cadastrado ainda</p>
              ) : (
                <div className="space-y-4">
                  {patients.slice(0, 5).map((patient) => (
                    <div
                      key={patient._id}
                      className="p-5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer border border-gray-200"
                      onClick={() => router.push('/patients')}
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center">
                            <Users className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-800 text-lg">{patient.nome}</p>
                            <p className="text-sm text-gray-500">{patient.convenio || 'Sem convênio'}</p>
                          </div>
                        </div>
                        <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                          patient.resposta === 'COMPARECEU'
                            ? 'bg-green-100 text-green-700'
                            : patient.resposta === 'NÃO COMPARECEU'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {patient.resposta || 'LIMBO'}
                        </span>
                      </div>

                      {/* Info Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                        {/* Data Consulta */}
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4 text-blue-500" />
                          <div>
                            <p className="text-xs text-gray-500">Consulta</p>
                            <p className="font-medium">{patient.dataConsulta || '-'}</p>
                          </div>
                        </div>

                        {/* Data Cirurgia */}
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4 text-red-500" />
                          <div>
                            <p className="text-xs text-gray-500">Cirurgia</p>
                            <p className="font-medium">{patient.dataCirurgia || '-'}</p>
                          </div>
                        </div>

                        {/* Sexo */}
                        <div className="flex items-center gap-2 text-gray-600">
                          <UserIcon className="w-4 h-4 text-purple-500" />
                          <div>
                            <p className="text-xs text-gray-500">Sexo</p>
                            <p className="font-medium">{patient.sexo || '-'}</p>
                          </div>
                        </div>

                        {/* Data Nascimento */}
                        <div className="flex items-center gap-2 text-gray-600">
                          <Cake className="w-4 h-4 text-pink-500" />
                          <div>
                            <p className="text-xs text-gray-500">Nascimento</p>
                            <p className="font-medium">{patient.dataNascimento || '-'}</p>
                          </div>
                        </div>

                        {/* Idade */}
                        <div className="flex items-center gap-2 text-gray-600">
                          <Cake className="w-4 h-4 text-orange-500" />
                          <div>
                            <p className="text-xs text-gray-500">Idade</p>
                            <p className="font-medium">{patient.idade ? `${patient.idade} anos` : '-'}</p>
                          </div>
                        </div>

                        {/* Profissão */}
                        <div className="flex items-center gap-2 text-gray-600">
                          <Briefcase className="w-4 h-4 text-green-500" />
                          <div>
                            <p className="text-xs text-gray-500">Profissão</p>
                            <p className="font-medium">{patient.profissao || '-'}</p>
                          </div>
                        </div>

                        {/* Email */}
                        <div className="flex items-center gap-2 text-gray-600 col-span-2">
                          <Mail className="w-4 h-4 text-indigo-500" />
                          <div className="flex-1">
                            <p className="text-xs text-gray-500">Email</p>
                            <p className="font-medium truncate">{patient.email || '-'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
