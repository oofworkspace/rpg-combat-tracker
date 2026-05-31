import { useState } from 'react';

// Exact data mapping from the Google Doc (image_7c431e.png)
const CLASS_AFFINITIES = {
  Warrior: { stat: 'Might', dmgType: 'Shadow', status: 'Panicked', minor: 'Cleave', weakness: 'Light', color: 'border-purple-600 bg-purple-950/30 text-purple-400', badge: 'bg-purple-900/50 text-purple-300 border-purple-700' },
  Adept: { stat: 'Agility', dmgType: 'Sand', status: 'Dazed', minor: 'Move', weakness: 'Wind', color: 'border-amber-600 bg-amber-950/30 text-amber-400', badge: 'bg-amber-900/50 text-amber-300 border-amber-700' },
  Defender: { stat: 'Vitality', dmgType: 'Wind', status: 'Restrained', minor: 'Defend', weakness: 'Sand', color: 'border-slate-500 bg-slate-900/40 text-slate-300', badge: 'bg-slate-800 text-slate-300 border-slate-600' },
  Creator: { stat: 'Ingenuity', dmgType: 'Fire', status: 'Ignite', minor: 'Steady', weakness: 'Water', color: 'border-red-600 bg-red-950/30 text-red-400', badge: 'bg-red-900/50 text-red-300 border-red-700' },
  Mender: { stat: 'Awareness', dmgType: 'Light', status: 'Blind', minor: 'Take Cover', weakness: 'Shadow', color: 'border-yellow-500 bg-yellow-950/30 text-yellow-400', badge: 'bg-yellow-900/50 text-yellow-200 border-yellow-600' },
  Mancer: { stat: 'Spirit', dmgType: 'Water', status: 'Purged', minor: 'Resist', weakness: 'Fire', color: 'border-blue-600 bg-blue-950/30 text-blue-400', badge: 'bg-blue-900/50 text-blue-300 border-blue-700' },
};

const STATUS_EFFECTS = {
  Panicked: 'Advantage on Attacks against this target.',
  Dazed: 'Only one Action on turn.',
  Restrained: 'Cannot use Minor Actions.',
  Ignite: 'Disadvantage on rolls.',
  Blind: 'Cannot use Attack Action.',
  Purged: 'Remove all buffs from the target, if they have no buffs half their AC (ru).',
};

export default function App() {
  // Character State
  const [charName, setCharName] = useState('My Hero');
  const [selectedClass, setSelectedClass] = useState('Warrior');
  const [hp, setHp] = useState(45);
  const [maxHp, setMaxHp] = useState(45);
  const [baseAc, setBaseAc] = useState(16);
  
  // Interactive Toggles
  const [activeStatuses, setActiveStatuses] = useState({
    Panicked: false, Dazed: false, Restrained: false, Ignite: false, Blind: false, Purged: false
  });
  const [buffsList, setBuffsList] = useState(['Shield of Faith']);
  const [newBuffName, setNewBuffName] = useState('');

  const currentAffinity = CLASS_AFFINITIES[selectedClass];

  // Logic: Calculate dynamic AC based on Purged status and buff conditions
  const hasBuffs = buffsList.length > 0;
  const isPurged = activeStatuses.Purged;
  const finalAc = (isPurged && !hasBuffs) ? Math.floor(baseAc / 2) : baseAc;

  const toggleStatus = (statusName) => {
    setActiveStatuses(prev => {
      const updated = { ...prev, [statusName]: !prev[statusName] };
      // Rule mechanic: Purged clears all buffs immediately when activated
      if (statusName === 'Purged' && updated.Purged) {
        setBuffsList([]);
      }
      return updated;
    });
  };

  const addBuff = (e) => {
    e.preventDefault();
    if (!newBuffName.trim()) return;
    setBuffsList([...buffsList, newBuffName.trim()]);
    setNewBuffName('');
  };

  const removeBuff = (index) => {
    setBuffsList(buffsList.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-4 md:p-8 font-sans selection:bg-emerald-500/30">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* TOP INTERACTIVE EDIT BAR */}
        <section className="bg-gray-900 border border-gray-800 p-4 rounded-2xl flex flex-col sm:flex-row gap-4 justify-between items-center shadow-xl">
          <div className="w-full sm:w-auto flex flex-col gap-1">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Character Name</label>
            <input 
              type="text" value={charName} onChange={(e) => setCharName(e.target.value)}
              className="bg-gray-950 border border-gray-700 rounded-xl px-3 py-1.5 font-bold text-lg text-emerald-400 focus:outline-none focus:border-emerald-500 w-full sm:w-64"
            />
          </div>

          <div className="w-full sm:w-auto flex flex-col gap-1">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Select Archetype / Class</label>
            <select 
              value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-gray-950 border border-gray-700 rounded-xl px-3 py-2 font-bold text-gray-200 focus:outline-none focus:border-emerald-500 w-full sm:w-52"
            >
              {Object.keys(CLASS_AFFINITIES).map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>
        </section>

        {/* MAIN CHARACTER SHEET DASHBOARD */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* COLUMN 1 & 2: SHEET STATS & AFFINITIES */}
          <div className="md:col-span-2 space-y-6">
            
            {/* CORE STATUS DISPLAY */}
            <div className={`border-2 rounded-2xl p-6 shadow-2xl transition-all duration-300 ${currentAffinity.color}`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-xs font-black uppercase tracking-widest text-gray-400 block">Active Profile</span>
                  <h2 className="text-3xl font-black tracking-tight text-white">{charName}</h2>
                  <span className="text-sm font-semibold italic opacity-80">The {selectedClass}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black uppercase tracking-widest text-gray-400 block">Class Weapon Variant</span>
                  <span className="text-lg font-bold text-white block">✨ {currentAffinity.minor} (Minor)</span>
                </div>
              </div>

              {/* DYNAMIC VITAL STATS GRID */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
                
                {/* HEALTH CARD */}
                <div className="bg-gray-950/80 border border-gray-800 rounded-xl p-3 text-center relative group">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">Vitals (HP)</span>
                  <div className="flex justify-center items-baseline gap-1 mt-1">
                    <input 
                      type="number" value={hp} onChange={(e) => setHp(Number(e.target.value))}
                      className="bg-transparent text-xl font-black text-rose-400 w-12 text-center focus:outline-none"
                    />
                    <span className="text-gray-500 text-sm">/</span>
                    <input 
                      type="number" value={maxHp} onChange={(e) => setMaxHp(Number(e.target.value))}
                      className="bg-transparent text-sm font-bold text-gray-400 w-10 text-center focus:outline-none"
                    />
                  </div>
                  <div className="w-full bg-gray-900 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-rose-500 h-full transition-all" style={{ width: `${Math.min(100, Math.max(0, (hp/maxHp)*100))}%` }}></div>
                  </div>
                </div>

                {/* DYNAMIC ARMOR CLASS CARD */}
                <div className={`border rounded-xl p-3 text-center transition-all ${isPurged && !hasBuffs ? 'bg-red-950/50 border-red-500 animate-pulse' : 'bg-gray-950/80 border-gray-800'}`}>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">Defense (AC)</span>
                  <div className="flex justify-center items-center gap-1 mt-1">
                    <input 
                      type="number" value={baseAc} onChange={(e) => setBaseAc(Number(e.target.value))}
                      className={`bg-transparent text-2xl font-black w-12 text-center focus:outline-none ${isPurged && !hasBuffs ? 'text-red-400 line-through text-lg' : 'text-blue-400'}`}
                    />
                    {isPurged && !hasBuffs && (
                      <span className="text-2xl font-black text-red-400">{finalAc}</span>
                    )}
                  </div>
                  <span className="text-[9px] font-medium text-gray-400 block mt-1">
                    {isPurged && !hasBuffs ? '⚠️ HALVED (Purged & No Buffs)' : 'Base Attribute'}
                  </span>
                </div>

                {/* PRIMARY STAT CARD */}
                <div className="bg-gray-950/80 border border-gray-800 rounded-xl p-3 text-center col-span-2 sm:col-span-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">Core Scaling Attribute</span>
                  <span className="text-xl font-black text-emerald-400 block mt-1">✊ {currentAffinity.stat}</span>
                </div>

              </div>
            </div>

            {/* CLASS AFFINITIES DETAIL MATRICES */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-4 shadow-lg">
              <h3 className="text-sm font-black uppercase tracking-wider text-gray-400 border-b border-gray-800 pb-2">🧬 Sheet Affinities ({selectedClass})</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gray-950 p-3 rounded-xl border border-gray-800">
                  <span className="text-[10px] font-bold text-gray-500 block uppercase">Primary Output Type</span>
                  <span className="text-lg font-bold text-teal-400 mt-1 block">🔮 {currentAffinity.dmgType} Damage</span>
                </div>

                <div className="bg-gray-950 p-3 rounded-xl border border-gray-800">
                  <span className="text-[10px] font-bold text-gray-500 block uppercase">Signature Minor Action</span>
                  <span className="text-lg font-bold text-amber-400 mt-1 block">⚡ {currentAffinity.minor}</span>
                  {activeStatuses.Restrained && (
                    <span className="text-[10px] text-red-400 font-bold block mt-1 animate-pulse">❌ Blocked by Restrained!</span>
                  )}
                </div>

                <div className="bg-gray-950 p-3 rounded-xl border border-red-900/40">
                  <span className="text-[10px] font-bold text-red-400 block uppercase tracking-wider">System Weakness</span>
                  <span className="text-lg font-black text-rose-400 mt-1 block">💔 {currentAffinity.weakness}</span>
                </div>
              </div>
            </div>

            {/* LIVE MODIFIER CONSOLE ALERT RULES */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-black uppercase tracking-wider text-gray-400">🚨 Active Rule Modifiers</h3>
              
              <div className="space-y-2">
                {Object.keys(activeStatuses).filter(s => activeStatuses[s]).length === 0 ? (
                  <p className="text-sm text-gray-500 italic py-2">Condition clean. No system rule penalties actively modified.</p>
                ) : (
                  Object.keys(activeStatuses).map(statusName => {
                    if (!activeStatuses[statusName]) return null;
                    return (
                      <div key={statusName} className="flex gap-3 items-start bg-red-950/20 border border-red-900/60 p-3 rounded-xl">
                        <span className="text-sm px-2 py-0.5 font-black uppercase tracking-wider bg-red-900/50 text-red-300 rounded border border-red-700 mt-0.5">
                          {statusName}
                        </span>
                        <p className="text-sm text-gray-300 font-medium">{STATUS_EFFECTS[statusName]}</p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </div>

          {/* COLUMN 3: INTERACTIVE BUFFS & DEBUFF PANEL */}
          <div className="space-y-6">
            
            {/* INTERACTIVE DEBUFF BUTTONS */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-lg">
              <h3 className="text-sm font-black uppercase tracking-wider text-gray-400 mb-3">⚠️ Apply Status Debuffs</h3>
              <div className="flex flex-col gap-2">
                {Object.keys(STATUS_EFFECTS).map(statusName => {
                  const isApplied = activeStatuses[statusName];
                  return (
                    <button
                      key={statusName}
                      type="button"
                      onClick={() => toggleStatus(statusName)}
                      className={`w-full text-left px-4 py-3 rounded-xl border transition-all duration-200 flex justify-between items-center ${
                        isApplied 
                          ? 'bg-red-950/60 border-red-500 text-red-200 shadow-md ring-1 ring-red-500/30' 
                          : 'bg-gray-950 border-gray-800 text-gray-400 hover:border-gray-700 hover:text-gray-200'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className={`text-sm font-bold ${isApplied ? 'text-red-400' : ''}`}>{statusName}</span>
                        <span className="text-[10px] text-gray-500 truncate max-w-[180px] font-medium mt-0.5">{STATUS_EFFECTS[statusName]}</span>
                      </div>
                      <span className="text-xs">{isApplied ? '🔴 ACTIVE' : '➕ Tap'}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* DYNAMIC BUFF TRACKER CONTAINER */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-lg">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-black uppercase tracking-wider text-gray-400">🛡️ Active Buffs</h3>
                <span className="text-xs bg-blue-950 border border-blue-800 text-blue-400 px-2 py-0.5 rounded-md font-bold">
                  {buffsList.length} Active
                </span>
              </div>

              <form onSubmit={addBuff} className="flex gap-2 mb-4">
                <input 
                  type="text" placeholder="Add custom buff..." value={newBuffName} onChange={(e) => setNewBuffName(e.target.value)}
                  className="bg-gray-950 border border-gray-800 rounded-xl px-3 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-emerald-500 flex-1"
                />
                <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-3 rounded-xl transition">
                  Add
                </button>
              </form>

              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {buffsList.length === 0 ? (
                  <p className="text-xs text-gray-500 italic py-2 text-center bg-gray-950 rounded-xl border border-dashed border-gray-800">
                    No active buffs. {isPurged ? '❌ Purged blocks new buff creation!' : ''}
                  </p>
                ) : (
                  buffsList.map((buff, i) => (
                    <div key={i} className="flex justify-between items-center bg-gray-950 border border-gray-800 px-3 py-1.5 rounded-lg text-xs">
                      <span className="font-bold text-blue-400">🛡️ {buff}</span>
                      <button type="button" onClick={() => removeBuff(i)} className="text-gray-500 hover:text-red-400 transition font-bold px-1">✕</button>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
