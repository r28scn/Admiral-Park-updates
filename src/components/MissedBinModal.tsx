import React from 'react';
import { AlertTriangle, Phone, ExternalLink, CheckSquare, X } from 'lucide-react';

interface MissedBinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MissedBinModal: React.FC<MissedBinModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5">
        
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Report a Missed Bin Collection
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Guildford Borough Council Kerbside Services (GU10)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Check Rules */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
          <span className="font-bold text-slate-800 dark:text-slate-200 block">
            Before reporting to Guildford Council, please verify:
          </span>
          <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
            <li className="flex items-start gap-2">
              <CheckSquare className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
              <span>Was the bin placed at your property boundary by <strong>6:30 AM</strong>?</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckSquare className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
              <span>Crews collect between 6:30 AM and 4:30 PM (your round may still be in progress).</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckSquare className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
              <span>Is there a bank holiday this week? If so, collections shift by 24 hours.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckSquare className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
              <span>Did the crew attach an orange contamination notice or advice tag?</span>
            </li>
          </ul>
        </div>

        {/* Direct Action Links */}
        <div className="space-y-2.5">
          <a
            href="https://my.guildford.gov.uk"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <span>Open Guildford Council Portal (my.guildford.gov.uk)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <a
            href="tel:01483444499"
            className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-slate-500" />
            <span>Call Customer Services: 01483 444 499</span>
          </a>
        </div>

        <div className="text-center">
          <button
            onClick={onClose}
            className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
