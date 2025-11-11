'use client';

import { useState, useRef, useEffect } from 'react';
import { Patient } from '@/types';
import { patientService } from '@/services/patientService';
import { Save, X, Phone, Mail, MessageSquare, FileText, AlertCircle, Search, RefreshCw, Trash2, Plus, Calendar } from 'lucide-react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import CustomSelect from './CustomSelect';

// Opções para os selects
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

const CONVENIO_SEARCH_OPTIONS = [
  { value: '', label: 'Todos...' },
  ...CONVENIO_OPTIONS.slice(1)
];

const RESPOSTA_OPTIONS = [
  { value: '', label: 'Selecione...' },
  { value: 'NÃO COMPARECEU', label: 'NÃO COMPARECEU' },
  { value: 'COMPARECEU', label: 'COMPARECEU' },
  { value: 'CONFIRMADO', label: 'CONFIRMADO' },
  { value: 'RETORNAR', label: 'RETORNAR' },
  { value: 'REMARCAR', label: 'REMARCAR' },
  { value: 'CANCELADO', label: 'CANCELADO' },
];

const RESPOSTA_SEARCH_OPTIONS = [
  { value: '', label: 'Todas...' },
  ...RESPOSTA_OPTIONS.slice(1)
];

const RESOLVIDO_OPTIONS = [
  { value: '', label: 'Selecione...' },
  { value: 'SIM', label: 'SIM' },
  { value: 'NÃO', label: 'NÃO' },
  { value: 'LIMBO', label: 'LIMBO' },
];

const RESOLVIDO_SEARCH_OPTIONS = [
  { value: '', label: 'Todos...' },
  ...RESOLVIDO_OPTIONS.slice(1)
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

interface ToDo {
  id: string;
  nome: string;
  data: string;
  acao: string;
  finalidade: string;
  resolvido: string;
}

interface PatientFormFileMakerProps {
  patient: Patient;
  allPatients?: Patient[];
  onUpdate?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onSelectPatient?: (patient: Patient) => void;
  onCreateNew?: () => void;
  onFilteredPatientsChange?: (patients: Patient[]) => void;
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
  onFilteredPatientsChange,
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
  const [showRecallPopover, setShowRecallPopover] = useState(false);
  const recallPopoverRef = useRef<HTMLDivElement>(null);
  const [todos, setTodos] = useState<ToDo[]>([]);
  const [newTodo, setNewTodo] = useState<Partial<ToDo>>({
    nome: patient.nome || '',
    data: '',
    acao: '',
    finalidade: '',
    resolvido: ''
  });
  
  // Refs para os inputs de data ocultos
  const dateInputRefs = {
    dataNascimento: useRef<HTMLInputElement>(null),
    dataConsulta: useRef<HTMLInputElement>(null),
    dataCirurgia: useRef<HTMLInputElement>(null),
  };
  
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

  // Função para calcular idade a partir da data de nascimento
  const calculateAge = (birthDate: string): number => {
    if (!birthDate || birthDate.length !== 10) return 0;
    
    try {
      const parts = birthDate.split('/');
      if (parts.length !== 3) return 0;
      
      const [day, month, year] = parts.map(p => parseInt(p, 10));
      if (!day || !month || !year) return 0;
      
      const birth = new Date(year, month - 1, day);
      const today = new Date();
      
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      
      // Ajustar se ainda não fez aniversário este ano
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      
      return age >= 0 ? age : 0;
    } catch (e) {
      console.log('Erro ao calcular idade:', e);
      return 0;
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

  const handlePerformSearch = () => {
    // Fechar todas as sugestões
    setShowSuggestions({});
    // Sair do modo de busca para mostrar os cards filtrados
    setIsSearching(false);
    // Se houver pacientes filtrados, selecionar o primeiro
    if (filteredPatients.length > 0 && onSelectPatient) {
      onSelectPatient(filteredPatients[0]);
    }
  };

  const handleUpdateAndClearFilters = () => {
    // Limpar filtros
    setFilteredPatients([]);
    setSearchTerms({});
    setIsSearching(false);
    setShowSuggestions({});
    
    // Notificar componente pai para limpar filtros
    if (onFilteredPatientsChange) {
      onFilteredPatientsChange([]);
    }
    
    // Chamar atualização
    if (onUpdate) {
      onUpdate();
    }
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
      console.log(`\n=== BUSCA ===`);
      console.log(`Campo: ${field}`);
      console.log(`Valor buscado: "${value}"`);
      console.log(`Total de pacientes: ${allPatients.length}`);
      
      const filtered = allPatients.filter(p => {
        const fieldValue = (p[field as keyof Patient] || '').toString().trim();
        
        // Debug: mostrar alguns valores
        if (field === 'convenio') {
          console.log(`Paciente: ${p.nome} | Convênio: "${fieldValue}"`);
        }
        
        // Se for campo de data e tiver padrão especial
        if (field === 'dataConsulta' && (value.includes('*') || value.includes('...'))) {
          return matchDatePattern(fieldValue, value);
        }
        
        // Para campos de select (convenio, resposta, resolvido), fazer comparação exata
        if (field === 'convenio' || field === 'resposta' || field === 'resolvido') {
          const match = fieldValue.toUpperCase() === value.toUpperCase();
          if (field === 'convenio' && match) {
            console.log(`✓ MATCH: ${p.nome}`);
          }
          return match;
        }
        
        return fieldValue.toLowerCase().includes(value.toLowerCase());
      });
      
      console.log(`Resultados encontrados: ${filtered.length}`);
      console.log(`=============\n`);
      
      setFilteredPatients(filtered);
      setShowSuggestions({ ...showSuggestions, [field]: field === 'nome' });
      
      // Notificar o componente pai sobre os pacientes filtrados
      if (onFilteredPatientsChange) {
        onFilteredPatientsChange(filtered);
      }
    } else {
      setFilteredPatients([]);
      setShowSuggestions({ ...showSuggestions, [field]: false });
      
      // Limpar filtros no componente pai
      if (onFilteredPatientsChange) {
        onFilteredPatientsChange([]);
      }
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
        recall: editedPatient.recall,
      };
      
      console.log('Dados sendo enviados:', updateData);
      console.log('Recall sendo enviado:', editedPatient.recall);
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

  // Sincronizar editedPatient quando patient mudar
  useEffect(() => {
    setEditedPatient(patient);
  }, [patient]);

  // Calcular idade automaticamente quando a data de nascimento mudar
  useEffect(() => {
    if (isEditing && editedPatient.dataNascimento) {
      const calculatedAge = calculateAge(editedPatient.dataNascimento);
      if (calculatedAge > 0 && calculatedAge !== editedPatient.idade) {
        setEditedPatient(prev => ({ ...prev, idade: calculatedAge }));
      }
    }
  }, [editedPatient.dataNascimento, isEditing]);

  // Fechar popover de recall ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (recallPopoverRef.current && !recallPopoverRef.current.contains(event.target as Node)) {
        setShowRecallPopover(false);
      }
    };

    if (showRecallPopover) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showRecallPopover]);

  const handleWhatsApp = () => {
    if (currentPatient.celular) {
      const phone = currentPatient.celular.replace(/\D/g, '');
      window.open(`https://wa.me/55${phone}`, '_blank');
    }
  };

  const handleAddTodo = () => {
    if (!newTodo.data || !newTodo.acao) {
      alert('Preencha pelo menos a Data e a Ação');
      return;
    }
    
    const todo: ToDo = {
      id: Date.now().toString(),
      nome: newTodo.nome || currentPatient.nome || '',
      data: newTodo.data || '',
      acao: newTodo.acao || '',
      finalidade: newTodo.finalidade || '',
      resolvido: newTodo.resolvido || ''
    };
    
    setTodos([...todos, todo]);
    setNewTodo({
      nome: currentPatient.nome || '',
      data: '',
      acao: '',
      finalidade: '',
      resolvido: ''
    });
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  const handleEmail = () => {
    // Email não está disponível no modelo atual
    alert('Campo de email não disponível');
  };

  return (
    <div className="bg-[#e8e8e8] min-h-screen overflow-visible !transform-none">
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
          <div className="space-y-1 sm:space-y-0">
            {!isEditing ? (
              <>
                {/* Primeira linha de botões - ATU e EDITAR (mobile) / Todos em uma linha (desktop) */}
                <div className="flex gap-1 sm:gap-2">
                  <button
                    onClick={handleUpdateAndClearFilters}
                    className="flex-1 min-w-[80px] px-2 sm:px-4 py-1.5 bg-purple-600 text-white rounded shadow-sm hover:bg-purple-700 text-xs sm:text-sm font-medium flex items-center justify-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>ATUALIZAR</span>
                  </button>
                  <button
                    onClick={handleEdit}
                    className="flex-1 min-w-[80px] px-2 sm:px-4 py-1.5 bg-blue-600 text-white rounded shadow-sm hover:bg-blue-700 text-xs sm:text-sm font-medium"
                  >
                    EDITAR
                  </button>
                  
                  {/* BUSCAR e NOVO aparecem na mesma linha em desktop */}
                  <button
                    onClick={handleSearch}
                    className={`hidden sm:flex flex-1 min-w-[80px] px-2 sm:px-4 py-1.5 rounded shadow-sm text-xs sm:text-sm font-medium items-center justify-center gap-1 ${
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
                    className="hidden sm:flex flex-1 min-w-[80px] px-2 sm:px-4 py-1.5 bg-green-600 text-white rounded shadow-sm hover:bg-green-700 text-xs sm:text-sm font-medium items-center justify-center gap-1"
                  >
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">NOVO</span>
                  </button>
                </div>
                
                {/* Segunda linha de botões - BUSCAR e NOVO (apenas mobile) */}
                <div className="flex gap-1 sm:hidden">
                  <button
                    onClick={handleSearch}
                    className={`flex-1 min-w-[80px] px-2 py-1.5 rounded shadow-sm text-xs font-medium flex items-center justify-center gap-1 ${
                      isSearching 
                        ? 'bg-orange-600 text-white hover:bg-orange-700' 
                        : 'bg-gray-600 text-white hover:bg-gray-700'
                    }`}
                  >
                    <Search className="w-3 h-3" />
                    <span>LOCALIZAR</span>
                  </button>
                  <button
                    onClick={onCreateNew}
                    className="flex-1 min-w-[80px] px-2 py-1.5 bg-green-600 text-white rounded shadow-sm hover:bg-green-700 text-xs font-medium flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>ADICIONAR PACIENTE</span>
                  </button>
                </div>
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
                  onClick={handleUpdateAndClearFilters}
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
                {isSearching && (
                  <button
                    onClick={handlePerformSearch}
                    className="px-4 py-1.5 bg-blue-600 text-white rounded shadow-sm hover:bg-blue-700 text-sm font-medium flex items-center gap-1"
                  >
                    <Search className="w-4 h-4" />
                    REALIZAR BUSCA
                  </button>
                )}
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

      {/* Barra de Recomendação */}
      <div className="bg-gradient-to-b from-blue-50 to-blue-100 border-b-2 border-blue-300 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-center flex-wrap">
          <FileText className="w-5 h-5 text-blue-700" />
          <span className="font-bold text-blue-900 text-sm sm:text-base">RECOMENDAÇÃO:</span>
          <span className="text-sm sm:text-base text-gray-800">
            PERGUNTAR SEMPRE <span className="font-bold text-blue-900">NOME, CELULAR E CONVÊNIO</span> AO MARCAR A CONSULTA
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-2 sm:p-4 lg:p-6 max-w-7xl mx-auto mt-20 overflow-visible !transform-none">
        <div className="bg-gray-200 rounded-lg shadow-lg border border-gray-300 p-3 sm:p-4 lg:p-6 overflow-visible !transform-none">
          {/* Form Grid - FileMaker Style - Responsivo */}
          <div className="grid grid-cols-1 gap-4">
            {/* Main Column */}
            <div className="space-y-3 sm:space-y-4">
              {/* Primeira Linha: Nome, Data de Nascimento */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Nome */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 lg:col-span-1">
                  <label className="sm:w-40 lg:w-32 sm:text-right sm:pr-3 text-xs sm:text-sm font-medium text-gray-700">
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
                              className="px-3 py-2 hover:bg-slate-300 cursor-pointer border-b border-gray-200 last:border-b-0 text-sm"
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

                {/* Data de Nascimento */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 lg:col-span-1">
                  <label className="sm:w-40 lg:w-32 sm:text-right sm:pr-3 text-xs sm:text-sm font-medium text-gray-700">
                    DATA NASC.
                  </label>
                  <div className="flex-1">
                  {isEditing ? (
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={currentPatient.dataNascimento || ''}
                        onChange={(e) => {
                          let value = e.target.value;
                          
                          // Permitir deletar livremente
                          if (value.length < (currentPatient.dataNascimento || '').length) {
                            handleChange('dataNascimento', value);
                            return;
                          }
                          
                          // Aplicar máscara apenas ao adicionar caracteres
                          const numbers = value.replace(/\D/g, '');
                          let masked = '';
                          
                          if (numbers.length > 0) {
                            masked = numbers.slice(0, 2);
                            if (numbers.length >= 3) {
                              masked += '/' + numbers.slice(2, 4);
                            }
                            if (numbers.length >= 5) {
                              masked += '/' + numbers.slice(4, 8);
                            }
                          }
                          
                          handleChange('dataNascimento', masked);
                        }}
                        placeholder="DD/MM/AAAA"
                        maxLength={10}
                        aria-label="Data de nascimento"
                        className="flex-1 px-3 py-1.5 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => {
                            dateInputRefs.dataNascimento.current?.showPicker();
                          }}
                          className="flex-shrink-0 w-10 h-10 bg-gray-200 border border-gray-300 rounded hover:bg-gray-300 flex items-center justify-center"
                          title="Escolher data"
                        >
                          <Calendar className="w-5 h-5 text-gray-600" />
                        </button>
                        <input
                          ref={dateInputRefs.dataNascimento}
                          type="date"
                          value={(() => {
                            if (!currentPatient.dataNascimento) return '';
                            try {
                              const parts = currentPatient.dataNascimento.split('/');
                              if (parts.length === 3) {
                                const [day, month, year] = parts;
                                return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                              }
                            } catch (e) {
                              console.log('Erro ao converter data');
                            }
                            return '';
                          })()}
                          onChange={(e) => {
                            if (e.target.value) {
                              const [year, month, day] = e.target.value.split('-');
                              const brDate = `${day}/${month}/${year}`;
                              handleChange('dataNascimento', brDate);
                            }
                          }}
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
              </div>

              {/* Segunda Linha: Idade, Sexo */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Idade */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 lg:col-span-1">
                  <label className="sm:w-40 lg:w-32 sm:text-right sm:pr-3 text-xs sm:text-sm font-medium text-gray-700">
                    IDADE
                  </label>
                  <div className="flex-1">
                    <div className="px-3 py-1.5 bg-slate-300 border border-gray-300 rounded min-h-[34px] flex items-center">
                      {currentPatient.idade ? `${currentPatient.idade} anos` : '\u00A0'}
                      {isEditing && currentPatient.dataNascimento && (
                        <span className="ml-2 text-xs text-gray-500 italic">(auto)</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sexo */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 lg:col-span-1">
                  <label className="sm:w-40 lg:w-32 sm:text-right sm:pr-3 text-xs sm:text-sm font-medium text-gray-700">
                    SEXO
                  </label>
                  <div className="flex-1 relative">
                    {isEditing ? (
                      <CustomSelect
                        value={currentPatient.sexo || ''}
                        onChange={(value) => handleChange('sexo', value)}
                        options={[
                          { value: '', label: 'Selecione...' },
                          { value: 'M', label: 'M' },
                          { value: 'F', label: 'F' }
                        ]}
                        aria-label="Sexo"
                        className="border-gray-400 focus:ring-blue-500"
                      />
                    ) : (
                      <div className="px-3 py-1.5 bg-white border border-gray-300 rounded min-h-[34px]">
                        {currentPatient.sexo || '\u00A0'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Data da Consulta */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 lg:col-span-1">
                  <label className="sm:w-40 lg:w-32 sm:text-right sm:pr-3 text-xs sm:text-sm font-medium text-gray-700">
                    DATA CONSULTA
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
                          let value = e.target.value;
                          
                          // Permitir deletar livremente
                          if (value.length < (currentPatient.dataConsulta || '').length) {
                            handleChange('dataConsulta', value);
                            return;
                          }
                          
                          // Aplicar máscara apenas ao adicionar caracteres
                          const numbers = value.replace(/\D/g, '');
                          let masked = '';
                          
                          if (numbers.length > 0) {
                            masked = numbers.slice(0, 2);
                            if (numbers.length >= 3) {
                              masked += '/' + numbers.slice(2, 4);
                            }
                            if (numbers.length >= 5) {
                              masked += '/' + numbers.slice(4, 8);
                            }
                          }
                          
                          handleChange('dataConsulta', masked);
                        }}
                        placeholder="DD/MM/AAAA"
                        maxLength={10}
                        aria-label="Data da consulta"
                        className="flex-1 px-3 py-1.5 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => {
                            dateInputRefs.dataConsulta.current?.showPicker();
                          }}
                          className="flex-shrink-0 w-10 h-10 bg-gray-200 border border-gray-300 rounded hover:bg-gray-300 flex items-center justify-center"
                          title="Escolher data"
                        >
                          <Calendar className="w-5 h-5 text-gray-600" />
                        </button>
                        <input
                          ref={dateInputRefs.dataConsulta}
                          type="date"
                          value={(() => {
                            if (!currentPatient.dataConsulta) return '';
                            try {
                              const parts = currentPatient.dataConsulta.split('/');
                              if (parts.length === 3) {
                                const [day, month, year] = parts;
                                return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                              }
                            } catch (e) {
                              console.log('Erro ao converter data');
                            }
                            return '';
                          })()}
                          onChange={(e) => {
                            if (e.target.value) {
                              const [year, month, day] = e.target.value.split('-');
                              const brDate = `${day}/${month}/${year}`;
                              handleChange('dataConsulta', brDate);
                            }
                          }}
                          className="absolute top-0 left-0 opacity-0 pointer-events-none w-full h-full"
                          tabIndex={-1}
                          aria-label="Seletor de data da consulta"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="px-3 py-1.5 bg-white border border-gray-300 rounded">
                      {currentPatient.dataConsulta}
                    </div>
                  )}
                  </div>
                </div>

                {/* Convênio */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 lg:col-span-1">
                  <label className="sm:w-40 lg:w-32 sm:text-right sm:pr-3 text-xs sm:text-sm font-medium text-gray-700">
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
                    <CustomSelect
                      value={currentPatient.convenio || ''}
                      onChange={(value) => handleChange('convenio', value)}
                      options={CONVENIO_OPTIONS}
                      aria-label="Convênio"
                      className="border-gray-400 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="px-3 py-1.5 bg-white border border-gray-300 rounded">
                      {currentPatient.convenio}
                    </div>
                  )}
                  </div>
                </div>
              </div>

              {/* Terceira Linha: Data Consulta, Convênio */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Subtipo Convênio */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 lg:col-span-1">
                  <label className="sm:w-40 lg:w-32 sm:text-right sm:pr-3 text-xs sm:text-sm font-medium text-gray-700">
                    SUBTIPO
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
                    <CustomSelect
                      value={currentPatient.subtipoConvenio || ''}
                      onChange={(value) => handleChange('subtipoConvenio', value)}
                      options={SUBTIPO_OPTIONS}
                      aria-label="Subtipo do convênio"
                      className="border-gray-400 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="px-3 py-1.5 bg-white border border-gray-300 rounded">
                      {currentPatient.subtipoConvenio}
                    </div>
                  )}
                  </div>
                </div>

                {/* Resposta */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 lg:col-span-1">
                  <label className="sm:w-40 lg:w-32 sm:text-right sm:pr-3 text-xs sm:text-sm font-medium text-gray-700">
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
                    <CustomSelect
                      value={currentPatient.resposta || ''}
                      onChange={(value) => handleChange('resposta', value)}
                      options={RESPOSTA_OPTIONS}
                      aria-label="Resposta do paciente"
                      className="border-gray-400 focus:ring-blue-500"
                    />
                  ) : (
                    <div className={`px-3 py-1.5 border border-gray-300 rounded font-semibold min-h-[38px] flex items-center ${
                      currentPatient.resposta === 'NÃO COMPARECEU' ? 'bg-red-100 text-red-700' : 
                      currentPatient.resposta === 'COMPARECEU' ? 'bg-green-100 text-green-700' : 
                      'bg-white text-gray-400'
                    }`}>
                      {currentPatient.resposta || '\u00A0'}
                    </div>
                  )}
                  </div>
                </div>

                {/* Celular 1 */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 lg:col-span-1">
                  <label className="sm:w-40 lg:w-32 sm:text-right sm:pr-3 text-xs sm:text-sm font-medium text-gray-700">
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
                      value={maskCelular(currentPatient.celular || '')}
                      onChange={(e) => {
                        const masked = maskCelular(e.target.value);
                        handleChange('celular', masked);
                      }}
                      placeholder="(00) 00000-0000"
                      aria-label="Celular"
                      maxLength={15}
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
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 lg:col-span-1">
                  <label className="sm:w-40 lg:w-32 sm:text-right sm:pr-3 text-xs sm:text-sm font-medium text-gray-700">
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
                      value={maskTelFixo(currentPatient.telFixo || '')}
                      onChange={(e) => {
                        const masked = maskTelFixo(e.target.value);
                        handleChange('telFixo', masked);
                      }}
                      placeholder="(00) 0000-0000"
                      aria-label="Telefone fixo"
                      maxLength={14}
                      className="w-full px-3 py-1.5 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="px-3 py-1.5 bg-white border border-gray-300 rounded min-h-[38px] flex items-center">
                      {currentPatient.telFixo || '\u00A0'}
                    </div>
                  )}
                  </div>
                </div>
              </div>

              {/* Quarta Linha: Indicação, Data Cirurgia */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Indicação */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 lg:col-span-1">
                  <label className="sm:w-40 lg:w-32 sm:text-right sm:pr-3 text-xs sm:text-sm font-medium text-gray-700">
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
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 lg:col-span-1">
                  <label className="sm:w-40 lg:w-32 sm:text-right sm:pr-3 text-xs sm:text-sm font-medium text-gray-700">
                    DATA CIRURGIA
                  </label>
                <div className="flex-1">
                  {isEditing ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={currentPatient.dataCirurgia || ''}
                        onChange={(e) => {
                          let value = e.target.value;
                          
                          // Permitir deletar livremente
                          if (value.length < (currentPatient.dataCirurgia || '').length) {
                            handleChange('dataCirurgia', value);
                            return;
                          }
                          
                          // Aplicar máscara apenas ao adicionar caracteres
                          const numbers = value.replace(/\D/g, '');
                          let masked = '';
                          
                          if (numbers.length > 0) {
                            masked = numbers.slice(0, 2);
                            if (numbers.length >= 3) {
                              masked += '/' + numbers.slice(2, 4);
                            }
                            if (numbers.length >= 5) {
                              masked += '/' + numbers.slice(4, 8);
                            }
                          }
                          
                          handleChange('dataCirurgia', masked);
                        }}
                        placeholder="DD/MM/AAAA"
                        maxLength={10}
                        aria-label="Data da cirurgia"
                        className="flex-1 px-3 py-1.5 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => {
                            dateInputRefs.dataCirurgia.current?.showPicker();
                          }}
                          className="flex-shrink-0 w-10 h-10 bg-gray-200 border border-gray-300 rounded hover:bg-gray-300 flex items-center justify-center"
                          title="Escolher data"
                        >
                          <Calendar className="w-5 h-5 text-gray-600" />
                        </button>
                        <input
                          ref={dateInputRefs.dataCirurgia}
                          type="date"
                          value={(() => {
                            if (!currentPatient.dataCirurgia) return '';
                            try {
                              const parts = currentPatient.dataCirurgia.split('/');
                              if (parts.length === 3) {
                                const [day, month, year] = parts;
                                return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                              }
                            } catch (e) {
                              console.log('Erro ao converter data');
                            }
                            return '';
                          })()}
                          onChange={(e) => {
                            if (e.target.value) {
                              const [year, month, day] = e.target.value.split('-');
                              const brDate = `${day}/${month}/${year}`;
                              handleChange('dataCirurgia', brDate);
                            }
                          }}
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
              </div>

              {/* Quinta Linha: Profissão, Email */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Profissão */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 lg:col-span-1">
                  <label className="sm:w-40 lg:w-32 sm:text-right sm:pr-3 text-xs sm:text-sm font-medium text-gray-700">
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

                {/* Email */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 lg:col-span-1">
                  <label className="sm:w-40 lg:w-32 sm:text-right sm:pr-3 text-xs sm:text-sm font-medium text-gray-700">
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
              </div>

              {/* Sexta Linha: Resolvido, Classificação */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Resolvido */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 lg:col-span-1">
                  <label className="sm:w-40 lg:w-32 sm:text-right sm:pr-3 text-xs sm:text-sm font-medium text-gray-700">
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
                    <CustomSelect
                      value={currentPatient.resolvido || ''}
                      onChange={(value) => handleChange('resolvido', value)}
                      options={RESOLVIDO_OPTIONS}
                      aria-label="Status resolvido"
                      className="border-gray-400 focus:ring-blue-500"
                    />
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
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 lg:col-span-1">
                  <label className="sm:w-40 lg:w-32 sm:text-right sm:pr-3 text-xs sm:text-sm font-medium text-gray-700">
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
                    <div className="px-3 py-1.5 bg-white border border-gray-300 rounded min-h-[38px] flex items-center">
                      {currentPatient.classificacao || '\u00A0'}
                    </div>
                  )}
                  </div>
                </div>
              </div>

              {/* WhatsApp Checkboxes */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <label className="sm:w-40 sm:text-right sm:pr-4 text-xs sm:text-sm font-medium text-gray-700">
                  WHATSAPP
                </label>
                <div className="flex-1 flex gap-4">
                  <label className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      className="rounded" 
                      disabled={!isEditing}
                      checked={currentPatient.recall?.[0]?.whatsapp_contato_1 || false}
                      onChange={(e) => {
                        const recall = currentPatient.recall || [{ periodo: 0, status: 'pendente', observacao: '', contato_realizado: false, whatsapp_contato_1: false, whatsapp_contato_2: false, whatsapp_contato_3: false, whatsapp_contato_4: false, whatsapp_contato_5: false, ligacao_contato_1: false, ligacao_contato_2: false, ligacao_contato_3: false, ligacao_contato_4: false, ligacao_contato_5: false }];
                        recall[0] = { ...recall[0], whatsapp_contato_1: e.target.checked, whatsapp_data_1: e.target.checked ? new Date() : recall[0].whatsapp_data_1 };
                        handleChange('recall', recall);
                      }}
                    />
                    <span className="text-sm">1X</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      className="rounded" 
                      disabled={!isEditing}
                      checked={currentPatient.recall?.[0]?.whatsapp_contato_2 || false}
                      onChange={(e) => {
                        const recall = currentPatient.recall || [{ periodo: 0, status: 'pendente', observacao: '', contato_realizado: false, whatsapp_contato_1: false, whatsapp_contato_2: false, whatsapp_contato_3: false, whatsapp_contato_4: false, whatsapp_contato_5: false, ligacao_contato_1: false, ligacao_contato_2: false, ligacao_contato_3: false, ligacao_contato_4: false, ligacao_contato_5: false }];
                        recall[0] = { ...recall[0], whatsapp_contato_2: e.target.checked, whatsapp_data_2: e.target.checked ? new Date() : recall[0].whatsapp_data_2 };
                        handleChange('recall', recall);
                      }}
                    />
                    <span className="text-sm">2X</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      className="rounded" 
                      disabled={!isEditing}
                      checked={currentPatient.recall?.[0]?.whatsapp_contato_3 || false}
                      onChange={(e) => {
                        const recall = currentPatient.recall || [{ periodo: 0, status: 'pendente', observacao: '', contato_realizado: false, whatsapp_contato_1: false, whatsapp_contato_2: false, whatsapp_contato_3: false, whatsapp_contato_4: false, whatsapp_contato_5: false, ligacao_contato_1: false, ligacao_contato_2: false, ligacao_contato_3: false, ligacao_contato_4: false, ligacao_contato_5: false }];
                        recall[0] = { ...recall[0], whatsapp_contato_3: e.target.checked, whatsapp_data_3: e.target.checked ? new Date() : recall[0].whatsapp_data_3 };
                        handleChange('recall', recall);
                      }}
                    />
                    <span className="text-sm">3X</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      className="rounded" 
                      disabled={!isEditing}
                      checked={currentPatient.recall?.[0]?.whatsapp_contato_4 || false}
                      onChange={(e) => {
                        const recall = currentPatient.recall || [{ periodo: 0, status: 'pendente', observacao: '', contato_realizado: false, whatsapp_contato_1: false, whatsapp_contato_2: false, whatsapp_contato_3: false, whatsapp_contato_4: false, whatsapp_contato_5: false, ligacao_contato_1: false, ligacao_contato_2: false, ligacao_contato_3: false, ligacao_contato_4: false, ligacao_contato_5: false }];
                        recall[0] = { ...recall[0], whatsapp_contato_4: e.target.checked, whatsapp_data_4: e.target.checked ? new Date() : recall[0].whatsapp_data_4 };
                        handleChange('recall', recall);
                      }}
                    />
                    <span className="text-sm">4X</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      className="rounded" 
                      disabled={!isEditing}
                      checked={currentPatient.recall?.[0]?.whatsapp_contato_5 || false}
                      onChange={(e) => {
                        const recall = currentPatient.recall || [{ periodo: 0, status: 'pendente', observacao: '', contato_realizado: false, whatsapp_contato_1: false, whatsapp_contato_2: false, whatsapp_contato_3: false, whatsapp_contato_4: false, whatsapp_contato_5: false, ligacao_contato_1: false, ligacao_contato_2: false, ligacao_contato_3: false, ligacao_contato_4: false, ligacao_contato_5: false }];
                        recall[0] = { ...recall[0], whatsapp_contato_5: e.target.checked, whatsapp_data_5: e.target.checked ? new Date() : recall[0].whatsapp_data_5 };
                        handleChange('recall', recall);
                      }}
                    />
                    <span className="text-sm">5X</span>
                  </label>
                </div>
              </div>

              {/* Ligações Checkboxes */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <label className="sm:w-40 sm:text-right sm:pr-4 text-xs sm:text-sm font-medium text-gray-700">
                  LIGAÇÕES
                </label>
                <div className="flex-1 flex gap-4 items-center">
                  <label className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      className="rounded" 
                      disabled={!isEditing}
                      checked={currentPatient.recall?.[0]?.ligacao_contato_1 || false}
                      onChange={(e) => {
                        const recall = currentPatient.recall || [{ periodo: 0, status: 'pendente', observacao: '', contato_realizado: false, whatsapp_contato_1: false, whatsapp_contato_2: false, whatsapp_contato_3: false, whatsapp_contato_4: false, whatsapp_contato_5: false, ligacao_contato_1: false, ligacao_contato_2: false, ligacao_contato_3: false, ligacao_contato_4: false, ligacao_contato_5: false }];
                        recall[0] = { ...recall[0], ligacao_contato_1: e.target.checked, ligacao_data_1: e.target.checked ? new Date() : recall[0].ligacao_data_1 };
                        handleChange('recall', recall);
                      }}
                    />
                    <span className="text-sm">1X</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      className="rounded" 
                      disabled={!isEditing}
                      checked={currentPatient.recall?.[0]?.ligacao_contato_2 || false}
                      onChange={(e) => {
                        const recall = currentPatient.recall || [{ periodo: 0, status: 'pendente', observacao: '', contato_realizado: false, whatsapp_contato_1: false, whatsapp_contato_2: false, whatsapp_contato_3: false, whatsapp_contato_4: false, whatsapp_contato_5: false, ligacao_contato_1: false, ligacao_contato_2: false, ligacao_contato_3: false, ligacao_contato_4: false, ligacao_contato_5: false }];
                        recall[0] = { ...recall[0], ligacao_contato_2: e.target.checked, ligacao_data_2: e.target.checked ? new Date() : recall[0].ligacao_data_2 };
                        handleChange('recall', recall);
                      }}
                    />
                    <span className="text-sm">2X</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      className="rounded" 
                      disabled={!isEditing}
                      checked={currentPatient.recall?.[0]?.ligacao_contato_3 || false}
                      onChange={(e) => {
                        const recall = currentPatient.recall || [{ periodo: 0, status: 'pendente', observacao: '', contato_realizado: false, whatsapp_contato_1: false, whatsapp_contato_2: false, whatsapp_contato_3: false, whatsapp_contato_4: false, whatsapp_contato_5: false, ligacao_contato_1: false, ligacao_contato_2: false, ligacao_contato_3: false, ligacao_contato_4: false, ligacao_contato_5: false }];
                        recall[0] = { ...recall[0], ligacao_contato_3: e.target.checked, ligacao_data_3: e.target.checked ? new Date() : recall[0].ligacao_data_3 };
                        handleChange('recall', recall);
                      }}
                    />
                    <span className="text-sm">3X</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      className="rounded" 
                      disabled={!isEditing}
                      checked={currentPatient.recall?.[0]?.ligacao_contato_4 || false}
                      onChange={(e) => {
                        const recall = currentPatient.recall || [{ periodo: 0, status: 'pendente', observacao: '', contato_realizado: false, whatsapp_contato_1: false, whatsapp_contato_2: false, whatsapp_contato_3: false, whatsapp_contato_4: false, whatsapp_contato_5: false, ligacao_contato_1: false, ligacao_contato_2: false, ligacao_contato_3: false, ligacao_contato_4: false, ligacao_contato_5: false }];
                        recall[0] = { ...recall[0], ligacao_contato_4: e.target.checked, ligacao_data_4: e.target.checked ? new Date() : recall[0].ligacao_data_4 };
                        handleChange('recall', recall);
                      }}
                    />
                    <span className="text-sm">4X</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      className="rounded" 
                      disabled={!isEditing}
                      checked={currentPatient.recall?.[0]?.ligacao_contato_5 || false}
                      onChange={(e) => {
                        const recall = currentPatient.recall || [{ periodo: 0, status: 'pendente', observacao: '', contato_realizado: false, whatsapp_contato_1: false, whatsapp_contato_2: false, whatsapp_contato_3: false, whatsapp_contato_4: false, whatsapp_contato_5: false, ligacao_contato_1: false, ligacao_contato_2: false, ligacao_contato_3: false, ligacao_contato_4: false, ligacao_contato_5: false }];
                        recall[0] = { ...recall[0], ligacao_contato_5: e.target.checked, ligacao_data_5: e.target.checked ? new Date() : recall[0].ligacao_data_5 };
                        handleChange('recall', recall);
                      }}
                    />
                    <span className="text-sm">5X</span>
                  </label>
                  
                  {/* Botão RECALL com Popover */}
                  <div className="relative" ref={recallPopoverRef}>
                    <button
                      type="button"
                      onClick={() => setShowRecallPopover(!showRecallPopover)}
                      className="ml-2 sm:ml-4 px-2 sm:px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition-colors"
                    >
                      RECALL
                    </button>
                    
                    {showRecallPopover && (
                      <div className="fixed sm:absolute left-2 right-2 sm:left-0 sm:right-auto top-20 sm:top-full mt-2 w-auto sm:w-80 md:w-96 bg-white border border-gray-300 rounded-lg shadow-xl z-50 max-h-[70vh] sm:max-h-96 overflow-y-auto">
                        <div>
                          {/* WhatsApp 1 */}
                          <div className="bg-slate-300 p-2 sm:p-3">
                            <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">WHATSAPP 1</h4>
                            <div className="flex gap-2 sm:gap-3 flex-wrap">
                              <label className="flex items-center gap-1 sm:gap-1.5">
                                <input 
                                  type="checkbox" 
                                  className="rounded" 
                                  disabled={!isEditing}
                                  checked={currentPatient.recall?.[1]?.whatsapp_contato_1 || false}
                                  onChange={(e) => {
                                    const recall = currentPatient.recall || [];
                                    if (!recall[1]) recall[1] = { periodo: 2, status: 'pendente', observacao: '', contato_realizado: false, whatsapp_contato_1: false, whatsapp_contato_2: false, whatsapp_contato_3: false, whatsapp_contato_4: false, whatsapp_contato_5: false, ligacao_contato_1: false, ligacao_contato_2: false, ligacao_contato_3: false, ligacao_contato_4: false, ligacao_contato_5: false };
                                    recall[1] = { ...recall[1], whatsapp_contato_1: e.target.checked, whatsapp_data_1: e.target.checked ? new Date() : recall[1].whatsapp_data_1 };
                                    handleChange('recall', recall);
                                  }}
                                />
                                <span className="text-xs">1X</span>
                              </label>
                              <label className="flex items-center gap-1 sm:gap-1.5">
                                <input 
                                  type="checkbox" 
                                  className="rounded" 
                                  disabled={!isEditing}
                                  checked={currentPatient.recall?.[1]?.whatsapp_contato_2 || false}
                                  onChange={(e) => {
                                    const recall = currentPatient.recall || [];
                                    if (!recall[1]) recall[1] = { periodo: 2, status: 'pendente', observacao: '', contato_realizado: false, whatsapp_contato_1: false, whatsapp_contato_2: false, whatsapp_contato_3: false, whatsapp_contato_4: false, whatsapp_contato_5: false, ligacao_contato_1: false, ligacao_contato_2: false, ligacao_contato_3: false, ligacao_contato_4: false, ligacao_contato_5: false };
                                    recall[1] = { ...recall[1], whatsapp_contato_2: e.target.checked, whatsapp_data_2: e.target.checked ? new Date() : recall[1].whatsapp_data_2 };
                                    handleChange('recall', recall);
                                  }}
                                />
                                <span className="text-xs">2X</span>
                              </label>
                              <label className="flex items-center gap-1 sm:gap-1.5">
                                <input 
                                  type="checkbox" 
                                  className="rounded" 
                                  disabled={!isEditing}
                                  checked={currentPatient.recall?.[1]?.whatsapp_contato_3 || false}
                                  onChange={(e) => {
                                    const recall = currentPatient.recall || [];
                                    if (!recall[1]) recall[1] = { periodo: 2, status: 'pendente', observacao: '', contato_realizado: false, whatsapp_contato_1: false, whatsapp_contato_2: false, whatsapp_contato_3: false, whatsapp_contato_4: false, whatsapp_contato_5: false, ligacao_contato_1: false, ligacao_contato_2: false, ligacao_contato_3: false, ligacao_contato_4: false, ligacao_contato_5: false };
                                    recall[1] = { ...recall[1], whatsapp_contato_3: e.target.checked, whatsapp_data_3: e.target.checked ? new Date() : recall[1].whatsapp_data_3 };
                                    handleChange('recall', recall);
                                  }}
                                />
                                <span className="text-xs">3X</span>
                              </label>
                              <label className="flex items-center gap-1 sm:gap-1.5">
                                <input 
                                  type="checkbox" 
                                  className="rounded" 
                                  disabled={!isEditing}
                                  checked={currentPatient.recall?.[1]?.whatsapp_contato_4 || false}
                                  onChange={(e) => {
                                    const recall = currentPatient.recall || [];
                                    if (!recall[1]) recall[1] = { periodo: 2, status: 'pendente', observacao: '', contato_realizado: false, whatsapp_contato_1: false, whatsapp_contato_2: false, whatsapp_contato_3: false, whatsapp_contato_4: false, whatsapp_contato_5: false, ligacao_contato_1: false, ligacao_contato_2: false, ligacao_contato_3: false, ligacao_contato_4: false, ligacao_contato_5: false };
                                    recall[1] = { ...recall[1], whatsapp_contato_4: e.target.checked, whatsapp_data_4: e.target.checked ? new Date() : recall[1].whatsapp_data_4 };
                                    handleChange('recall', recall);
                                  }}
                                />
                                <span className="text-xs">4X</span>
                              </label>
                              <label className="flex items-center gap-1 sm:gap-1.5">
                                <input 
                                  type="checkbox" 
                                  className="rounded" 
                                  disabled={!isEditing}
                                  checked={currentPatient.recall?.[1]?.whatsapp_contato_5 || false}
                                  onChange={(e) => {
                                    const recall = currentPatient.recall || [];
                                    if (!recall[1]) recall[1] = { periodo: 2, status: 'pendente', observacao: '', contato_realizado: false, whatsapp_contato_1: false, whatsapp_contato_2: false, whatsapp_contato_3: false, whatsapp_contato_4: false, whatsapp_contato_5: false, ligacao_contato_1: false, ligacao_contato_2: false, ligacao_contato_3: false, ligacao_contato_4: false, ligacao_contato_5: false };
                                    recall[1] = { ...recall[1], whatsapp_contato_5: e.target.checked, whatsapp_data_5: e.target.checked ? new Date() : recall[1].whatsapp_data_5 };
                                    handleChange('recall', recall);
                                  }}
                                />
                                <span className="text-xs">5X</span>
                              </label>
                            </div>
                          </div>
                          
                          {/* Ligações 1 */}
                          <div className="bg-slate-300 p-2 sm:p-3">
                            <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">LIGAÇÕES 1</h4>
                            <div className="flex gap-2 sm:gap-3 flex-wrap">
                              <label className="flex items-center gap-1 sm:gap-1.5">
                                <input 
                                  type="checkbox" 
                                  className="rounded" 
                                  disabled={!isEditing}
                                  checked={currentPatient.recall?.[1]?.ligacao_contato_1 || false}
                                  onChange={(e) => {
                                    const recall = currentPatient.recall || [];
                                    if (!recall[1]) recall[1] = { periodo: 2, status: 'pendente', observacao: '', contato_realizado: false, whatsapp_contato_1: false, whatsapp_contato_2: false, whatsapp_contato_3: false, whatsapp_contato_4: false, whatsapp_contato_5: false, ligacao_contato_1: false, ligacao_contato_2: false, ligacao_contato_3: false, ligacao_contato_4: false, ligacao_contato_5: false };
                                    recall[1] = { ...recall[1], ligacao_contato_1: e.target.checked, ligacao_data_1: e.target.checked ? new Date() : recall[1].ligacao_data_1 };
                                    handleChange('recall', recall);
                                  }}
                                />
                                <span className="text-xs">1X</span>
                              </label>
                              <label className="flex items-center gap-1 sm:gap-1.5">
                                <input 
                                  type="checkbox" 
                                  className="rounded" 
                                  disabled={!isEditing}
                                  checked={currentPatient.recall?.[1]?.ligacao_contato_2 || false}
                                  onChange={(e) => {
                                    const recall = currentPatient.recall || [];
                                    if (!recall[1]) recall[1] = { periodo: 2, status: 'pendente', observacao: '', contato_realizado: false, whatsapp_contato_1: false, whatsapp_contato_2: false, whatsapp_contato_3: false, whatsapp_contato_4: false, whatsapp_contato_5: false, ligacao_contato_1: false, ligacao_contato_2: false, ligacao_contato_3: false, ligacao_contato_4: false, ligacao_contato_5: false };
                                    recall[1] = { ...recall[1], ligacao_contato_2: e.target.checked, ligacao_data_2: e.target.checked ? new Date() : recall[1].ligacao_data_2 };
                                    handleChange('recall', recall);
                                  }}
                                />
                                <span className="text-xs">2X</span>
                              </label>
                              <label className="flex items-center gap-1 sm:gap-1.5">
                                <input 
                                  type="checkbox" 
                                  className="rounded" 
                                  disabled={!isEditing}
                                  checked={currentPatient.recall?.[1]?.ligacao_contato_3 || false}
                                  onChange={(e) => {
                                    const recall = currentPatient.recall || [];
                                    if (!recall[1]) recall[1] = { periodo: 2, status: 'pendente', observacao: '', contato_realizado: false, whatsapp_contato_1: false, whatsapp_contato_2: false, whatsapp_contato_3: false, whatsapp_contato_4: false, whatsapp_contato_5: false, ligacao_contato_1: false, ligacao_contato_2: false, ligacao_contato_3: false, ligacao_contato_4: false, ligacao_contato_5: false };
                                    recall[1] = { ...recall[1], ligacao_contato_3: e.target.checked, ligacao_data_3: e.target.checked ? new Date() : recall[1].ligacao_data_3 };
                                    handleChange('recall', recall);
                                  }}
                                />
                                <span className="text-xs">3X</span>
                              </label>
                              <label className="flex items-center gap-1 sm:gap-1.5">
                                <input 
                                  type="checkbox" 
                                  className="rounded" 
                                  disabled={!isEditing}
                                  checked={currentPatient.recall?.[1]?.ligacao_contato_4 || false}
                                  onChange={(e) => {
                                    const recall = currentPatient.recall || [];
                                    if (!recall[1]) recall[1] = { periodo: 2, status: 'pendente', observacao: '', contato_realizado: false, whatsapp_contato_1: false, whatsapp_contato_2: false, whatsapp_contato_3: false, whatsapp_contato_4: false, whatsapp_contato_5: false, ligacao_contato_1: false, ligacao_contato_2: false, ligacao_contato_3: false, ligacao_contato_4: false, ligacao_contato_5: false };
                                    recall[1] = { ...recall[1], ligacao_contato_4: e.target.checked, ligacao_data_4: e.target.checked ? new Date() : recall[1].ligacao_data_4 };
                                    handleChange('recall', recall);
                                  }}
                                />
                                <span className="text-xs">4X</span>
                              </label>
                              <label className="flex items-center gap-1 sm:gap-1.5">
                                <input 
                                  type="checkbox" 
                                  className="rounded" 
                                  disabled={!isEditing}
                                  checked={currentPatient.recall?.[1]?.ligacao_contato_5 || false}
                                  onChange={(e) => {
                                    const recall = currentPatient.recall || [];
                                    if (!recall[1]) recall[1] = { periodo: 2, status: 'pendente', observacao: '', contato_realizado: false, whatsapp_contato_1: false, whatsapp_contato_2: false, whatsapp_contato_3: false, whatsapp_contato_4: false, whatsapp_contato_5: false, ligacao_contato_1: false, ligacao_contato_2: false, ligacao_contato_3: false, ligacao_contato_4: false, ligacao_contato_5: false };
                                    recall[1] = { ...recall[1], ligacao_contato_5: e.target.checked, ligacao_data_5: e.target.checked ? new Date() : recall[1].ligacao_data_5 };
                                    handleChange('recall', recall);
                                  }}
                                />
                                <span className="text-xs">5X</span>
                              </label>
                            </div>
                          </div>
                          
                          {/* WhatsApp 2 */}
                          <div className="p-2 sm:p-3">
                            <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">WHATSAPP 2</h4>
                            <div className="flex gap-2 sm:gap-3 flex-wrap">
                              {[1, 2, 3, 4, 5].map((num) => (
                                <label key={`wa2-${num}`} className="flex items-center gap-1 sm:gap-1.5">
                                  <input 
                                    type="checkbox" 
                                    className="rounded" 
                                    disabled={!isEditing}
                                    checked={(currentPatient.recall?.[2] as any)?.[`whatsapp_contato_${num}`] || false}
                                    onChange={(e) => {
                                      const recall = currentPatient.recall || [];
                                      if (!recall[2]) recall[2] = { periodo: 3, status: 'pendente', observacao: '', contato_realizado: false, whatsapp_contato_1: false, whatsapp_contato_2: false, whatsapp_contato_3: false, whatsapp_contato_4: false, whatsapp_contato_5: false, ligacao_contato_1: false, ligacao_contato_2: false, ligacao_contato_3: false, ligacao_contato_4: false, ligacao_contato_5: false };
                                      recall[2] = { ...recall[2], [`whatsapp_contato_${num}`]: e.target.checked, [`whatsapp_data_${num}`]: e.target.checked ? new Date() : (recall[2] as any)[`whatsapp_data_${num}`] };
                                      handleChange('recall', recall);
                                    }}
                                  />
                                  <span className="text-[10px] sm:text-xs">{num}X</span>
                                </label>
                              ))}
                            </div>
                          </div>
                          
                          {/* Ligações 2 */}
                          <div className="p-2 sm:p-3">
                            <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">LIGAÇÕES 2</h4>
                            <div className="flex gap-2 sm:gap-3 flex-wrap">
                              {[1, 2, 3, 4, 5].map((num) => (
                                <label key={`lig2-${num}`} className="flex items-center gap-1 sm:gap-1.5">
                                  <input 
                                    type="checkbox" 
                                    className="rounded" 
                                    disabled={!isEditing}
                                    checked={(currentPatient.recall?.[2] as any)?.[`ligacao_contato_${num}`] || false}
                                    onChange={(e) => {
                                      const recall = currentPatient.recall || [];
                                      if (!recall[2]) recall[2] = { periodo: 3, status: 'pendente', observacao: '', contato_realizado: false, whatsapp_contato_1: false, whatsapp_contato_2: false, whatsapp_contato_3: false, whatsapp_contato_4: false, whatsapp_contato_5: false, ligacao_contato_1: false, ligacao_contato_2: false, ligacao_contato_3: false, ligacao_contato_4: false, ligacao_contato_5: false };
                                      recall[2] = { ...recall[2], [`ligacao_contato_${num}`]: e.target.checked, [`ligacao_data_${num}`]: e.target.checked ? new Date() : (recall[2] as any)[`ligacao_data_${num}`] };
                                      handleChange('recall', recall);
                                    }}
                                  />
                                  <span className="text-[10px] sm:text-xs">{num}X</span>
                                </label>
                              ))}
                            </div>
                          </div>
                          
                          {/* WhatsApp 3 */}
                          <div className="bg-slate-300 p-2 sm:p-3">
                            <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">WHATSAPP 3</h4>
                            <div className="flex gap-2 sm:gap-3 flex-wrap">
                              {[1, 2, 3, 4, 5].map((num) => (
                                <label key={`wa3-${num}`} className="flex items-center gap-1 sm:gap-1.5">
                                  <input 
                                    type="checkbox" 
                                    className="rounded" 
                                    disabled={!isEditing}
                                    checked={(currentPatient.recall?.[3] as any)?.[`whatsapp_contato_${num}`] || false}
                                    onChange={(e) => {
                                      const recall = currentPatient.recall || [];
                                      if (!recall[3]) recall[3] = { periodo: 4, status: 'pendente', observacao: '', contato_realizado: false, whatsapp_contato_1: false, whatsapp_contato_2: false, whatsapp_contato_3: false, whatsapp_contato_4: false, whatsapp_contato_5: false, ligacao_contato_1: false, ligacao_contato_2: false, ligacao_contato_3: false, ligacao_contato_4: false, ligacao_contato_5: false };
                                      recall[3] = { ...recall[3], [`whatsapp_contato_${num}`]: e.target.checked, [`whatsapp_data_${num}`]: e.target.checked ? new Date() : (recall[3] as any)[`whatsapp_data_${num}`] };
                                      handleChange('recall', recall);
                                    }}
                                  />
                                  <span className="text-[10px] sm:text-xs">{num}X</span>
                                </label>
                              ))}
                            </div>
                          </div>
                          
                          {/* Ligações 3 */}
                          <div className="bg-slate-300 p-2 sm:p-3">
                            <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">LIGAÇÕES 3</h4>
                            <div className="flex gap-2 sm:gap-3 flex-wrap">
                              {[1, 2, 3, 4, 5].map((num) => (
                                <label key={`lig3-${num}`} className="flex items-center gap-1 sm:gap-1.5">
                                  <input 
                                    type="checkbox" 
                                    className="rounded" 
                                    disabled={!isEditing}
                                    checked={(currentPatient.recall?.[3] as any)?.[`ligacao_contato_${num}`] || false}
                                    onChange={(e) => {
                                      const recall = currentPatient.recall || [];
                                      if (!recall[3]) recall[3] = { periodo: 4, status: 'pendente', observacao: '', contato_realizado: false, whatsapp_contato_1: false, whatsapp_contato_2: false, whatsapp_contato_3: false, whatsapp_contato_4: false, whatsapp_contato_5: false, ligacao_contato_1: false, ligacao_contato_2: false, ligacao_contato_3: false, ligacao_contato_4: false, ligacao_contato_5: false };
                                      recall[3] = { ...recall[3], [`ligacao_contato_${num}`]: e.target.checked, [`ligacao_data_${num}`]: e.target.checked ? new Date() : (recall[3] as any)[`ligacao_data_${num}`] };
                                      handleChange('recall', recall);
                                    }}
                                  />
                                  <span className="text-[10px] sm:text-xs">{num}X</span>
                                </label>
                              ))}
                            </div>
                          </div>
                          
                          {/* WhatsApp 4 */}
                          <div className="p-2 sm:p-3">
                            <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">WHATSAPP 4</h4>
                            <div className="flex gap-2 sm:gap-3 flex-wrap">
                              {[1, 2, 3, 4, 5].map((num) => (
                                <label key={`wa4-${num}`} className="flex items-center gap-1 sm:gap-1.5">
                                  <input 
                                    type="checkbox" 
                                    className="rounded" 
                                    disabled={!isEditing}
                                    checked={(currentPatient.recall?.[4] as any)?.[`whatsapp_contato_${num}`] || false}
                                    onChange={(e) => {
                                      const recall = currentPatient.recall || [];
                                      if (!recall[4]) recall[4] = { periodo: 5, status: 'pendente', observacao: '', contato_realizado: false, whatsapp_contato_1: false, whatsapp_contato_2: false, whatsapp_contato_3: false, whatsapp_contato_4: false, whatsapp_contato_5: false, ligacao_contato_1: false, ligacao_contato_2: false, ligacao_contato_3: false, ligacao_contato_4: false, ligacao_contato_5: false };
                                      recall[4] = { ...recall[4], [`whatsapp_contato_${num}`]: e.target.checked, [`whatsapp_data_${num}`]: e.target.checked ? new Date() : (recall[4] as any)[`whatsapp_data_${num}`] };
                                      handleChange('recall', recall);
                                    }}
                                  />
                                  <span className="text-[10px] sm:text-xs">{num}X</span>
                                </label>
                              ))}
                            </div>
                          </div>
                          
                          {/* Ligações 4 */}
                          <div className="p-2 sm:p-3">
                            <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">LIGAÇÕES 4</h4>
                            <div className="flex gap-2 sm:gap-3 flex-wrap">
                              {[1, 2, 3, 4, 5].map((num) => (
                                <label key={`lig4-${num}`} className="flex items-center gap-1 sm:gap-1.5">
                                  <input 
                                    type="checkbox" 
                                    className="rounded" 
                                    disabled={!isEditing}
                                    checked={(currentPatient.recall?.[4] as any)?.[`ligacao_contato_${num}`] || false}
                                    onChange={(e) => {
                                      const recall = currentPatient.recall || [];
                                      if (!recall[4]) recall[4] = { periodo: 5, status: 'pendente', observacao: '', contato_realizado: false, whatsapp_contato_1: false, whatsapp_contato_2: false, whatsapp_contato_3: false, whatsapp_contato_4: false, whatsapp_contato_5: false, ligacao_contato_1: false, ligacao_contato_2: false, ligacao_contato_3: false, ligacao_contato_4: false, ligacao_contato_5: false };
                                      recall[4] = { ...recall[4], [`ligacao_contato_${num}`]: e.target.checked, [`ligacao_data_${num}`]: e.target.checked ? new Date() : (recall[4] as any)[`ligacao_data_${num}`] };
                                      handleChange('recall', recall);
                                    }}
                                  />
                                  <span className="text-[10px] sm:text-xs">{num}X</span>
                                </label>
                              ))}
                            </div>
                          </div>
                          
                          {/* WhatsApp 5 */}
                          <div className="bg-slate-300 p-2 sm:p-3">
                            <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">WHATSAPP 5</h4>
                            <div className="flex gap-2 sm:gap-3 flex-wrap">
                              {[1, 2, 3, 4, 5].map((num) => (
                                <label key={`wa5-${num}`} className="flex items-center gap-1 sm:gap-1.5">
                                  <input 
                                    type="checkbox" 
                                    className="rounded" 
                                    disabled={!isEditing}
                                    checked={(currentPatient.recall?.[5] as any)?.[`whatsapp_contato_${num}`] || false}
                                    onChange={(e) => {
                                      const recall = currentPatient.recall || [];
                                      if (!recall[5]) recall[5] = { periodo: 6, status: 'pendente', observacao: '', contato_realizado: false, whatsapp_contato_1: false, whatsapp_contato_2: false, whatsapp_contato_3: false, whatsapp_contato_4: false, whatsapp_contato_5: false, ligacao_contato_1: false, ligacao_contato_2: false, ligacao_contato_3: false, ligacao_contato_4: false, ligacao_contato_5: false };
                                      recall[5] = { ...recall[5], [`whatsapp_contato_${num}`]: e.target.checked, [`whatsapp_data_${num}`]: e.target.checked ? new Date() : (recall[5] as any)[`whatsapp_data_${num}`] };
                                      handleChange('recall', recall);
                                    }}
                                  />
                                  <span className="text-[10px] sm:text-xs">{num}X</span>
                                </label>
                              ))}
                            </div>
                          </div>
                          
                          {/* Ligações 5 */}
                          <div className="bg-slate-300 p-2 sm:p-3">
                            <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">LIGAÇÕES 5</h4>
                            <div className="flex gap-2 sm:gap-3 flex-wrap">
                              {[1, 2, 3, 4, 5].map((num) => (
                                <label key={`lig5-${num}`} className="flex items-center gap-1 sm:gap-1.5">
                                  <input 
                                    type="checkbox" 
                                    className="rounded" 
                                    disabled={!isEditing}
                                    checked={(currentPatient.recall?.[5] as any)?.[`ligacao_contato_${num}`] || false}
                                    onChange={(e) => {
                                      const recall = currentPatient.recall || [];
                                      if (!recall[5]) recall[5] = { periodo: 6, status: 'pendente', observacao: '', contato_realizado: false, whatsapp_contato_1: false, whatsapp_contato_2: false, whatsapp_contato_3: false, whatsapp_contato_4: false, whatsapp_contato_5: false, ligacao_contato_1: false, ligacao_contato_2: false, ligacao_contato_3: false, ligacao_contato_4: false, ligacao_contato_5: false };
                                      recall[5] = { ...recall[5], [`ligacao_contato_${num}`]: e.target.checked, [`ligacao_data_${num}`]: e.target.checked ? new Date() : (recall[5] as any)[`ligacao_data_${num}`] };
                                      handleChange('recall', recall);
                                    }}
                                  />
                                  <span className="text-[10px] sm:text-xs">{num}X</span>
                                </label>
                              ))}
                            </div>
                          </div>
                          
                          {/* WhatsApp 6 */}
                          <div className="p-2 sm:p-3">
                            <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">WHATSAPP 6</h4>
                            <div className="flex gap-2 sm:gap-3 flex-wrap">
                              {[1, 2, 3, 4, 5].map((num) => (
                                <label key={`wa6-${num}`} className="flex items-center gap-1 sm:gap-1.5">
                                  <input 
                                    type="checkbox" 
                                    className="rounded" 
                                    disabled={!isEditing}
                                    checked={(currentPatient.recall?.[6] as any)?.[`whatsapp_contato_${num}`] || false}
                                    onChange={(e) => {
                                      const recall = currentPatient.recall || [];
                                      if (!recall[6]) recall[6] = { periodo: 7, status: 'pendente', observacao: '', contato_realizado: false, whatsapp_contato_1: false, whatsapp_contato_2: false, whatsapp_contato_3: false, whatsapp_contato_4: false, whatsapp_contato_5: false, ligacao_contato_1: false, ligacao_contato_2: false, ligacao_contato_3: false, ligacao_contato_4: false, ligacao_contato_5: false };
                                      recall[6] = { ...recall[6], [`whatsapp_contato_${num}`]: e.target.checked, [`whatsapp_data_${num}`]: e.target.checked ? new Date() : (recall[6] as any)[`whatsapp_data_${num}`] };
                                      handleChange('recall', recall);
                                    }}
                                  />
                                  <span className="text-[10px] sm:text-xs">{num}X</span>
                                </label>
                              ))}
                            </div>
                          </div>
                          
                          {/* Ligações 6 */}
                          <div className="p-2 sm:p-3">
                            <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">LIGAÇÕES 6</h4>
                            <div className="flex gap-2 sm:gap-3 flex-wrap">
                              {[1, 2, 3, 4, 5].map((num) => (
                                <label key={`lig6-${num}`} className="flex items-center gap-1 sm:gap-1.5">
                                  <input 
                                    type="checkbox" 
                                    className="rounded" 
                                    disabled={!isEditing}
                                    checked={(currentPatient.recall?.[6] as any)?.[`ligacao_contato_${num}`] || false}
                                    onChange={(e) => {
                                      const recall = currentPatient.recall || [];
                                      if (!recall[6]) recall[6] = { periodo: 7, status: 'pendente', observacao: '', contato_realizado: false, whatsapp_contato_1: false, whatsapp_contato_2: false, whatsapp_contato_3: false, whatsapp_contato_4: false, whatsapp_contato_5: false, ligacao_contato_1: false, ligacao_contato_2: false, ligacao_contato_3: false, ligacao_contato_4: false, ligacao_contato_5: false };
                                      recall[6] = { ...recall[6], [`ligacao_contato_${num}`]: e.target.checked, [`ligacao_data_${num}`]: e.target.checked ? new Date() : (recall[6] as any)[`ligacao_data_${num}`] };
                                      handleChange('recall', recall);
                                    }}
                                  />
                                  <span className="text-[10px] sm:text-xs">{num}X</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
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

              {/* Alerta */}
              <div className="flex items-start">
                <label className="w-40 text-right pr-4 text-sm font-medium text-gray-700 pt-2 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  ALERTA
                </label>
                <div className="flex-1">
                  {isSearching ? (
                    <input
                      type="text"
                      value={searchTerms.alerta || ''}
                      onChange={(e) => handleSearchChange('alerta', e.target.value)}
                      placeholder="Buscar por alerta..."
                      aria-label="Buscar alerta"
                      className="w-full px-3 py-1.5 border border-orange-400 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 bg-yellow-50"
                    />
                  ) : isEditing ? (
                    <textarea
                      value={currentPatient.alerta || ''}
                      onChange={(e) => handleChange('alerta', e.target.value)}
                      rows={2}
                      aria-label="Alerta"
                      className="w-full px-3 py-1.5 border border-red-400 rounded focus:outline-none focus:ring-2 focus:ring-red-500 bg-red-50"
                    />
                  ) : (
                    <div className="px-3 py-1.5 bg-red-50 border border-red-300 rounded min-h-[60px] whitespace-pre-wrap text-red-700">
                      {currentPatient.alerta}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Portal ToDo's - Seção inferior */}
          <div className="mt-6 bg-gradient-to-b from-gray-100 to-gray-200 border-2 border-gray-400 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-blue-600 text-white px-3 py-1 rounded font-bold text-sm">
                ToDo's
              </div>
              <h3 className="font-bold text-gray-800">Tarefas do Paciente</h3>
            </div>

            {/* Formulário de novo ToDo */}
            <div className="bg-white border-2 border-gray-300 rounded-lg p-3 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                <div className="md:col-span-1">
                  <label className="block text-xs font-bold text-gray-700 mb-1">NOME ToDo's</label>
                  <input
                    type="text"
                    value={newTodo.nome || ''}
                    onChange={(e) => setNewTodo({ ...newTodo, nome: e.target.value })}
                    className="w-full px-2 py-1.5 border border-gray-400 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nome do paciente"
                  />
                </div>
                
                <div className="md:col-span-1">
                  <label className="block text-xs font-bold text-gray-700 mb-1">DATA ToDo's</label>
                  <input
                    type="date"
                    value={newTodo.data || ''}
                    onChange={(e) => setNewTodo({ ...newTodo, data: e.target.value })}
                    aria-label="Data da tarefa"
                    className="w-full px-2 py-1.5 border border-gray-400 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="md:col-span-1">
                  <label className="block text-xs font-bold text-gray-700 mb-1">AÇÃO ToDo's</label>
                  <select
                    value={newTodo.acao || ''}
                    onChange={(e) => setNewTodo({ ...newTodo, acao: e.target.value })}
                    aria-label="Ação da tarefa"
                    className="w-full px-2 py-1.5 border border-gray-400 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selecione...</option>
                    <option value="Ligar">Ligar</option>
                    <option value="Email">Email</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="SMS">SMS</option>
                    <option value="Consulta">Consulta</option>
                    <option value="Retorno">Retorno</option>
                  </select>
                </div>
                
                <div className="md:col-span-1">
                  <label className="block text-xs font-bold text-gray-700 mb-1">FINALIDADE ToDo's</label>
                  <input
                    type="text"
                    value={newTodo.finalidade || ''}
                    onChange={(e) => setNewTodo({ ...newTodo, finalidade: e.target.value })}
                    className="w-full px-2 py-1.5 border border-gray-400 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Finalidade"
                  />
                </div>
                
                <div className="md:col-span-1">
                  <label className="block text-xs font-bold text-gray-700 mb-1">RESOLVIDO ToDo's</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="checkbox"
                      checked={newTodo.resolvido === 'Sim'}
                      onChange={(e) => setNewTodo({ ...newTodo, resolvido: e.target.checked ? 'Sim' : 'Não' })}
                      aria-label="Tarefa resolvida"
                      className="w-5 h-5 border-2 border-gray-400 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={handleAddTodo}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded font-bold text-sm flex items-center justify-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      Adicionar
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Lista de ToDos */}
            {todos.length > 0 && (
              <div className="bg-white border-2 border-gray-300 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gradient-to-b from-blue-100 to-blue-200 border-b-2 border-gray-300">
                    <tr>
                      <th className="px-3 py-2 text-left font-bold text-gray-800 border-r border-gray-300">NOME</th>
                      <th className="px-3 py-2 text-left font-bold text-gray-800 border-r border-gray-300">DATA</th>
                      <th className="px-3 py-2 text-left font-bold text-gray-800 border-r border-gray-300">AÇÃO</th>
                      <th className="px-3 py-2 text-left font-bold text-gray-800 border-r border-gray-300">FINALIDADE</th>
                      <th className="px-3 py-2 text-left font-bold text-gray-800 border-r border-gray-300">RESOLVIDO</th>
                      <th className="px-3 py-2 text-center font-bold text-gray-800">AÇÕES</th>
                    </tr>
                  </thead>
                  <tbody>
                    {todos.map((todo, index) => (
                      <tr key={todo.id} className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        <td className="px-3 py-2 border-r border-gray-200">{todo.nome}</td>
                        <td className="px-3 py-2 border-r border-gray-200">
                          {todo.data ? new Date(todo.data).toLocaleDateString('pt-BR') : ''}
                        </td>
                        <td className="px-3 py-2 border-r border-gray-200">{todo.acao}</td>
                        <td className="px-3 py-2 border-r border-gray-200">{todo.finalidade}</td>
                        <td className="px-3 py-2 border-r border-gray-200">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            todo.resolvido === 'Sim' 
                              ? 'bg-green-200 text-green-800' 
                              : 'bg-yellow-200 text-yellow-800'
                          }`}>
                            {todo.resolvido || 'Não'}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-center">
                          <button
                            onClick={() => handleDeleteTodo(todo.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1 mx-auto"
                          >
                            <Trash2 className="w-3 h-3" />
                            Excluir
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {todos.length === 0 && (
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 font-semibold">Nenhuma tarefa cadastrada</p>
                <p className="text-gray-400 text-sm">Adicione tarefas usando o formulário acima</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
