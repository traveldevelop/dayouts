import React, { useState } from 'react';
import { Currency, Language, PageType } from '../types';

interface HeaderProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
  currency: Currency;
  onCurrencyChange: (curr: Currency) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  bookingCount: number;
  onOpenAiCreator?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  currency,
  onCurrencyChange,
  language,
  onLanguageChange,
  bookingCount,
  onOpenAiCreator
}) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#e2e8e5] transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => onNavigate('explore-stays')}
          className="flex items-center gap-2.5 text-left cursor-pointer group focus:outline-none shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-[#003528] text-white flex items-center justify-center shadow-sm group-hover:bg-[#004d3b] transition-colors">
            <span className="material-symbols-outlined text-[24px]">villa</span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline text-xl font-extrabold tracking-tight text-[#003528] leading-none">
              DAYOUTS<span className="text-[#006a66]">.LK</span>
            </span>
            <span className="text-[11px] text-[#55635e] font-medium tracking-normal mt-0.5 hidden sm:inline-block">
              Sri Lanka Escapes &amp; Sanctuaries
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links (Home, DayOuts, Offers + Suggested links) */}
        <nav className="hidden lg:flex items-center gap-6">
          <button
            onClick={() => onNavigate('explore-stays')}
            className={`text-sm font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 py-1 border-b-2 ${
              currentPage === 'explore-stays'
                ? 'border-[#003528] text-[#003528] font-bold'
                : 'border-transparent text-[#404945] hover:text-[#003528]'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => onNavigate('day-out-packages')}
            className={`text-sm font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 py-1 border-b-2 flex items-center gap-1.5 ${
              currentPage === 'day-out-packages'
                ? 'border-[#003528] text-[#003528] font-bold'
                : 'border-transparent text-[#404945] hover:text-[#003528]'
            }`}
          >
            <span>DayOuts</span>
            <span className="px-1.5 py-0.5 rounded-md bg-[#e2f5f1] text-[#006a66] text-[10px] font-bold">
              Passes
            </span>
          </button>

          <button
            onClick={() => onNavigate('deals-and-offers')}
            className={`text-sm font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 py-1 border-b-2 flex items-center gap-1.5 ${
              currentPage === 'deals-and-offers'
                ? 'border-[#003528] text-[#003528] font-bold'
                : 'border-transparent text-[#404945] hover:text-[#003528]'
            }`}
          >
            <span>Offers</span>
            <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[9px] font-extrabold uppercase tracking-wider">
              % Hot
            </span>
          </button>

          <button
            onClick={() => onNavigate('villas-stays')}
            className={`text-sm font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 py-1 border-b-2 ${
              currentPage === 'villas-stays'
                ? 'border-[#003528] text-[#003528] font-bold'
                : 'border-transparent text-[#404945] hover:text-[#003528]'
            }`}
          >
            Villas &amp; Stays
          </button>

          <button
            onClick={() => onNavigate('tour-packages')}
            className={`text-sm font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 py-1 border-b-2 ${
              currentPage === 'tour-packages'
                ? 'border-[#003528] text-[#003528] font-bold'
                : 'border-transparent text-[#404945] hover:text-[#003528]'
            }`}
          >
            Tour Packages
          </button>
        </nav>

        {/* Zone 3: Actions (Currency, Language, User Account) */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Currency Switcher */}
          <div className="hidden sm:flex items-center bg-[#f4f7f6] rounded-lg p-0.5 border border-[#e2e8e5] text-xs font-mono">
            <button
              onClick={() => onCurrencyChange('LKR')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                currency === 'LKR'
                  ? 'bg-white text-[#003528] font-bold shadow-xs'
                  : 'text-[#6b7772] hover:text-[#003528]'
              }`}
            >
              LKR
            </button>
            <button
              onClick={() => onCurrencyChange('USD')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                currency === 'USD'
                  ? 'bg-white text-[#003528] font-bold shadow-xs'
                  : 'text-[#6b7772] hover:text-[#003528]'
              }`}
            >
              USD
            </button>
          </div>

          {/* Language Switcher */}
          <div className="hidden md:flex items-center bg-[#f4f7f6] rounded-lg p-0.5 border border-[#e2e8e5] text-xs font-semibold">
            <button
              onClick={() => onLanguageChange('EN')}
              className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                language === 'EN'
                  ? 'bg-[#003528] text-white shadow-xs'
                  : 'text-[#6b7772] hover:text-[#003528]'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => onLanguageChange('SI')}
              className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                language === 'SI'
                  ? 'bg-[#003528] text-white shadow-xs'
                  : 'text-[#6b7772] hover:text-[#003528]'
              }`}
            >
              සිං
            </button>
            <button
              onClick={() => onLanguageChange('TA')}
              className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                language === 'TA'
                  ? 'bg-[#003528] text-white shadow-xs'
                  : 'text-[#6b7772] hover:text-[#003528]'
              }`}
            >
              தமிழ்
            </button>
          </div>

          {/* AI Listing Creator CTA */}
          {onOpenAiCreator && (
            <button
              onClick={onOpenAiCreator}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-700 hover:from-teal-700 hover:to-emerald-800 text-white transition-all text-xs font-bold cursor-pointer shrink-0 shadow-2xs"
              title="Add hotel or dayout listing automatically by pasting promo text"
            >
              <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
              <span>✨ AI Listing</span>
            </button>
          )}

          {/* Owners Admin Dashboard CTA */}
          <button
            onClick={() => onNavigate('admin-dashboard')}
            className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-600/40 bg-emerald-50 hover:bg-[#003528] text-[#003528] hover:text-white transition-all text-xs font-bold cursor-pointer shrink-0 shadow-2xs"
            title="Open Central Property & Reservations Admin Dashboard (/admin-dashboard)"
          >
            <span className="material-symbols-outlined text-[16px] text-emerald-700">dashboard_customize</span>
            <span>Admin Dashboard</span>
          </button>

          {/* List Your Property / Host CTA */}
          <button
            onClick={() => onNavigate('owner-portal')}
            className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#003528]/20 bg-[#f4f7f6] hover:bg-[#003528] text-[#003528] hover:text-white transition-all text-xs font-bold cursor-pointer shrink-0"
            title="List your Hotel, Cabana, or Villa on Dayouts.lk"
          >
            <span className="material-symbols-outlined text-[16px]">add_business</span>
            <span>+ List Sanctuary</span>
          </button>

          {/* User Account / Pass Wallet */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 p-1.5 pl-3 rounded-full bg-[#f4f7f6] hover:bg-[#ebf0ee] border border-[#e2e8e5] transition cursor-pointer focus:outline-none"
              aria-label="Account Menu"
            >
              <span className="text-xs font-semibold text-[#003528] hidden sm:inline-block">
                Nalin J.
              </span>
              {bookingCount > 0 && (
                <span className="bg-[#006a66] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full tabular-nums">
                  {bookingCount}
                </span>
              )}
              <div className="w-7 h-7 rounded-full bg-[#003528] text-white flex items-center justify-center font-bold text-xs">
                NJ
              </div>
            </button>

            {/* Dropdown Menu */}
            {profileOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-[#e2e8e5] p-2 z-50 animate-in fade-in zoom-in-95"
                onMouseLeave={() => setProfileOpen(false)}
              >
                <div className="px-3 py-2.5 border-b border-[#f0f4f2] mb-1">
                  <p className="text-sm font-bold text-[#003528] truncate">
                    Nalin Jayawardena
                  </p>
                  <p className="text-xs text-[#006a66] font-medium">
                    Verified SLTDA Explorer &amp; Property Owner
                  </p>
                </div>

                <button
                  onClick={() => {
                    onNavigate('admin-dashboard');
                    setProfileOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-[#003528] bg-emerald-50 hover:bg-emerald-100 transition-colors cursor-pointer text-left mb-1"
                >
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-base text-emerald-700">dashboard_customize</span>
                    Owner Admin Dashboard
                  </span>
                  <span className="text-[10px] font-mono bg-emerald-200/80 text-emerald-900 px-1.5 py-0.5 rounded">
                    /admin-dashboard
                  </span>
                </button>

                <button
                  onClick={() => {
                    onNavigate('my-bookings');
                    setProfileOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-[#404945] hover:bg-[#f4f7f6] hover:text-[#003528] transition-colors cursor-pointer text-left"
                >
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-base text-[#006a66]">confirmation_number</span>
                    My Day Passes &amp; Stays
                  </span>
                  {bookingCount > 0 && (
                    <span className="bg-[#003528] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full tabular-nums">
                      {bookingCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => {
                    onNavigate('explore-stays');
                    setProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-[#404945] hover:bg-[#f4f7f6] hover:text-[#003528] transition-colors cursor-pointer text-left"
                >
                  <span className="material-symbols-outlined text-base text-rose-500">favorite</span>
                  Saved Wishlist
                </button>

                <div className="my-1 border-t border-[#f0f4f2]"></div>

                <button
                  onClick={() => {
                    onNavigate('owner-portal');
                    setProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-[#003528] hover:bg-[#f4f7f6] transition-colors cursor-pointer text-left"
                >
                  <span className="material-symbols-outlined text-base text-[#003528]">real_estate_agent</span>
                  Switch to Host Portal
                </button>

                <button
                  onClick={() => {
                    onNavigate('admin-console');
                    setProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-[#006a66] hover:bg-[#f4f7f6] transition-colors cursor-pointer text-left"
                >
                  <span className="material-symbols-outlined text-base text-[#006a66]">admin_panel_settings</span>
                  SLTDA Regulatory Console
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-[#404945] hover:bg-[#f4f7f6] cursor-pointer"
            aria-label="Toggle navigation"
          >
            <span className="material-symbols-outlined text-[24px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#e2e8e5] px-4 py-4 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-[#f0f4f2]">
            {/* Currency */}
            <div className="flex items-center gap-1 bg-[#f4f7f6] rounded-lg p-1 text-xs">
              <button
                onClick={() => onCurrencyChange('LKR')}
                className={`px-3 py-1 rounded font-bold ${currency === 'LKR' ? 'bg-[#003528] text-white' : 'text-[#55635e]'}`}
              >
                LKR
              </button>
              <button
                onClick={() => onCurrencyChange('USD')}
                className={`px-3 py-1 rounded font-bold ${currency === 'USD' ? 'bg-[#003528] text-white' : 'text-[#55635e]'}`}
              >
                USD
              </button>
            </div>

            {/* Language */}
            <div className="flex items-center gap-1 bg-[#f4f7f6] rounded-lg p-1 text-xs font-medium">
              <button
                onClick={() => onLanguageChange('EN')}
                className={`px-2 py-1 rounded font-bold ${language === 'EN' ? 'bg-[#003528] text-white' : 'text-[#55635e]'}`}
              >
                EN
              </button>
              <button
                onClick={() => onLanguageChange('SI')}
                className={`px-2 py-1 rounded font-bold ${language === 'SI' ? 'bg-[#003528] text-white' : 'text-[#55635e]'}`}
              >
                සිං
              </button>
              <button
                onClick={() => onLanguageChange('TA')}
                className={`px-2 py-1 rounded font-bold ${language === 'TA' ? 'bg-[#003528] text-white' : 'text-[#55635e]'}`}
              >
                தமிழ்
              </button>
            </div>
          </div>

          <button
            onClick={() => {
              onNavigate('explore-stays');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left py-2.5 px-3 rounded-lg text-sm font-semibold flex items-center justify-between ${
              currentPage === 'explore-stays' ? 'text-[#003528] bg-[#f4f7f6] font-bold' : 'text-[#404945] hover:bg-[#f4f7f6]'
            }`}
          >
            <span>Home</span>
          </button>
          <button
            onClick={() => {
              onNavigate('day-out-packages');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left py-2.5 px-3 rounded-lg text-sm font-semibold flex items-center justify-between ${
              currentPage === 'day-out-packages' ? 'text-[#003528] bg-[#f4f7f6] font-bold' : 'text-[#404945] hover:bg-[#f4f7f6]'
            }`}
          >
            <span>DayOuts</span>
            <span className="px-1.5 py-0.5 rounded bg-[#e2f5f1] text-[#006a66] text-[10px] font-bold">Passes</span>
          </button>
          <button
            onClick={() => {
              onNavigate('deals-and-offers');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left py-2.5 px-3 rounded-lg text-sm font-semibold flex items-center justify-between ${
              currentPage === 'deals-and-offers' ? 'text-[#003528] bg-[#f4f7f6] font-bold' : 'text-[#404945] hover:bg-[#f4f7f6]'
            }`}
          >
            <span>Offers</span>
            <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[9px] font-bold uppercase">% Hot</span>
          </button>
          <button
            onClick={() => {
              onNavigate('villas-stays');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left py-2.5 px-3 rounded-lg text-sm font-semibold flex items-center justify-between ${
              currentPage === 'villas-stays' ? 'text-[#003528] bg-[#f4f7f6] font-bold' : 'text-[#404945] hover:bg-[#f4f7f6]'
            }`}
          >
            <span>Villas &amp; Stays</span>
          </button>
          <button
            onClick={() => {
              onNavigate('tour-packages');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left py-2.5 px-3 rounded-lg text-sm font-semibold flex items-center justify-between ${
              currentPage === 'tour-packages' ? 'text-[#003528] bg-[#f4f7f6] font-bold' : 'text-[#404945] hover:bg-[#f4f7f6]'
            }`}
          >
            <span>Tour Packages</span>
            <span className="px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">New</span>
          </button>
          <button
            onClick={() => {
              onNavigate('admin-dashboard');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2.5 px-3 rounded-lg text-sm font-bold text-emerald-950 bg-emerald-50 hover:bg-emerald-100 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-emerald-700">dashboard_customize</span>
              <span>Owner Admin Dashboard</span>
            </div>
            <span className="text-[10px] font-mono bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded">
              /admin-dashboard
            </span>
          </button>
          <button
            onClick={() => {
              onNavigate('owner-portal');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2.5 px-3 rounded-lg text-sm text-[#003528] font-semibold hover:bg-[#f4f7f6] flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">add_business</span>
            <span>List Sanctuary (Host Portal)</span>
          </button>
          <button
            onClick={() => {
              onNavigate('admin-console');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded-lg text-sm text-[#006a66] font-semibold hover:bg-[#f4f7f6]"
          >
            SLTDA Regulatory Governance
          </button>
          <button
            onClick={() => {
              onNavigate('my-bookings');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded-lg text-sm font-bold text-[#003528] bg-[#f4f7f6] flex items-center justify-between"
          >
            <span>My Day Passes</span>
            <span className="bg-[#003528] text-white text-[10px] font-bold px-2 py-0.5 rounded-full tabular-nums">
              {bookingCount}
            </span>
          </button>
        </div>
      )}
    </header>
  );
};
