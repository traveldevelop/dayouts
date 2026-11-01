import React from 'react';
import { PageType } from '../types';

interface FooterProps {
  onNavigate: (page: PageType) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-[#002118] text-white pt-16 pb-12 border-t border-[#003528]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Brand & Accreditation Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white text-[#003528] flex items-center justify-center font-bold shadow-sm">
                <span className="material-symbols-outlined text-[22px]">villa</span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline text-xl font-extrabold text-white leading-none">
                  DAYOUTS<span className="text-[#80d5d0]">.LK</span>
                </span>
                <span className="text-[11px] text-white/70 font-medium mt-0.5">
                  Sri Lanka Escapes &amp; Verified Sanctuaries
                </span>
              </div>
            </div>

            <p className="text-xs text-white/75 max-w-sm leading-relaxed">
              Discover, book, and verify luxury day villas, coastal retreats, pool passes, and tea-plantation sanctuaries across the island.
            </p>

            <div className="inline-flex items-center gap-3 bg-white/10 px-3.5 py-2 rounded-xl border border-white/10">
              <span className="material-symbols-outlined text-teal-300 text-2xl">verified_user</span>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-white uppercase tracking-wider font-mono">
                  SLTDA Registered Platform
                </span>
                <span className="font-mono text-white/70 text-[11px]">
                  License No: SLTDA/SQA/APP/2024/0981
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-teal-300">
                <span className="material-symbols-outlined text-lg">support_agent</span>
              </div>
              <div>
                <p className="text-[11px] text-white/70">
                  24/7 Island Concierge &amp; Emergency Support
                </p>
                <p className="font-mono text-sm text-white font-bold">
                  +94 11 789 0000
                </p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-headline text-sm font-bold text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs text-white/70">
              <li>
                <button
                  onClick={() => onNavigate('explore-stays')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Verified Day Escapes
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('day-out-packages')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  All-Inclusive Pool Passes
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('deals-and-offers')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Exclusive Member Deals
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('tour-packages')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Sri Lanka Tour Packages
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('owner-portal')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Host Portal &amp; Property Listing
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admin-console')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  SLTDA Regulatory Governance
                </button>
              </li>
            </ul>
          </div>

          {/* Island Regions */}
          <div>
            <h4 className="font-headline text-sm font-bold text-white mb-4">
              Sanctuary Corridors
            </h4>
            <ul className="space-y-2.5 text-xs text-white/70">
              <li>
                <button
                  onClick={() => onNavigate('explore-stays')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Bentota Riviera &amp; Kalutara
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('explore-stays')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Galle Fort Ramparts &amp; Unawatuna
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('explore-stays')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Ella Valleys &amp; Little Adam&apos;s Peak
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('explore-stays')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Kitulgala Kelani Rainforest
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('explore-stays')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Kandy Highlands &amp; Nuwara Eliya
                </button>
              </li>
            </ul>
          </div>

          {/* Secure Guarantee */}
          <div>
            <h4 className="font-headline text-sm font-bold text-white mb-4">
              Escrow Protection
            </h4>
            <p className="text-xs text-white/70 mb-3 leading-relaxed">
              100% money-back guarantee backed by Sri Lanka Tourism Development Authority statutory escrow.
            </p>
            <div className="flex flex-wrap gap-2 text-white text-[11px] font-mono">
              <span className="px-2 py-1 bg-white/10 rounded">Visa</span>
              <span className="px-2 py-1 bg-white/10 rounded">MasterCard</span>
              <span className="px-2 py-1 bg-white/10 rounded">LANKAQR</span>
              <span className="px-2 py-1 bg-white/10 rounded">CEFT</span>
            </div>
            <div className="mt-4 p-3 bg-white/10 rounded-xl">
              <p className="text-[11px] font-bold text-teal-300 flex items-center gap-1.5 font-mono">
                <span className="material-symbols-outlined text-sm">lock</span>
                Official Central Bank Escrow
              </p>
            </div>
          </div>
        </div>

        {/* 25 Districts Strip */}
        <div className="py-6 border-b border-white/10">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold text-white">
              Islandwide 25 Districts Coverage:
            </span>
            <p className="text-[11px] text-white/60 leading-relaxed font-body">
              Colombo • Gampaha • Kalutara • Kandy • Matale • Nuwara Eliya • Galle • Matara • Hambantota • Jaffna • Kilinochchi • Mannar • Vavuniya • Mullaitivu • Batticaloa • Ampara • Trincomalee • Kurunegala • Puttalam • Anuradhapura • Polonnaruwa • Badulla • Monaragala • Ratnapura • Kegalle
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <p>© 2025 DAYOUTS.LK Pvt Ltd. Regulated under Sri Lanka Tourism Development Authority. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-white cursor-pointer">Privacy Charter</span>
            <span className="hover:text-white cursor-pointer">Guest Booking Terms</span>
            <span className="hover:text-white cursor-pointer">Weather Force Majeure</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
