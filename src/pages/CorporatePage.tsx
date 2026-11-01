import React, { useState } from 'react';
import { SanctuaryProperty, Currency, PageType } from '../types';
import { PROPERTIES, USD_EXCHANGE_RATE } from '../data/mockData';

interface CorporatePageProps {
  currency: Currency;
  onSelectProperty: (property: SanctuaryProperty) => void;
  onStartBooking: (property: SanctuaryProperty) => void;
  onNavigate: (page: PageType) => void;
}

export const CorporatePage: React.FC<CorporatePageProps> = ({
  currency,
  onSelectProperty,
  onStartBooking,
  onNavigate
}) => {
  const [teamSize, setTeamSize] = useState<number>(25);
  const [selectedPackage, setSelectedPackage] = useState<string>('deluxe');
  const [inquirySent, setInquirySent] = useState<boolean>(false);
  const [companyName, setCompanyName] = useState<string>('');
  const [contactPhone, setContactPhone] = useState<string>('');

  const packagePricing: Record<string, { lkr: number; label: string; features: string[] }> = {
    standard: {
      lkr: 5500,
      label: 'Standard Team Day Out',
      features: ['Welcome drink & King Coconut', 'Full Buffet Lunch', 'Pool access & lawn games', 'Changing rooms & lockers']
    },
    deluxe: {
      lkr: 7800,
      label: 'Executive Team Retreat & BBQ',
      features: ['Welcome Mocktails', 'Grand Seafood & Live BBQ Buffet', 'Pool & Private Cabana Section', 'Evening High Tea & Snacks', 'BYOB Corkage-Free']
    },
    adventure: {
      lkr: 9200,
      label: 'Wild Rapids & Leadership Outing',
      features: ['White water rafting (Kitulgala)', 'Stream swimming & natural rock sliding', 'Open-air buffet & bonfire BBQ', 'Certified safety marshals & gear']
    }
  };

  const currentPkg = packagePricing[selectedPackage] || packagePricing.deluxe;
  const totalLkr = currentPkg.lkr * teamSize;

  const formatPrice = (lkrAmount: number) => {
    if (currency === 'USD') {
      return `$${(lkrAmount / USD_EXCHANGE_RATE).toFixed(2)}`;
    }
    return `LKR ${lkrAmount.toLocaleString()}`;
  };

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySent(true);
  };

  return (
    <div className="min-h-screen bg-[#f8faf9] pb-24">
      {/* Hero */}
      <section className="bg-gradient-to-r from-[#003528] to-[#005a4e] text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-200 text-xs font-semibold tracking-wide uppercase mb-4">
            <span className="material-symbols-outlined text-sm">groups</span>
            Corporate &amp; Group Day Outs
          </div>
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-headline text-white leading-tight">
              Company Team Outings, Retreats &amp; Group Celebrations
            </h1>
            <p className="mt-3 text-base sm:text-lg text-emerald-100/90 leading-relaxed">
              Curated Day-Out packages for 10 to 500+ guests with dedicated pavilion booking, grand buffets, pool games, team-building activities, and tax invoices.
            </p>
          </div>
        </div>
      </section>

      {/* Instant Group Package Cost Calculator */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-[#e2e8e5]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7">
              <span className="text-xs font-bold uppercase tracking-wider text-[#006a66]">Instant Estimation Tool</span>
              <h2 className="text-2xl font-bold font-headline text-[#003528] mt-1">
                Customize Your Group Package
              </h2>

              {/* Package selector */}
              <div className="mt-6 space-y-3">
                {Object.entries(packagePricing).map(([key, item]) => {
                  const isSelected = selectedPackage === key;
                  return (
                    <div
                      key={key}
                      onClick={() => setSelectedPackage(key)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-4 ${
                        isSelected
                          ? 'border-[#006a66] bg-[#eefaf8]'
                          : 'border-[#e2e8e5] hover:border-[#ccd5d1]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            isSelected ? 'border-[#006a66] bg-[#006a66]' : 'border-slate-400'
                          }`}>
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                          </span>
                          <h4 className="font-bold text-sm text-[#2d3834]">{item.label}</h4>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-[#55635e]">
                          {item.features.map((f, i) => (
                            <span key={i} className="bg-white/80 px-2 py-0.5 rounded border border-[#ccd5d1]">
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-sm font-black text-[#003528] block">{formatPrice(item.lkr)}</span>
                        <span className="text-[10px] text-[#6b7772]">per person</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Team Size Slider */}
              <div className="mt-6 p-4 rounded-2xl bg-[#f4f7f6] border border-[#e2e8e5]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#2d3834]">Estimated Group Size</span>
                  <span className="px-3 py-1 rounded-full bg-[#003528] text-white text-xs font-extrabold font-mono">
                    {teamSize} People
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="200"
                  step="5"
                  value={teamSize}
                  onChange={(e) => setTeamSize(Number(e.target.value))}
                  className="w-full accent-[#006a66] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-[#6b7772] mt-1 font-medium">
                  <span>10 Pax</span>
                  <span>50 Pax</span>
                  <span>100 Pax</span>
                  <span>200+ Pax</span>
                </div>
              </div>
            </div>

            {/* Price Summary & Inquiry Form */}
            <div className="lg:col-span-5 bg-[#003528] text-white rounded-2xl p-6 sm:p-7 shadow-lg">
              <span className="text-[11px] text-emerald-300 font-bold uppercase tracking-wider block">
                Estimated Group Total
              </span>
              <div className="text-3xl font-black font-mono mt-1 text-white">
                {formatPrice(totalLkr)}
              </div>
              <p className="text-xs text-emerald-200 mt-1">
                Includes all food buffets, pool access, service charges &amp; taxes for {teamSize} guests.
              </p>

              {inquirySent ? (
                <div className="mt-6 p-5 rounded-xl bg-emerald-700/60 border border-emerald-400 text-center">
                  <span className="material-symbols-outlined text-4xl text-emerald-200">check_circle</span>
                  <h4 className="font-bold text-base mt-2">Inquiry Submitted!</h4>
                  <p className="text-xs text-emerald-100 mt-1">
                    Our corporate coordinator will call you within 30 minutes with venue availability &amp; proforma invoice.
                  </p>
                  <button
                    onClick={() => setInquirySent(false)}
                    className="mt-4 text-xs font-bold underline text-white"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSendInquiry} className="mt-6 space-y-3">
                  <div>
                    <label className="text-[11px] font-semibold text-emerald-200 block mb-1">Company / Group Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Dialog Axiata Team / Rotary Club"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-emerald-200/50 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-emerald-200 block mb-1">Contact Phone / WhatsApp</label>
                    <input
                      type="tel"
                      required
                      placeholder="077 XXXXXXX"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-emerald-200/50 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-400"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 py-3 rounded-xl bg-emerald-400 text-[#003528] font-bold text-xs hover:bg-emerald-300 transition-colors cursor-pointer shadow-md"
                  >
                    Request Corporate Quotation
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Venues for Groups */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <h3 className="text-xl font-bold font-headline text-[#003528] mb-6">
          Popular Venues for Corporate Outings &amp; Large Groups
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PROPERTIES.slice(0, 3).map((prop) => (
            <div key={prop.id} className="bg-white rounded-2xl overflow-hidden border border-[#e2e8e5] p-4 flex flex-col justify-between">
              <div>
                <img src={prop.imageUrl} alt={prop.name} className="w-full h-40 object-cover rounded-xl" />
                <h4 className="font-bold text-base text-[#003528] mt-3 line-clamp-1">{prop.name}</h4>
                <p className="text-xs text-[#55635e]">{prop.location}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-[#006a66] text-[10px] font-bold">Up to 250 Guests</span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold">Live Band / DJ Permitted</span>
                </div>
              </div>
              <button
                onClick={() => onSelectProperty(prop)}
                className="mt-4 w-full py-2 rounded-xl bg-[#f4f7f6] hover:bg-[#e2e8e5] text-xs font-bold text-[#003528] transition-colors"
              >
                View Venue Details
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
