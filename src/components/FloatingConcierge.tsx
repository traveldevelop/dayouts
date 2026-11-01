import React, { useState } from 'react';

export const FloatingConcierge: React.FC = () => {
  const [showBubble, setShowBubble] = useState(true);

  return (
    <aside aria-label="WhatsApp Concierge" className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2.5 pointer-events-auto">
      {/* Live Assistant Bubble */}
      {showBubble && (
        <div className="hidden sm:flex items-center gap-3 bg-white rounded-2xl p-3 shadow-xl border border-[#e2e8e5] pl-3.5 max-w-xs relative animate-in fade-in slide-in-from-bottom-2">
          <button
            onClick={() => setShowBubble(false)}
            className="absolute -top-2 -left-2 w-5 h-5 bg-[#f4f7f6] rounded-full text-[#55635e] hover:bg-[#ebf0ee] flex items-center justify-center text-[10px] cursor-pointer"
            title="Dismiss message"
          >
            ✕
          </button>
          <div className="w-9 h-9 rounded-full bg-[#003528] text-white flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[18px]">support_agent</span>
          </div>
          <div className="flex flex-col pr-1">
            <p className="text-xs font-bold text-[#003528] leading-tight">
              Direct Island Concierge
            </p>
            <p className="text-[11px] text-[#55635e] mt-0.5 leading-tight">
              Custom family day passes &amp; villa arrangements.
            </p>
          </div>
        </div>
      )}

      {/* WhatsApp Action Button */}
      <a
        href="https://wa.me/94771234567?text=Hello%20DAYOUTS.LK,%20I%20would%20like%20to%20inquire%20about%20a%20luxury%20day%20pass%20or%20private%20villa%20reservation."
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-2 px-4 py-2.5 bg-[#003528] text-white hover:bg-[#004d3b] rounded-full shadow-lg transition-all hover:scale-102 cursor-pointer border border-white/20"
      >
        <svg className="w-4 h-4 fill-current text-emerald-300" viewBox="0 0 24 24">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.861.173.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.144.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824z" />
        </svg>
        <span className="text-xs font-semibold text-white">
          WhatsApp Concierge
        </span>
      </a>
    </aside>
  );
};
