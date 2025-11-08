'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import { patientService } from '@/services/patientService';
import { Patient } from '@/types';
import Navbar from '@/components/Navbar';
import PatientFormFileMaker from '@/components/PatientFormFileMaker';
import { RefreshCw, Search, Plus, Calendar, Filter, Clock, TrendingUp, BarChart3 } from 'lucide-react';

type FilterPeriod = '7d' | '30d' | '3m' | '6m' | '9m' | '12m' | '15m' | '18m' | '2y' | '3y' | '4y' | '5y' | '6y' | '7y' | '8y' | '9y' | '10y' | '6y+' | 'all';

export default function PatientsPage() {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [allPatients, setAllPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeFilter, setActiveFilter] = useState<FilterPeriod>('all');
  const [showYearsPopover, setShowYearsPopover] = useState(false);
  const [showStatusPopover, setShowStatusPopover] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const loadPatients = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await patientService.getAll();
      setAllPatients(data);
      setPatients(data);
    } catch (err: any) {
      setError('Erro ao carregar pacientes. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterByPeriod = (period: FilterPeriod) => {
    setActiveFilter(period);
    
    if (period === 'all') {
      setPatients(allPatients);
      return;
    }

    const now = new Date();
    let startDate = new Date();

    // Calcular data de início baseado no período
    switch (period) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '3m':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case '6m':
        startDate.setMonth(now.getMonth() - 6);
        break;
      case '9m':
        startDate.setMonth(now.getMonth() - 9);
        break;
      case '12m':
        startDate.setMonth(now.getMonth() - 12);
        break;
      case '15m':
        startDate.setMonth(now.getMonth() - 15);
        break;
      case '18m':
        startDate.setMonth(now.getMonth() - 18);
        break;
      case '2y':
        startDate.setFullYear(now.getFullYear() - 2);
        break;
      case '3y':
        startDate.setFullYear(now.getFullYear() - 3);
        break;
      case '4y':
        startDate.setFullYear(now.getFullYear() - 4);
        break;
      case '5y':
        startDate.setFullYear(now.getFullYear() - 5);
        break;
      case '6y':
        startDate.setFullYear(now.getFullYear() - 6);
        break;
      case '7y':
        startDate.setFullYear(now.getFullYear() - 7);
        break;
      case '8y':
        startDate.setFullYear(now.getFullYear() - 8);
        break;
      case '9y':
        startDate.setFullYear(now.getFullYear() - 9);
        break;
      case '10y':
        startDate.setFullYear(now.getFullYear() - 10);
        break;
      case '6y+':
        startDate.setFullYear(now.getFullYear() - 100); // Mais de 6 anos = tudo antes de 6 anos atrás
        break;
    }

    // Filtrar pacientes pela data da consulta
    const filtered = allPatients.filter(patient => {
      if (!patient.dataConsulta) return false;
      
      try {
        const [day, month, year] = patient.dataConsulta.split('/');
        const consultaDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        return consultaDate >= startDate && consultaDate <= now;
      } catch (e) {
        return false;
      }
    });

    setPatients(filtered);
  };

  const filterByStatus = (year: string, status: string) => {
    const filterKey = `${year}_${status}`;
    setStatusFilter(filterKey);
    setShowStatusPopover(false);
    
    // Filtrar pacientes pelo ano e status
    const filtered = allPatients.filter(patient => {
      if (!patient.dataConsulta) return false;
      
      try {
        const [day, month, yearStr] = patient.dataConsulta.split('/');
        const consultaYear = parseInt(yearStr);
        
        // Verificar se o ano corresponde
        if (consultaYear.toString() !== year) return false;
        
        // Verificar status usando os campos disponíveis
        const patientStatus = (patient.resolvido || patient.classificacao || '').toUpperCase();
        
        return patientStatus.includes(status.toUpperCase());
      } catch (e) {
        return false;
      }
    });
    
    setPatients(filtered);
  };

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    loadPatients();
  }, [router]);

  useEffect(() => {
    console.log('Estado showStatusPopover mudou para:', showStatusPopover);
  }, [showStatusPopover]);

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
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Gerenciar Pacientes</h1>
          <p className="text-gray-600">Visualize, edite e gerencie todos os pacientes cadastrados</p>
        </div>

        {/* Filter Bar - FileMaker Style */}
        <div className="bg-gradient-to-b from-gray-100 to-gray-200 border border-gray-300 rounded-lg shadow-sm p-3 mb-6">
          {/* Primeira linha - 7 DIAS até 9 MESES (5 em mobile, 8 em desktop) */}
          <div className="grid grid-cols-5 lg:grid-cols-8 gap-2 mb-2">
            <button
              onClick={() => filterByPeriod('7d')}
              className={`min-w-[60px] px-2 py-1.5 rounded border text-xs font-bold transition-all ${
                activeFilter === '7d'
                  ? 'bg-gradient-to-b from-orange-400 to-orange-500 text-white border-orange-600 shadow-lg'
                  : 'bg-gradient-to-b from-orange-100 to-orange-200 text-orange-800 border-orange-300 hover:from-orange-200 hover:to-orange-300 shadow-sm'
              }`}
            >
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-lg font-bold">7</span>
                <span className="text-[10px]">DIAS</span>
              </div>
            </button>
            <button
              onClick={() => filterByPeriod('30d')}
              className={`min-w-[60px] px-2 py-1.5 rounded border text-xs font-bold transition-all ${
                activeFilter === '30d'
                  ? 'bg-gradient-to-b from-amber-400 to-amber-500 text-white border-amber-600 shadow-lg'
                  : 'bg-gradient-to-b from-amber-100 to-amber-200 text-amber-800 border-amber-300 hover:from-amber-200 hover:to-amber-300 shadow-sm'
              }`}
            >
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-lg font-bold">30</span>
                <span className="text-[10px]">DIAS</span>
              </div>
            </button>
            <button
              onClick={() => filterByPeriod('3m')}
              className={`min-w-[60px] px-2 py-1.5 rounded border text-xs font-bold transition-all ${
                activeFilter === '3m'
                  ? 'bg-gradient-to-b from-blue-400 to-blue-500 text-white border-blue-600 shadow-lg'
                  : 'bg-gradient-to-b from-blue-100 to-blue-200 text-blue-800 border-blue-300 hover:from-blue-200 hover:to-blue-300 shadow-sm'
              }`}
            >
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-lg font-bold">3</span>
                <span className="text-[10px]">MESES</span>
              </div>
            </button>
            <button
              onClick={() => filterByPeriod('6m')}
              className={`min-w-[60px] px-2 py-1.5 rounded border text-xs font-bold transition-all ${
                activeFilter === '6m'
                  ? 'bg-gradient-to-b from-cyan-400 to-cyan-500 text-white border-cyan-600 shadow-lg'
                  : 'bg-gradient-to-b from-cyan-100 to-cyan-200 text-cyan-800 border-cyan-300 hover:from-cyan-200 hover:to-cyan-300 shadow-sm'
              }`}
            >
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-lg font-bold">6</span>
                <span className="text-[10px]">MESES</span>
              </div>
            </button>
            <button
              onClick={() => filterByPeriod('9m')}
              className={`min-w-[60px] px-2 py-1.5 rounded border text-xs font-bold transition-all ${
                activeFilter === '9m'
                  ? 'bg-gradient-to-b from-teal-400 to-teal-500 text-white border-teal-600 shadow-lg'
                  : 'bg-gradient-to-b from-teal-100 to-teal-200 text-teal-800 border-teal-300 hover:from-teal-200 hover:to-teal-300 shadow-sm'
              }`}
            >
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-lg font-bold">9</span>
                <span className="text-[10px]">MESES</span>
              </div>
            </button>
            
            {/* 12M, 15M, 18M - Aparecem na primeira linha em desktop, segunda em mobile */}
            <button
              onClick={() => filterByPeriod('12m')}
              className={`min-w-[60px] px-2 py-1.5 rounded border text-xs font-bold transition-all hidden lg:block ${
                activeFilter === '12m'
                  ? 'bg-gradient-to-b from-emerald-400 to-emerald-500 text-white border-emerald-600 shadow-lg'
                  : 'bg-gradient-to-b from-emerald-100 to-emerald-200 text-emerald-800 border-emerald-300 hover:from-emerald-200 hover:to-emerald-300 shadow-sm'
              }`}
            >
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-lg font-bold">12</span>
                <span className="text-[10px]">MESES</span>
              </div>
            </button>
            <button
              onClick={() => filterByPeriod('15m')}
              className={`min-w-[60px] px-2 py-1.5 rounded border text-xs font-bold transition-all hidden lg:block ${
                activeFilter === '15m'
                  ? 'bg-gradient-to-b from-green-400 to-green-500 text-white border-green-600 shadow-lg'
                  : 'bg-gradient-to-b from-green-100 to-green-200 text-green-800 border-green-300 hover:from-green-200 hover:to-green-300 shadow-sm'
              }`}
            >
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-lg font-bold">15</span>
                <span className="text-[10px]">MESES</span>
              </div>
            </button>
            <button
              onClick={() => filterByPeriod('18m')}
              className={`min-w-[60px] px-2 py-1.5 rounded border text-xs font-bold transition-all hidden lg:block ${
                activeFilter === '18m'
                  ? 'bg-gradient-to-b from-lime-400 to-lime-500 text-white border-lime-600 shadow-lg'
                  : 'bg-gradient-to-b from-lime-100 to-lime-200 text-lime-800 border-lime-300 hover:from-lime-200 hover:to-lime-300 shadow-sm'
              }`}
            >
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-lg font-bold">18</span>
                <span className="text-[10px]">MESES</span>
              </div>
            </button>
          </div>

          {/* Segunda linha - 12M, 15M, 18M, 2 ANOS, 3 ANOS (mobile) / 2-5 ANOS (desktop) */}
          <div className="grid grid-cols-5 lg:grid-cols-8 gap-2 mb-2">
            {/* 12M, 15M, 18M - Aparecem na segunda linha em mobile */}
            <button
              onClick={() => filterByPeriod('12m')}
              className={`min-w-[60px] px-2 py-1.5 rounded border text-xs font-bold transition-all lg:hidden ${
                activeFilter === '12m'
                  ? 'bg-gradient-to-b from-emerald-400 to-emerald-500 text-white border-emerald-600 shadow-lg'
                  : 'bg-gradient-to-b from-emerald-100 to-emerald-200 text-emerald-800 border-emerald-300 hover:from-emerald-200 hover:to-emerald-300 shadow-sm'
              }`}
            >
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-lg font-bold">12</span>
                <span className="text-[10px]">MESES</span>
              </div>
            </button>
            <button
              onClick={() => filterByPeriod('15m')}
              className={`min-w-[60px] px-2 py-1.5 rounded border text-xs font-bold transition-all lg:hidden ${
                activeFilter === '15m'
                  ? 'bg-gradient-to-b from-green-400 to-green-500 text-white border-green-600 shadow-lg'
                  : 'bg-gradient-to-b from-green-100 to-green-200 text-green-800 border-green-300 hover:from-green-200 hover:to-green-300 shadow-sm'
              }`}
            >
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-lg font-bold">15</span>
                <span className="text-[10px]">MESES</span>
              </div>
            </button>
            <button
              onClick={() => filterByPeriod('18m')}
              className={`min-w-[60px] px-2 py-1.5 rounded border text-xs font-bold transition-all lg:hidden ${
                activeFilter === '18m'
                  ? 'bg-gradient-to-b from-lime-400 to-lime-500 text-white border-lime-600 shadow-lg'
                  : 'bg-gradient-to-b from-lime-100 to-lime-200 text-lime-800 border-lime-300 hover:from-lime-200 hover:to-lime-300 shadow-sm'
              }`}
            >
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-lg font-bold">18</span>
                <span className="text-[10px]">MESES</span>
              </div>
            </button>
            
            <button
              onClick={() => filterByPeriod('2y')}
              className={`min-w-[60px] px-2 py-1.5 rounded border text-xs font-bold transition-all ${
                activeFilter === '2y'
                  ? 'bg-gradient-to-b from-purple-400 to-purple-500 text-white border-purple-600 shadow-lg'
                  : 'bg-gradient-to-b from-purple-100 to-purple-200 text-purple-800 border-purple-300 hover:from-purple-200 hover:to-purple-300 shadow-sm'
              }`}
            >
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-lg font-bold">2</span>
                <span className="text-[10px]">ANOS</span>
              </div>
            </button>
            <button
              onClick={() => filterByPeriod('3y')}
              className={`min-w-[60px] px-2 py-1.5 rounded border text-xs font-bold transition-all ${
                activeFilter === '3y'
                  ? 'bg-gradient-to-b from-violet-400 to-violet-500 text-white border-violet-600 shadow-lg'
                  : 'bg-gradient-to-b from-violet-100 to-violet-200 text-violet-800 border-violet-300 hover:from-violet-200 hover:to-violet-300 shadow-sm'
              }`}
            >
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-lg font-bold">3</span>
                <span className="text-[10px]">ANOS</span>
              </div>
            </button>
            <button
              onClick={() => filterByPeriod('4y')}
              className={`min-w-[60px] px-2 py-1.5 rounded border text-xs font-bold transition-all hidden lg:block ${
                activeFilter === '4y'
                  ? 'bg-gradient-to-b from-fuchsia-400 to-fuchsia-500 text-white border-fuchsia-600 shadow-lg'
                  : 'bg-gradient-to-b from-fuchsia-100 to-fuchsia-200 text-fuchsia-800 border-fuchsia-300 hover:from-fuchsia-200 hover:to-fuchsia-300 shadow-sm'
              }`}
            >
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-lg font-bold">4</span>
                <span className="text-[10px]">ANOS</span>
              </div>
            </button>
            <button
              onClick={() => filterByPeriod('5y')}
              className={`min-w-[60px] px-2 py-1.5 rounded border text-xs font-bold transition-all hidden lg:block ${
                activeFilter === '5y'
                  ? 'bg-gradient-to-b from-pink-400 to-pink-500 text-white border-pink-600 shadow-lg'
                  : 'bg-gradient-to-b from-pink-100 to-pink-200 text-pink-800 border-pink-300 hover:from-pink-200 hover:to-pink-300 shadow-sm'
              }`}
            >
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-lg font-bold">5</span>
                <span className="text-[10px]">ANOS</span>
              </div>
            </button>
            
            {/* Botão > 6 ANOS com Popover */}
            <div className="relative hidden lg:block">
              <button
                onClick={() => setShowYearsPopover(!showYearsPopover)}
                className={`w-full px-2 py-1.5 rounded border text-xs font-bold transition-all ${
                  activeFilter === '6y+' || activeFilter === '6y' || activeFilter === '7y' || activeFilter === '8y' || activeFilter === '9y' || activeFilter === '10y'
                    ? 'bg-gradient-to-b from-red-500 to-red-600 text-white border-red-700 shadow-lg'
                    : 'bg-gradient-to-b from-red-100 to-red-200 text-red-800 border-red-300 hover:from-red-200 hover:to-red-300 shadow-sm'
                }`}
              >
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-lg font-bold">&gt; 6</span>
                  <span className="text-[10px]">ANOS</span>
                </div>
              </button>
              
              {/* Popover com anos individuais */}
              {showYearsPopover && (
                <>
                  {/* Overlay para fechar ao clicar fora */}
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowYearsPopover(false)}
                  ></div>
                  
                  {/* Popover */}
                  <div className="absolute top-full left-0 mt-2 z-20 bg-white border-2 border-gray-400 rounded-lg shadow-xl p-2 min-w-[200px]">
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => {
                          filterByPeriod('6y');
                          setShowYearsPopover(false);
                        }}
                        className={`w-full px-4 py-2 rounded border text-sm font-bold transition-all text-left ${
                          activeFilter === '6y'
                            ? 'bg-gradient-to-b from-rose-400 to-rose-500 text-white border-rose-600 shadow-md'
                            : 'bg-gradient-to-b from-white to-gray-50 text-gray-700 border-gray-300 hover:from-gray-50 hover:to-gray-100'
                        }`}
                      >
                        6 ANOS
                      </button>
                      <button
                        onClick={() => {
                          filterByPeriod('7y');
                          setShowYearsPopover(false);
                        }}
                        className={`w-full px-4 py-2 rounded border text-sm font-bold transition-all text-left ${
                          activeFilter === '7y'
                            ? 'bg-gradient-to-b from-indigo-400 to-indigo-500 text-white border-indigo-600 shadow-md'
                            : 'bg-gradient-to-b from-white to-gray-50 text-gray-700 border-gray-300 hover:from-gray-50 hover:to-gray-100'
                        }`}
                      >
                        7 ANOS
                      </button>
                      <button
                        onClick={() => {
                          filterByPeriod('8y');
                          setShowYearsPopover(false);
                        }}
                        className={`w-full px-4 py-2 rounded border text-sm font-bold transition-all text-left ${
                          activeFilter === '8y'
                            ? 'bg-gradient-to-b from-sky-400 to-sky-500 text-white border-sky-600 shadow-md'
                            : 'bg-gradient-to-b from-white to-gray-50 text-gray-700 border-gray-300 hover:from-gray-50 hover:to-gray-100'
                        }`}
                      >
                        8 ANOS
                      </button>
                      <button
                        onClick={() => {
                          filterByPeriod('9y');
                          setShowYearsPopover(false);
                        }}
                        className={`w-full px-4 py-2 rounded border text-sm font-bold transition-all text-left ${
                          activeFilter === '9y'
                            ? 'bg-gradient-to-b from-slate-400 to-slate-500 text-white border-slate-600 shadow-md'
                            : 'bg-gradient-to-b from-white to-gray-50 text-gray-700 border-gray-300 hover:from-gray-50 hover:to-gray-100'
                        }`}
                      >
                        9 ANOS
                      </button>
                      <button
                        onClick={() => {
                          filterByPeriod('10y');
                          setShowYearsPopover(false);
                        }}
                        className={`w-full px-4 py-2 rounded border text-sm font-bold transition-all text-left ${
                          activeFilter === '10y'
                            ? 'bg-gradient-to-b from-gray-400 to-gray-500 text-white border-gray-600 shadow-md'
                            : 'bg-gradient-to-b from-white to-gray-50 text-gray-700 border-gray-300 hover:from-gray-50 hover:to-gray-100'
                        }`}
                      >
                        10 ANOS
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Botão Todos - Desktop */}
            <button
              onClick={() => filterByPeriod('all')}
              className={`min-w-[60px] px-2 py-1.5 rounded border text-xs font-bold transition-all hidden lg:block ${
                activeFilter === 'all'
                  ? 'bg-gradient-to-b from-green-500 to-green-600 text-white border-green-700 shadow-lg'
                  : 'bg-gradient-to-b from-green-100 to-green-200 text-green-800 border-green-300 hover:from-green-200 hover:to-green-300 shadow-sm'
              }`}
            >
              <div className="flex flex-col items-center gap-0.5">
                <BarChart3 className="w-6 h-6" />
                <span className="text-[10px]">TODOS</span>
              </div>
            </button>
            
            {/* Botão Filtro de Status - Desktop */}
            <div className="relative h-full hidden lg:block">
              <button
                onClick={() => {
                  console.log('Clicou no botão STATUS, estado atual:', showStatusPopover);
                  setShowStatusPopover(!showStatusPopover);
                }}
                className={`w-full h-full px-2 py-1.5 rounded border text-xs font-bold transition-all ${
                  statusFilter
                    ? 'bg-gradient-to-b from-blue-500 to-blue-600 text-white border-blue-700 shadow-lg'
                    : 'bg-gradient-to-b from-blue-100 to-blue-200 text-blue-800 border-blue-300 hover:from-blue-200 hover:to-blue-300 shadow-sm'
                }`}
              >
                <div className="flex flex-col items-center justify-center gap-0.5 h-full">
                  <Filter className="w-6 h-6" />
                  <span className="text-[10px]">STATUS</span>
                </div>
              </button>
              
              {/* Popover com filtros de status */}
              {showStatusPopover && (
                <>
                  {/* Overlay para fechar ao clicar fora */}
                  <div 
                    className="fixed inset-0 z-[100]" 
                    onClick={() => {
                      console.log('Clicou no overlay');
                      setShowStatusPopover(false);
                    }}
                  ></div>
                  
                  {/* Popover */}
                  <div className="absolute top-full right-0 mt-2 z-[101] bg-white border-2 border-gray-400 rounded-lg shadow-2xl p-3 w-[650px] max-h-[600px] overflow-y-auto">
                    <div className="grid grid-cols-3 gap-2">
                      {/* Coluna 1: 2026-2022 (5 anos) */}
                      <div className="space-y-1">
                        {/* 2026 - Roxo */}
                        <div className="space-y-1">
                          <button onClick={() => filterByStatus('2026', 'OPERADO')} className="w-full px-3 py-2 rounded border text-xs font-bold bg-gradient-to-b from-purple-200 to-purple-300 text-purple-900 border-purple-400 hover:from-purple-300 hover:to-purple-400 text-left">
                            2026 OPERADO
                          </button>
                          <button onClick={() => filterByStatus('2026', 'COMPARECEU NÃO OP')} className="w-full px-3 py-2 rounded border text-xs font-bold bg-gradient-to-b from-purple-200 to-purple-300 text-purple-900 border-purple-400 hover:from-purple-300 hover:to-purple-400 text-left">
                            2026 COMPARECEU NÃO OP
                          </button>
                          <button onClick={() => filterByStatus('2026', 'DESISTIU')} className="w-full px-3 py-2 rounded border text-xs font-bold bg-gradient-to-b from-purple-200 to-purple-300 text-purple-900 border-purple-400 hover:from-purple-300 hover:to-purple-400 text-left">
                            2026 DESISTIU
                          </button>
                          <button onClick={() => filterByStatus('2026', 'NÃO COMPARECEU')} className="w-full px-3 py-2 rounded border text-xs font-bold bg-gradient-to-b from-purple-200 to-purple-300 text-purple-900 border-purple-400 hover:from-purple-300 hover:to-purple-400 text-left">
                            2026 NÃO COMPARECEU
                          </button>
                          <button onClick={() => filterByStatus('2026', 'PARTICULAR NÃO OP')} className="w-full px-3 py-2 rounded border text-xs font-bold bg-gradient-to-b from-purple-200 to-purple-300 text-purple-900 border-purple-400 hover:from-purple-300 hover:to-purple-400 text-left">
                            2026 PARTICULAR NÃO OP
                          </button>
                          <button onClick={() => filterByStatus('2026', 'LIMBO')} className="w-full px-3 py-2 rounded border text-xs font-bold bg-gradient-to-b from-purple-200 to-purple-300 text-purple-900 border-purple-400 hover:from-purple-300 hover:to-purple-400 text-left">
                            2026 LIMBO
                          </button>
                        </div>
                        
                        {/* 2025 - Verde */}
                        <div className="space-y-1">
                          <button onClick={() => filterByStatus('2025', 'OPERADO')} className="w-full px-3 py-2 rounded border text-xs font-bold bg-gradient-to-b from-green-200 to-green-300 text-green-900 border-green-400 hover:from-green-300 hover:to-green-400 text-left">
                            2025 OPERADO
                          </button>
                          <button onClick={() => filterByStatus('2025', 'COMPARECEU NÃO OP')} className="w-full px-3 py-2 rounded border text-xs font-bold bg-gradient-to-b from-green-200 to-green-300 text-green-900 border-green-400 hover:from-green-300 hover:to-green-400 text-left">
                            2025 COMPARECEU NÃO OP
                          </button>
                          <button onClick={() => filterByStatus('2025', 'DESISTIU')} className="w-full px-3 py-2 rounded border text-xs font-bold bg-gradient-to-b from-green-200 to-green-300 text-green-900 border-green-400 hover:from-green-300 hover:to-green-400 text-left">
                            2025 DESISTIU
                          </button>
                          <button onClick={() => filterByStatus('2025', 'NÃO COMPARECEU')} className="w-full px-3 py-2 rounded border text-xs font-bold bg-gradient-to-b from-green-200 to-green-300 text-green-900 border-green-400 hover:from-green-300 hover:to-green-400 text-left">
                            2025 NÃO COMPARECEU
                          </button>
                          <button onClick={() => filterByStatus('2025', 'PARTICULAR NÃO OP')} className="w-full px-3 py-2 rounded border text-xs font-bold bg-gradient-to-b from-green-200 to-green-300 text-green-900 border-green-400 hover:from-green-300 hover:to-green-400 text-left">
                            2025 PARTICULAR NÃO OP
                          </button>
                          <button onClick={() => filterByStatus('2025', 'LIMBO')} className="w-full px-3 py-2 rounded border text-xs font-bold bg-gradient-to-b from-green-200 to-green-300 text-green-900 border-green-400 hover:from-green-300 hover:to-green-400 text-left">
                            2025 LIMBO
                          </button>
                        </div>
                        
                        {/* 2024 - Azul Claro */}
                        <div className="space-y-1">
                          <button onClick={() => filterByStatus('2024', 'OPERADO')} className="w-full px-3 py-2 rounded border text-xs font-bold bg-gradient-to-b from-cyan-200 to-cyan-300 text-cyan-900 border-cyan-400 hover:from-cyan-300 hover:to-cyan-400 text-left">
                            2024 OPERADO
                          </button>
                          <button onClick={() => filterByStatus('2024', 'COMPARECEU NÃO OP')} className="w-full px-3 py-2 rounded border text-xs font-bold bg-gradient-to-b from-cyan-200 to-cyan-300 text-cyan-900 border-cyan-400 hover:from-cyan-300 hover:to-cyan-400 text-left">
                            2024 COMPARECEU NÃO OP
                          </button>
                          <button onClick={() => filterByStatus('2024', 'DESISTIU')} className="w-full px-3 py-2 rounded border text-xs font-bold bg-gradient-to-b from-cyan-200 to-cyan-300 text-cyan-900 border-cyan-400 hover:from-cyan-300 hover:to-cyan-400 text-left">
                            2024 DESISTIU
                          </button>
                          <button onClick={() => filterByStatus('2024', 'NÃO COMPARECEU')} className="w-full px-3 py-2 rounded border text-xs font-bold bg-gradient-to-b from-cyan-200 to-cyan-300 text-cyan-900 border-cyan-400 hover:from-cyan-300 hover:to-cyan-400 text-left">
                            2024 NÃO COMPARECEU
                          </button>
                          <button onClick={() => filterByStatus('2024', 'PARTICULAR NÃO OP')} className="w-full px-3 py-2 rounded border text-xs font-bold bg-gradient-to-b from-cyan-200 to-cyan-300 text-cyan-900 border-cyan-400 hover:from-cyan-300 hover:to-cyan-400 text-left">
                            2024 PARTICULAR NÃO OP
                          </button>
                          <button onClick={() => filterByStatus('2024', 'LIMBO')} className="w-full px-3 py-2 rounded border text-xs font-bold bg-gradient-to-b from-cyan-200 to-cyan-300 text-cyan-900 border-cyan-400 hover:from-cyan-300 hover:to-cyan-400 text-left">
                            2024 LIMBO
                          </button>
                        </div>
                        
                        {/* 2023 - Verde Escuro */}
                        <div className="space-y-1">
                          <button onClick={() => filterByStatus('2023', 'OPERADO')} className="w-full px-3 py-2 rounded border text-xs font-bold bg-gradient-to-b from-emerald-200 to-emerald-300 text-emerald-900 border-emerald-400 hover:from-emerald-300 hover:to-emerald-400 text-left">
                            2023 OPERADO
                          </button>
                          <button onClick={() => filterByStatus('2023', 'COMPARECEU NÃO OP')} className="w-full px-3 py-2 rounded border text-xs font-bold bg-gradient-to-b from-emerald-200 to-emerald-300 text-emerald-900 border-emerald-400 hover:from-emerald-300 hover:to-emerald-400 text-left">
                            2023 COMPARECEU NÃO OP
                          </button>
                          <button onClick={() => filterByStatus('2023', 'DESISTIU')} className="w-full px-3 py-2 rounded border text-xs font-bold bg-gradient-to-b from-emerald-200 to-emerald-300 text-emerald-900 border-emerald-400 hover:from-emerald-300 hover:to-emerald-400 text-left">
                            2023 DESISTIU
                          </button>
                          <button onClick={() => filterByStatus('2023', 'NÃO COMPARECEU')} className="w-full px-3 py-2 rounded border text-xs font-bold bg-gradient-to-b from-emerald-200 to-emerald-300 text-emerald-900 border-emerald-400 hover:from-emerald-300 hover:to-emerald-400 text-left">
                            2023 NÃO COMPARECEU
                          </button>
                          <button onClick={() => filterByStatus('2023', 'PARTICULAR NÃO OP')} className="w-full px-3 py-2 rounded border text-xs font-bold bg-gradient-to-b from-emerald-200 to-emerald-300 text-emerald-900 border-emerald-400 hover:from-emerald-300 hover:to-emerald-400 text-left">
                            2023 PARTICULAR NÃO OP
                          </button>
                          <button onClick={() => filterByStatus('2023', 'LIMBO')} className="w-full px-3 py-2 rounded border text-xs font-bold bg-gradient-to-b from-emerald-200 to-emerald-300 text-emerald-900 border-emerald-400 hover:from-emerald-300 hover:to-emerald-400 text-left">
                            2023 LIMBO
                          </button>
                        </div>
                        
                        {/* 2022 - Amarelo */}
                        <div className="space-y-1">
                          <button onClick={() => filterByStatus('2022', 'OPERADO')} className="w-full px-3 py-2 rounded border text-xs font-bold bg-gradient-to-b from-yellow-200 to-yellow-300 text-yellow-900 border-yellow-400 hover:from-yellow-300 hover:to-yellow-400 text-left">
                            2022 OPERADO
                          </button>
                          <button onClick={() => filterByStatus('2022', 'COMPARECEU NÃO OP')} className="w-full px-3 py-2 rounded border text-xs font-bold bg-gradient-to-b from-yellow-200 to-yellow-300 text-yellow-900 border-yellow-400 hover:from-yellow-300 hover:to-yellow-400 text-left">
                            2022 COMPARECEU NÃO OP
                          </button>
                          <button onClick={() => filterByStatus('2022', 'DESISTIU')} className="w-full px-3 py-2 rounded border text-xs font-bold bg-gradient-to-b from-yellow-200 to-yellow-300 text-yellow-900 border-yellow-400 hover:from-yellow-300 hover:to-yellow-400 text-left">
                            2022 DESISTIU
                          </button>
                          <button onClick={() => filterByStatus('2022', 'NÃO COMPARECEU')} className="w-full px-3 py-2 rounded border text-xs font-bold bg-gradient-to-b from-yellow-200 to-yellow-300 text-yellow-900 border-yellow-400 hover:from-yellow-300 hover:to-yellow-400 text-left">
                            2022 NÃO COMPARECEU
                          </button>
                          <button onClick={() => filterByStatus('2022', 'PARTICULAR NÃO OP')} className="w-full px-3 py-2 rounded border text-xs font-bold bg-gradient-to-b from-yellow-200 to-yellow-300 text-yellow-900 border-yellow-400 hover:from-yellow-300 hover:to-yellow-400 text-left">
                            2022 PARTICULAR NÃO OP
                          </button>
                          <button onClick={() => filterByStatus('2022', 'LIMBO')} className="w-full px-3 py-2 rounded border text-xs font-bold bg-gradient-to-b from-yellow-200 to-yellow-300 text-yellow-900 border-yellow-400 hover:from-yellow-300 hover:to-yellow-400 text-left">
                            2022 LIMBO
                          </button>
                        </div>
                      </div>
                      
                      {/* Coluna 2: 2021-2017 (5 anos) */}
                      <div className="space-y-1">
                        {/* 2021 - Rosa */}
                        <div className="space-y-1">
                          <button onClick={() => filterByStatus('2021', 'OPERADO')} className="w-full px-3 py-2 rounded border text-xs font-bold bg-gradient-to-b from-pink-200 to-pink-300 text-pink-900 border-pink-400 hover:from-pink-300 hover:to-pink-400 text-left">
                            2021 OPERADO
                          </button>
                          <button onClick={() => filterByStatus('2021', 'COMPARECEU NÃO OP')} className="w-full px-3 py-2 rounded border text-xs font-bold bg-gradient-to-b from-pink-200 to-pink-300 text-pink-900 border-pink-400 hover:from-pink-300 hover:to-pink-400 text-left">
                            2021 COMPARECEU NÃO OP
                          </button>
                          <button onClick={() => filterByStatus('2021', 'DESISTIU')} className="w-full px-3 py-2 rounded border text-xs font-bold bg-gradient-to-b from-pink-200 to-pink-300 text-pink-900 border-pink-400 hover:from-pink-300 hover:to-pink-400 text-left">
                            2021 DESISTIU
                          </button>
                          <button onClick={() => filterByStatus('2021', 'NÃO COMPARECEU')} className="w-full px-3 py-2 rounded border text-xs font-bold bg-gradient-to-b from-pink-200 to-pink-300 text-pink-900 border-pink-400 hover:from-pink-300 hover:to-pink-400 text-left">
                            2021 NÃO COMPARECEU
                          </button>
                          <button onClick={() => filterByStatus('2021', 'PARTICULAR NÃO OP')} className="w-full px-3 py-2 rounded border text-xs font-bold bg-gradient-to-b from-pink-200 to-pink-300 text-pink-900 border-pink-400 hover:from-pink-300 hover:to-pink-400 text-left">
                            2021 PARTICULAR NÃO OP
                          </button>
                          <button onClick={() => filterByStatus('2021', 'LIMBO')} className="w-full px-3 py-2 rounded border text-xs font-bold bg-gradient-to-b from-pink-200 to-pink-300 text-pink-900 border-pink-400 hover:from-pink-300 hover:to-pink-400 text-left">
                            2021 LIMBO
                          </button>
                        </div>
                        
                        {/* 2020 - Vermelho */}
                        <div className="space-y-1">
                          <button onClick={() => filterByStatus('2020', 'OPERADO')} className="w-full px-3 py-2 rounded border text-xs font-bold bg-gradient-to-b from-red-200 to-red-300 text-red-900 border-red-400 hover:from-red-300 hover:to-red-400 text-left">
                            2020 OPERADO
                          </button>
                          <button onClick={() => filterByStatus('2020', 'COMPARECEU NÃO OP')} className="w-full px-3 py-2 rounded border text-xs font-bold bg-gradient-to-b from-red-200 to-red-300 text-red-900 border-red-400 hover:from-red-300 hover:to-red-400 text-left">
                            2020 COMPARECEU NÃO OP
                          </button>
                          <button onClick={() => filterByStatus('2020', 'DESISTIU')} className="w-full px-3 py-2 rounded border text-xs font-bold bg-gradient-to-b from-red-200 to-red-300 text-red-900 border-red-400 hover:from-red-300 hover:to-red-400 text-left">
                            2020 DESISTIU
                          </button>
                          <button onClick={() => filterByStatus('2020', 'NÃO COMPARECEU')} className="w-full px-3 py-2 rounded border text-xs font-bold bg-gradient-to-b from-red-200 to-red-300 text-red-900 border-red-400 hover:from-red-300 hover:to-red-400 text-left">
                            2020 NÃO COMPARECEU
                          </button>
                          <button onClick={() => filterByStatus('2020', 'PARTICULAR NÃO OP')} className="w-full px-3 py-2 rounded border text-xs font-bold bg-gradient-to-b from-red-200 to-red-300 text-red-900 border-red-400 hover:from-red-300 hover:to-red-400 text-left">
                            2020 PARTICULAR NÃO OP
                          </button>
                          <button onClick={() => filterByStatus('2020', 'LIMBO')} className="w-full px-3 py-2 rounded border text-xs font-bold bg-gradient-to-b from-red-200 to-red-300 text-red-900 border-red-400 hover:from-red-300 hover:to-red-400 text-left">
                            2020 LIMBO
                          </button>
                        </div>
                        
                        {/* 2019 - Âmbar */}
                        <div className="space-y-1">
                          <button onClick={() => filterByStatus('2019', 'OPERADO')} className="w-full px-3 py-2 rounded border text-xs font-bold bg-gradient-to-b from-amber-200 to-amber-300 text-amber-900 border-amber-400 hover:from-amber-300 hover:to-amber-400 text-left">
                            2019 OPERADO
                          </button>
                          <button onClick={() => filterByStatus('2019', 'COMPARECEU NÃO OP')} className="w-full px-3 py-2 rounded border text-xs font-bold bg-gradient-to-b from-amber-200 to-amber-300 text-amber-900 border-amber-400 hover:from-amber-300 hover:to-amber-400 text-left">
                            2019 COMPARECEU NÃO OP
                          </button>
                          <button onClick={() => filterByStatus('2019', 'DESISTIU')} className="w-full px-3 py-2 rounded border text-xs font-bold bg-gradient-to-b from-amber-200 to-amber-300 text-amber-900 border-amber-400 hover:from-amber-300 hover:to-amber-400 text-left">
                            2019 DESISTIU
                          </button>
                          <button onClick={() => filterByStatus('2019', 'NÃO COMPARECEU')} className="w-full px-3 py-2 rounded border text-xs font-bold bg-gradient-to-b from-amber-200 to-amber-300 text-amber-900 border-amber-400 hover:from-amber-300 hover:to-amber-400 text-left">
                            2019 NÃO COMPARECEU
                          </button>
                          <button onClick={() => filterByStatus('2019', 'PARTICULAR NÃO OP')} className="w-full px-3 py-2 rounded border text-xs font-bold bg-gradient-to-b from-amber-200 to-amber-300 text-amber-900 border-amber-400 hover:from-amber-300 hover:to-amber-400 text-left">
                            2019 PARTICULAR NÃO OP
                          </button>
                          <button onClick={() => filterByStatus('2019', 'LIMBO')} className="w-full px-3 py-2 rounded border text-xs font-bold bg-gradient-to-b from-amber-200 to-amber-300 text-amber-900 border-amber-400 hover:from-amber-300 hover:to-amber-400 text-left">
                            2019 LIMBO
                          </button>
                        </div>
                        
                        {/* 2018 - Cinza */}
                        <div className="space-y-1">
                          <button onClick={() => filterByStatus('2018', 'OPERADO')} className="w-full px-3 py-2 rounded border text-xs font-bold bg-gradient-to-b from-gray-200 to-gray-300 text-gray-900 border-gray-400 hover:from-gray-300 hover:to-gray-400 text-left">
                            2018 OPERADO
                          </button>
                          <button onClick={() => filterByStatus('2018', 'COMPARECEU NÃO OP')} className="w-full px-3 py-2 rounded border text-xs font-bold bg-gradient-to-b from-gray-200 to-gray-300 text-gray-900 border-gray-400 hover:from-gray-300 hover:to-gray-400 text-left">
                            2018 COMPARECEU NÃO OP
                          </button>
                          <button onClick={() => filterByStatus('2018', 'DESISTIU')} className="w-full px-3 py-2 rounded border text-xs font-bold bg-gradient-to-b from-gray-200 to-gray-300 text-gray-900 border-gray-400 hover:from-gray-300 hover:to-gray-400 text-left">
                            2018 DESISTIU
                          </button>
                          <button onClick={() => filterByStatus('2018', 'NÃO COMPARECEU')} className="w-full px-3 py-2 rounded border text-xs font-bold bg-gradient-to-b from-gray-200 to-gray-300 text-gray-900 border-gray-400 hover:from-gray-300 hover:to-gray-400 text-left">
                            2018 NÃO COMPARECEU
                          </button>
                          <button onClick={() => filterByStatus('2018', 'PARTICULAR NÃO OP')} className="w-full px-3 py-2 rounded border text-xs font-bold bg-gradient-to-b from-gray-200 to-gray-300 text-gray-900 border-gray-400 hover:from-gray-300 hover:to-gray-400 text-left">
                            2018 PARTICULAR NÃO OP
                          </button>
                          <button onClick={() => filterByStatus('2018', 'LIMBO')} className="w-full px-3 py-2 rounded border text-xs font-bold bg-gradient-to-b from-gray-200 to-gray-300 text-gray-900 border-gray-400 hover:from-gray-300 hover:to-gray-400 text-left">
                            2018 LIMBO
                          </button>
                        </div>
                        
                        {/* 2017 - Amarelo */}
                        <div className="space-y-1">
                          <button onClick={() => filterByStatus('2017', 'OPERADO')} className="w-full px-3 py-2 rounded border text-xs font-bold bg-gradient-to-b from-yellow-200 to-yellow-300 text-yellow-900 border-yellow-400 hover:from-yellow-300 hover:to-yellow-400 text-left">
                            2017 OPERADO
                          </button>
                          <button onClick={() => filterByStatus('2017', 'COMPARECEU NÃO OP')} className="w-full px-3 py-2 rounded border text-xs font-bold bg-gradient-to-b from-yellow-200 to-yellow-300 text-yellow-900 border-yellow-400 hover:from-yellow-300 hover:to-yellow-400 text-left">
                            2017 COMPARECEU NÃO OP
                          </button>
                          <button onClick={() => filterByStatus('2017', 'DESISTIU')} className="w-full px-3 py-2 rounded border text-xs font-bold bg-gradient-to-b from-yellow-200 to-yellow-300 text-yellow-900 border-yellow-400 hover:from-yellow-300 hover:to-yellow-400 text-left">
                            2017 DESISTIU
                          </button>
                          <button onClick={() => filterByStatus('2017', 'NÃO COMPARECEU')} className="w-full px-3 py-2 rounded border text-xs font-bold bg-gradient-to-b from-yellow-200 to-yellow-300 text-yellow-900 border-yellow-400 hover:from-yellow-300 hover:to-yellow-400 text-left">
                            2017 NÃO COMPARECEU
                          </button>
                          <button onClick={() => filterByStatus('2017', 'PARTICULAR NÃO OP')} className="w-full px-3 py-2 rounded border text-xs font-bold bg-gradient-to-b from-yellow-200 to-yellow-300 text-yellow-900 border-yellow-400 hover:from-yellow-300 hover:to-yellow-400 text-left">
                            2017 PARTICULAR NÃO OP
                          </button>
                          <button onClick={() => filterByStatus('2017', 'LIMBO')} className="w-full px-3 py-2 rounded border text-xs font-bold bg-gradient-to-b from-yellow-200 to-yellow-300 text-yellow-900 border-yellow-400 hover:from-yellow-300 hover:to-yellow-400 text-left">
                            2017 LIMBO
                          </button>
                        </div>
                      </div>
                      
                      {/* Coluna 3: 2016-2014 (3 anos) */}
                      <div className="space-y-1">
                        {/* 2016 - Verde */}
                        <div className="space-y-1">
                          <button onClick={() => filterByStatus('2016', 'OPERADO')} className="w-full px-3 py-2 rounded border text-xs font-bold bg-gradient-to-b from-green-200 to-green-300 text-green-900 border-green-400 hover:from-green-300 hover:to-green-400 text-left">
                            2016 OPERADO
                          </button>
                          <button onClick={() => filterByStatus('2016', 'COMPARECEU NÃO OP')} className="w-full px-3 py-2 rounded border text-xs font-bold bg-gradient-to-b from-green-200 to-green-300 text-green-900 border-green-400 hover:from-green-300 hover:to-green-400 text-left">
                            2016 COMPARECEU NÃO OP
                          </button>
                          <button onClick={() => filterByStatus('2016', 'DESISTIU')} className="w-full px-3 py-2 rounded border text-xs font-bold bg-gradient-to-b from-green-200 to-green-300 text-green-900 border-green-400 hover:from-green-300 hover:to-green-400 text-left">
                            2016 DESISTIU
                          </button>
                          <button onClick={() => filterByStatus('2016', 'NÃO COMPARECEU')} className="w-full px-3 py-2 rounded border text-xs font-bold bg-gradient-to-b from-green-200 to-green-300 text-green-900 border-green-400 hover:from-green-300 hover:to-green-400 text-left">
                            2016 NÃO COMPARECEU
                          </button>
                          <button onClick={() => filterByStatus('2016', 'PARTICULAR NÃO OP')} className="w-full px-3 py-2 rounded border text-xs font-bold bg-gradient-to-b from-green-200 to-green-300 text-green-900 border-green-400 hover:from-green-300 hover:to-green-400 text-left">
                            2016 PARTICULAR NÃO OP
                          </button>
                          <button onClick={() => filterByStatus('2016', 'LIMBO')} className="w-full px-3 py-2 rounded border text-xs font-bold bg-gradient-to-b from-green-200 to-green-300 text-green-900 border-green-400 hover:from-green-300 hover:to-green-400 text-left">
                            2016 LIMBO
                          </button>
                        </div>
                        
                        {/* 2015 - Roxo */}
                        <div className="space-y-1">
                          <button onClick={() => filterByStatus('2015', 'OPERADO')} className="w-full px-3 py-2 rounded border text-xs font-bold bg-gradient-to-b from-purple-200 to-purple-300 text-purple-900 border-purple-400 hover:from-purple-300 hover:to-purple-400 text-left">
                            2015 OPERADO
                          </button>
                          <button onClick={() => filterByStatus('2015', 'COMPARECEU NÃO OP')} className="w-full px-3 py-2 rounded border text-xs font-bold bg-gradient-to-b from-purple-200 to-purple-300 text-purple-900 border-purple-400 hover:from-purple-300 hover:to-purple-400 text-left">
                            2015 COMPARECEU NÃO OP
                          </button>
                          <button onClick={() => filterByStatus('2015', 'DESISTIU')} className="w-full px-3 py-2 rounded border text-xs font-bold bg-gradient-to-b from-purple-200 to-purple-300 text-purple-900 border-purple-400 hover:from-purple-300 hover:to-purple-400 text-left">
                            2015 DESISTIU
                          </button>
                          <button onClick={() => filterByStatus('2015', 'NÃO COMPARECEU')} className="w-full px-3 py-2 rounded border text-xs font-bold bg-gradient-to-b from-purple-200 to-purple-300 text-purple-900 border-purple-400 hover:from-purple-300 hover:to-purple-400 text-left">
                            2015 NÃO COMPARECEU
                          </button>
                          <button onClick={() => filterByStatus('2015', 'PARTICULAR NÃO OP')} className="w-full px-3 py-2 rounded border text-xs font-bold bg-gradient-to-b from-purple-200 to-purple-300 text-purple-900 border-purple-400 hover:from-purple-300 hover:to-purple-400 text-left">
                            2015 PARTICULAR NÃO OP
                          </button>
                          <button onClick={() => filterByStatus('2015', 'LIMBO')} className="w-full px-3 py-2 rounded border text-xs font-bold bg-gradient-to-b from-purple-200 to-purple-300 text-purple-900 border-purple-400 hover:from-purple-300 hover:to-purple-400 text-left">
                            2015 LIMBO
                          </button>
                        </div>
                        
                        {/* 2014 - Vermelho */}
                        <div className="space-y-1">
                          <button onClick={() => filterByStatus('2014', 'OPERADO')} className="w-full px-3 py-2 rounded border text-xs font-bold bg-gradient-to-b from-red-200 to-red-300 text-red-900 border-red-400 hover:from-red-300 hover:to-red-400 text-left">
                            2014 OPERADO
                          </button>
                          <button onClick={() => filterByStatus('2014', 'COMPARECEU NÃO OP')} className="w-full px-3 py-2 rounded border text-xs font-bold bg-gradient-to-b from-red-200 to-red-300 text-red-900 border-red-400 hover:from-red-300 hover:to-red-400 text-left">
                            2014 COMPARECEU NÃO OP
                          </button>
                          <button onClick={() => filterByStatus('2014', 'DESISTIU')} className="w-full px-3 py-2 rounded border text-xs font-bold bg-gradient-to-b from-red-200 to-red-300 text-red-900 border-red-400 hover:from-red-300 hover:to-red-400 text-left">
                            2014 DESISTIU
                          </button>
                          <button onClick={() => filterByStatus('2014', 'NÃO COMPARECEU')} className="w-full px-3 py-2 rounded border text-xs font-bold bg-gradient-to-b from-red-200 to-red-300 text-red-900 border-red-400 hover:from-red-300 hover:to-red-400 text-left">
                            2014 NÃO COMPARECEU
                          </button>
                          <button onClick={() => filterByStatus('2014', 'PARTICULAR NÃO OP')} className="w-full px-3 py-2 rounded border text-xs font-bold bg-gradient-to-b from-red-200 to-red-300 text-red-900 border-red-400 hover:from-red-300 hover:to-red-400 text-left">
                            2014 PARTICULAR NÃO OP
                          </button>
                          <button onClick={() => filterByStatus('2014', 'LIMBO')} className="w-full px-3 py-2 rounded border text-xs font-bold bg-gradient-to-b from-red-200 to-red-300 text-red-900 border-red-400 hover:from-red-300 hover:to-red-400 text-left">
                            2014 LIMBO
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            
            
            {/* Contador de Resultados - Aparece na segunda linha em lg+ */}
            <div className="hidden lg:block">
              <div className="w-full flex items-center justify-center gap-2 px-3 h-full bg-white border border-gray-400 rounded shadow-sm">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-gray-700">
                  {patients.length} registro{patients.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>

          {/* Terceira linha - 4 ANOS, 5 ANOS, > 6 ANOS, TODOS, STATUS (apenas mobile) */}
          <div className="grid grid-cols-5 gap-2 mb-2 lg:hidden">
            <button
              onClick={() => filterByPeriod('4y')}
              className={`min-w-[60px] px-2 py-1.5 rounded border text-xs font-bold transition-all ${
                activeFilter === '4y'
                  ? 'bg-gradient-to-b from-fuchsia-400 to-fuchsia-500 text-white border-fuchsia-600 shadow-lg'
                  : 'bg-gradient-to-b from-fuchsia-100 to-fuchsia-200 text-fuchsia-800 border-fuchsia-300 hover:from-fuchsia-200 hover:to-fuchsia-300 shadow-sm'
              }`}
            >
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-lg font-bold">4</span>
                <span className="text-[10px]">ANOS</span>
              </div>
            </button>
            <button
              onClick={() => filterByPeriod('5y')}
              className={`min-w-[60px] px-2 py-1.5 rounded border text-xs font-bold transition-all ${
                activeFilter === '5y'
                  ? 'bg-gradient-to-b from-pink-400 to-pink-500 text-white border-pink-600 shadow-lg'
                  : 'bg-gradient-to-b from-pink-100 to-pink-200 text-pink-800 border-pink-300 hover:from-pink-200 hover:to-pink-300 shadow-sm'
              }`}
            >
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-lg font-bold">5</span>
                <span className="text-[10px]">ANOS</span>
              </div>
            </button>
            
            {/* > 6 ANOS com popover - Mobile */}
            <div className="relative">
              <button
                onClick={() => setShowYearsPopover(!showYearsPopover)}
                className={`w-full px-2 py-1.5 rounded border text-xs font-bold transition-all ${
                  activeFilter === '6y+' || activeFilter === '6y' || activeFilter === '7y' || activeFilter === '8y' || activeFilter === '9y' || activeFilter === '10y'
                    ? 'bg-gradient-to-b from-red-500 to-red-600 text-white border-red-700 shadow-lg'
                    : 'bg-gradient-to-b from-red-100 to-red-200 text-red-800 border-red-300 hover:from-red-200 hover:to-red-300 shadow-sm'
                }`}
              >
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-lg font-bold">&gt; 6</span>
                  <span className="text-[10px]">ANOS</span>
                </div>
              </button>
            </div>
            
            {/* Botão Todos - Mobile */}
            <button
              onClick={() => filterByPeriod('all')}
              className={`min-w-[60px] px-2 py-1.5 rounded border text-xs font-bold transition-all ${
                activeFilter === 'all'
                  ? 'bg-gradient-to-b from-green-500 to-green-600 text-white border-green-700 shadow-lg'
                  : 'bg-gradient-to-b from-green-100 to-green-200 text-green-800 border-green-300 hover:from-green-200 hover:to-green-300 shadow-sm'
              }`}
            >
              <div className="flex flex-col items-center gap-0.5">
                <BarChart3 className="w-6 h-6" />
                <span className="text-[10px]">TODOS</span>
              </div>
            </button>
            
            {/* Botão Filtro de Status - Mobile */}
            <div className="relative h-full">
              <button
                onClick={() => {
                  console.log('Clicou no botão STATUS, estado atual:', showStatusPopover);
                  setShowStatusPopover(!showStatusPopover);
                }}
                className={`w-full h-full px-2 py-1.5 rounded border text-xs font-bold transition-all ${
                  statusFilter
                    ? 'bg-gradient-to-b from-blue-500 to-blue-600 text-white border-blue-700 shadow-lg'
                    : 'bg-gradient-to-b from-blue-100 to-blue-200 text-blue-800 border-blue-300 hover:from-blue-200 hover:to-blue-300 shadow-sm'
                }`}
              >
                <div className="flex flex-col items-center justify-center gap-0.5 h-full">
                  <Filter className="w-6 h-6" />
                  <span className="text-[10px]">STATUS</span>
                </div>
              </button>
            </div>
          </div>

          {/* Quarta linha - Contador de Registros (apenas mobile) */}
          <div className="flex justify-center lg:hidden mt-2">
            <div className="flex items-center justify-center gap-2 px-3 py-1.5 bg-white border border-gray-400 rounded shadow-sm">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold text-gray-700">
                {patients.length} registro{patients.length !== 1 ? 's' : ''}
              </span>
            </div>
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
            patient={(filteredPatients.length > 0 ? filteredPatients : patients)[currentIndex]}
            allPatients={patients}
            onUpdate={loadPatients}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onSelectPatient={(patient) => {
              const patientsToSearch = filteredPatients.length > 0 ? filteredPatients : patients;
              const index = patientsToSearch.findIndex(p => p._id === patient._id);
              if (index !== -1) setCurrentIndex(index);
            }}
            onFilteredPatientsChange={(filtered) => {
              setFilteredPatients(filtered);
              setCurrentIndex(0); // Resetar para o primeiro resultado
            }}
            onCreateNew={() => {
              router.push('/patients/new');
            }}
            currentIndex={currentIndex}
            totalPatients={filteredPatients.length > 0 ? filteredPatients.length : patients.length}
          />
        )}
      </main>
    </div>
  );
}
