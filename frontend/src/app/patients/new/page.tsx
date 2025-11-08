'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { patientService } from '@/services/patientService';
import { ArrowLeft, Save, Calendar } from 'lucide-react';
import CustomSelect from '@/components/CustomSelect';

// Importar constantes de opções
const CONVENIO_OPTIONS = [
  { value: '', label: 'Selecione...' },
  { value: 'PARTICULAR', label: 'PARTICULAR' },
  { value: 'SULAMERICA', label: 'SULAMERICA' },
  { value: 'BRADESCO', label: 'BRADESCO' },
  { value: 'ABET', label: 'ABET' },
  { value: 'ALLIANZ', label: 'ALLIANZ' },
  { value: 'AMEPLAN', label: 'AMEPLAN' },
  { value: 'AMIL', label: 'AMIL' },
  { value: 'AMAFRESP', label: 'AMAFRESP' },
  { value: 'CABESP', label: 'CABESP' },
  { value: 'CARE PLUS', label: 'CARE PLUS' },
  { value: 'CASSI', label: 'CASSI' },
  { value: 'CET', label: 'CET' },
  { value: 'CLASSES LABORIOSAS', label: 'CLASSES LABORIOSAS' },
  { value: 'CUIDAR ME', label: 'CUIDAR ME' },
  { value: 'ECONOMUS', label: 'ECONOMUS' },
  { value: 'EMBRATEL', label: 'EMBRATEL' },
  { value: 'FUNDACAO CESP', label: 'FUNDACAO CESP' },
  { value: 'GAMA', label: 'GAMA' },
  { value: 'GEAP', label: 'GEAP' },
  { value: 'GOLDEN CROSS', label: 'GOLDEN CROSS' },
  { value: 'GREEN LINE', label: 'GREEN LINE' },
  { value: 'INTERMEDICA', label: 'INTERMEDICA' },
  { value: 'ITAU', label: 'ITAU' },
  { value: 'NOTRE DAME', label: 'NOTRE DAME' },
  { value: 'MARITIMA', label: 'MARITIMA' },
  { value: 'MEDIAL', label: 'MEDIAL' },
  { value: 'MEDISERVICE', label: 'MEDISERVICE' },
  { value: 'METRUS', label: 'METRUS' },
  { value: 'OMINT', label: 'OMINT' },
  { value: 'ONE HEALTH', label: 'ONE HEALTH' },
  { value: 'PORTO SEGURO', label: 'PORTO SEGURO' },
  { value: 'POSTAL SAUDE', label: 'POSTAL SAUDE' },
  { value: 'SABESPREV', label: 'SABESPREV' },
  { value: 'SAUDE CAIXA', label: 'SAUDE CAIXA' },
  { value: 'SOMPO SAÚDE', label: 'SOMPO SAÚDE' },
  { value: 'TRASMONTANO', label: 'TRASMONTANO' },
  { value: 'UNIMED', label: 'UNIMED' },
  { value: 'UNIMED CENTRAL NACIONAL', label: 'UNIMED CENTRAL NACIONAL' },
  { value: 'UNIMED FESP', label: 'UNIMED FESP' },
  { value: 'UNIMED GUARULHOS', label: 'UNIMED GUARULHOS' },
  { value: 'UNIMED SEGUROS', label: 'UNIMED SEGUROS' },
  { value: 'VOLKSWAGEN', label: 'VOLKSWAGEN' },
  { value: 'OUTROS', label: 'OUTROS' },
];

const SUBTIPO_OPTIONS = [
  { value: '', label: 'Selecione...' },
  { value: 'AMIL 140 PLUS', label: 'AMIL 140 PLUS' },
  { value: 'AMIL 160', label: 'AMIL 160' },
  { value: 'AMIL BLUE I', label: 'AMIL BLUE I' },
  { value: 'AMIL BLUE II', label: 'AMIL BLUE II' },
  { value: 'AMIL GLOBAL I', label: 'AMIL GLOBAL I' },
  { value: 'AMIL 30', label: 'AMIL 30' },
  { value: 'AMIL 40', label: 'AMIL 40' },
  { value: 'AMIL 200', label: 'AMIL 200' },
  { value: 'AMIL 300', label: 'AMIL 300' },
  { value: 'AMIL 400', label: 'AMIL 400' },
  { value: 'AMIL 500', label: 'AMIL 500' },
  { value: 'AMIL 700', label: 'AMIL 700' },
  { value: 'AMIL BLUE GOLD', label: 'AMIL BLUE GOLD' },
  { value: 'AMIL FACIL S60 SP', label: 'AMIL FACIL S60 SP' },
  { value: 'AMIL COLABORADOR', label: 'AMIL COLABORADOR' },
  { value: 'AMIL ORIENTADOR 40', label: 'AMIL ORIENTADOR 40' },
  { value: 'AMIL ORIENTADOR 140', label: 'AMIL ORIENTADOR 140' },
  { value: 'AMIL NEXT MUN SAO PAULO', label: 'AMIL NEXT MUN SAO PAULO' },
  { value: 'AMIL QUALITE M22', label: 'AMIL QUALITE M22' },
  { value: 'AMIL ONE S1500', label: 'AMIL ONE S1500' },
  { value: 'AMIL ONE S2500', label: 'AMIL ONE S2500' },
  { value: 'AMIL OPCAO M22', label: 'AMIL OPCAO M22' },
  { value: 'AMIL SANTA PAULA', label: 'AMIL SANTA PAULA' },
  { value: 'AMIL S40', label: 'AMIL S40' },
  { value: 'AMIL S80', label: 'AMIL S80' },
  { value: 'AMIL S250', label: 'AMIL S250' },
  { value: 'AMIL S350', label: 'AMIL S350' },
  { value: 'AMIL S450', label: 'AMIL S450' },
  { value: 'AMIL S580', label: 'AMIL S580' },
  { value: 'AMIL S750', label: 'AMIL S750' },
  { value: 'ABSOLUTO', label: 'ABSOLUTO' },
  { value: 'ACESSO IV', label: 'ACESSO IV' },
  { value: 'ADVANCE 600', label: 'ADVANCE 600' },
  { value: 'ADVANCE 700', label: 'ADVANCE 700' },
  { value: 'ADVANCE 800', label: 'ADVANCE 800' },
  { value: 'AGREGADO', label: 'AGREGADO' },
  { value: 'AMPLA COLETIVO', label: 'AMPLA COLETIVO' },
  { value: 'ASSOCIADOS', label: 'ASSOCIADOS' },
  { value: 'ATIVOS', label: 'ATIVOS' },
  { value: 'BASICO', label: 'BASICO' },
  { value: 'BASICO 10', label: 'BASICO 10' },
  { value: 'BETA', label: 'BETA' },
  { value: 'BLUE III', label: 'BLUE III' },
  { value: 'BLUE IV', label: 'BLUE IV' },
  { value: 'BLUE 300', label: 'BLUE 300' },
  { value: 'BLUE 300 PLUS', label: 'BLUE 300 PLUS' },
  { value: 'BLUE 400', label: 'BLUE 400' },
  { value: 'BLUE 400 PLUS', label: 'BLUE 400 PLUS' },
  { value: 'BLUE 500', label: 'BLUE 500' },
  { value: 'BLUE 500 PLUS', label: 'BLUE 500 PLUS' },
  { value: 'BLUE 600', label: 'BLUE 600' },
  { value: 'BLUE 600 PLUS', label: 'BLUE 600 PLUS' },
  { value: 'BLUE 700', label: 'BLUE 700' },
  { value: 'BLUE 800', label: 'BLUE 800' },
  { value: 'BLUE EXECUTIVO', label: 'BLUE EXECUTIVO' },
  { value: 'BRANCO', label: 'BRANCO' },
  { value: 'BRANCO SL', label: 'BRANCO SL' },
  { value: 'BRANCO 100', label: 'BRANCO 100' },
  { value: 'BRANCO 150', label: 'BRANCO 150' },
  { value: 'BRONZE', label: 'BRONZE' },
  { value: 'BRONZE I', label: 'BRONZE I' },
  { value: 'BRONZE TOP', label: 'BRONZE TOP' },
  { value: 'CABESP FAMILIA', label: 'CABESP FAMILIA' },
  { value: 'CELEBRITY', label: 'CELEBRITY' },
  { value: 'CENTRAL NACIONAL', label: 'CENTRAL NACIONAL' },
  { value: 'CLASS 620 E', label: 'CLASS 620 E' },
  { value: 'CLASS 620 A', label: 'CLASS 620 A' },
  { value: 'CLASS 640 A', label: 'CLASS 640 A' },
  { value: 'CLASSICO', label: 'CLASSICO' },
  { value: 'COLETIVO EMPRESARIAL', label: 'COLETIVO EMPRESARIAL' },
  { value: 'COMPLETO', label: 'COMPLETO' },
  { value: 'CORPORATIVO COMPLETO', label: 'CORPORATIVO COMPLETO' },
  { value: 'CORREIOS SAUDE', label: 'CORREIOS SAUDE' },
  { value: 'CRISTAL I', label: 'CRISTAL I' },
  { value: 'D', label: 'D' },
  { value: 'DIAMANTE I', label: 'DIAMANTE I' },
  { value: 'DIAMANTE I 876', label: 'DIAMANTE I 876' },
  { value: 'DINAMICO', label: 'DINAMICO' },
  { value: 'DSP CLINIC', label: 'DSP CLINIC' },
  { value: 'DSP PLENA', label: 'DSP PLENA' },
  { value: 'DIX 10', label: 'DIX 10' },
  { value: 'DIX ORIENTADOR', label: 'DIX ORIENTADOR' },
  { value: 'DIX 100', label: 'DIX 100' },
  { value: 'EFETIVO IV', label: 'EFETIVO IV' },
  { value: 'ELETROPAULO', label: 'ELETROPAULO' },
  { value: 'ESSENCIAL', label: 'ESSENCIAL' },
  { value: 'ESSENCIAL PLUS', label: 'ESSENCIAL PLUS' },
  { value: 'ESPECIAL', label: 'ESPECIAL' },
  { value: 'ESPECIAL I', label: 'ESPECIAL I' },
  { value: 'ESPECIAL II', label: 'ESPECIAL II' },
  { value: 'ESPECIAL III', label: 'ESPECIAL III' },
  { value: 'ESPECIAL 100', label: 'ESPECIAL 100' },
  { value: 'ESTILO I', label: 'ESTILO I' },
  { value: 'ESTILO III', label: 'ESTILO III' },
  { value: 'ES07 ESPECIAL', label: 'ES07 ESPECIAL' },
  { value: 'EXATO', label: 'EXATO' },
  { value: 'EXCELLENCE', label: 'EXCELLENCE' },
  { value: 'EXECUTIVE', label: 'EXECUTIVE' },
  { value: 'EXECUTIVO', label: 'EXECUTIVO' },
  { value: 'EXCLUSIVO', label: 'EXCLUSIVO' },
  { value: 'FAMILIA', label: 'FAMILIA' },
  { value: 'FAMILA AGREGADO', label: 'FAMILA AGREGADO' },
  { value: 'FESP', label: 'FESP' },
  { value: 'FIT', label: 'FIT' },
  { value: 'FLEX', label: 'FLEX' },
  { value: 'GREEN 211', label: 'GREEN 211' },
  { value: 'H2L2R2ED', label: 'H2L2R2ED' },
  { value: 'H3L2', label: 'H3L2' },
  { value: 'IDEAL ENFERMARIA', label: 'IDEAL ENFERMARIA' },
  { value: 'INFINITY 1000', label: 'INFINITY 1000' },
  { value: 'INTEGRADA', label: 'INTEGRADA' },
  { value: 'LIDER', label: 'LIDER' },
  { value: 'LIFE STD', label: 'LIFE STD' },
  { value: 'LT3', label: 'LT3' },
  { value: 'LT4', label: 'LT4' },
  { value: 'MASTER', label: 'MASTER' },
  { value: 'MASTER I', label: 'MASTER I' },
  { value: 'MASTER II', label: 'MASTER II' },
  { value: 'MASTER III', label: 'MASTER III' },
  { value: 'MASTER IV', label: 'MASTER IV' },
  { value: 'MAX 250', label: 'MAX 250' },
  { value: 'MAX 300', label: 'MAX 300' },
  { value: 'MAX 350', label: 'MAX 350' },
  { value: 'MAX 400', label: 'MAX 400' },
  { value: 'MAXI', label: 'MAXI' },
  { value: 'MAXIMO', label: 'MAXIMO' },
  { value: 'MEDIAL 200', label: 'MEDIAL 200' },
  { value: 'MEDIAL CLASS 620', label: 'MEDIAL CLASS 620' },
  { value: 'MEDIAL 31', label: 'MEDIAL 31' },
  { value: 'MEDIAL 400', label: 'MEDIAL 400' },
  { value: 'MEDIAL 840 A', label: 'MEDIAL 840 A' },
  { value: 'MEDIAL ESTRELAS 31', label: 'MEDIAL ESTRELAS 31' },
  { value: 'MEDIAL EXECUTIVE PLUS', label: 'MEDIAL EXECUTIVE PLUS' },
  { value: 'MEDIAL INTER II NAC PJCE', label: 'MEDIAL INTER II NAC PJCE' },
  { value: 'MEDIAL GOL', label: 'MEDIAL GOL' },
  { value: 'MEDIAL IDEAL 420 A', label: 'MEDIAL IDEAL 420 A' },
  { value: 'MEDIAL ORIENTADOR CLASS 30', label: 'MEDIAL ORIENTADOR CLASS 30' },
  { value: 'MEDIAL PLENO II', label: 'MEDIAL PLENO II' },
  { value: 'MEDIAL PREMIUM 840A', label: 'MEDIAL PREMIUM 840A' },
  { value: 'MEDICUS M22', label: 'MEDICUS M22' },
  { value: 'MEDICUS 122', label: 'MEDICUS 122' },
  { value: 'MELHOR', label: 'MELHOR' },
  { value: 'MSI', label: 'MSI' },
  { value: 'NDS 111', label: 'NDS 111' },
  { value: 'NDS 126', label: 'NDS 126' },
  { value: 'NDS 127', label: 'NDS 127' },
  { value: 'NDS 130', label: 'NDS 130' },
  { value: 'NDS 140', label: 'NDS 140' },
  { value: 'NDS 141', label: 'NDS 141' },
  { value: 'NDS 161', label: 'NDS 161' },
  { value: 'ONE BLACK T2', label: 'ONE BLACK T2' },
  { value: 'ONE BLACK T3', label: 'ONE BLACK T3' },
  { value: 'ONE 2000', label: 'ONE 2000' },
  { value: 'OPCAO M22', label: 'OPCAO M22' },
  { value: 'OPCAO 122', label: 'OPCAO 122' },
  { value: 'ORIGINAL', label: 'ORIGINAL' },
  { value: 'OSWALDO CRUZ 100', label: 'OSWALDO CRUZ 100' },
  { value: 'OURO', label: 'OURO' },
  { value: 'OURO I', label: 'OURO I' },
  { value: 'OURO III', label: 'OURO III' },
  { value: 'OURO IV', label: 'OURO IV' },
  { value: 'OURO MAIS Q', label: 'OURO MAIS Q' },
  { value: 'OURO MAX Q', label: 'OURO MAX Q' },
  { value: 'PADRAO', label: 'PADRAO' },
  { value: 'PLENO', label: 'PLENO' },
  { value: 'PLENO II 920', label: 'PLENO II 920' },
  { value: 'PLUS', label: 'PLUS' },
  { value: 'PME COMPACTO', label: 'PME COMPACTO' },
  { value: 'PORTO MED I', label: 'PORTO MED I' },
  { value: 'PRATA', label: 'PRATA' },
  { value: 'PRATA BRONZE COPAR Q', label: 'PRATA BRONZE COPAR Q' },
  { value: 'PRATA E MAIS', label: 'PRATA E MAIS' },
  { value: 'PRATA MAIS Q', label: 'PRATA MAIS Q' },
  { value: 'PRATA I', label: 'PRATA I' },
  { value: 'PRATA TOP', label: 'PRATA TOP' },
  { value: 'PREMIUM', label: 'PREMIUM' },
  { value: 'PREMIUM TOP', label: 'PREMIUM TOP' },
  { value: 'PREMIUM 800', label: 'PREMIUM 800' },
  { value: 'PREMIUM 900', label: 'PREMIUM 900' },
  { value: 'QUALITE', label: 'QUALITE' },
  { value: 'REDE 300', label: 'REDE 300' },
  { value: 'REFE EFETIVO', label: 'REFE EFETIVO' },
  { value: 'REDE EFETIVO III', label: 'REDE EFETIVO III' },
  { value: 'REDE EFETIVO IV', label: 'REDE EFETIVO IV' },
  { value: 'REDE HSC IDEAL', label: 'REDE HSC IDEAL' },
  { value: 'REDE HSC NACIONAL', label: 'REDE HSC NACIONAL' },
  { value: 'REDE IDEAL I', label: 'REDE IDEAL I' },
  { value: 'REDE LIVRE ESCOLHA', label: 'REDE LIVRE ESCOLHA' },
  { value: 'REDE PERFIL SP', label: 'REDE PERFIL SP' },
  { value: 'REDE PERSONAL IV', label: 'REDE PERSONAL IV' },
  { value: 'REDE PREFERENCIAL', label: 'REDE PREFERENCIAL' },
  { value: 'REDE PREFERENCIAL PLUS', label: 'REDE PREFERENCIAL PLUS' },
  { value: 'REDE INTERNACIONAL', label: 'REDE INTERNACIONAL' },
  { value: 'REDE NACIONAL INDIVIDUAL', label: 'REDE NACIONAL INDIVIDUAL' },
  { value: 'REDE NACIONAL EMPRESARIAL', label: 'REDE NACIONAL EMPRESARIAL' },
  { value: 'REDE NACIONAL EMPRESARIAL SPG', label: 'REDE NACIONAL EMPRESARIAL SPG' },
  { value: 'REDE NACIONAL ESPECIAL', label: 'REDE NACIONAL ESPECIAL' },
  { value: 'REDE NACIONAL FLEX', label: 'REDE NACIONAL FLEX' },
  { value: 'REDE NACIONAL FLEX II', label: 'REDE NACIONAL FLEX II' },
  { value: 'REDE NACIONAL PLUS', label: 'REDE NACIONAL PLUS' },
  { value: 'REDE PERSONAL VI', label: 'REDE PERSONAL VI' },
  { value: 'REDE SCANIA', label: 'REDE SCANIA' },
  { value: 'REDE SIEMENS', label: 'REDE SIEMENS' },
  { value: 'REGIONAL', label: 'REGIONAL' },
  { value: 'SAUDE CAIXA ATIVOS', label: 'SAUDE CAIXA ATIVOS' },
  { value: 'SEGUROS UNIMED HCOR', label: 'SEGUROS UNIMED HCOR' },
  { value: 'SELETO I', label: 'SELETO I' },
  { value: 'SENIOR I', label: 'SENIOR I' },
  { value: 'SENIOR II 920', label: 'SENIOR II 920' },
  { value: 'SKILL', label: 'SKILL' },
  { value: 'SMART 200', label: 'SMART 200' },
  { value: 'SMART 300', label: 'SMART 300' },
  { value: 'SMART 400', label: 'SMART 400' },
  { value: 'SMART 500', label: 'SMART 500' },
  { value: 'SMART 600', label: 'SMART 600' },
  { value: 'STANDARD', label: 'STANDARD' },
  { value: 'SUPERIEUR', label: 'SUPERIEUR' },
  { value: 'SUPERIOR NACIONAL', label: 'SUPERIOR NACIONAL' },
  { value: 'SUPREMO', label: 'SUPREMO' },
  { value: 'S 450', label: 'S 450' },
  { value: 'S 750', label: 'S 750' },
  { value: 'UNIPLAN INTEGRADA', label: 'UNIPLAN INTEGRADA' },
  { value: 'UNIPLAN PADRÃO', label: 'UNIPLAN PADRÃO' },
  { value: 'UNIPLAN SUPREMO', label: 'UNIPLAN SUPREMO' },
  { value: 'UNIPLAN UP OURO', label: 'UNIPLAN UP OURO' },
  { value: 'UNIPLAN UP BRONZE', label: 'UNIPLAN UP BRONZE' },
  { value: 'UNIPLAN', label: 'UNIPLAN' },
  { value: 'UNIPLAN NEW PRATA', label: 'UNIPLAN NEW PRATA' },
  { value: 'VERSATIL', label: 'VERSATIL' },
  { value: 'VITA', label: 'VITA' },
  { value: 'UNIPLAN ESPECIAL', label: 'UNIPLAN ESPECIAL' },
  { value: 'UNIPLAN MASTERAMIL', label: 'UNIPLAN MASTERAMIL' },
];

export default function NewPatientPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const dateInputRef = useRef<HTMLInputElement>(null);
  
  // Função para aplicar máscara de celular (00) 00000-0000
  const maskCelular = (value: string): string => {
    if (!value) return '';
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return `(${numbers}`;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  // Função para aplicar máscara de telefone fixo (00) 0000-0000
  const maskTelFixo = (value: string): string => {
    if (!value) return '';
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return `(${numbers}`;
    if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6, 10)}`;
  };
  
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
    observacao: '',
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
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-1 sm:gap-2 text-gray-600 hover:text-gray-900 text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Voltar</span>
            </button>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Novo Paciente</h1>
          </div>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <Save className="w-4 h-4 sm:w-5 sm:h-5" />
            {isSaving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-4 sm:p-5 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
            {/* Nome */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Nome *
              </label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => handleChange('nome', e.target.value.toUpperCase())}
                required
                aria-label="Nome do paciente"
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
              />
            </div>

            {/* Data da Consulta */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
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
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="relative">
                  <button
                    type="button"
                    onClick={handleCalendarClick}
                    className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 bg-gray-200 border border-gray-300 rounded-lg hover:bg-gray-300 flex items-center justify-center"
                    title="Escolher data"
                  >
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
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
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Convênio
              </label>
              <CustomSelect
                value={formData.convenio}
                onChange={(value) => handleChange('convenio', value)}
                options={CONVENIO_OPTIONS}
                aria-label="Convênio"
                className="border-gray-300 focus:ring-blue-500"
              />
            </div>

            {/* Subtipo Convênio */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Subtipo Convênio
              </label>
              <CustomSelect
                value={formData.subtipoConvenio}
                onChange={(value) => handleChange('subtipoConvenio', value)}
                options={SUBTIPO_OPTIONS}
                aria-label="Subtipo do convênio"
                className="border-gray-300 focus:ring-blue-500"
              />
            </div>

            {/* Celular */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Celular
              </label>
              <input
                type="text"
                value={maskCelular(formData.celular)}
                onChange={(e) => {
                  const masked = maskCelular(e.target.value);
                  handleChange('celular', masked);
                }}
                placeholder="(00) 00000-0000"
                aria-label="Celular"
                maxLength={15}
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Telefone Fixo */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Telefone Fixo
              </label>
              <input
                type="text"
                value={maskTelFixo(formData.telFixo)}
                onChange={(e) => {
                  const masked = maskTelFixo(e.target.value);
                  handleChange('telFixo', masked);
                }}
                placeholder="(00) 0000-0000"
                aria-label="Telefone fixo"
                maxLength={14}
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Indicação */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Indicação
              </label>
              <input
                type="text"
                value={formData.indicacao}
                onChange={(e) => handleChange('indicacao', e.target.value)}
                aria-label="Indicação"
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Observação */}
            <div className="md:col-span-2">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Observação
              </label>
              <textarea
                value={formData.observacao}
                onChange={(e) => handleChange('observacao', e.target.value)}
                rows={4}
                aria-label="Observação"
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

          </div>

          <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="w-full sm:w-auto px-4 sm:px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm sm:text-base"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <Save className="w-4 h-4 sm:w-5 sm:h-5" />
              {isSaving ? 'Salvando...' : 'Salvar Paciente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
