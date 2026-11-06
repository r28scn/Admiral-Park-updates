import React, { useState } from 'react';
import { Building2, Mail, Phone, AlertCircle, Wrench, Shield, Check, Copy, ExternalLink, X } from 'lucide-react';

interface EstateManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const EstateManagementModal: React.FC<EstateManagementModalProps> = ({
  isOpen,
  onClose,
  onShowToast
}) => {
  const [category, setCategory] = useState('Communal Lighting');
  const [propertyUnit, setPropertyUnit] = useState('');
  const [description, setDescription] = useState('');
  const [residentName, setResidentName] = useState('');
  const [residentPhone, setResidentPhone] = useState('');
  const [urgency, setUrgency] = useState<'routine' | 'urgent'>('routine');

  if (!isOpen) return null;

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`[Admiral Park] Maintenance Report: ${category} (${urgency.toUpperCase()})`);
    const body = encodeURIComponent(
      `Dear Dean & It's Your Place Team,\n\n` +
      `I am reporting an estate maintenance issue at Admiral Park (GU10).\n\n` +
      `Category: ${category}\n` +
      `Urgency: ${urgency.toUpperCase()}\n` +
      `Resident: ${residentName || 'Resident'} (Property / Unit: ${propertyUnit || 'Admiral Park'})\n` +
      `Contact Phone: ${residentPhone || 'N/A'}\n\n` +
      `Issue Details:\n${description}\n\n` +
      `Thank you,\n${residentName || 'Admiral Park Resident'}`
    );

    window.location.href = `mailto:dean@itsyourplace.co.uk?subject=${subject}&body=${body}`;
    onShowToast('Opened email client for dean@itsyourplace.co.uk');
    onClose();
  };

  const handleCopyReport = () => {
    const text = 
      `ADMIRAL PARK ESTATE MAINTENANCE REPORT\n` +
      `Managing Agent: dean@itsyourplace.co.uk (It's Your Place Ltd)\n` +
      `Category: ${category}\n` +
      `Urgency: ${urgency.toUpperCase()}\n` +
      `Resident: ${residentName || 'Resident'} (${propertyUnit || 'Admiral Park'})\n` +
      `Phone: ${residentPhone || 'N/A'}\n\n` +
      `Description:\n${description}`;

    navigator.clipboard.writeText(text);
    onShowToast('Report text copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-8">
        
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-800 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                Development Management
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                It's Your Place Ltd · Managing Agent for Admiral Park
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

        {/* Contact Info Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs">
          <div className="space-y-1">
            <span className="font-semibold text-slate-500 dark:text-slate-400">Managing Agent Contact:</span>
            <div className="font-bold text-slate-900 dark:text-white">Dean (Property Manager)</div>
            <a
              href="mailto:dean@itsyourplace.co.uk"
              className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>dean@itsyourplace.co.uk</span>
            </a>
          </div>

          <div className="space-y-1">
            <span className="font-semibold text-slate-500 dark:text-slate-400">Office Telephone:</span>
            <div className="font-bold text-slate-900 dark:text-white">It's Your Place Office</div>
            <a
              href="tel:01483575888"
              className="inline-flex items-center gap-1.5 text-slate-700 dark:text-slate-300 hover:underline font-medium"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>01483 575 888</span>
            </a>
          </div>
        </div>

        {/* Report Form */}
        <form onSubmit={handleSendEmail} className="space-y-4 text-xs">
          <div className="font-bold text-sm text-slate-900 dark:text-white">
            Report a Maintenance or Communal Issue
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Issue Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="Communal Lighting">Communal Lighting / Streetlamps</option>
                <option value="Automated Entrance Gates">Entrance Gate / Access Control</option>
                <option value="Bin Store Maintenance">Bin Store Enclosure / Refuse Area</option>
                <option value="Landscaping & Grounds">Landscaping, Hedges & Trees</option>
                <option value="Roads, Paving & Drainage">Roads, Kerbs & Block Paving</option>
                <option value="Parking & Vehicle Issues">Parking Enquiries</option>
                <option value="General Maintenance">General Development Maintenance</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Urgency
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="routine">Routine Maintenance (Standard)</option>
                <option value="urgent">Urgent / Safety Hazard</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Your House / Unit #
              </label>
              <input
                type="text"
                placeholder="e.g. 14 Admiral Park"
                value={propertyUnit}
                onChange={(e) => setPropertyUnit(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Your Name
              </label>
              <input
                type="text"
                placeholder="First & Last Name"
                value={residentName}
                onChange={(e) => setResidentName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Contact Phone
              </label>
              <input
                type="tel"
                placeholder="07..."
                value={residentPhone}
                onChange={(e) => setResidentPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Description & Location on Estate *
            </label>
            <textarea
              rows={3}
              required
              placeholder="e.g. Streetlamp #3 near the north turning bay has been flickering; or entrance gate arm is pausing halfway..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handleCopyReport}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Report Text</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-500 transition-colors flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Email Dean Directly</span>
              </button>
            </div>
          </div>
        </form>

        {/* Emergency & Utility Helplines */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="font-semibold text-slate-500 dark:text-slate-400 mb-2">
            Emergency Utilities & Borough Helplines
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
            <a href="tel:105" className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 hover:border-slate-300">
              <span className="font-bold text-slate-900 dark:text-white block">Power Cut</span>
              <span className="text-slate-500">Call 105 (UK Power)</span>
            </a>
            <a href="tel:08003169800" className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 hover:border-slate-300">
              <span className="font-bold text-slate-900 dark:text-white block">Thames Water</span>
              <span className="text-slate-500">0800 316 9800</span>
            </a>
            <a href="tel:101" className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 hover:border-slate-300">
              <span className="font-bold text-slate-900 dark:text-white block">Surrey Police</span>
              <span className="text-slate-500">Call 101 (Non-emerg)</span>
            </a>
            <a href="tel:01483444499" className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 hover:border-slate-300">
              <span className="font-bold text-slate-900 dark:text-white block">Guildford Waste</span>
              <span className="text-slate-500">01483 444 499</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
