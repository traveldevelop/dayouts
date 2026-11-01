import React, { useState } from 'react';
import { Currency, PageType } from '../types';

interface AdminConsolePageProps {
  currency: Currency;
  onNavigate: (page: PageType) => void;
}

export const AdminConsolePage: React.FC<AdminConsolePageProps> = ({
  onNavigate
}) => {
  const [activeTab, setActiveTab] = useState<'verification' | 'taxonomy' | 'refunds' | 'audit'>('verification');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Listing approval states
  const [listingStatuses, setListingStatuses] = useState<{ [id: string]: 'pending' | 'approved' | 'rejected' }>({
    'L-4091': 'pending',
    'L-4092': 'pending'
  });

  const [refundCaseStatus, setRefundCaseStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleApproveListing = (id: string, name: string) => {
    setListingStatuses((prev) => ({ ...prev, [id]: 'approved' }));
    showNotification(`SLTDA Gazette License issued for ${name}. Listing is now live.`);
  };

  const handleRejectListing = (id: string, name: string) => {
    setListingStatuses((prev) => ({ ...prev, [id]: 'rejected' }));
    showNotification(`Application for ${name} flagged for physical hygiene inspection.`);
  };

  const handleAdjudicateRefund = (decision: 'approved' | 'rejected') => {
    setRefundCaseStatus(decision);
    showNotification(
      decision === 'approved'
        ? 'Escrow Refund #REF-2041 approved. LKR 14,800 released back to guest card.'
        : 'Escrow Refund #REF-2041 rejected under host cancellation force-majeure guidelines.'
    );
  };

  return (
    <div className="bg-[#fbfcfc] text-[#121d1e] min-h-screen pb-20">
      {/* Top Banner Navigation */}
      <div className="bg-[#002118] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-teal-300 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>SLTDA GOVERNANCE &amp; REGULATORY OVERSIGHT</span>
            </div>
            <h1 className="font-headline text-2xl sm:text-3xl font-extrabold tracking-tight">
              Sri Lanka Escapes Operations Console
            </h1>
            <p className="text-xs text-white/80 mt-1">
              Statutory Escrow Management · Property Licensing · Gazette Standard Audit
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('explore-stays')}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">public</span>
              <span>Public Marketplace</span>
            </button>
            <button
              onClick={() => onNavigate('owner-portal')}
              className="px-4 py-2 rounded-xl bg-[#006a66] hover:bg-[#00524f] text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">real_estate_agent</span>
              <span>Host Portal</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Super Admin Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-[#e2e8e5] shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#55635e]">
              Escrow Volume Held
            </span>
            <div className="font-headline text-3xl font-extrabold text-[#003528] mt-1 tabular-nums">
              LKR 42.8M
            </div>
            <span className="text-xs text-emerald-700 font-medium mt-1 block">
              100% Guaranteed in Central Bank Escrow
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#e2e8e5] shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#55635e]">
              Active Licensed Escapes
            </span>
            <div className="font-headline text-3xl font-extrabold text-[#003528] mt-1 tabular-nums">
              342 Sanctuaries
            </div>
            <span className="text-xs text-[#006a66] font-medium mt-1 block">
              Across 9 Provinces of Sri Lanka
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#e2e8e5] shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#55635e]">
              Hygiene Compliance Rate
            </span>
            <div className="font-headline text-3xl font-extrabold text-[#003528] mt-1 tabular-nums">
              99.4%
            </div>
            <span className="text-xs text-emerald-700 font-medium mt-1 block">
              PHN Inspected Water &amp; Kitchens
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#e2e8e5] shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#55635e]">
              Pending Backlog Audits
            </span>
            <div className="font-headline text-3xl font-extrabold text-amber-600 mt-1 tabular-nums">
              2 Properties
            </div>
            <span className="text-xs text-[#55635e] font-medium mt-1 block">
              Awaiting Gazette clearance
            </span>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-[#e2e8e5] gap-3 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('verification')}
            className={`py-3 px-4 font-headline text-xs font-bold flex items-center gap-2 border-b-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'verification'
                ? 'border-[#003528] text-[#003528]'
                : 'border-transparent text-[#55635e] hover:text-[#003528]'
            }`}
          >
            <span className="material-symbols-outlined text-base">verified</span>
            <span>Listing Verification Backlog (2)</span>
          </button>

          <button
            onClick={() => setActiveTab('refunds')}
            className={`py-3 px-4 font-headline text-xs font-bold flex items-center gap-2 border-b-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'refunds'
                ? 'border-[#003528] text-[#003528]'
                : 'border-transparent text-[#55635e] hover:text-[#003528]'
            }`}
          >
            <span className="material-symbols-outlined text-base">gavel</span>
            <span>Escrow Refund Adjudication (1)</span>
          </button>

          <button
            onClick={() => setActiveTab('taxonomy')}
            className={`py-3 px-4 font-headline text-xs font-bold flex items-center gap-2 border-b-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'taxonomy'
                ? 'border-[#003528] text-[#003528]'
                : 'border-transparent text-[#55635e] hover:text-[#003528]'
            }`}
          >
            <span className="material-symbols-outlined text-base">tune</span>
            <span>Standard Facilities Taxonomy</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`py-3 px-4 font-headline text-xs font-bold flex items-center gap-2 border-b-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'audit'
                ? 'border-[#003528] text-[#003528]'
                : 'border-transparent text-[#55635e] hover:text-[#003528]'
            }`}
          >
            <span className="material-symbols-outlined text-base">history</span>
            <span>Cryptographic Audit Trail</span>
          </button>
        </div>

        {/* Tab 1: Verification Backlog */}
        {activeTab === 'verification' && (
          <div className="bg-white rounded-3xl border border-[#e2e8e5] p-6 lg:p-8 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#006a66]">
                SLTDA Registration Queue
              </span>
              <h2 className="font-headline text-xl font-bold text-[#003528] mt-0.5">
                New Host Verification Applications
              </h2>
            </div>

            <div className="space-y-4">
              {/* Card 1 */}
              <div className="p-5 rounded-2xl bg-[#f4f7f6] border border-[#e2e8e5] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#003528]">#L-4091</span>
                    <span className="font-bold text-sm text-[#003528]">
                      Tangalle Azure Cliff &amp; Ocean Villa
                    </span>
                    <span className="text-[11px] text-[#55635e]">· Southern Province</span>
                  </div>
                  <p className="text-xs text-[#55635e]">
                    Host: Saman Jayasuriya · 6 Suites, 2 Saltwater Plunge Pools · SLTDA Application #SQA-99182
                  </p>
                  <div className="flex gap-3 text-[11px] font-mono text-[#006a66] pt-1">
                    <span>Deed Ownership: VERIFIED</span>
                    <span>·</span>
                    <span>Pool Water Test: PASSED (PH 7.4)</span>
                    <span>·</span>
                    <span>Civil Defense Clearance: FILED</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {listingStatuses['L-4091'] === 'pending' ? (
                    <>
                      <button
                        onClick={() => handleApproveListing('L-4091', 'Tangalle Azure Cliff Villa')}
                        className="px-4 py-2 rounded-xl bg-[#003528] text-white text-xs font-bold hover:bg-[#004d3b] transition cursor-pointer"
                      >
                        Grant License
                      </button>
                      <button
                        onClick={() => handleRejectListing('L-4091', 'Tangalle Azure Cliff Villa')}
                        className="px-3 py-2 rounded-xl border border-rose-300 text-rose-700 text-xs font-semibold hover:bg-rose-50 transition cursor-pointer"
                      >
                        Request Audit
                      </button>
                    </>
                  ) : (
                    <span className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold">
                      {listingStatuses['L-4091'] === 'approved' ? 'License Issued' : 'Audit Requested'}
                    </span>
                  )}
                </div>
              </div>

              {/* Card 2 */}
              <div className="p-5 rounded-2xl bg-[#f4f7f6] border border-[#e2e8e5] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#003528]">#L-4092</span>
                    <span className="font-bold text-sm text-[#003528]">
                      Kandy Knuckles High Mist Eco Cabins
                    </span>
                    <span className="text-[11px] text-[#55635e]">· Central Province</span>
                  </div>
                  <p className="text-xs text-[#55635e]">
                    Host: Dr. Harsha Bandara · Knuckles World Heritage Reserve Fringe · Day Pass Rafting
                  </p>
                  <div className="flex gap-3 text-[11px] font-mono text-[#006a66] pt-1">
                    <span>Forest Dept Permit: VERIFIED</span>
                    <span>·</span>
                    <span>Fire Safety: PASSED</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {listingStatuses['L-4092'] === 'pending' ? (
                    <>
                      <button
                        onClick={() => handleApproveListing('L-4092', 'Kandy Knuckles High Mist Cabins')}
                        className="px-4 py-2 rounded-xl bg-[#003528] text-white text-xs font-bold hover:bg-[#004d3b] transition cursor-pointer"
                      >
                        Grant License
                      </button>
                      <button
                        onClick={() => handleRejectListing('L-4092', 'Kandy Knuckles High Mist Cabins')}
                        className="px-3 py-2 rounded-xl border border-rose-300 text-rose-700 text-xs font-semibold hover:bg-rose-50 transition cursor-pointer"
                      >
                        Request Audit
                      </button>
                    </>
                  ) : (
                    <span className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold">
                      {listingStatuses['L-4092'] === 'approved' ? 'License Issued' : 'Audit Requested'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Refunds Adjudication */}
        {activeTab === 'refunds' && (
          <div className="bg-white rounded-3xl border border-[#e2e8e5] p-6 lg:p-8 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#006a66]">
                SLTDA Escrow Consumer Protection
              </span>
              <h2 className="font-headline text-xl font-bold text-[#003528] mt-0.5">
                Active Dispute &amp; Force-Majeure Cases
              </h2>
            </div>

            <div className="p-6 rounded-2xl bg-[#f4f7f6] border border-[#e2e8e5] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#e2e8e5] gap-2">
                <div>
                  <span className="font-mono text-xs font-bold text-[#003528]">Case #REF-2041</span>
                  <h4 className="font-headline text-base font-bold text-[#003528] mt-0.5">
                    Kitulgala Whitewater Rapids Cancellation (Met Dept Red Rain Advisory)
                  </h4>
                </div>
                <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-md border border-amber-200">
                  Adjudication Required
                </span>
              </div>

              <p className="text-xs text-[#55635e] leading-relaxed">
                Guest Anura Kumara requested full refund of Day Pass (LKR 14,800) due to flash flood warnings issued by the Sri Lanka Disaster Management Centre on Kelani River.
              </p>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-mono text-[#003528]">Claim Amount: <strong>LKR 14,800</strong></span>
                {refundCaseStatus === 'pending' ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAdjudicateRefund('approved')}
                      className="px-4 py-2 rounded-xl bg-[#003528] text-white text-xs font-bold hover:bg-[#004d3b]"
                    >
                      Authorize 100% Escrow Refund
                    </button>
                    <button
                      onClick={() => handleAdjudicateRefund('rejected')}
                      className="px-3 py-2 rounded-xl border border-[#e2e8e5] text-xs font-bold text-[#55635e]"
                    >
                      Dismiss Case
                    </button>
                  </div>
                ) : (
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-md">
                    Case Adjudicated &amp; Closed
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Facilities Taxonomy */}
        {activeTab === 'taxonomy' && (
          <div className="bg-white rounded-3xl border border-[#e2e8e5] p-6 lg:p-8 shadow-sm space-y-4">
            <h2 className="font-headline text-xl font-bold text-[#003528]">
              Standardized Facilities Taxonomy
            </h2>
            <p className="text-xs text-[#55635e]">
              Official tags mandated for all registered Sri Lankan sanctuaries.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              {[
                'Pool & Sun Loungers',
                'Grand Seafood Buffet',
                'BYOB Free Corkage',
                'AC Private Changing Cabanas',
                'Direct Beach Access',
                'High-Speed Starlink WiFi',
                'River Water Sports',
                'Lifeguard Certified',
                'Kids Safe Splash Zone'
              ].map((item, i) => (
                <div key={i} className="p-3 rounded-xl bg-[#f4f7f6] border border-[#e2e8e5] text-xs font-semibold text-[#003528] flex items-center justify-between">
                  <span>{item}</span>
                  <span className="material-symbols-outlined text-sm text-[#006a66]">verified</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Audit Ledger */}
        {activeTab === 'audit' && (
          <div className="bg-white rounded-3xl border border-[#e2e8e5] p-6 lg:p-8 shadow-sm space-y-4">
            <h2 className="font-headline text-xl font-bold text-[#003528]">
              Cryptographic Statutory Log
            </h2>
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-[#f4f7f6] border border-[#e2e8e5] flex justify-between items-center">
                <span>[2025-04-18 10:14:02 UTC] EscrowHold_Issued · BK-9841 · Hash: 0x8f2d...41a</span>
                <span className="text-emerald-700 font-bold">VERIFIED</span>
              </div>
              <div className="p-3 rounded-xl bg-[#f4f7f6] border border-[#e2e8e5] flex justify-between items-center">
                <span>[2025-04-18 09:44:11 UTC] CEFT_Disbursement · Host_BOC_4892 · Hash: 0x3d91...77b</span>
                <span className="text-emerald-700 font-bold">VERIFIED</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <aside aria-label="Governance Alert" className="fixed bottom-6 right-6 z-50 bg-[#002118] text-white px-5 py-3.5 rounded-xl shadow-xl flex items-center gap-3 border border-emerald-400/30">
          <span className="material-symbols-outlined text-teal-300 text-lg">verified</span>
          <span className="text-xs font-medium">{toastMessage}</span>
        </aside>
      )}
    </div>
  );
};
