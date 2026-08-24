import { ThemeMode } from '../types';

export interface ThemeStyles {
  id: ThemeMode;
  name: string;
  bodyBg: string;
  cardBg: string;
  subtleBg: string;
  textColor: string;
  mutedText: string;
  borderColor: string;
  thickBorderColor: string;
  gridBg: string;
  cellBg: string;
  initialCellText: string;
  userCellText: string;
  selectedCellBg: string;
  peerCellBg: string;
  sameNumberBg: string;
  errorCellBg: string;
  errorCellText: string;
  hintTargetBg: string;
  hintPeerBg: string;
  noteText: string;
  accentBtn: string;
  accentBtnHover: string;
  accentText: string;
  controlBtnBg: string;
  controlBtnText: string;
  controlBtnActiveBg: string;
}

export const THEMES: Record<ThemeMode, ThemeStyles> = {
  'elegant-dark': {
    id: 'elegant-dark',
    name: 'Elegant Dark',
    bodyBg: 'bg-[#121212]',
    cardBg: 'bg-[#161616]',
    subtleBg: 'bg-[#252525]',
    textColor: 'text-slate-200',
    mutedText: 'text-slate-400',
    borderColor: 'border-slate-800',
    thickBorderColor: 'border-slate-700',
    gridBg: 'bg-slate-900',
    cellBg: 'bg-[#1a1a1a]',
    initialCellText: 'text-white font-light',
    userCellText: 'text-indigo-400 font-normal',
    selectedCellBg: 'bg-[#222] ring-2 ring-indigo-500 shadow-[inset_0_0_15px_rgba(99,102,241,0.2)]',
    peerCellBg: 'bg-[#222222]/70',
    sameNumberBg: 'bg-indigo-950/50 text-indigo-300',
    errorCellBg: 'bg-rose-950/70 ring-1 ring-rose-500',
    errorCellText: 'text-rose-400 font-medium',
    hintTargetBg: 'bg-amber-950/80 ring-2 ring-amber-400',
    hintPeerBg: 'bg-amber-950/30',
    noteText: 'text-slate-500 font-light',
    accentBtn: 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-md shadow-indigo-950/30',
    accentBtnHover: 'hover:bg-indigo-500',
    accentText: 'text-indigo-400',
    controlBtnBg: 'bg-slate-800 hover:bg-slate-700 border border-slate-700/60 text-slate-200',
    controlBtnText: 'text-slate-200',
    controlBtnActiveBg: 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-900/40',
  },
  'minimal-light': {
    id: 'minimal-light',
    name: 'Minimal Light',
    bodyBg: 'bg-neutral-50',
    cardBg: 'bg-white',
    subtleBg: 'bg-neutral-100',
    textColor: 'text-neutral-900',
    mutedText: 'text-neutral-500',
    borderColor: 'border-neutral-200',
    thickBorderColor: 'border-neutral-900',
    gridBg: 'bg-neutral-200',
    cellBg: 'bg-white',
    initialCellText: 'text-neutral-900 font-bold',
    userCellText: 'text-blue-600 font-semibold',
    selectedCellBg: 'bg-blue-100',
    peerCellBg: 'bg-neutral-100/80',
    sameNumberBg: 'bg-blue-50',
    errorCellBg: 'bg-rose-100',
    errorCellText: 'text-rose-600 font-bold',
    hintTargetBg: 'bg-amber-200 ring-2 ring-amber-400',
    hintPeerBg: 'bg-amber-50',
    noteText: 'text-neutral-500 font-medium',
    accentBtn: 'bg-neutral-900 text-white hover:bg-neutral-800',
    accentBtnHover: 'hover:bg-neutral-800',
    accentText: 'text-blue-600',
    controlBtnBg: 'bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-700',
    controlBtnText: 'text-neutral-700',
    controlBtnActiveBg: 'bg-neutral-900 text-white border-neutral-900',
  },
  'warm-paper': {
    id: 'warm-paper',
    name: 'Warm Paper',
    bodyBg: 'bg-[#FAF7F2]',
    cardBg: 'bg-[#FFFDF9]',
    subtleBg: 'bg-[#F2EBE1]',
    textColor: 'text-stone-900',
    mutedText: 'text-stone-500',
    borderColor: 'border-stone-200',
    thickBorderColor: 'border-stone-800',
    gridBg: 'bg-stone-300',
    cellBg: 'bg-[#FFFDF9]',
    initialCellText: 'text-stone-900 font-bold',
    userCellText: 'text-amber-800 font-semibold',
    selectedCellBg: 'bg-amber-100',
    peerCellBg: 'bg-stone-100',
    sameNumberBg: 'bg-amber-50',
    errorCellBg: 'bg-red-100',
    errorCellText: 'text-red-700 font-bold',
    hintTargetBg: 'bg-yellow-200 ring-2 ring-yellow-400',
    hintPeerBg: 'bg-yellow-50',
    noteText: 'text-stone-500 font-medium',
    accentBtn: 'bg-stone-800 text-stone-50 hover:bg-stone-700',
    accentBtnHover: 'hover:bg-stone-700',
    accentText: 'text-amber-800',
    controlBtnBg: 'bg-[#FFFDF9] hover:bg-[#F2EBE1] border border-stone-200 text-stone-700',
    controlBtnText: 'text-stone-700',
    controlBtnActiveBg: 'bg-stone-800 text-stone-50 border-stone-800',
  },
  'dark-slate': {
    id: 'dark-slate',
    name: 'Dark Slate',
    bodyBg: 'bg-slate-950',
    cardBg: 'bg-slate-900',
    subtleBg: 'bg-slate-800',
    textColor: 'text-slate-100',
    mutedText: 'text-slate-400',
    borderColor: 'border-slate-800',
    thickBorderColor: 'border-slate-400',
    gridBg: 'bg-slate-800',
    cellBg: 'bg-slate-900',
    initialCellText: 'text-slate-100 font-bold',
    userCellText: 'text-sky-400 font-semibold',
    selectedCellBg: 'bg-sky-950/80 ring-1 ring-sky-500',
    peerCellBg: 'bg-slate-800/60',
    sameNumberBg: 'bg-sky-900/40',
    errorCellBg: 'bg-rose-950/80 ring-1 ring-rose-500',
    errorCellText: 'text-rose-400 font-bold',
    hintTargetBg: 'bg-amber-900/70 ring-2 ring-amber-400',
    hintPeerBg: 'bg-amber-950/40',
    noteText: 'text-slate-400 font-medium',
    accentBtn: 'bg-sky-600 text-white hover:bg-sky-500',
    accentBtnHover: 'hover:bg-sky-500',
    accentText: 'text-sky-400',
    controlBtnBg: 'bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200',
    controlBtnText: 'text-slate-200',
    controlBtnActiveBg: 'bg-sky-600 text-white border-sky-600',
  },
  'nordic-forest': {
    id: 'nordic-forest',
    name: 'Nordic Pine',
    bodyBg: 'bg-[#0f1715]',
    cardBg: 'bg-[#15221f]',
    subtleBg: 'bg-[#1c2e2a]',
    textColor: 'text-[#e8f0ec]',
    mutedText: 'text-[#87a398]',
    borderColor: 'border-[#243b35]',
    thickBorderColor: 'border-[#4e7d70]',
    gridBg: 'bg-[#243b35]',
    cellBg: 'bg-[#15221f]',
    initialCellText: 'text-[#e8f0ec] font-bold',
    userCellText: 'text-[#4ade80] font-semibold',
    selectedCellBg: 'bg-[#1d3d34] ring-1 ring-[#34d399]',
    peerCellBg: 'bg-[#182a26]',
    sameNumberBg: 'bg-[#16382f]',
    errorCellBg: 'bg-[#3b1219] ring-1 ring-rose-500',
    errorCellText: 'text-rose-300 font-bold',
    hintTargetBg: 'bg-[#3b3412] ring-2 ring-amber-400',
    hintPeerBg: 'bg-[#26210b]',
    noteText: 'text-[#7d9b90] font-medium',
    accentBtn: 'bg-[#10b981] text-zinc-950 hover:bg-[#34d399]',
    accentBtnHover: 'hover:bg-[#34d399]',
    accentText: 'text-[#34d399]',
    controlBtnBg: 'bg-[#15221f] hover:bg-[#1c2e2a] border border-[#243b35] text-[#d1e0d9]',
    controlBtnText: 'text-[#d1e0d9]',
    controlBtnActiveBg: 'bg-[#10b981] text-zinc-950 border-[#10b981]',
  },
};
