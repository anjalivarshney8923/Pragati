import React, { useState } from 'react';
import {
  Scale, ShieldCheck, BookOpen, Droplets, Zap, GraduationCap,
  HeartPulse, Home, Wheat, Vote, ChevronDown, ChevronUp, ExternalLink
} from 'lucide-react';

const rights = [
  {
    icon: Vote,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    title: 'Right to Vote',
    law: 'Representation of the People Act, 1950',
    summary: 'Every citizen above 18 years has the right to vote in Gram Panchayat, State and General elections without discrimination.',
    details: [
      'Vote in Gram Panchayat elections every 5 years',
      'Enroll in voter list at nearest BLO office',
      'No one can prevent you from casting your vote',
      'Voting is secret — no one can ask how you voted',
    ],
    tag: 'Political',
  },
  {
    icon: BookOpen,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    border: 'border-orange-100',
    title: 'Right to Information (RTI)',
    law: 'Right to Information Act, 2005',
    summary: 'Every citizen can request information from any government office. The office must respond within 30 days.',
    details: [
      'File RTI application at Panchayat office for ₹10',
      'Response must be given within 30 days',
      'Covers all government schemes, funds, and decisions',
      'First appeal to senior officer if denied',
    ],
    tag: 'Transparency',
  },
  {
    icon: Droplets,
    color: 'text-cyan-600',
    bg: 'bg-cyan-50',
    border: 'border-cyan-100',
    title: 'Right to Clean Drinking Water',
    law: 'Jal Jeevan Mission & Article 21',
    summary: 'Every household is entitled to a functional tap water connection providing safe and adequate drinking water.',
    details: [
      '55 litres per person per day is the minimum standard',
      'Complain to Gram Panchayat if supply is disrupted',
      'Water quality testing must be done regularly',
      'Free connection under Jal Jeevan Mission for BPL families',
    ],
    tag: 'Basic Needs',
  },
  {
    icon: Zap,
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
    border: 'border-yellow-100',
    title: 'Right to Electricity',
    law: 'Saubhagya Scheme & Electricity Act, 2003',
    summary: 'Every household is entitled to a free electricity connection under the Pradhan Mantri Sahaj Bijli Har Ghar Yojana.',
    details: [
      'Free connection for BPL households under Saubhagya',
      'Minimum 8 hours of power supply in rural areas',
      'Complain to DISCOM if supply is irregular',
      'Subsidised rates for below poverty line families',
    ],
    tag: 'Basic Needs',
  },
  {
    icon: GraduationCap,
    color: 'text-green-600',
    bg: 'bg-green-50',
    border: 'border-green-100',
    title: 'Right to Education',
    law: 'Right to Education Act, 2009',
    summary: 'Children aged 6–14 years have the fundamental right to free and compulsory education in a neighbourhood school.',
    details: [
      'Free education from Class 1 to Class 8',
      'No child can be expelled or failed till Class 8',
      '25% seats reserved for EWS children in private schools',
      'Mid-day meal is a right in government schools',
    ],
    tag: 'Education',
  },
  {
    icon: HeartPulse,
    color: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-100',
    title: 'Right to Health',
    law: 'Ayushman Bharat & Article 21',
    summary: 'Every citizen has the right to access basic healthcare. Under Ayushman Bharat, families get ₹5 lakh health cover per year.',
    details: [
      '₹5 lakh annual health cover under PM-JAY',
      'Free treatment at government hospitals',
      'Free medicines at Jan Aushadhi Kendras',
      'Emergency treatment cannot be denied by any hospital',
    ],
    tag: 'Health',
  },
  {
    icon: Home,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-100',
    title: 'Right to Housing',
    law: 'Pradhan Mantri Awas Yojana (Gramin)',
    summary: 'Eligible rural families are entitled to financial assistance to construct a pucca house with basic amenities.',
    details: [
      '₹1.20 lakh assistance in plain areas, ₹1.30 lakh in hilly areas',
      'Includes toilet under Swachh Bharat Mission',
      'Apply through Gram Panchayat or AwaasSoft portal',
      'Priority to SC/ST, minorities and disabled persons',
    ],
    tag: 'Housing',
  },
  {
    icon: Wheat,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    title: 'Right to Food',
    law: 'National Food Security Act, 2013',
    summary: 'Every person in a priority household is entitled to 5 kg of subsidised foodgrains per month at ₹1–3 per kg.',
    details: [
      '5 kg rice/wheat/coarse grain per person per month',
      'Antyodaya families get 35 kg per household per month',
      'Collect ration from Fair Price Shop with Aadhaar',
      'Complain to District Food Officer if denied',
    ],
    tag: 'Food',
  },
  {
    icon: Scale,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    border: 'border-indigo-100',
    title: 'Right to Legal Aid',
    law: 'Legal Services Authorities Act, 1987',
    summary: 'Every citizen below the poverty line or belonging to a weaker section has the right to free legal aid and representation.',
    details: [
      'Free legal aid from District Legal Services Authority (DLSA)',
      'Covers civil and criminal cases',
      'Available to SC/ST, women, children, disabled persons',
      'Contact nearest Lok Adalat for quick resolution',
    ],
    tag: 'Legal',
  },
  {
    icon: ShieldCheck,
    color: 'text-teal-600',
    bg: 'bg-teal-50',
    border: 'border-teal-100',
    title: 'Right Against Exploitation',
    law: 'Articles 23 & 24 of the Constitution',
    summary: 'No person can be forced into bonded labour, human trafficking, or child labour. Violations are punishable offences.',
    details: [
      'Bonded labour is illegal and punishable',
      'Children below 14 cannot be employed in hazardous work',
      'Report violations to District Magistrate or police',
      'Victims entitled to rehabilitation and compensation',
    ],
    tag: 'Protection',
  },
];

const tagColors = {
  Political: 'bg-blue-100 text-blue-700',
  Transparency: 'bg-orange-100 text-orange-700',
  'Basic Needs': 'bg-cyan-100 text-cyan-700',
  Education: 'bg-green-100 text-green-700',
  Health: 'bg-red-100 text-red-700',
  Housing: 'bg-purple-100 text-purple-700',
  Food: 'bg-amber-100 text-amber-700',
  Legal: 'bg-indigo-100 text-indigo-700',
  Protection: 'bg-teal-100 text-teal-700',
};

const RightCard = ({ right }) => {
  const [open, setOpen] = useState(false);
  const Icon = right.icon;

  return (
    <div className={`bg-white rounded-2xl border ${right.border} shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md`}>
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className={`w-11 h-11 rounded-xl ${right.bg} flex items-center justify-center flex-shrink-0 shadow-sm`}>
            <Icon className={`w-5 h-5 ${right.color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-sm font-extrabold text-slate-800 leading-tight">{right.title}</h3>
                <p className="text-[10px] font-semibold text-slate-400 mt-0.5">{right.law}</p>
              </div>
              <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full flex-shrink-0 ${tagColors[right.tag]}`}>
                {right.tag}
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed mt-2">{right.summary}</p>
          </div>
        </div>

        <button
          onClick={() => setOpen(o => !o)}
          className="mt-4 flex items-center gap-1.5 text-[11px] font-black text-[#1E3A8A] hover:text-blue-800 transition-colors"
        >
          {open ? 'Hide Details' : 'View Details'}
          {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {open && (
        <div className={`px-5 pb-5 pt-1 border-t ${right.border} ${right.bg}`}>
          <ul className="space-y-2">
            {right.details.map((d, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${right.color.replace('text-', 'bg-')}`} />
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
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">My Rights</h2>
            <p className="text-slate-500 text-xs font-semibold">Know your fundamental rights as a citizen of India</p>
          </div>
        </div>
        <p className="text-sm text-slate-500 leading-relaxed max-w-2xl mt-3">
          As a villager, you are entitled to several rights guaranteed by the Constitution of India and various government schemes.
          Tap <span className="font-bold text-[#1E3A8A]">View Details</span> on any card to learn more.
        </p>
      </div>
      <div className="absolute -right-8 -top-8 w-40 h-40 bg-gov-blue/5 rounded-full blur-2xl z-0" />
    </div>

    {/* Stats row */}
    <div className="grid grid-cols-3 gap-4">
      {[
        { label: 'Total Rights', value: rights.length, color: 'text-[#1E3A8A]', bg: 'bg-blue-50' },
        { label: 'Govt Schemes', value: 6, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Constitutional', value: 4, color: 'text-orange-600', bg: 'bg-orange-50' },
      ].map(s => (
        <div key={s.label} className={`${s.bg} rounded-2xl p-4 text-center border border-white shadow-sm`}>
          <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">{s.label}</p>
        </div>
      ))}
    </div>

    {/* Rights Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {rights.map((r, i) => <RightCard key={i} right={r} />)}
    </div>

    {/* Footer note */}
    <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
      <ExternalLink className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
      <p className="text-xs text-amber-700 font-medium leading-relaxed">
        For more information, visit <span className="font-black">mygov.in</span> or contact your nearest <span className="font-black">Gram Panchayat office</span>. You can also raise a complaint through this portal if any of your rights are being violated.
      </p>
    </div>
  </div>
);

export default MyRights;
