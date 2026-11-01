import React, { useState } from 'react';
import { BookingState, Currency } from '../types';
import { USD_EXCHANGE_RATE } from '../data/mockData';

interface MyBookingsPageProps {
  bookings: BookingState[];
  currency: Currency;
  onViewVoucher: (booking: BookingState) => void;
  onExplore: () => void;
  onNavigateHome: () => void;
}

export const MyBookingsPage: React.FC<MyBookingsPageProps> = ({
  bookings,
  currency,
  onViewVoucher,
  onExplore,
  onNavigateHome
}) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const filteredBookings = bookings.filter((b) => {
    if (filter === 'active') {
      return b.status === 'CONFIRMED' || b.status === 'AWAITING_OWNER_APPROVAL' || b.status === 'CHECKED_IN';
    }
    if (filter === 'completed') {
      return b.status === 'COMPLETED' || b.status === 'REJECTED';
    }
    return true;
  });

  const formatPrice = (lkrAmount: number) => {
    if (currency === 'USD') {
      return `$${(lkrAmount / USD_EXCHANGE_RATE).toFixed(2)}`;
    }
    return `LKR ${lkrAmount.toLocaleString()}`;
  };

  return (
    <div className="bg-[#fbfcfc] text-[#121d1e] min-h-screen pb-20">
      {/* Top Banner */}
      <div className="bg-[#003528] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-teal-300 mb-1.5">
              <span className="material-symbols-outlined text-sm">verified</span>
              <span>SLTDA REGISTERED TRAVEL IDENTITY</span>
            </div>
            <h1 className="font-headline text-3xl sm:text-4xl font-extrabold tracking-tight">
              My Day Passes &amp; Stays
            </h1>
            <p className="text-xs text-white/80 mt-1 max-w-xl">
              Access your official Sri Lanka Tourism verified digital QR vouchers, cabana allocations, and gate entry permits.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onExplore}
              className="px-5 py-2.5 rounded-xl bg-white text-[#003528] font-bold text-xs shadow-md hover:bg-white/95 transition cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">travel_explore</span>
              <span>Explore More Escapes</span>
            </button>
            <button
              onClick={onNavigateHome}
              className="px-4 py-2.5 rounded-xl bg-white/10 text-white font-semibold text-xs hover:bg-white/20 transition cursor-pointer"
            >
              Home
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Navigation / Filter Tabs */}
        <div className="flex items-center justify-between border-b border-[#e2e8e5] pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
                filter === 'all'
                  ? 'bg-[#003528] text-white shadow-xs'
                  : 'bg-[#f4f7f6] text-[#55635e] hover:bg-[#ebf0ee]'
              }`}
            >
              <span>All Bookings</span>
              <span className="font-mono">{bookings.length}</span>
            </button>

            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
                filter === 'active'
                  ? 'bg-[#003528] text-white shadow-xs'
                  : 'bg-[#f4f7f6] text-[#55635e] hover:bg-[#ebf0ee]'
              }`}
            >
              <span>Upcoming Passes</span>
              <span className="font-mono">
                {bookings.filter((b) => b.status !== 'COMPLETED' && b.status !== 'REJECTED').length}
              </span>
            </button>

            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
                filter === 'completed'
                  ? 'bg-[#003528] text-white shadow-xs'
                  : 'bg-[#f4f7f6] text-[#55635e] hover:bg-[#ebf0ee]'
              }`}
            >
              <span>Past Escapes</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#55635e]">
            <span className="material-symbols-outlined text-sm text-[#006a66]">qr_code_scanner</span>
            <span>Scan QR at resort security for clearance</span>
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#e2e8e5] p-8 max-w-md mx-auto shadow-xs">
            <span className="material-symbols-outlined text-4xl text-[#006a66] mb-3">confirmation_number</span>
            <h3 className="font-headline text-lg font-bold text-[#003528]">No passes found</h3>
            <p className="text-xs text-[#55635e] mt-1 mb-5">
              You haven&apos;t booked any day passes or stays in this section yet.
            </p>
            <button
              onClick={onExplore}
              className="px-5 py-2.5 rounded-xl bg-[#003528] text-white text-xs font-bold hover:bg-[#004d3b]"
            >
              Discover Sanctuaries
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-3xl border border-[#e2e8e5] shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col lg:flex-row"
              >
                {/* Property Image & Badge */}
                <div className="lg:w-72 relative overflow-hidden bg-slate-100 shrink-0">
                  <img
                    src={booking.propertyImage}
                    alt={booking.propertyName}
                    className="w-full h-48 lg:h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-mono font-bold px-2.5 py-1 rounded-md">
                    #{booking.id}
                  </div>
                </div>

                {/* Details & Actions */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        {booking.status === 'CONFIRMED' && (
                          <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                            Confirmed &amp; Verified
                          </span>
                        )}
                        {booking.status === 'AWAITING_OWNER_APPROVAL' && (
                          <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                            Awaiting Host Gate Confirmation
                          </span>
                        )}
                        {booking.status === 'CHECKED_IN' && (
                          <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-teal-100 text-teal-800">
                            Checked In On-Site
                          </span>
                        )}
                      </div>

                      <span className="text-xs text-[#55635e] font-mono flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">calendar_today</span>
                        {booking.selectedDate} · {booking.selectedSlot}
                      </span>
                    </div>

                    <h3 className="font-headline text-xl font-extrabold text-[#003528]">
                      {booking.propertyName}
                    </h3>

                    <p className="text-xs text-[#55635e] mt-1">
                      {booking.propertyLocation}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#55635e]">
                      <span className="font-medium text-[#003528]">{booking.packageName}</span>
                      <span>·</span>
                      <span>{booking.adults} Adults {booking.children > 0 ? `, ${booking.children} Children` : ''}</span>
                      <span>·</span>
                      <span>Seating: {booking.guestInfo.cabanaLocation || 'Poolside'}</span>
                    </div>
                  </div>

                  {/* Bottom Bar: Amount & CTA */}
                  <div className="pt-4 border-t border-[#f0f4f2] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#55635e]">Amount</span>
                      <div className="font-headline text-xl font-black text-[#003528] tabular-nums">
                        {formatPrice(booking.totalLkr)}
                      </div>
                      <span className="text-[11px] text-[#55635e]">
                        {booking.guestInfo.paymentChoice === 'pay_at_property' ? 'Pay upon gate check-in' : 'Settled Online'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onViewVoucher(booking)}
                        className="px-4 py-2.5 rounded-xl bg-[#003528] hover:bg-[#004d3b] text-white text-xs font-bold shadow-md transition cursor-pointer flex items-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-base">qr_code_2</span>
                        <span>View SLTDA Digital QR Pass</span>
                      </button>

                      <a
                        href={`https://wa.me/94771234567?text=Hi%20DAYOUTS.LK,%20I%20have%20an%20inquiry%20regarding%20booking%20%23${booking.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2.5 rounded-xl border border-[#e2e8e5] text-[#55635e] hover:text-[#003528] hover:bg-[#f4f7f6] transition cursor-pointer"
                        title="Contact Concierge"
                      >
                        <span className="material-symbols-outlined text-base">support_agent</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
