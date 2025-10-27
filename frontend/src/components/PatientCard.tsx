'use client';

import { Patient } from '@/types';
import { formatDate, formatPhone, getStatusColor, cn } from '@/lib/utils';
import { Calendar, Phone, FileText, Building2, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface PatientCardProps {
  patient: Patient;
}

export default function PatientCard({ patient }: PatientCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{patient.nome}</h2>
          <div className="flex gap-2 flex-wrap mt-2">
            {patient.resolvido && (
              <span className={cn('px-3 py-1 rounded-full text-sm font-medium', getStatusColor(patient.resolvido))}>
                {patient.resolvido}
              </span>
            )}
            {patient.classificacao && (
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-700">
                {patient.classificacao}
              </span>
            )}
          </div>
        </div>
        {patient.ano && (
          <div className="bg-primary-50 rounded-xl px-4 py-2">
            <p className="text-sm text-primary-600 font-medium">Ano</p>
            <p className="text-2xl font-bold text-primary-700">{patient.ano}</p>
          </div>
        )}
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {patient.celular && (
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="bg-primary-100 p-2 rounded-lg">
              <Phone className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Celular</p>
              <p className="text-sm font-semibold text-gray-800">{formatPhone(patient.celular)}</p>
            </div>
          </div>
        )}

        {patient.telFixo && (
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="bg-secondary-100 p-2 rounded-lg">
              <Phone className="w-5 h-5 text-secondary-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Tel. Fixo</p>
              <p className="text-sm font-semibold text-gray-800">{formatPhone(patient.telFixo)}</p>
            </div>
          </div>
        )}

        {patient.dd3 && (
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="bg-success-100 p-2 rounded-lg">
              <Phone className="w-5 h-5 text-success-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">DD3</p>
              <p className="text-sm font-semibold text-gray-800">{patient.dd3}</p>
            </div>
          </div>
        )}

        {patient.dataConsulta && (
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Data da Consulta</p>
              <p className="text-sm font-semibold text-gray-800">{formatDate(patient.dataConsulta)}</p>
            </div>
          </div>
        )}
      </div>

      {/* Medical Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        {patient.convenio && (
          <div className="p-3 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="w-4 h-4 text-emerald-600" />
              <p className="text-xs text-emerald-600 font-medium">Convênio</p>
            </div>
            <p className="text-sm font-semibold text-gray-800">{patient.convenio}</p>
          </div>
        )}

        {patient.subtipoConvenio && (
          <div className="p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="w-4 h-4 text-blue-600" />
              <p className="text-xs text-blue-600 font-medium">Subtipo Convênio</p>
            </div>
            <p className="text-sm font-semibold text-gray-800">{patient.subtipoConvenio}</p>
          </div>
        )}

        {patient.indicacao && (
          <div className="p-3 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-4 h-4 text-indigo-600" />
              <p className="text-xs text-indigo-600 font-medium">Indicação</p>
            </div>
            <p className="text-sm font-semibold text-gray-800">{patient.indicacao}</p>
          </div>
        )}

        {patient.resposta && (
          <div className="p-3 bg-gradient-to-br from-pink-50 to-rose-50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-4 h-4 text-pink-600" />
              <p className="text-xs text-pink-600 font-medium">Resposta</p>
            </div>
            <p className="text-sm font-semibold text-gray-800">{patient.resposta}</p>
          </div>
        )}
      </div>

      {/* Observations */}
      {patient.observacao && (
        <div className="p-4 bg-amber-50 rounded-lg border border-amber-100 mb-4">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <p className="text-xs text-amber-600 font-medium mb-1">Observação</p>
              <p className="text-sm text-gray-700 leading-relaxed">{patient.observacao}</p>
            </div>
          </div>
        </div>
      )}

      {/* Alert */}
      {patient.alerta && (
        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <p className="text-xs text-red-600 font-medium mb-1">Alerta</p>
              <p className="text-sm text-red-700 leading-relaxed font-semibold">{patient.alerta}</p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
