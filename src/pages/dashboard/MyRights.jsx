import React, { useState } from 'react';
import {
  Clock, FileText, MapPin, Building2, UserCircle, Users,
  MessageCircle, Hammer, CalendarCheck, RefreshCw, ChevronDown, ChevronUp, ExternalLink, Scale
} from 'lucide-react';

const escalationSteps = [
  {
    icon: Clock,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    title: 'Step 1: Wait for Given Time After Complaint',
    law: 'Process Standard',
    summary: 'Villagers should wait for the normal resolution time. If not solved, proceed to meet the BDO. This ensures a fair escalation process.',
    details: [
      'Water problem: 3–5 days',
      'Electricity problem: 1–3 days',
      'Sanitation problem: 2–4 days',
      'Road problem: 7–15 days',
      'Infrastructure problem: 5–10 days',
    ],
    tag: 'Waiting Time',
  },
  {
    icon: FileText,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    border: 'border-orange-100',
    title: 'Step 2: Gather Basic Information',
    law: 'Preparation',
    summary: 'No written documents needed — just basic info to help the BDO understand quickly. Example: "Road broken near school since 10 days, no action yet."',
    details: [
      'Problem details & Location of problem',
      'Date when complaint was originally raised',
      'Complaint ID (if using portal)',
      'Photo of the issue (if available)',
    ],
    tag: 'Preparation',
  },
  {
    icon: MapPin,
    color: 'text-cyan-600',
    bg: 'bg-cyan-50',
    border: 'border-cyan-100',
    title: 'Step 3: Find the Block Office Location',
    law: 'Navigation',
    summary: 'Ask: "Block office kaha hai?" or "BDO kaha milenge?". Usually located at the Tehsil area or nearby town.',
    details: [
      'Ask at the local Panchayat office',
      'Ask the Village School teacher',
      'Ask Anganwadi or ASHA workers',
      'Or simply ask other villagers for directions',
    ],
    tag: 'Location',
  },
  {
    icon: Building2,
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
    border: 'border-yellow-100',
    title: 'Step 4: Visit Block Development Office',
    law: 'Action',
    summary: 'Visit the Block Development Office during working hours. Morning is best because the BDO is usually available and it is less crowded.',
    details: [
      'Office Timing: Monday to Friday, 10:00 AM to 5:00 PM',
      'Best Time: Morning (10 AM to 12 PM)',
      'You can go alone, with family, or a group of villagers',
      'Going with a group is better for serious problems',
    ],
    tag: 'Visit',
  },
  {
    icon: UserCircle,
    color: 'text-green-600',
    bg: 'bg-green-50',
    border: 'border-green-100',
    title: 'Step 5: Ask at Office Reception',
    law: 'Communication',
    summary: 'No formal education needed. Just say: "BDO se milna hai" or "Gaon ki problem hai".',
    details: [
      'Office staff will ask for your village name',
      'They will ask the general nature of the problem',
      'They will guide you to the right waiting area',
    ],
    tag: 'Inquiry',
  },
  {
    icon: Users,
    color: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-100',
    title: 'Step 6: Wait for Your Turn',
    law: 'Patience',
    summary: 'Office staff may allow a direct meeting or ask you to wait. Meetings usually happen on the same day.',
    details: [
      'Sit in the designated waiting area',
      'Wait patiently for your turn to be called',
      'Prepare what you want to say in your head',
    ],
    tag: 'Waiting',
  },
  {
    icon: MessageCircle,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-100',
    title: 'Step 7: Meet the BDO',
    law: 'Discussion',
    summary: 'Speak in simple language. No formal English required. Tell them the problem, since when, and how it affects the village.',
    details: [
      'Clearly state what the problem is',
      'Mention that the Pradhan has not resolved it yet',
      'Explain how the villagers are being affected',
      'Example: "Sir, gaon me pani pipeline tuti hai, 7 din se repair nahi hua."',
    ],
    tag: 'Meeting',
  },
  {
    icon: Hammer,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    title: 'Step 8: BDO Takes Action',
    law: 'Resolution',
    summary: 'The BDO has the authority to monitor the Pradhan and ensure the work is completed successfully.',
    details: [
      'BDO may call Panchayat officials directly',
      'BDO can order an immediate inspection',
      'BDO can send a repair team to your village',
      'BDO can approve funds and give a timeline',
    ],
    tag: 'Authority',
  },
  {
    icon: CalendarCheck,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    border: 'border-indigo-100',
    title: 'Step 9: Ask for Follow-Up Details',
    law: 'Tracking',
    summary: 'This helps you and your village track the progress. Always ask: "Sir, kab tak problem solve hogi?".',
    details: [
      'Ask for a clear date or timeline',
      'Note down any specific instructions given',
      'Share the timeline with other affected villagers',
    ],
    tag: 'Follow-Up',
  },
  {
    icon: RefreshCw,
    color: 'text-teal-600',
    bg: 'bg-teal-50',
    border: 'border-teal-100',
    title: 'Step 10: Follow Up if Needed',
    law: 'Persistence',
    summary: 'Usually, after BDO involvement, problems are solved faster. If not, don\'t hesitate to go back.',
    details: [
      'Visit again after a few days if no action is taken',
      'Politely remind the BDO of your previous visit',
      'Ask for a current status update on the work',
    ],
    tag: 'Persistence',
  },
];

const tagColors = {
  'Waiting Time': 'bg-blue-100 text-blue-700',
  'Preparation': 'bg-orange-100 text-orange-700',
  'Location': 'bg-cyan-100 text-cyan-700',
  'Visit': 'bg-yellow-100 text-yellow-700',
  'Inquiry': 'bg-green-100 text-green-700',
  'Waiting': 'bg-red-100 text-red-700',
  'Meeting': 'bg-purple-100 text-purple-700',
  'Authority': 'bg-amber-100 text-amber-700',
  'Follow-Up': 'bg-indigo-100 text-indigo-700',
  'Persistence': 'bg-teal-100 text-teal-700',
};

const StepCard = ({ step }) => {
  const [open, setOpen] = useState(false);
  const Icon = step.icon;

  return (
    <div className={`bg-white rounded-2xl border ${step.border} shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md relative`}>
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className={`w-11 h-11 rounded-xl ${step.bg} flex items-center justify-center flex-shrink-0 shadow-sm`}>
            <Icon className={`w-5 h-5 ${step.color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-sm font-extrabold text-slate-800 leading-tight">{step.title}</h3>
                <p className="text-[10px] font-semibold text-slate-400 mt-0.5">{step.law}</p>
              </div>
              <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full flex-shrink-0 ${tagColors[step.tag]}`}>
                {step.tag}
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed mt-2">{step.summary}</p>
          </div>
        </div>

        <button
          onClick={() => setOpen((o) => !o)}
          className="mt-4 flex items-center gap-1.5 text-[11px] font-black text-[#1E3A8A] hover:text-blue-800 transition-colors"
        >
          {open ? 'Hide Actions' : 'View Key Actions'}
          {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {open && (
        <div className={`px-5 pb-5 pt-1 border-t ${step.border} ${step.bg}`}>
          <ul className="space-y-2">
            {step.details.map((d, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-slate-600 font-medium">
                <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${step.color.replace('text-', 'bg-')}`} />
                {d}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const MyRights = () => (
  <div className="space-y-6">
    {/* Header */}
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 bg-gradient-to-r from-gov-blue/5 to-transparent relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-[#1E3A8A] flex items-center justify-center shadow-lg shadow-blue-200">
            <Scale className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Complaint Escalation Rights</h2>
            <p className="text-slate-500 text-xs font-semibold">Your right to escalate unresolved issues to the BDO</p>
          </div>
        </div>
        <p className="text-sm text-slate-500 leading-relaxed max-w-2xl mt-3">
          If the Pradhan fails to resolve your village's problems in a timely manner, you have the full right to escalate the issue directly to the Block Development Office. Follow these 10 steps to ensure a fair and proper resolution.
        </p>
      </div>
      <div className="absolute -right-8 -top-8 w-40 h-40 bg-gov-blue/5 rounded-full blur-2xl z-0" />
    </div>

    {/* Stats row */}
    <div className="grid grid-cols-3 gap-4">
      {[
        { label: 'Total Steps', value: escalationSteps.length, color: 'text-[#1E3A8A]', bg: 'bg-blue-50' },
        { label: 'Wait Periods', value: 5, color: 'text-orange-600', bg: 'bg-orange-50' },
        { label: 'Resolution Path', value: 1, color: 'text-green-600', bg: 'bg-green-50' },
      ].map((s) => (
        <div key={s.label} className={`${s.bg} rounded-2xl p-4 text-center border border-white shadow-sm`}>
          <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">{s.label}</p>
        </div>
      ))}
    </div>

    {/* Rights/Steps Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
      {/* Optional: Add a visual timeline line on desktop if needed, or just let them stack naturally */}
      {escalationSteps.map((s, i) => (
        <StepCard key={i} step={s} />
      ))}
    </div>

    {/* Footer note */}
    <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
      <ExternalLink className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
      <p className="text-xs text-amber-700 font-medium leading-relaxed">
        Remember, you do <span className="font-black">not</span> need formal education, perfect English, or written documents to meet the BDO. Your voice and your problem are enough. Stand up for your village's <span className="font-black">rights</span> confidently.
      </p>
    </div>
  </div>
);

export default MyRights;
