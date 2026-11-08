import React, { useState } from 'react';
import { Currency, PageType, BookingState } from '../types';
import { USD_EXCHANGE_RATE } from '../data/mockData';

interface OwnerPortalPageProps {
  currency: Currency;
  onCurrencyChange: (curr: Currency) => void;
  onNavigate: (page: PageType) => void;
  bookings: BookingState[];
  onApproveBooking: (id: string) => void;
  onRejectBooking: (id: string) => void;
  onOpenAiCreator?: () => void;
}

export const OwnerPortalPage: React.FC<OwnerPortalPageProps> = ({
  currency,
  onNavigate,
  bookings,
  onApproveBooking,
  onRejectBooking,
  onOpenAiCreator
}) => {
  const [dayPassCap, setDayPassCap] = useState<number>(30);
  const [payoutModalOpen, setPayoutModalOpen] = useState(false);
  const [quickBlockModalOpen, setQuickBlockModalOpen] = useState(false);
  const [blockedDays, setBlockedDays] = useState<number[]>([22, 28]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const toggleDayBlock = (dayNum: number) => {
    setBlockedDays((prev) =>
      prev.includes(dayNum) ? prev.filter((d) => d !== dayNum) : [...prev, dayNum]
    );
    showNotification(`Day ${dayNum} availability updated.`);
  };

  const formatPrice = (lkr: number) => {
    if (currency === 'USD') {
      return `$${(lkr / USD_EXCHANGE_RATE).toFixed(2)}`;
    }
    return `LKR ${lkr.toLocaleString()}`;
  };

  return (
    <div className="bg-[#fbfcfc] text-[#121d1e] min-h-screen pb-20">
      {/* Top Banner Navigation */}
      <div className="bg-[#003528] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-teal-300 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>HOST PORTAL · CEYLON PALMS LUXURY RETREAT</span>
            </div>
            <h1 className="font-headline text-2xl sm:text-3xl font-extrabold tracking-tight">
              Property Dashboard &amp; Gate Manager
            </h1>
            <p className="text-xs text-white/80 mt-1">
              SLTDA License: #SLTDA/SQA/PRO/01824 · Moragalla Beach, Bentota Riviera
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('explore-stays')}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">storefront</span>
              <span>View Public Listing</span>
            </button>
            <button
              onClick={onOpenAiCreator}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-500 hover:from-teal-500 hover:to-emerald-600 text-[#002118] text-xs font-extrabold shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">auto_awesome</span>
              <span>✨ AI Listing Creator</span>
            </button>
            <button
              onClick={() => setPayoutModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#006a66] hover:bg-[#00524f] text-white text-xs font-bold shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">payments</span>
              <span>Instant Payout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* AI Quick Listing Generator Banner */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-[#003528] via-[#004d3b] to-[#006a66] text-white border border-teal-500/30 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-teal-300 text-lg animate-pulse">auto_awesome</span>
              <span className="text-[11px] font-mono text-teal-300 uppercase tracking-wider font-bold">
                NEW · AI MAGIC LISTING CREATOR (AI ස්වයංක්‍රීය දැන්වීම් පද්ධතිය)
              </span>
            </div>
            <h2 className="font-headline text-xl sm:text-2xl font-bold">
              Paste WhatsApp or Facebook Promo &amp; Let AI Add the Property
            </h2>
            <p className="text-xs text-white/80 leading-relaxed">
              Have promotional text from Facebook, WhatsApp, or a flyer (e.g. <em>&quot;Pavana Beach Hotel Negombo... Couple Dayout 3,990... Night Stay 3,000&quot;</em>)? Paste it in one click — Gemini 3.8 AI extracts all room tiers, Day Out/Night Stay pricing, contacts, and facilities. You only add the photos!
            </p>
          </div>

          <button
            onClick={onOpenAiCreator}
            className="px-5 py-3 rounded-2xl bg-white text-[#003528] hover:bg-teal-50 font-bold text-xs shadow-md transition flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base text-[#006a66]">auto_awesome</span>
            <span>Open AI Listing Creator</span>
          </button>
        </div>

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-[#e2e8e5] shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#55635e]">
              Today&apos;s Arrivals
            </span>
            <div className="font-headline text-3xl font-extrabold text-[#003528] mt-1 tabular-nums">
              24 Guests
            </div>
            <span className="text-xs text-[#006a66] font-medium mt-1 block">
              18 Day Passes · 6 Chalet Guests
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#e2e8e5] shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#55635e]">
              Active Day Pass Capacity
            </span>
            <div className="font-headline text-3xl font-extrabold text-[#003528] mt-1 tabular-nums">
              {bookings.filter((b) => b.status === 'CONFIRMED').length * 2} / {dayPassCap}
            </div>
            <span className="text-xs text-amber-600 font-medium mt-1 block">
              {dayPassCap - bookings.filter((b) => b.status === 'CONFIRMED').length * 2} slots available today
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#e2e8e5] shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#55635e]">
              Today&apos;s Gross Revenue
            </span>
            <div className="font-headline text-3xl font-extrabold text-[#003528] mt-1 tabular-nums">
              {formatPrice(159000)}
            </div>
            <span className="text-xs text-[#55635e] font-medium mt-1 block">
              Net settlement via CEFT
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#e2e8e5] shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#55635e]">
              Ready for Payout
            </span>
            <div className="font-headline text-3xl font-extrabold text-[#006a66] mt-1 tabular-nums">
              {formatPrice(1623600)}
            </div>
            <span className="text-xs text-[#006a66] font-medium mt-1 block">
              BOC Account *4892 Verified
            </span>
          </div>
        </div>

        {/* Live Booking Requests & Ledger */}
        <div className="bg-white rounded-3xl border border-[#e2e8e5] shadow-sm p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#f0f4f2] gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#006a66]">
                Incoming Guest Clearance
              </span>
              <h2 className="font-headline text-2xl font-bold text-[#003528]">
                Live Guest Bookings &amp; Day Pass Ledger
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#003528] bg-[#f4f7f6] px-3 py-1.5 rounded-lg border border-[#e2e8e5]">
                {bookings.length} Total Records
              </span>
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#e2e8e5] text-[#55635e] font-bold uppercase tracking-wider">
                  <th className="py-3 px-3">Pass ID</th>
                  <th className="py-3 px-3">Lead Guest</th>
                  <th className="py-3 px-3">Package / Slot</th>
                  <th className="py-3 px-3">Seating</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Host Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f4f2]">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-[#fbfcfc] transition">
                    <td className="py-4 px-3 font-mono font-bold text-[#003528]">
                      #{booking.id}
                    </td>

                    <td className="py-4 px-3">
                      <div className="font-bold text-[#003528]">
                        {booking.guestInfo.firstName} {booking.guestInfo.lastName}
                      </div>
                      <div className="text-[#55635e] font-mono text-[11px]">
                        +94 {booking.guestInfo.phone} · NIC: {booking.guestInfo.nicPassport}
                      </div>
                    </td>

                    <td className="py-4 px-3">
                      <div className="font-semibold text-[#003528]">{booking.packageName}</div>
                      <div className="text-[#55635e]">
                        {booking.selectedDate} · {booking.selectedSlot}
                      </div>
                    </td>

                    <td className="py-4 px-3 text-[#55635e]">
                      {booking.guestInfo.cabanaLocation || 'Poolside'}
                    </td>

                    <td className="py-4 px-3 font-headline font-bold text-[#003528] tabular-nums">
                      {formatPrice(booking.totalLkr)}
                    </td>

                    <td className="py-4 px-3">
                      {booking.status === 'CONFIRMED' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                          Confirmed
                        </span>
                      )}
                      {booking.status === 'AWAITING_OWNER_APPROVAL' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                          Pending Approval
                        </span>
                      )}
                      {booking.status === 'CHECKED_IN' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
                          Checked-In Gate
                        </span>
                      )}
                      {booking.status === 'REJECTED' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-800 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
                          Declined
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-3 text-right">
                      {booking.status === 'AWAITING_OWNER_APPROVAL' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onApproveBooking(booking.id)}
                            className="px-3 py-1.5 rounded-lg bg-[#003528] text-white font-bold text-xs hover:bg-[#004d3b] transition cursor-pointer"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => onRejectBooking(booking.id)}
                            className="px-3 py-1.5 rounded-lg border border-rose-300 text-rose-700 font-semibold text-xs hover:bg-rose-50 transition cursor-pointer"
                          >
                            Decline
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-[#55635e]">Synchronized</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 2-Column Split: Capacity Allocator Left, Availability Calendar Right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Capacity Allocator */}
          <div className="bg-white rounded-3xl border border-[#e2e8e5] p-6 lg:p-7 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#006a66]">
                Inventory Management
              </span>
              <h3 className="font-headline text-xl font-bold text-[#003528] mt-1">
                Day Pass &amp; Chalet Capacity Allocator
              </h3>
            </div>

            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-xs font-bold text-[#003528] mb-2">
                  <span>Daily Day Pass Guest Cap:</span>
                  <span className="font-mono text-sm">{dayPassCap} Guests</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={60}
                  value={dayPassCap}
                  onChange={(e) => setDayPassCap(Number(e.target.value))}
                  className="w-full accent-[#003528]"
                />
                <p className="text-[11px] text-[#55635e] mt-1">
                  Limits the maximum number of simultaneous pool and buffet guests to prevent overcrowding.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#f4f7f6] border border-[#e2e8e5] space-y-3">
                <span className="font-bold text-xs text-[#003528] block">
                  Overnight Chalet Suite Status
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-white rounded-xl border border-[#e2e8e5] flex justify-between items-center">
                    <span>Chalet #1 Ocean</span>
                    <span className="font-bold text-emerald-700">Occupied</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-[#e2e8e5] flex justify-between items-center">
                    <span>Chalet #2 Garden</span>
                    <span className="font-bold text-[#006a66]">Available</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-[#e2e8e5] flex justify-between items-center">
                    <span>Chalet #3 Veranda</span>
                    <span className="font-bold text-[#006a66]">Available</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-[#e2e8e5] flex justify-between items-center">
                    <span>Chalet #4 Villa</span>
                    <span className="font-bold text-emerald-700">Occupied</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setQuickBlockModalOpen(true)}
                className="w-full py-3 rounded-xl border border-[#003528] text-[#003528] font-bold text-xs hover:bg-[#003528] hover:text-white transition cursor-pointer"
              >
                Schedule Maintenance / Complete Blackout
              </button>
            </div>
          </div>

          {/* Availability Calendar */}
          <div className="bg-white rounded-3xl border border-[#e2e8e5] p-6 lg:p-7 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#006a66]">
                  April 2025
                </span>
                <h3 className="font-headline text-xl font-bold text-[#003528] mt-0.5">
                  Availability Calendar
                </h3>
              </div>
              <span className="text-[11px] text-[#55635e]">Click date to toggle hold</span>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2 text-center text-xs pt-2">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                <div key={i} className="font-bold text-[#55635e] py-1">
                  {day}
                </div>
              ))}

              {Array.from({ length: 30 }).map((_, index) => {
                const day = index + 1;
                const isBlocked = blockedDays.includes(day);

                return (
                  <button
                    key={day}
                    onClick={() => toggleDayBlock(day)}
                    className={`h-11 rounded-xl font-mono text-xs flex flex-col items-center justify-center transition cursor-pointer border ${
                      isBlocked
                        ? 'bg-rose-50 border-rose-300 text-rose-700 font-bold'
                        : 'bg-[#f4f7f6] border-[#e2e8e5] text-[#003528] hover:border-[#003528]'
                    }`}
                  >
                    <span>{day}</span>
                    <span className="text-[9px] scale-90">
                      {isBlocked ? 'HOLD' : 'OPEN'}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-2 text-[11px] text-[#55635e]">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f4f7f6] border border-[#e2e8e5]"></span>
                Open for booking
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                Maintenance / Private event
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Instant Payout Modal */}
      {payoutModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#e2e8e5] space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[#f0f4f2]">
              <h3 className="font-headline text-lg font-bold text-[#003528]">
                Instant CEFT Bank Transfer
              </h3>
              <button
                onClick={() => setPayoutModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#f4f7f6] flex items-center justify-center text-[#55635e]"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#55635e]">
              Disburse cleared guest escrow funds directly into Bank of Ceylon account *4892.
            </p>

            <div className="p-4 rounded-xl bg-[#f4f7f6] border border-[#e2e8e5] text-xs space-y-2">
              <div className="flex justify-between">
                <span>Total Cleared Escrow:</span>
                <strong className="font-mono text-[#003528]">{formatPrice(1623600)}</strong>
              </div>
              <div className="flex justify-between text-emerald-700">
                <span>SLTDA Host Fee (0% Promotional):</span>
                <strong className="font-mono">LKR 0</strong>
              </div>
              <div className="pt-2 border-t border-[#e2e8e5] flex justify-between font-bold text-sm text-[#003528]">
                <span>Net Disbursed:</span>
                <span className="font-headline font-black">{formatPrice(1623600)}</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setPayoutModalOpen(false)}
                className="w-1/2 py-2.5 rounded-xl border border-[#e2e8e5] text-xs font-bold text-[#55635e]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  showNotification('Instant CEFT transfer of LKR 1,623,600 triggered to BOC *4892.');
                  setPayoutModalOpen(false);
                }}
                className="w-1/2 py-2.5 rounded-xl bg-[#003528] text-white text-xs font-bold hover:bg-[#004d3b]"
              >
                Confirm Payout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Block Modal */}
      {quickBlockModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#e2e8e5] space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[#f0f4f2]">
              <h3 className="font-headline text-lg font-bold text-[#003528]">
                Schedule Property Maintenance
              </h3>
              <button
                onClick={() => setQuickBlockModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#f4f7f6] flex items-center justify-center text-[#55635e]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#55635e] mb-1">Target Area</label>
                <select className="w-full px-3 py-2 rounded-xl border border-[#e2e8e5] text-[#003528] font-semibold">
                  <option>Infinity Pool Deep Cleaning</option>
                  <option>Complete Resort Blackout (Wedding / Film Shoot)</option>
                  <option>Buffet Restaurant Renovation</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#55635e] mb-1">Date</label>
                <input
                  type="date"
                  defaultValue="2025-04-28"
                  className="w-full px-3 py-2 rounded-xl border border-[#e2e8e5] text-[#003528] font-mono font-semibold"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setQuickBlockModalOpen(false)}
                className="w-1/2 py-2.5 rounded-xl border border-[#e2e8e5] text-xs font-bold text-[#55635e]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setBlockedDays((prev) => [...prev, 28]);
                  showNotification('Inventory block successfully scheduled and synchronized.');
                  setQuickBlockModalOpen(false);
                }}
                className="w-1/2 py-2.5 rounded-xl bg-[#003528] text-white text-xs font-bold hover:bg-[#004d3b]"
              >
                Apply Block
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <aside aria-label="Host Portal Alert" className="fixed bottom-6 right-6 z-50 bg-[#003528] text-white px-5 py-3.5 rounded-xl shadow-xl flex items-center gap-3 border border-emerald-400/30">
          <span className="material-symbols-outlined text-teal-300 text-lg">check_circle</span>
          <span className="text-xs font-medium">{toastMessage}</span>
        </aside>
      )}
    </div>
  );
};
