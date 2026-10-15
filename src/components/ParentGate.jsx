import { useState, useRef } from 'react';

// Simple math gate — toddlers can't solve it; parents can
const QUESTIONS = [
  { q: '2 + 3 = ?', a: '5' },
  { q: '4 + 2 = ?', a: '6' },
  { q: '7 - 3 = ?', a: '4' },
  { q: '3 × 3 = ?', a: '9' },
  { q: '10 ÷ 2 = ?', a: '5' },
  { q: '8 - 5 = ?', a: '3' },
  { q: '6 + 2 = ?', a: '8' },
];

function pick() {
  return QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
}

export default function ParentGate({ onSuccess, onCancel }) {
  const [{ q, a }] = useState(pick);
  const [input,  setInput]  = useState('');
  const [shake,  setShake]  = useState(false);
  const inputRef = useRef(null);

  function submit(e) {
    e.preventDefault();
    if (input.trim() === a) {
      onSuccess();
    } else {
      setShake(true);
      setInput('');
      setTimeout(() => { setShake(false); inputRef.current?.focus(); }, 450);
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-lg">
      <div
        className={`bg-[#13132a] border border-white/10 rounded-3xl p-8 w-[min(90vw,400px)]
                    flex flex-col gap-6 shadow-2xl ${shake ? 'shake' : ''}`}
      >
        <div className="text-center">
          <div className="text-4xl mb-3">🔒</div>
          <h2 className="text-white text-xl font-black tracking-wider">Parent Mode</h2>
          <p className="text-white/40 text-sm mt-1 tracking-wide">Solve to continue</p>
        </div>

        <div className="bg-white/5 rounded-2xl p-5 text-center">
          <p className="text-white/60 text-sm mb-1 tracking-widest">WHAT IS</p>
          <p className="text-white text-3xl font-black tracking-wider">{q}</p>
        </div>

        <form onSubmit={submit} className="flex gap-3">
          <input
            ref={inputRef}
            autoFocus
            type="number"
            value={input}
            onChange={e => setInput(e.target.value)}
            className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3
                       text-white text-xl font-bold text-center outline-none
                       focus:border-[#FDE047] transition-colors"
            placeholder="?"
          />
          <button
            type="submit"
            className="bg-[#FDE047] text-black font-black rounded-xl px-6
                       hover:scale-105 active:scale-95 transition-transform"
          >
            Go
          </button>
        </form>

        <button
          onClick={onCancel}
          className="text-white/30 text-sm text-center hover:text-white/60 transition-colors"
        >
          Cancel — keep playing
        </button>
      </div>
    </div>
  );
}
