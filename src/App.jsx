import { useState, useEffect, useCallback, useRef } from "react";

// ── Default rate profiles ──────────────────────────────────────────────────
const DEFAULT_PROFILES = [
  { id: 1, name: "Default", dayRate: 700, hoursPerDay: 8, color: "#a78bfa" },
];

const QUOTES = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "You're not just working — you're building something.", author: null },
  { text: "Every second counts. Literally, in your case.", author: null },
  { text: "Progress, not perfection.", author: null },
  { text: "The clock is ticking. So is your bank balance.", author: null },
  { text: "Hard work beats talent when talent doesn't work hard.", author: "Tim Notke" },
  { text: "Your future self is watching you right now through memories.", author: null },
  { text: "Do something today that your future self will thank you for.", author: null },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { text: "The present moment always will have been.", author: null },
  { text: "Discipline is choosing between what you want now and what you want most.", author: null },
  { text: "Your effort is literally paying off. Right now. Watch.", author: null },
  { text: "Be so good they can't ignore you.", author: "Steve Martin" },
  { text: "A smooth sea never made a skilled sailor.", author: null },
  { text: "You've already outlasted the version of you who almost didn't start.", author: null },
  { text: "The difference between ordinary and extraordinary is that little extra.", author: "Jimmy Johnson" },
  { text: "Don't watch the clock. Do what it does — keep going.", author: "Sam Levenson" },
  { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
  { text: "It's not about having time. It's about making time.", author: null },
  { text: "Coffee: £3. Earning while drinking it: priceless.", author: null },
  { text: "What you do today can improve all your tomorrows.", author: "Ralph Marston" },
  { text: "Either you run the day, or the day runs you.", author: "Jim Rohn" },
  { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  { text: "You are what you do, not what you say you'll do.", author: "Carl Jung" },
  { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
  { text: "Time is what we want most but use worst.", author: "William Penn" },
  { text: "If it's worth doing, it's worth doing right.", author: null },
  { text: "Great things are not done by impulse, but by a series of small things brought together.", author: "Vincent Van Gogh" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Energy and persistence conquer all things.", author: "Benjamin Franklin" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { text: "The harder I work, the luckier I get.", author: "Samuel Goldwyn" },
  { text: "Don't count the days, make the days count.", author: "Muhammad Ali" },
  { text: "Opportunities don't happen. You create them.", author: "Chris Grosser" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "Dream big, start small, act now.", author: null },
  { text: "Success usually comes to those who are too busy to be looking for it.", author: "Henry David Thoreau" },
  { text: "Don't be afraid to give up the good to go for the great.", author: "John D. Rockefeller" },
  { text: "Done is better than perfect.", author: null },
  { text: "Work hard in silence. Let success make the noise.", author: null },
  { text: "If you're going through hell, keep going.", author: "Winston Churchill" },
  { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
  { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" },
  { text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky" },
  { text: "The most reliable way to predict the future is to create it.", author: "Abraham Lincoln" },
  { text: "Never let the fear of striking out keep you from playing the game.", author: "Babe Ruth" },
  { text: "Formal education will make you a living; self-education will make you a fortune.", author: "Jim Rohn" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: null },
  { text: "Too many of us are not living our dreams because we are living our fears.", author: "Les Brown" },
  { text: "Life isn't about finding yourself. Life is about creating yourself.", author: "George Bernard Shaw" },
  { text: "Done is better than perfect.", author: null },
  { text: "All our dreams can come true, if we have the courage to pursue them.", author: "Walt Disney" },
  { text: "Successful people do what unsuccessful people are not willing to do.", author: null },
  { text: "The only place where success comes before work is in the dictionary.", author: "Vidal Sassoon" },
  { text: "Try not to become a person of success, but rather try to become a person of value.", author: "Albert Einstein" },
  { text: "I have not failed. I've just found 10,000 ways that won't work.", author: "Thomas Edison" },
  { text: "Creativity is intelligence having fun.", author: "Albert Einstein" },
  { text: "Don't worry about failure; you only have to be right once.", author: "Drew Houston" },
  { text: "There are no traffic jams along the extra mile.", author: "Roger Staubach" },
  { text: "Whatever the mind of man can conceive and believe, it can achieve.", author: "Napoleon Hill" },
  { text: "You only live once, but if you do it right, once is enough.", author: "Mae West" },
  { text: "The mind is everything. What you think you become.", author: "Buddha" },
  { text: "Eighty percent of success is showing up.", author: "Woody Allen" },
  { text: "Your time is limited, so don't waste it living someone else's life.", author: "Steve Jobs" },
  { text: "In the middle of every difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "Whether you think you can or you think you can't, you're right.", author: "Henry Ford" },
  { text: "Quality is not an act, it is a habit.", author: "Aristotle" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "Twenty years from now you will be more disappointed by the things you didn't do than by the ones you did.", author: "Mark Twain" },
  { text: "The most difficult thing is the decision to act. The rest is merely tenacity.", author: "Amelia Earhart" },
  { text: "If you're offered a seat on a rocket ship, don't ask what seat — just get on.", author: "Sheryl Sandberg" },
  { text: "Winning isn't everything, but wanting to win is.", author: "Vince Lombardi" },
  { text: "Strive not to be a success, but rather to be of value.", author: "Albert Einstein" },
  { text: "Life is either a daring adventure or nothing at all.", author: "Helen Keller" },
];

// ── Helpers ────────────────────────────────────────────────────────────────
function formatTime(s) {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;
}
function formatDays(s, hpd = 8) { return (s / (hpd * 3600)).toFixed(2); }
function formatCurrency(n) { return `£${Number(n).toFixed(2)}`; }
function formatDate(ts) { return new Date(ts).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" }); }
function formatGMT(ts) { if (!ts) return "—"; return new Date(ts).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "GMT" }); }

// ── Streak helpers ─────────────────────────────────────────────────────────
function getDayKey(ts) {
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}
function isWorkday(ts) {
  const day = new Date(ts).getDay(); // 0=Sun, 6=Sat
  return day >= 1 && day <= 5;
}
// Returns the previous workday key from a given date
function prevWorkday(dateKey) {
  let d = new Date(dateKey + "T12:00:00");
  do { d = new Date(d.getTime() - 86400000); } while (!isWorkday(d.getTime()));
  return getDayKey(d.getTime());
}
function calcStreaks(sessions) {
  // Only count workday sessions
  const workdaySessions = sessions.filter(s => isWorkday(s.dateTs));
  if (!workdaySessions.length) return { current: 0, longest: 0 };

  const days = new Set(workdaySessions.map(s => getDayKey(s.dateTs)));
  const todayTs = Date.now();
  const today = getDayKey(todayTs);
  const lastWorkday = isWorkday(todayTs) ? today : prevWorkday(today);
  const prevWD = prevWorkday(lastWorkday);

  // Streak is alive if worked today (if workday) or last workday
  const aliveFrom = days.has(lastWorkday) ? lastWorkday : (days.has(prevWD) ? prevWD : null);
  if (!aliveFrom) return { current: 0, longest: calcLongest(days) };

  // Walk back through consecutive workdays
  let current = 0;
  let check = aliveFrom;
  while (days.has(check)) {
    current++;
    check = prevWorkday(check);
  }

  return { current, longest: Math.max(current, calcLongest(days)) };
}
function calcLongest(days) {
  if (!days.size) return 0;
  const sorted = Array.from(days).sort();
  let longest = 1, run = 1;
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === nextWorkdayKey(sorted[i-1])) { run++; longest = Math.max(longest, run); }
    else run = 1;
  }
  return longest;
}
function nextWorkdayKey(dateKey) {
  let d = new Date(dateKey + "T12:00:00");
  do { d = new Date(d.getTime() + 86400000); } while (!isWorkday(d.getTime()));
  return getDayKey(d.getTime());
}
function getStorage(k, fb) { try { const v = localStorage.getItem(k); return v !== null ? JSON.parse(v) : fb; } catch { return fb; } }
function setStorage(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }

// ── Milestone chime (Web Audio) ────────────────────────────────────────────
function playChime(milestone) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const notes = milestone === 100 ? [523, 659, 784, 1047] : milestone === 75 ? [659, 784] : milestone === 50 ? [523, 659] : [523];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = "sine"; osc.frequency.value = freq;
      const t = ctx.currentTime + i * 0.18;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.18, t + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);
      osc.start(t); osc.stop(t + 0.6);
    });
  } catch {}
}
function playStreakChime() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    // Warm, rising two-note tone — distinct from earnings chime
    [[392, 0], [523, 0.22], [659, 0.42]].forEach(([freq, delay]) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = "triangle"; osc.frequency.value = freq;
      const t = ctx.currentTime + delay;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.14, t + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.7);
      osc.start(t); osc.stop(t + 0.75);
    });
  } catch {}
}

// ── Profile colour palette ─────────────────────────────────────────────────
const PROFILE_COLORS = ["#a78bfa","#6ee7b7","#fbbf24","#f9a8d4","#67e8f9","#fb923c","#86efac","#c4b5fd"];

// ── Blob configs ───────────────────────────────────────────────────────────
const BLOB_CONFIGS = [
  { color: "rgba(88,80,236,0.26)",  size: "62vw", blur: 55, initX: -10, initY: -15 },
  { color: "rgba(16,185,129,0.19)", size: "52vw", blur: 55, initX:  55, initY:  60 },
  { color: "rgba(236,72,153,0.16)", size: "40vw", blur: 42, initX:  70, initY:  30 },
  { color: "rgba(6,182,212,0.13)",  size: "46vw", blur: 50, initX:  20, initY:  70 },
];

// ══════════════════════════════════════════════════════════════════════════
// TimerCard component
// ══════════════════════════════════════════════════════════════════════════
function TimerCard({ status, isRunning, isPaused, elapsed, timerColor, earnings, earningsPulse,
  confirmReset, setConfirmReset, startNew, pause, resume, finish, cancelAndReset,
  sessionTitle, updateTitle, profiles, activeProfileId, setActiveProfileId }) {

  const [panel, setPanel] = useState(status === "idle" ? "idle" : "active");
  const [fading, setFading] = useState(false);
  const [height, setHeight] = useState(null);
  const [localTitle, setLocalTitle] = useState(sessionTitle || "");
  const contentRef = useRef(null);
  const activeProfile = profiles.find(p => p.id === activeProfileId) || profiles[0];
  const ratePerHour = activeProfile.dayRate / activeProfile.hoursPerDay;
  const minuteRate = ratePerHour / 60;

  useEffect(() => { setLocalTitle(sessionTitle || ""); }, [sessionTitle]);

  useEffect(() => {
    if (!contentRef.current) return;
    setHeight(contentRef.current.scrollHeight);
  }, [panel, confirmReset, status]);

  useEffect(() => {
    const target = status === "idle" ? "idle" : "active";
    if (target === panel) return;
    setFading(true);
    const t = setTimeout(() => { setPanel(target); setFading(false); }, 300);
    return () => clearTimeout(t);
  }, [status]); // eslint-disable-line

  const cardOpacity = fading ? 0 : 1;
  const cardTransform = fading
    ? (panel === "idle" ? "translateY(-8px) scale(0.97)" : "translateY(8px) scale(0.97)")
    : "translateY(0) scale(1)";

  return (
    <div className="glass" style={{ marginBottom: 24, textAlign: "center", overflow: "hidden", height: height || "auto", transition: "height 0.45s cubic-bezier(0.4,0,0.2,1)" }}>
      <div ref={contentRef} style={{ opacity: cardOpacity, transform: cardTransform, transition: "opacity 0.3s ease, transform 0.3s ease" }}>
        {panel === "idle" ? (
          <div style={{ padding: "32px 24px 28px", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div className="serif" style={{ fontSize: 32, fontStyle: "italic", fontWeight: 400, color: "rgba(255,255,255,0.88)", lineHeight: 1.25, marginBottom: 6, letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>
              Start some new shit.
            </div>
            <div className="sf" style={{ fontSize: 12.5, color: "rgba(255,255,255,0.55)", marginBottom: 20, letterSpacing: "0.04em" }}>ready when you are</div>

            {/* Title input */}
            <input type="text" placeholder="What are you working on? (optional)" value={localTitle}
              onChange={e => setLocalTitle(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") startNew(localTitle, activeProfileId); }}
              maxLength={60} className="sf"
              style={{ width: "100%", marginBottom: 14, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: "11px 14px", color: "rgba(255,255,255,0.85)", fontSize: 13, outline: "none", textAlign: "center", fontFamily: "'DM Sans',-apple-system,sans-serif", transition: "border-color 0.15s ease" }}
              onFocus={e => { e.target.style.borderColor = "rgba(139,92,246,0.5)"; e.target.style.background = "rgba(255,255,255,0.07)"; }}
              onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.background = "rgba(255,255,255,0.05)"; }}
            />

            {/* Profile selector */}
            {profiles.length > 1 && (
              <div style={{ width: "100%", marginBottom: 16 }}>
                <div className="sf" style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", marginBottom: 8, textAlign: "left" }}>Rate Profile</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {profiles.map(p => (
                    <button key={p.id} onClick={() => setActiveProfileId(p.id)} className="sf"
                      style={{ flex: 1, minWidth: 80, padding: "8px 10px", borderRadius: 14, border: `1px solid ${activeProfileId === p.id ? p.color : "rgba(255,255,255,0.1)"}`, background: activeProfileId === p.id ? `${p.color}18` : "rgba(255,255,255,0.04)", color: activeProfileId === p.id ? p.color : "rgba(255,255,255,0.45)", fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.15s ease" }}>
                      {p.name}
                      <div style={{ fontSize: 10, fontWeight: 400, opacity: 0.7, marginTop: 2 }}>{formatCurrency(p.dayRate)}/day</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button className="btn-primary start" onClick={() => startNew(localTitle, activeProfileId)} style={{ width: 200 }}>Start Timing</button>
          </div>
        ) : (
          <div style={{ padding: "28px 24px 24px" }}>
            {/* Editable title */}
            <input type="text" placeholder="What are you working on?" value={localTitle}
              onChange={e => { setLocalTitle(e.target.value); updateTitle(e.target.value); }}
              maxLength={60} className="sf"
              style={{ width: "100%", marginBottom: 14, background: "transparent", border: "none", borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "4px 0 8px", color: localTitle ? "rgba(255,255,255,0.72)" : "rgba(255,255,255,0.22)", fontSize: 13, fontWeight: 500, outline: "none", textAlign: "center", fontFamily: "'DM Sans',-apple-system,sans-serif", letterSpacing: "0.02em", transition: "border-color 0.15s ease" }}
              onFocus={e => { e.target.style.borderBottomColor = "rgba(139,92,246,0.5)"; }}
              onBlur={e => { e.target.style.borderBottomColor = "rgba(255,255,255,0.08)"; }}
            />

            {/* Profile badge */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 20, background: `${activeProfile.color}14`, border: `1px solid ${activeProfile.color}30` }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: activeProfile.color }} />
                <span className="sf" style={{ fontSize: 11, fontWeight: 600, color: activeProfile.color, letterSpacing: "0.04em" }}>{activeProfile.name}</span>
              </div>
            </div>

            {/* Timer digits */}
            <div style={{ marginBottom: 10, lineHeight: 1 }}>
              <span className="sf" style={{ fontSize: 78, fontWeight: 700, letterSpacing: "-0.05em", fontVariantNumeric: "tabular-nums", color: timerColor, display: "inline-block", transition: "color 0.4s ease", animation: isPaused ? "pausedPulse 1.8s ease-in-out infinite" : "none" }}>
                {formatTime(elapsed)}
              </span>
            </div>

            {/* Status pill */}
            <div style={{ marginBottom: 22, display: "flex", justifyContent: "center" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: isRunning ? "rgba(16,185,129,0.1)" : "rgba(251,191,36,0.1)", border: `1px solid ${isRunning ? "rgba(16,185,129,0.22)" : "rgba(251,191,36,0.25)"}`, borderRadius: 20, padding: "5px 12px" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", flexShrink: 0, background: isRunning ? "#10b981" : "#fbbf24", animation: isRunning ? "liveDot 1.6s ease-in-out infinite" : "pausedPulse 1.8s ease-in-out infinite" }} />
                <span className="sf" style={{ fontSize: 11.5, fontWeight: 500, color: isRunning ? "#10b981" : "#fbbf24", letterSpacing: "0.04em" }}>
                  {isRunning ? `${formatDays(elapsed, activeProfile.hoursPerDay)} days elapsed` : "Session paused"}
                </span>
              </div>
            </div>

            {/* Earnings strip */}
            <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: 14, padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div style={{ textAlign: "left" }}>
                <div className="sf" style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", marginBottom: 2 }}>Session Earnings</div>
                <div className="sf" style={{ fontSize: 29, fontWeight: 700, letterSpacing: "-0.025em", background: "linear-gradient(135deg,#6ee7b7,#34d399)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", display: "inline-block", animation: earningsPulse ? "tick 0.5s ease" : "none" }}>
                  {formatCurrency(earnings)}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="sf" style={{ fontSize: 11, color: "rgba(255,255,255,0.60)", lineHeight: 1.8 }}>{formatCurrency(ratePerHour)}<span style={{ opacity: 0.7 }}>/hr</span></div>
                <div className="sf" style={{ fontSize: 11, color: "rgba(255,255,255,0.55)" }}>{formatCurrency(minuteRate)}<span style={{ opacity: 0.7 }}>/min</span></div>
              </div>
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {confirmReset && (
                <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 14, padding: "14px 16px", marginBottom: 2 }}>
                  <div className="sf" style={{ fontSize: 13, fontWeight: 600, color: "rgba(239,68,68,0.9)", marginBottom: 4 }}>Cancel &amp; Reset?</div>
                  <div className="sf" style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 12, lineHeight: 1.5 }}>This will discard your current session and cannot be undone.</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    <button className="btn-ghost" onClick={() => setConfirmReset(false)} style={{ fontSize: 13, padding: "10px 0" }}>Keep Going</button>
                    <button className="btn-ghost danger" onClick={cancelAndReset} style={{ fontSize: 13, padding: "10px 0" }}>Yes, Reset</button>
                  </div>
                </div>
              )}
              {status === "running" && <button className="btn-primary pause" onClick={pause}>⏸ Pause</button>}
              {status === "paused" && <button className="btn-primary resume" onClick={resume}>▶ Resume</button>}
              {!confirmReset && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 6 }}>
                  <button className="btn-ghost finish" onClick={finish}>Finish &amp; Save</button>
                  <button className="btn-ghost danger" onClick={() => setConfirmReset(true)}>Cancel &amp; Reset</button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// QuoteCard component
// ══════════════════════════════════════════════════════════════════════════
function QuoteCard({ quote, visible, hovered, onHoverChange, onRefresh }) {
  const innerRef = useRef(null);
  const [height, setHeight] = useState(null);
  useEffect(() => {
    if (!innerRef.current) return;
    const t = setTimeout(() => { if (innerRef.current) setHeight(innerRef.current.scrollHeight); }, 30);
    return () => clearTimeout(t);
  }, [quote]);

  return (
    <div style={{ marginBottom: 24, position: "relative" }} onMouseEnter={() => onHoverChange(true)} onMouseLeave={() => onHoverChange(false)}>
      <div className="glass" style={{ position: "relative", overflow: "hidden", height: height || "auto", transition: "height 0.45s cubic-bezier(0.4,0,0.2,1)" }}>
        <div style={{ position: "absolute", left: 0, top: "15%", bottom: "15%", width: 2.5, borderRadius: "0 2px 2px 0", background: "linear-gradient(180deg,rgba(139,92,246,0)0%,rgba(139,92,246,0.75)45%,rgba(236,72,153,0.45)100%)" }} />
        <div className="serif" style={{ position: "absolute", top: -4, right: 14, fontSize: 88, lineHeight: 1, color: "rgba(139,92,246,0.1)", fontStyle: "italic", userSelect: "none", pointerEvents: "none" }}>"</div>
        <div ref={innerRef} style={{ padding: "20px 22px 18px 26px", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(6px)", transition: "opacity 0.45s ease, transform 0.45s ease" }}>
          <div className="serif" style={{ fontSize: 16, fontStyle: "italic", lineHeight: 1.68, color: "rgba(255,255,255,0.82)", paddingRight: 36, position: "relative", zIndex: 1 }}>{quote.text}</div>
          {quote.author ? (
            <div className="sf" style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 11, position: "relative", zIndex: 1 }}>
              <div style={{ width: 20, height: 1, background: "rgba(255,255,255,0.18)", flexShrink: 0 }} />
              <span style={{ fontSize: 11.5, fontWeight: 500, color: "rgba(255,255,255,0.3)", letterSpacing: "0.04em" }}>{quote.author}</span>
            </div>
          ) : <div style={{ marginTop: 11 }}><div style={{ width: 20, height: 1, background: "rgba(255,255,255,0.1)" }} /></div>}
        </div>
        <button onClick={onRefresh} style={{ position: "absolute", bottom: 12, right: 12, width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)", color: "rgba(255,255,255,0.6)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, opacity: hovered ? 1 : 0, transform: hovered ? "scale(1)" : "scale(0.8)", transition: "opacity 0.2s ease, transform 0.2s ease", zIndex: 2 }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.15)"; e.currentTarget.style.color = "#fff"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
          title="New quote">&#8635;</button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// SettingsPanel component
// ══════════════════════════════════════════════════════════════════════════
function SettingsPanel({ profiles, setProfiles, onClose }) {
  const [editing, setEditing] = useState(null); // profile id being edited, or "new"
  const [form, setForm] = useState({ name: "", dayRate: "", hoursPerDay: "", color: PROFILE_COLORS[0] });
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const openNew = () => {
    const usedColors = profiles.map(p => p.color);
    const nextColor = PROFILE_COLORS.find(c => !usedColors.includes(c)) || PROFILE_COLORS[0];
    setForm({ name: "", dayRate: "", hoursPerDay: "8", color: nextColor });
    setEditing("new");
  };
  const openEdit = (p) => { setForm({ name: p.name, dayRate: String(p.dayRate), hoursPerDay: String(p.hoursPerDay), color: p.color }); setEditing(p.id); };
  const cancel = () => { setEditing(null); setDeleteConfirm(null); };

  const save = () => {
    const dayRate = parseFloat(form.dayRate);
    const hoursPerDay = parseFloat(form.hoursPerDay);
    if (!form.name.trim() || isNaN(dayRate) || isNaN(hoursPerDay) || dayRate <= 0 || hoursPerDay <= 0) return;
    if (editing === "new") {
      const newProfile = { id: Date.now(), name: form.name.trim(), dayRate, hoursPerDay, color: form.color };
      const updated = [...profiles, newProfile];
      setProfiles(updated);
      setStorage("tl_profiles", updated);
    } else {
      const updated = profiles.map(p => p.id === editing ? { ...p, name: form.name.trim(), dayRate, hoursPerDay, color: form.color } : p);
      setProfiles(updated);
      setStorage("tl_profiles", updated);
    }
    setEditing(null);
  };

  const deleteProfile = (id) => {
    if (profiles.length <= 1) return;
    const updated = profiles.filter(p => p.id !== id);
    setProfiles(updated);
    setStorage("tl_profiles", updated);
    setDeleteConfirm(null);
  };

  const inputStyle = { width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: "10px 13px", color: "rgba(255,255,255,0.85)", fontSize: 13, outline: "none", fontFamily: "'DM Sans',-apple-system,sans-serif", marginBottom: 10 };

  return (
    <div style={{ animation: "up 0.3s ease both" }}>
      <div className="glass" style={{ padding: "22px 20px", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <div className="sf" style={{ fontSize: 15, fontWeight: 700, color: "rgba(255,255,255,0.9)" }}>Rate Profiles</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 18, padding: "0 2px" }}>✕</button>
        </div>

        {editing ? (
          <div>
            <div className="sf" style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", marginBottom: 12 }}>{editing === "new" ? "New Profile" : "Edit Profile"}</div>
            <input style={inputStyle} placeholder="Client / profile name" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))}
              onFocus={e => e.target.style.borderColor = "rgba(139,92,246,0.5)"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
              <div>
                <div className="sf" style={{ fontSize: 10, color: "rgba(255,255,255,0.55)", marginBottom: 4 }}>Day rate (£)</div>
                <input style={{...inputStyle, marginBottom: 0}} placeholder="700" value={form.dayRate} onChange={e => setForm(f => ({...f, dayRate: e.target.value}))}
                  type="number" min="1"
                  onFocus={e => e.target.style.borderColor = "rgba(139,92,246,0.5)"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
              </div>
              <div>
                <div className="sf" style={{ fontSize: 10, color: "rgba(255,255,255,0.55)", marginBottom: 4 }}>Hours / day</div>
                <input style={{...inputStyle, marginBottom: 0}} placeholder="8" value={form.hoursPerDay} onChange={e => setForm(f => ({...f, hoursPerDay: e.target.value}))}
                  type="number" min="1" max="24"
                  onFocus={e => e.target.style.borderColor = "rgba(139,92,246,0.5)"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
              </div>
            </div>
            {/* Colour picker */}
            <div className="sf" style={{ fontSize: 10, color: "rgba(255,255,255,0.55)", marginBottom: 6 }}>Colour</div>
            <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
              {PROFILE_COLORS.map(c => (
                <button key={c} onClick={() => setForm(f => ({...f, color: c}))}
                  style={{ width: 24, height: 24, borderRadius: "50%", background: c, border: form.color === c ? "2px solid #fff" : "2px solid transparent", cursor: "pointer", transition: "border 0.1s", padding: 0 }} />
              ))}
            </div>
            {form.dayRate && form.hoursPerDay && !isNaN(parseFloat(form.dayRate)) && !isNaN(parseFloat(form.hoursPerDay)) && (
              <div className="sf" style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", marginBottom: 12 }}>
                → {formatCurrency(parseFloat(form.dayRate) / parseFloat(form.hoursPerDay))}/hr · {formatCurrency(parseFloat(form.dayRate) / parseFloat(form.hoursPerDay) / 60)}/min
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <button className="btn-ghost" onClick={cancel} style={{ fontSize: 13, padding: "10px 0" }}>Cancel</button>
              <button className="btn-ghost finish" onClick={save} style={{ fontSize: 13, padding: "10px 0" }}>Save</button>
            </div>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
              {profiles.map(p => (
                <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: 14 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: p.color, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div className="sf" style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>{p.name}</div>
                    <div className="sf" style={{ fontSize: 11, color: "rgba(255,255,255,0.55)" }}>{formatCurrency(p.dayRate)}/day · {formatCurrency(p.dayRate / p.hoursPerDay)}/hr</div>
                  </div>
                  {deleteConfirm === p.id ? (
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => setDeleteConfirm(null)} className="btn-ghost" style={{ fontSize: 11, padding: "5px 9px" }}>Keep</button>
                      <button onClick={() => deleteProfile(p.id)} className="btn-ghost danger" style={{ fontSize: 11, padding: "5px 9px" }}>Delete</button>
                    </div>
                  ) : (
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => openEdit(p)} style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "5px 9px", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: 11 }}>Edit</button>
                      {profiles.length > 1 && <button onClick={() => setDeleteConfirm(p.id)} style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.16)", borderRadius: 8, padding: "5px 9px", color: "rgba(239,68,68,0.6)", cursor: "pointer", fontSize: 11 }}>✕</button>}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <button className="btn-ghost" onClick={openNew} style={{ width: "100%", fontSize: 13, padding: "11px 0" }}>+ Add Profile</button>
          </>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// EarningsHeatmap component
// ══════════════════════════════════════════════════════════════════════════
function EarningsHeatmap({ sessions }) {
  const [viewMode, setViewMode] = useState("month"); // "month" | "week"

  const now = new Date();

  // Build day map: dateStr -> total earned
  const dayMap = {};
  sessions.forEach(s => {
    const d = new Date(s.dateTs);
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
    dayMap[key] = (dayMap[key] || 0) + (s.earned || 0);
  });

  const maxEarned = Math.max(...Object.values(dayMap), 1);

  const getColor = (earned) => {
    if (!earned) return "rgba(255,255,255,0.04)";
    const intensity = Math.min(earned / maxEarned, 1);
    if (intensity > 0.75) return "rgba(110,231,183,0.85)";
    if (intensity > 0.5)  return "rgba(110,231,183,0.55)";
    if (intensity > 0.25) return "rgba(110,231,183,0.32)";
    return "rgba(110,231,183,0.16)";
  };

  if (viewMode === "week") {
    // Last 8 weeks bar chart
    const weeks = [];
    for (let w = 7; w >= 0; w--) {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay() - w * 7);
      weekStart.setHours(0,0,0,0);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 7);
      let total = 0;
      sessions.forEach(s => { if (s.dateTs >= weekStart.getTime() && s.dateTs < weekEnd.getTime()) total += (s.earned || 0); });
      const label = `${weekStart.getDate()}/${weekStart.getMonth()+1}`;
      weeks.push({ label, total, isCurrent: w === 0 });
    }
    const maxWeek = Math.max(...weeks.map(w => w.total), 1);

    return (
      <div className="glass" style={{ padding: "18px 20px", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div className="sf" style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.6)", letterSpacing: "0.05em" }}>Weekly Earnings</div>
          <div style={{ display: "flex", gap: 4 }}>
            {["month","week"].map(m => (
              <button key={m} onClick={() => setViewMode(m)} className="sf"
                style={{ fontSize: 11, padding: "4px 10px", borderRadius: 10, border: `1px solid ${viewMode===m?"rgba(139,92,246,0.4)":"rgba(255,255,255,0.1)"}`, background: viewMode===m?"rgba(139,92,246,0.15)":"transparent", color: viewMode===m?"#a78bfa":"rgba(255,255,255,0.35)", cursor: "pointer" }}>
                {m === "month" ? "Calendar" : "Weekly"}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 80 }}>
          {weeks.map((w, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%" }}>
              <div style={{ flex: 1, display: "flex", alignItems: "flex-end", width: "100%" }}>
                <div style={{ width: "100%", borderRadius: "4px 4px 0 0", background: w.isCurrent ? "rgba(139,92,246,0.7)" : w.total > 0 ? "rgba(110,231,183,0.45)" : "rgba(255,255,255,0.06)", height: w.total > 0 ? `${Math.max((w.total / maxWeek) * 100, 8)}%` : "8%", transition: "height 0.4s ease", position: "relative" }}>
                  {w.total > 0 && (
                    <div className="sf" style={{ position: "absolute", bottom: "calc(100% + 3px)", left: "50%", transform: "translateX(-50%)", fontSize: 8, color: "rgba(255,255,255,0.5)", whiteSpace: "nowrap" }}>{formatCurrency(w.total)}</div>
                  )}
                </div>
              </div>
              <div className="sf" style={{ fontSize: 8, color: "rgba(255,255,255,0.3)", marginTop: 4, letterSpacing: "0.02em" }}>{w.label}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Month calendar heatmap
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0=Sun
  const monthLabel = now.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
  const cells = [];
  for (let i = 0; i < firstDayOfWeek; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="glass" style={{ padding: "18px 20px", marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div className="sf" style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.6)", letterSpacing: "0.05em" }}>{monthLabel}</div>
        <div style={{ display: "flex", gap: 4 }}>
          {["month","week"].map(m => (
            <button key={m} onClick={() => setViewMode(m)} className="sf"
              style={{ fontSize: 11, padding: "4px 10px", borderRadius: 10, border: `1px solid ${viewMode===m?"rgba(139,92,246,0.4)":"rgba(255,255,255,0.1)"}`, background: viewMode===m?"rgba(139,92,246,0.15)":"transparent", color: viewMode===m?"#a78bfa":"rgba(255,255,255,0.35)", cursor: "pointer" }}>
              {m === "month" ? "Calendar" : "Weekly"}
            </button>
          ))}
        </div>
      </div>
      {/* Day labels */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 3, marginBottom: 4 }}>
        {["S","M","T","W","T","F","S"].map((d,i) => (
          <div key={i} className="sf" style={{ textAlign: "center", fontSize: 9, color: "rgba(255,255,255,0.50)", fontWeight: 600, paddingBottom: 2 }}>{d}</div>
        ))}
      </div>
      {/* Day cells */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 3 }}>
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const key = `${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
          const earned = dayMap[key] || 0;
          const isToday = day === now.getDate();
          return (
            <div key={i} title={earned ? formatCurrency(earned) : undefined}
              style={{ aspectRatio: "1", borderRadius: 5, background: getColor(earned), border: isToday ? "1px solid rgba(167,139,250,0.6)" : "1px solid transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: earned ? "default" : "default", transition: "background 0.2s" }}>
              <span className="sf" style={{ fontSize: 9, color: earned ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.2)", fontWeight: isToday ? 700 : 400 }}>{day}</span>
            </div>
          );
        })}
      </div>
      {/* Legend */}
      <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 10, justifyContent: "flex-end" }}>
        <span className="sf" style={{ fontSize: 9, color: "rgba(255,255,255,0.50)", marginRight: 2 }}>Less</span>
        {["rgba(255,255,255,0.04)","rgba(110,231,183,0.16)","rgba(110,231,183,0.32)","rgba(110,231,183,0.55)","rgba(110,231,183,0.85)"].map((c,i) => (
          <div key={i} style={{ width: 10, height: 10, borderRadius: 2, background: c }} />
        ))}
        <span className="sf" style={{ fontSize: 9, color: "rgba(255,255,255,0.50)", marginLeft: 2 }}>More</span>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// StreakCard component
// ══════════════════════════════════════════════════════════════════════════
function StreakCard({ sessions, streakJustExtended }) {
  const { current, longest } = calcStreaks(sessions);
  const today = getDayKey(Date.now());
  const todayIsWorkday = isWorkday(Date.now());
  const lastWorkday = todayIsWorkday ? today : prevWorkday(today);
  const prevWD = prevWorkday(lastWorkday);

  const workedToday = todayIsWorkday && sessions.some(s => getDayKey(s.dateTs) === today);
  const workedLastWorkday = sessions.some(s => getDayKey(s.dateTs) === lastWorkday);
  const streakAlive = workedToday || workedLastWorkday;

  // Mon–Fri of current week
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0=Sun
  // Find Monday of this week
  const monday = new Date(now);
  monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  monday.setHours(12, 0, 0, 0);

  const weekDays = Array.from({ length: 5 }, (_, i) => {
    const d = new Date(monday.getTime() + i * 86400000);
    const key = getDayKey(d.getTime());
    const isFuture = d > now && key !== today;
    const isToday = key === today;
    const worked = sessions.some(s => getDayKey(s.dateTs) === key);
    return { key, worked, isToday, isFuture, label: ["M","T","W","T","F"][i] };
  });

  const getMessage = () => {
    if (!sessions.filter(s => isWorkday(s.dateTs)).length) return "Log a session on a working day to start your streak.";
    if (!todayIsWorkday) return current > 0 ? `${current}-day streak — back at it Monday.` : "Weekend. Rest up.";
    if (!workedToday && !workedLastWorkday) return "Start fresh — log a session to begin a new streak.";
    if (!workedToday && current > 0) return `Don't break it — you haven't logged today yet.`;
    if (current >= 14) return `${current} working days straight. Unstoppable.`;
    if (current >= 7)  return `${current} days and on fire 🔥 — keep the week alive.`;
    if (current >= 3)  return `${current} days running — momentum is building.`;
    if (current === 2) return "2 days in a row. Keep it going.";
    if (current === 1) return "Good start — log tomorrow to build your streak.";
    return "Log a session today to start your streak.";
  };

  const flameColor = current === 0 ? "#6b7280"
    : current >= 7 ? "#f97316"
    : current >= 3 ? "#fbbf24"
    : "#fcd34d";

  // AA-safe text colours
  const labelColor = "rgba(255,255,255,0.55)";
  const metaColor   = "rgba(255,255,255,0.65)";

  return (
    <div className="inset" style={{ padding: "16px 18px", marginBottom: 24, position: "relative", overflow: "hidden" }}>
      {current > 0 && (
        <div style={{ position: "absolute", top: -10, right: -10, width: 80, height: 80, borderRadius: "50%", background: `radial-gradient(circle, ${flameColor}28 0%, transparent 70%)`, pointerEvents: "none" }} />
      )}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ fontSize: 28, lineHeight: 1, filter: current === 0 ? "grayscale(1) opacity(0.4)" : "none", animation: current >= 3 ? "flamePulse 2s ease-in-out infinite" : "none" }}>🔥</div>
          <div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
              <span className="sf" style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.03em", color: flameColor, lineHeight: 1, animation: streakJustExtended ? "streakPop 0.5s cubic-bezier(0.34,1.56,0.64,1)" : "none" }}>
                {current}
              </span>
              <span className="sf" style={{ fontSize: 12, fontWeight: 500, color: metaColor }}>day streak</span>
            </div>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className="sf" style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: labelColor, marginBottom: 2 }}>Best</div>
          <div className="sf" style={{ fontSize: 16, fontWeight: 700, color: "rgba(255,255,255,0.75)", letterSpacing: "-0.02em" }}>{longest}<span style={{ fontSize: 11, fontWeight: 400, marginLeft: 2, color: metaColor }}>days</span></div>
        </div>
      </div>

      {/* Mon–Fri strip */}
      <div style={{ display: "flex", gap: 5, marginBottom: 10 }}>
        {weekDays.map(({ key, worked, isToday, isFuture, label }) => (
          <div key={key} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{
              width: "100%", height: 6, borderRadius: 3,
              background: isFuture
                ? "rgba(255,255,255,0.05)"
                : worked
                  ? (isToday ? flameColor : `${flameColor}aa`)
                  : isToday
                    ? "rgba(255,255,255,0.15)"
                    : "rgba(255,255,255,0.08)",
              border: isToday ? `1px solid ${current > 0 ? flameColor + "88" : "rgba(255,255,255,0.3)"}` : "1px solid transparent",
              transition: "background 0.3s ease",
            }} />
            <span className="sf" style={{ fontSize: 9, fontWeight: isToday ? 700 : 400, color: isToday ? "rgba(255,255,255,0.75)" : isFuture ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.5)" }}>{label}</span>
          </div>
        ))}
      </div>

      <div className="sf" style={{ fontSize: 11.5, color: streakAlive ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.5)", lineHeight: 1.5, fontStyle: "italic" }}>
        {getMessage()}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// App
// ══════════════════════════════════════════════════════════════════════════
export default function App() {
  const [sessions, setSessions] = useState(() => getStorage("tl_sessions", []));
  const [timerState, setTimerState] = useState(() => getStorage("tl_timer", null));
  const [elapsed, setElapsed] = useState(0);
  const [view, setView] = useState("timer");
  const [quoteIdx, setQuoteIdx] = useState(Math.floor(Math.random() * QUOTES.length));
  const [quoteVisible, setQuoteVisible] = useState(true);
  const [quoteHovered, setQuoteHovered] = useState(false);
  const [sessionTitle, setSessionTitle] = useState(timerState?.title || "");
  const [earningsPulse, setEarningsPulse] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [profiles, setProfiles] = useState(() => getStorage("tl_profiles", DEFAULT_PROFILES));
  const [activeProfileId, setActiveProfileId] = useState(() => {
    const saved = getStorage("tl_active_profile", null);
    return saved || DEFAULT_PROFILES[0].id;
  });
  const [streakJustExtended, setStreakJustExtended] = useState(false);
  const usedQuotesRef = useRef(new Set());
  const milestoneRef = useRef(new Set()); // track which milestones fired this session

  const status = timerState ? timerState.status : "idle";
  const isRunning = status === "running";
  const isPaused = status === "paused";
  const isActive = isRunning || isPaused;

  // Active profile derived values
  const activeProfile = profiles.find(p => p.id === activeProfileId) || profiles[0];
  const ratePerSecond = activeProfile.dayRate / (activeProfile.hoursPerDay * 3600);

  // Tick
  useEffect(() => {
    if (isRunning && timerState) {
      const tick = () => setElapsed(Math.floor((Date.now() - timerState.startedAt) / 1000) + (timerState.baseElapsed || 0));
      tick();
      const id = setInterval(tick, 1000);
      return () => clearInterval(id);
    }
  }, [isRunning, timerState]);

  // Earnings pulse every minute
  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => { setEarningsPulse(true); setTimeout(() => setEarningsPulse(false), 900); }, 60000);
    return () => clearInterval(id);
  }, [isRunning]);

  // Milestone chimes
  const earnings = elapsed * ratePerSecond;
  const todaySessions = sessions.filter(s => s.date === new Date().toLocaleDateString("en-GB"));
  const todayEarned = todaySessions.reduce((a, s) => a + (s.earned || 0), 0) + (isActive ? earnings : 0);
  const dailyGoal = activeProfile.dayRate;
  const dailyProgress = Math.min((todayEarned / dailyGoal) * 100, 100);

  useEffect(() => {
    if (!isRunning) return;
    [25, 50, 75, 100].forEach(ms => {
      if (dailyProgress >= ms && !milestoneRef.current.has(ms)) {
        milestoneRef.current.add(ms);
        playChime(ms);
      }
    });
  }, [dailyProgress, isRunning]);

  // Quote rotation
  const nextQuote = useCallback(() => {
    let idx, attempts = 0;
    do { idx = Math.floor(Math.random() * QUOTES.length); attempts++; if (attempts > 20) usedQuotesRef.current = new Set(); }
    while (usedQuotesRef.current.has(idx) && QUOTES.length > 5);
    usedQuotesRef.current.add(idx);
    if (usedQuotesRef.current.size > Math.floor(QUOTES.length * 0.7)) usedQuotesRef.current = new Set([idx]);
    setQuoteVisible(false);
    setTimeout(() => { setQuoteIdx(idx); setQuoteVisible(true); }, 500);
  }, []);
  useEffect(() => { const id = setInterval(nextQuote, 40000); return () => clearInterval(id); }, [nextQuote]);

  // Callbacks
  const startNew = useCallback((title = "", profileId) => {
    const pid = profileId || activeProfileId;
    milestoneRef.current = new Set();
    const ts = { id: Date.now(), date: new Date().toLocaleDateString("en-GB"), dateTs: Date.now(), startedAt: Date.now(), baseElapsed: 0, status: "running", title: title.trim(), profileId: pid };
    setTimerState(ts); setStorage("tl_timer", ts); setElapsed(0); setView("timer");
    setStorage("tl_active_profile", pid);
  }, [activeProfileId]);

  const updateTitle = useCallback((title) => {
    setSessionTitle(title);
    if (!timerState) return;
    const updated = { ...timerState, title: title.trim() };
    setTimerState(updated); setStorage("tl_timer", updated);
  }, [timerState]);

  const pause = useCallback(() => {
    if (!timerState || timerState.status !== "running") return;
    const updated = { ...timerState, status: "paused", baseElapsed: elapsed };
    setTimerState(updated); setStorage("tl_timer", updated);
  }, [timerState, elapsed]);

  const resume = useCallback(() => {
    if (!timerState || timerState.status !== "paused") return;
    const updated = { ...timerState, status: "running", startedAt: Date.now() };
    setTimerState(updated); setStorage("tl_timer", updated);
  }, [timerState]);

  const finish = useCallback(() => {
    if (!timerState) return;
    const prof = profiles.find(p => p.id === (timerState.profileId || activeProfileId)) || profiles[0];
    const rate = prof.dayRate / (prof.hoursPerDay * 3600);
    const finalSession = { ...timerState, endedAt: Date.now(), totalSeconds: elapsed, earned: elapsed * rate, title: timerState.title || sessionTitle.trim() || "", profileId: prof.id, profileName: prof.name };
    const updated = [...sessions.filter(s => s.id !== timerState.id), finalSession].sort((a, b) => b.dateTs - a.dateTs);

    // Streak check: did we just add today's first session?
    const today = getDayKey(Date.now());
    const hadTodayBefore = sessions.some(s => getDayKey(s.dateTs) === today);
    if (!hadTodayBefore) {
      const { current: prevStreak } = calcStreaks(sessions);
      const { current: newStreak } = calcStreaks(updated);
      if (newStreak > prevStreak || newStreak >= 1) {
        playStreakChime();
        setStreakJustExtended(true);
        setTimeout(() => setStreakJustExtended(false), 600);
      }
    }

    setSessions(updated); setStorage("tl_sessions", updated);
    setTimerState(null); setStorage("tl_timer", null);
    setElapsed(0); setSessionTitle("");
  }, [timerState, elapsed, sessions, sessionTitle, profiles, activeProfileId]);

  const cancelAndReset = useCallback(() => {
    setTimerState(null); setStorage("tl_timer", null); setElapsed(0); setConfirmReset(false);
  }, []);

  const deleteSession = useCallback((id) => {
    const updated = sessions.filter(s => s.id !== id);
    setSessions(updated); setStorage("tl_sessions", updated);
  }, [sessions]);

  const updateSessionTitle = useCallback((id, title) => {
    const updated = sessions.map(s => s.id === id ? { ...s, title: title.trim() } : s);
    setSessions(updated); setStorage("tl_sessions", updated);
  }, [sessions]);

  const weekEarned = (() => {
    const weekAgo = new Date(Date.now() - 7 * 86400000);
    return sessions.filter(s => new Date(s.dateTs) > weekAgo).reduce((a, s) => a + (s.earned || 0), 0) + (isActive ? earnings : 0);
  })();

  const timerColor = isRunning ? "#a78bfa" : isPaused ? "#fbbf24" : "rgba(255,255,255,0.72)";

  // Blob animation
  const blobStateRef = useRef(BLOB_CONFIGS.map((b, i) => ({
    x: b.initX, y: b.initY, scale: 0.9 + i * 0.15,
    tx: b.initX + (Math.random()-0.5)*50, ty: b.initY + (Math.random()-0.5)*50,
    ts: 0.7 + Math.random()*0.8,
    retarget: 6000 + Math.random()*6000,
  })));
  const [blobPos, setBlobPos] = useState(() => blobStateRef.current.map(b => ({ x: b.x, y: b.y, scale: b.scale })));
  const rafRef = useRef(null);
  const isRunningRef = useRef(isRunning);
  useEffect(() => { isRunningRef.current = isRunning; }, [isRunning]);
  useEffect(() => {
    let last = performance.now();
    const LERP = 0.005;
    const tick = (now) => {
      rafRef.current = requestAnimationFrame(tick);
      const dt = Math.min(now - last, 50); last = now;
      const next = blobStateRef.current.map(b => {
        const rt = b.retarget - dt; let { tx, ty, ts } = b;
        if (rt <= 0) {
          tx = -20 + Math.random() * 90;
          ty = -20 + Math.random() * 90;
          ts = 0.55 + Math.random() * 1.1; // wide range: 0.55 → 1.65 for strong depth feel
        }
        const f = LERP * (dt / 16);
        return {
          x: b.x + (tx - b.x) * f,
          y: b.y + (ty - b.y) * f,
          scale: b.scale + (ts - b.scale) * f,
          tx, ty, ts,
          retarget: rt <= 0 ? 8000 + Math.random() * 8000 : rt,
        };
      });
      blobStateRef.current = next;
      setBlobPos(next.map(b => ({ x: b.x, y: b.y, scale: b.scale })));
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // Milestone toast
  const [milestoneToast, setMilestoneToast] = useState(null);
  const prevProgressRef = useRef(0);
  useEffect(() => {
    if (!isRunning) return;
    [25, 50, 75, 100].forEach(ms => {
      if (dailyProgress >= ms && prevProgressRef.current < ms) {
        setMilestoneToast(ms);
        setTimeout(() => setMilestoneToast(null), 3500);
      }
    });
    prevProgressRef.current = dailyProgress;
  }, [dailyProgress, isRunning]);

  return (
    <div style={{ minHeight: "100vh", background: "#06060f", fontFamily: "'SF Pro Display',-apple-system,sans-serif", color: "#fff", position: "relative", overflowX: "hidden" }}>

      {/* Blobs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        {BLOB_CONFIGS.map((cfg, i) => (
          <div key={i} style={{ position: "absolute", left: 0, top: 0, width: cfg.size, height: cfg.size, borderRadius: "50%", background: `radial-gradient(circle, ${cfg.color} 0%, transparent 65%)`, filter: `blur(${cfg.blur}px)`, transform: `translate(${blobPos[i]?.x??cfg.initX}vw,${blobPos[i]?.y??cfg.initY}vh) scale(${blobPos[i]?.scale??1})`, willChange: "transform" }} />
        ))}
      </div>

      {/* Milestone toast */}
      {milestoneToast && (
        <div style={{ position: "fixed", top: 24, left: "50%", transform: "translateX(-50%)", zIndex: 100, animation: "up 0.3s ease both" }}>
          <div style={{ background: "rgba(16,185,129,0.15)", backdropFilter: "blur(20px)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 20, padding: "10px 18px", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 16 }}>{milestoneToast === 100 ? "🎉" : "✨"}</span>
            <span className="sf" style={{ fontSize: 13, fontWeight: 600, color: "#6ee7b7" }}>{milestoneToast}% of daily goal reached!</span>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
        @keyframes up { from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)} }
        @keyframes liveDot { 0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.3;transform:scale(0.6)} }
        @keyframes pausedPulse { 0%,100%{opacity:1}50%{opacity:0.55} }
        @keyframes tick { 0%{transform:translateY(0)}35%{transform:translateY(-4px)}65%{transform:translateY(2px)}100%{transform:translateY(0)} }
        @keyframes flamePulse { 0%,100%{transform:scale(1)}50%{transform:scale(1.12)} }
        @keyframes streakPop { 0%{transform:scale(1)}50%{transform:scale(1.35)}100%{transform:scale(1)} }
        * { box-sizing:border-box; }
        .sf { font-family:'DM Sans',-apple-system,sans-serif; }
        .serif { font-family:'DM Serif Display',Georgia,serif; }
        .glass { background:rgba(255,255,255,0.06); backdrop-filter:blur(32px) saturate(1.5); -webkit-backdrop-filter:blur(32px) saturate(1.5); border:1px solid rgba(255,255,255,0.10); border-radius:20px; }
        .inset { background:rgba(255,255,255,0.06); backdrop-filter:blur(20px) saturate(1.4); -webkit-backdrop-filter:blur(20px) saturate(1.4); border:1px solid rgba(255,255,255,0.10); border-radius:20px; }
        .tab { border:none; cursor:pointer; font-family:'DM Sans',-apple-system,sans-serif; font-size:13.5px; font-weight:500; padding:9px 0; border-radius:20px; transition:all 0.22s cubic-bezier(0.34,1.56,0.64,1); color:rgba(255,255,255,0.60); background:transparent; flex:1; letter-spacing:0.01em; }
        .tab.on { color:#fff; background:rgba(255,255,255,0.1); }
        .tab:hover:not(.on) { color:rgba(255,255,255,0.65); }
        .btn-primary { width:100%; border:none; cursor:pointer; font-family:'DM Sans',-apple-system,sans-serif; font-weight:600; font-size:16px; letter-spacing:0.025em; padding:17px 0; border-radius:14px; transition:all 0.17s ease; color:#fff; }
        .btn-primary:hover { transform:translateY(-1px) scale(1.012); filter:brightness(1.08); }
        .btn-primary:active { transform:scale(0.979); }
        .btn-primary.start { background:linear-gradient(135deg,#6d5fee,#9333ea); box-shadow:0 4px 22px rgba(109,95,238,0.32),0 1px 0 rgba(255,255,255,0.1) inset; }
        .btn-primary.pause { background:linear-gradient(135deg,#d97706,#f59e0b); box-shadow:0 4px 22px rgba(217,119,6,0.3),0 1px 0 rgba(255,255,255,0.1) inset; }
        .btn-primary.resume { background:linear-gradient(135deg,#6d5fee,#9333ea); box-shadow:0 4px 22px rgba(109,95,238,0.32),0 1px 0 rgba(255,255,255,0.1) inset; }
        .btn-ghost { border:1px solid rgba(255,255,255,0.12); cursor:pointer; font-family:'DM Sans',-apple-system,sans-serif; font-weight:500; font-size:13px; letter-spacing:0.02em; padding:11px 0; border-radius:14px; transition:all 0.17s ease; color:rgba(255,255,255,0.70); background:rgba(255,255,255,0.06); }
        .btn-ghost:hover { background:rgba(255,255,255,0.08); color:rgba(255,255,255,0.8); border-color:rgba(255,255,255,0.2); transform:translateY(-1px); }
        .btn-ghost:active { transform:scale(0.979); }
        .btn-ghost.danger { border-color:rgba(239,68,68,0.22); color:rgba(239,68,68,0.6); background:rgba(239,68,68,0.05); }
        .btn-ghost.danger:hover { background:rgba(239,68,68,0.1); color:#ef4444; border-color:rgba(239,68,68,0.35); }
        .btn-ghost.finish { border-color:rgba(16,185,129,0.25); color:rgba(110,231,183,0.75); background:rgba(16,185,129,0.06); }
        .btn-ghost.finish:hover { background:rgba(16,185,129,0.12); color:#6ee7b7; border-color:rgba(16,185,129,0.4); transform:translateY(-1px); }
        .xbtn { background:rgba(239,68,68,0.07); border:1px solid rgba(239,68,68,0.16); color:rgba(239,68,68,0.6); cursor:pointer; border-radius:10px; padding:7px 9px; font-size:11px; transition:all 0.14s; flex-shrink:0; }
        .xbtn:hover { background:rgba(239,68,68,0.14); color:#ef4444; }
        ::-webkit-scrollbar { width:3px; }
        ::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.09); border-radius:2px; }
        input::placeholder { color:rgba(255,255,255,0.22); }
        input:focus::placeholder { color:rgba(255,255,255,0.14); }
        input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button { opacity: 0.3; }
      `}</style>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 456, margin: "0 auto", padding: "0 17px 64px" }}>

        {/* Header */}
        <div style={{ paddingTop: 50, paddingBottom: 20, display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div>
            <div className="sf" style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.50)", marginBottom: 5 }}>Time Logger</div>
            <div className="serif" style={{ fontSize: 26, fontWeight: 400, letterSpacing: "-0.01em", lineHeight: 1.18 }}>
              {new Date().toLocaleDateString("en-GB", { weekday: "long" })},
              <br /><span style={{ color: "rgba(255,255,255,0.60)" }}>{new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long" })}</span>
            </div>
          </div>
          {/* Streak badge — visible when streak >= 3 */}
          {(() => { const { current } = calcStreaks(sessions); return current >= 3 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 3, cursor: "default" }} onClick={() => setView("timer")}>
              <div style={{ fontSize: 22, lineHeight: 1, animation: "flamePulse 2s ease-in-out infinite" }}>🔥</div>
              <div className="sf" style={{ fontSize: 11, fontWeight: 700, color: current >= 7 ? "#f97316" : "#fbbf24", letterSpacing: "-0.01em", marginTop: 2 }}>{current}</div>
            </div>
          ) : null; })()}
        </div>

        {/* Nav */}
        <div className="glass" style={{ display: "flex", padding: "4px", marginBottom: 24, gap: 3 }}>
          {[["timer","Timer"],["history", sessions.length > 0 ? `History (${sessions.length})` : "History"],["settings","Settings"]].map(([v,label]) => (
            <button key={v} className={`tab ${view===v?"on":""}`} onClick={() => setView(v)}>{label}</button>
          ))}
        </div>

        {/* ── Timer view ── */}
        {view === "timer" && (
          <div style={{ animation: "up 0.35s ease both" }}>
            <TimerCard
              status={status} isRunning={isRunning} isPaused={isPaused} elapsed={elapsed}
              timerColor={timerColor} earnings={earnings} earningsPulse={earningsPulse}
              confirmReset={confirmReset} setConfirmReset={setConfirmReset}
              startNew={startNew} pause={pause} resume={resume} finish={finish} cancelAndReset={cancelAndReset}
              sessionTitle={sessionTitle} updateTitle={updateTitle}
              profiles={profiles} activeProfileId={activeProfileId} setActiveProfileId={setActiveProfileId}
            />

            <QuoteCard quote={QUOTES[quoteIdx]} visible={quoteVisible} hovered={quoteHovered} onHoverChange={setQuoteHovered} onRefresh={nextQuote} />

            <StreakCard sessions={sessions} streakJustExtended={streakJustExtended} />

            {/* Stats grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
              <div className="inset" style={{ padding: "16px 15px" }}>
                <div className="sf" style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.60)", marginBottom: 7 }}>Today's Goal</div>
                <div className="sf" style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", color: "#a78bfa", marginBottom: 2 }}>{formatCurrency(todayEarned)}</div>
                <div className="sf" style={{ fontSize: 12, color: "rgba(255,255,255,0.60)", marginBottom: 10 }}>of {formatCurrency(dailyGoal)}</div>
                <div style={{ height: 3, background: "rgba(255,255,255,0.1)", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ height: "100%", borderRadius: 99, width: `${dailyProgress}%`, background: dailyProgress >= 100 ? "linear-gradient(90deg,#10b981,#34d399)" : "linear-gradient(90deg,#6d5fee,#a78bfa)", transition: "width 1.2s cubic-bezier(0.4,0,0.2,1)" }} />
                </div>
                <div className="sf" style={{ fontSize: 11, color: "rgba(255,255,255,0.60)", marginTop: 7 }}>{dailyProgress >= 100 ? "✓ Goal reached" : `${dailyProgress.toFixed(0)}% complete`}</div>
              </div>
              <div className="inset" style={{ padding: "16px 15px" }}>
                <div className="sf" style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.60)", marginBottom: 7 }}>This Week</div>
                <div className="sf" style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", color: "#c084fc", marginBottom: 2 }}>{formatCurrency(weekEarned)}</div>
                <div className="sf" style={{ fontSize: 12, color: "rgba(255,255,255,0.60)", marginBottom: 10 }}>earned</div>
                <div className="sf" style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.55 }}>
                  ~ {formatCurrency(weekEarned / 7 * 30)}
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", marginTop: 2 }}>monthly proj.</div>
                </div>
              </div>
            </div>

            {/* Rate strip — dynamic based on active profile */}
            <div className="inset" style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              {[
                { label: "Hourly", val: `${formatCurrency(activeProfile.dayRate / activeProfile.hoursPerDay)}/hr` },
                { label: "Per minute", val: formatCurrency(activeProfile.dayRate / activeProfile.hoursPerDay / 60) },
                { label: "Day rate", val: formatCurrency(activeProfile.dayRate) },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                  {i > 0 && <div style={{ width: 1, height: 28, background: "rgba(255,255,255,0.1)", marginRight: 14 }} />}
                  <div style={{ textAlign: i===2?"right":i===1?"center":"left", flex: 1 }}>
                    <div className="sf" style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.60)", marginBottom: 4 }}>{item.label}</div>
                    <div className="sf" style={{ fontSize: 16, fontWeight: 700, color: "#fcd34d", letterSpacing: "-0.01em" }}>{item.val}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── History view ── */}
        {view === "history" && (
          <div style={{ animation: "up 0.35s ease both" }}>
            {sessions.length === 0 ? (
              <div className="glass" style={{ padding: "52px 28px", textAlign: "center" }}>
                <div className="serif" style={{ fontSize: 20, color: "rgba(255,255,255,0.6)", marginBottom: 7 }}>No sessions yet</div>
                <div className="sf" style={{ fontSize: 13, color: "rgba(255,255,255,0.50)", lineHeight: 1.6 }}>Your completed sessions will appear here once you finish a timer.</div>
              </div>
            ) : (
              <>
                {/* Summary stats */}
                <div className="glass" style={{ padding: "18px", marginBottom: 24, display: "grid", gridTemplateColumns: "1fr 1px 1fr 1px 1fr", alignItems: "center" }}>
                  {[
                    { label: "Total Earned", value: formatCurrency(sessions.reduce((a,s)=>a+(s.earned||0),0)), color: "#6ee7b7" },
                    null,
                    { label: "Days Worked", value: formatDays(sessions.reduce((a,s)=>a+(s.totalSeconds||0),0)), color: "#a78bfa" },
                    null,
                    { label: "Sessions", value: String(sessions.length), color: "#fcd34d" },
                  ].map((item, i) => item === null
                    ? <div key={i} style={{ height: 28, background: "rgba(255,255,255,0.06)" }} />
                    : <div key={i} style={{ textAlign: "center", padding: "0 6px" }}>
                        <div className="sf" style={{ fontSize: 19, fontWeight: 700, color: item.color, letterSpacing: "-0.02em" }}>{item.value}</div>
                        <div className="sf" style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.13em", textTransform: "uppercase", color: "rgba(255,255,255,0.60)", marginTop: 3 }}>{item.label}</div>
                      </div>
                  )}
                </div>

                {/* Heatmap */}
                <EarningsHeatmap sessions={sessions} />

                {/* Session list */}
                {sessions.map(s => {
                  const sProfile = profiles.find(p => p.id === s.profileId);
                  return (
                    <div key={s.id} className="inset" style={{ padding: "14px 16px", marginBottom: 12, display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <input type="text" defaultValue={s.title || ""} placeholder="Untitled session" maxLength={60} className="sf"
                          onBlur={e => updateSessionTitle(s.id, e.target.value)}
                          onKeyDown={e => { if (e.key==="Enter") e.target.blur(); if (e.key==="Escape") { e.target.value=s.title||""; e.target.blur(); } }}
                          style={{ width: "100%", background: "transparent", border: "none", borderBottom: "1px solid transparent", outline: "none", fontSize: 13, fontWeight: 600, color: s.title?"rgba(255,255,255,0.9)":"rgba(255,255,255,0.35)", fontStyle: s.title?"normal":"italic", fontFamily: "'DM Sans',-apple-system,sans-serif", padding: "0 0 2px", marginBottom: 2, transition: "border-color 0.15s ease, color 0.15s ease", cursor: "text" }}
                          onFocus={e => { e.target.style.borderBottomColor="rgba(139,92,246,0.45)"; e.target.style.color="rgba(255,255,255,0.9)"; e.target.style.fontStyle="normal"; }}
                          onBlurCapture={e => { e.target.style.borderBottomColor="transparent"; e.target.style.color=e.target.value?"rgba(255,255,255,0.9)":"rgba(255,255,255,0.35)"; e.target.style.fontStyle=e.target.value?"normal":"italic"; }}
                        />
                        {sProfile && (
                          <div style={{ display: "inline-flex", alignItems: "center", gap: 4, marginBottom: 3 }}>
                            <div style={{ width: 5, height: 5, borderRadius: "50%", background: sProfile.color }} />
                            <span className="sf" style={{ fontSize: 10, color: sProfile.color, fontWeight: 600, opacity: 0.8 }}>{sProfile.name}</span>
                          </div>
                        )}
                        <div className="sf" style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", marginBottom: 2 }}>{formatDate(s.dateTs)}</div>
                        <div className="sf" style={{ fontSize: 11, color: "rgba(255,255,255,0.60)", marginBottom: 2 }}>
                          {formatGMT(s.dateTs)} — {formatGMT(s.endedAt)}
                          <span className="sf" style={{ fontSize: 10, color: "rgba(255,255,255,0.50)", marginLeft: 4 }}>GMT</span>
                        </div>
                        <div className="sf" style={{ fontSize: 11, color: "rgba(255,255,255,0.55)" }}>
                          {formatTime(s.totalSeconds||0)}
                          <span style={{ margin: "0 5px", opacity: 0.4 }}>&middot;</span>
                          {formatDays(s.totalSeconds||0)} days
                        </div>
                      </div>
                      <div className="sf" style={{ fontSize: 15, fontWeight: 700, color: "#6ee7b7", flexShrink: 0 }}>{formatCurrency(s.earned||0)}</div>
                      <button className="xbtn" onClick={() => deleteSession(s.id)}>✕</button>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        )}

        {/* ── Settings view ── */}
        {view === "settings" && (
          <SettingsPanel profiles={profiles} setProfiles={setProfiles} onClose={() => setView("timer")} />
        )}

      </div>
    </div>
  );
}
