import React, { useState } from 'react';
import { BookingState, Currency } from '../types';

interface VoucherModalProps {
  booking: BookingState | null;
  currency: Currency;
  onClose: () => void;
}

export const VoucherModal: React.FC<VoucherModalProps> = ({
  booking,
  currency,
  onClose
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!booking) return null;

  const displayTotal =
    currency === 'LKR'
      ? `LKR ${booking.totalLkr.toLocaleString('en-LK')}`
      : `$${booking.totalUsd.toFixed(2)} USD`;

  const handleDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => {
      setDownloadSuccess(false);
    }, 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#e2e8e5]">
        {/* Pass Top Banner */}
        <div className="bg-[#003528] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white p-1 rounded-full cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
          
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-[#9cf1ec] text-lg">verified</span>
            <span className="text-[11px] uppercase tracking-wider text-[#9cf1ec] font-bold font-mono">
              SLTDA VERIFIED DIGITAL GATE PASS
            </span>
          </div>

          <h3 className="font-headline text-xl font-bold">
            {booking.propertyName}
          </h3>
          <p className="text-xs text-white/80 mt-0.5">
            {booking.propertyLocation}
          </p>

          <div className="mt-4 flex items-center justify-between bg-white/10 px-3.5 py-2 rounded-xl text-xs font-mono">
            <span>Pass ID: <strong className="text-teal-200">#{booking.id}</strong></span>
            <span className="px-2 py-0.5 rounded bg-emerald-400 text-[#002118] font-bold uppercase text-[10px]">
              {booking.status}
            </span>
          </div>
        </div>

        {/* Voucher Body */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#f0f4f2] pb-4">
            <div>
              <p className="text-[11px] text-[#55635e] uppercase font-bold">Lead Guest</p>
              <p className="font-headline text-base text-[#003528] font-bold">
                {booking.guestInfo.firstName} {booking.guestInfo.lastName}
              </p>
              <p className="text-xs text-[#55635e] font-mono mt-0.5">
                NIC / Passport: {booking.guestInfo.nicPassport || '199214502391'}
              </p>
              <p className="text-xs text-[#55635e] font-mono">
                WhatsApp: +94 {booking.guestInfo.phone}
              </p>
            </div>
            
            {/* Visual Simulated QR Code */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-[#f4f7f6] p-1.5 rounded-xl border border-[#e2e8e5] flex items-center justify-center">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=DAYOUTS-LK-${booking.id}-${booking.propertyId}`}
                  alt="Check-in QR"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="font-mono text-[10px] text-[#55635e] mt-1">Scan at Gate</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs bg-[#f4f7f6] p-3.5 rounded-2xl border border-[#e2e8e5]">
            <div>
              <span className="text-[#55635e] block">Arrival Date:</span>
              <strong className="text-[#003528] font-mono">{booking.selectedDate}</strong>
            </div>
            <div>
              <span className="text-[#55635e] block">Time Slot:</span>
              <strong className="text-[#003528]">{booking.selectedSlot}</strong>
            </div>
            <div>
              <span className="text-[#55635e] block">Party Size:</span>
              <strong className="text-[#003528]">
                {booking.adults} Adults {booking.children > 0 ? `+ ${booking.children} Kids` : ''}
              </strong>
            </div>
            <div>
              <span className="text-[#55635e] block">Assigned Spot:</span>
              <strong className="text-[#006a66] font-bold truncate block">
                {booking.selectedCabana ? `${booking.selectedCabana.code} · ${booking.selectedCabana.name}` : (booking.guestInfo.cabanaLocation || 'Reserved Cabana')}
              </strong>
            </div>
            {booking.selectedCabana && (
              <div className="col-span-2 pt-2 border-t border-[#e2e8e5]/80 text-[11px] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[#55635e]">Package Tier:</span>
                  <span className="font-bold text-[#006a66] bg-[#eefaf8] px-2 py-0.5 rounded border border-[#b2e4dc]">
                    {booking.selectedTier?.name || booking.selectedCabana.packageDetails?.tierName || 'Standard Day Pass'}
                  </span>
                </div>
                <div className="text-[#003528]">
                  <strong>Dining Entitlement: </strong>
                  <span className="text-[#55635e]">
                    {booking.selectedTier?.diningPlan || booking.selectedCabana.packageDetails?.diningPlan}
                  </span>
                </div>
                <div className="text-[#003528]">
                  <strong>Privileges: </strong>
                  <span className="text-[#55635e]">
                    {booking.selectedCabana.packageDetails?.welcomeRefreshment} • {booking.selectedCabana.packageDetails?.corkagePolicy}
                  </span>
                </div>
              </div>
            )}
            <div className="col-span-2 pt-2 border-t border-[#e2e8e5] flex items-center justify-between">
              <span className="text-[#55635e]">Total Amount:</span>
              <strong className="text-[#003528] font-headline font-bold text-sm">{displayTotal}</strong>
            </div>
          </div>

          <div className="text-xs text-[#55635e] space-y-1.5 bg-[#eaf4f3] p-3.5 rounded-2xl border border-[#d2e4e1]">
            <p className="font-bold text-[#003528] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#006a66]">check_circle</span>
              Arrival &amp; Gate Entry Checklist:
            </p>
            <p>
              {booking.guestInfo.paymentChoice === 'pay_at_property'
                ? '• You selected "Pay at Sanctuary on Check-in". Bring cash (LKR) or credit card upon arrival.'
                : '• Online Pre-Authorization verified. Present this digital QR pass at reception.'}
            </p>
            <p>• Pool towels, sun lounger tags, and buffet lunch wristbands will be issued at the reception desk.</p>
          </div>

          {downloadSuccess && (
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs text-center font-bold animate-in fade-in">
              Official SLTDA Digital PDF Pass downloaded to device!
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleDownload}
              className="flex-1 bg-[#003528] hover:bg-[#004d3b] text-white py-3 px-4 rounded-xl font-headline text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-base">download</span>
              <span>Download Digital PDF Pass</span>
            </button>
            <button
              onClick={onClose}
              className="px-5 py-3 border border-[#e2e8e5] rounded-xl text-xs font-bold text-[#55635e] hover:bg-[#f4f7f6] cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
