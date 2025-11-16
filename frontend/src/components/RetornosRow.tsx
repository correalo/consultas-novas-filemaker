'use client';

interface RetornosRowProps {
  periodo: string;
  periodoAbrev: string;
  index: number;
}

export default function RetornosRow({ periodo, periodoAbrev, index }: RetornosRowProps) {
  const isEven = index % 2 === 0;
  
  return (
    <div className={`border-b border-gray-300 pb-2 pt-2 px-2 ${
      isEven ? 'bg-gray-300' : 'bg-white'
    }`}>
      {/* Primeira linha: EXAMES, DATA, SIM/NÃO, ENCAMINHAR */}
      <div className="grid grid-cols-12 gap-2 items-center text-xs mb-2">
        {/* Campo EXAMES */}
        <div className="col-span-3">
          <input 
            type="text" 
            placeholder={`EXAMES ${periodo}`}
            className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500" 
          />
        </div>
        
        {/* Campo DATA */}
        <div className="col-span-2">
          <input 
            type="date"
            aria-label={`Data ${periodo}`}
            className="w-full px-1 py-1 border border-gray-300 rounded text-[10px] focus:outline-none focus:ring-1 focus:ring-blue-500" 
          />
        </div>
        
        {/* Checkboxes SIM/NÃO */}
        <div className="col-span-2 flex gap-1 items-center justify-center">
          <label className="flex items-center gap-0.5">
            <input type="checkbox" className="w-3 h-3" />
            <span className="text-[10px]">SIM</span>
          </label>
          <label className="flex items-center gap-0.5">
            <input type="checkbox" className="w-3 h-3" />
            <span className="text-[10px]">NÃO</span>
          </label>
        </div>
        
        {/* ENCAMINHAR EXS */}
        <div className="col-span-5 flex items-center gap-1">
          <span className="text-[10px] font-semibold whitespace-nowrap">ENCAMINHAR EXS {periodoAbrev}</span>
          <label className="flex items-center gap-0.5">
            <input type="checkbox" className="w-3 h-3" />
            <span className="text-[10px]">SIM</span>
          </label>
        </div>
      </div>

      {/* Segunda linha: WHATSAPP e LIGAÇÃO */}
      <div className="grid grid-cols-12 gap-2 items-center text-xs">
        {/* WHATSAPP */}
        <div className="col-span-6 flex items-center gap-1">
          <span className="text-[10px] font-semibold whitespace-nowrap">WHATSAPP {periodoAbrev}</span>
          <button className="px-1.5 py-0.5 bg-gray-200 border border-gray-400 rounded text-[10px] hover:bg-gray-300 transition-colors">1X</button>
          <button className="px-1.5 py-0.5 bg-gray-200 border border-gray-400 rounded text-[10px] hover:bg-gray-300 transition-colors">2X</button>
          <button className="px-1.5 py-0.5 bg-gray-200 border border-gray-400 rounded text-[10px] hover:bg-gray-300 transition-colors">3X</button>
          <button className="px-1.5 py-0.5 bg-gray-200 border border-gray-400 rounded text-[10px] hover:bg-gray-300 transition-colors">LIMBO</button>
        </div>
        
        {/* LIGAÇÃO */}
        <div className="col-span-6 flex items-center gap-1">
          <span className="text-[10px] font-semibold whitespace-nowrap">LIGAÇÃO {periodoAbrev}</span>
          <button className="px-1.5 py-0.5 bg-gray-200 border border-gray-400 rounded text-[10px] hover:bg-gray-300 transition-colors">1X</button>
          <button className="px-1.5 py-0.5 bg-gray-200 border border-gray-400 rounded text-[10px] hover:bg-gray-300 transition-colors">2X</button>
          <button className="px-1.5 py-0.5 bg-gray-200 border border-gray-400 rounded text-[10px] hover:bg-gray-300 transition-colors">3X</button>
          <button className="px-1.5 py-0.5 bg-gray-200 border border-gray-400 rounded text-[10px] hover:bg-gray-300 transition-colors">4X</button>
          <button className="px-1.5 py-0.5 bg-gray-200 border border-gray-400 rounded text-[10px] hover:bg-gray-300 transition-colors">5X</button>
        </div>
      </div>
    </div>
  );
}
