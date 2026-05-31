import { useState } from 'react';

// Class layouts from your original affinity systems
const CLASS_DATA = {
  Defender: { stat: 'Vitality', weakness: 'Sand / Daze', minor: 'Defend', color: 'border-slate-600 bg-slate-900/40 text-slate-300' },
  Warrior: { stat: 'Might', weakness: 'Light / Panic', minor: 'Cleave', color: 'border-purple-600 bg-purple-950/30 text-purple-400' },
  Adept: { stat: 'Agility', weakness: 'Wind / Daze', minor: 'Move', color: 'border-amber-600 bg-amber-950/30 text-amber-400' },
  Creator: { stat: 'Ingenuity', weakness: 'Water / Ignite', minor: 'Steady', color: 'border-red-600 bg-red-950/30 text-red-400' },
  Mender: { stat: 'Awareness', weakness: 'Shadow / Blind', minor: 'Take Cover', color: 'border-yellow-500 bg-yellow-950/30 text-yellow-400' },
  Mancer: { stat: 'Spirit', weakness: 'Fire / Purged', minor: 'Resist', color: 'border-blue-600 bg-blue-950/30 text-blue-400' },
};

export default function App() {
  // Identity Block
  const [name, setName] = useState('Argylle (Ryan)');
  const [level, setLevel] = useState(2);
  const [archetype, setArchetype] = useState('Defender');
  const [subClass, setSubClass] = useState('Survivor');

  // Vitals State Matrix
  const [wounds, setWounds] = useState(0);
  const [maxHp, setMaxHp] = useState(24);
  const [hp, setHp] = useState(24);
  const [thp, setThp] = useState(0);
  const [baseAc, setBaseAc] = useState(2);
  const [tac, setTac] = useState(0);
  
  // Virtual Dice Log State
  const [diceLog, setDiceLog] = useState('Click a die to roll...');

  // Attribute Node States
  const [stats, setStats] = useState({
    Might: { val: 1, state: 'Normal' },
    Agility: { val: 1, state: 'Weak' },
    Vitality: { val: 1, state: 'Mastered' },
    Ingenuity: { val: 1, state: 'Normal' },
    Awareness: { val: 2, state: 'Normal' },
    Spirit: { val: 1, state: 'Normal' },
    Charisma: { val: 2, state: 'Normal' },
  });

  // Action Grid Console Row Data
  const [actionRows, setActionRows] = useState([
    { label: 'Attack Bonus', val: 0, status: 'Ignite', badgeColor: 'bg-red-900 text-red-200 border-red-700', active: false },
    { label: 'TAKE COVER (AC range)', val: 0, status: 'Panic', badgeColor: 'bg-purple-900 text-purple-200 border-purple-700', active: false },
    { label: 'DEFEND (AC melee)', val: 0, status: 'Purge', badgeColor: 'bg-blue-900 text-blue-200 border-blue-700', active: false },
    { label: 'STEADY (DMG Range)', val: 0, status: 'Restrain', badgeColor: 'bg-sky-900 text-sky-200 border-sky-700', active: false },
    { label: 'CLEAVE (attacked next melee)', val: 0, status: 'Daze', badgeColor: 'bg-amber-900 text-amber-200 border-amber-800', active: false },
    { label: 'AURA (- to AC)', val: 4, status: 'Blind', badgeColor: 'bg-yellow-900 text-yellow-100 border-yellow-600', active: false },
  ]);

  // Inventory & Bookkeeping Blocks
  const [xp, setXp] = useState('120 / 300');
  const [inventory, setInventory] = useState('Iron Kite Shield, Heavy Plated Mail, Healing Draught (x2)');

  // Dynamic Rule Calculation Engine
  const isPurgedActive = actionRows.find(r => r.status === 'Purge')?.active;
  const computedTotalAc = baseAc + tac;
  const finalCalculatedAc = isPurgedActive ? Math.floor(computedTotalAc / 2) : computedTotalAc;

  // Dice Roller Execution Tool
  const rollDice = (type, formulaText) => {
    let roll = 0;
    if (type === 'spd') {
      roll = Math.floor(Math.random() * 4) + 1 + 5; // 1d4 + 5
    } else if (type === 'attrition') {
      roll = Math.floor(Math.random() * 4) + 1; // 1d4
    }
    setDiceLog(`🎲 Rolled ${formulaText}: Result = [ ${roll} ]`);
  };

  const toggleStatState = (statName, current) => {
    const states = ['Normal', 'Weak', 'Mastered'];
    const nextIndex = (states.indexOf(current) + 1) % states.length;
    setStats({
      ...stats,
      [statName]: { ...stats[statName], state: states[nextIndex] }
    });
  };

  const toggleRowActive = (index) => {
    const updated = [...actionRows];
    updated[index].active = !updated[index].active;
    setActionRows(updated);
  };

  const updateRowVal = (index, newVal) => {
    const updated = [...actionRows];
    updated[index].val = Number(newVal);
    setActionRows(updated);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-3 md:p-6 font-sans selection:bg-emerald-500/20">
      <div className="max-w-5xl mx-auto space-y-5">
        
        {/* ROW 1: CORE CHARACTER IDENTITY HEADER */}
        <header className="bg-gray-900 border border-gray-800 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
          <div className="space-y-1 w-full md:w-auto">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Tactical Sheet Interface</span>
            <div className="flex flex-wrap items-baseline gap-3">
              <input 
                type="text" value={name} onChange={(e) => setName(e.target.value)}
                className="bg-transparent text-2xl font-black text-white focus:outline-none border-b border-transparent hover:border-gray-700 focus:border-emerald-500 transition pb-0.5"
              />
              <div className="flex items-center gap-1.5 bg-gray-950 border border-gray-800 px-2 py-0.5 rounded-lg text-xs">
                <span className="text-gray-500 font-bold">LVL</span>
                <input type="number" value={level} onChange={(e) => setLevel(Number(e.target.value))} className="w-6 bg-transparent font-black text-amber-400 text-center focus:outline-none" />
              </div>
            </div>
            <p className="text-xs text-gray-400 font-medium">System Core Profile Tracking Terminal</p>
          </div>

          {/* Archetype Selections */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <select value={archetype} onChange={(e) => setArchetype(e.target.value)} className="bg-gray-950 border border-gray-800 text-xs font-black rounded-xl p-2 text-emerald-400 focus:outline-none focus:border-emerald-500">
              {Object.keys(CLASS_DATA).map(cls => <option key={cls} value={cls}>{cls}</option>)}
            </select>
            <input type="text" value={subClass} onChange={(e) => setSubClass(e.target.value)} className="bg-gray-950 border border-gray-800 text-xs font-bold rounded-xl p-2 text-gray-300 w-28 text-center focus:outline-none focus:border-emerald-500" placeholder="Role Specialization" />
            
            <div className="bg-rose-950/30 border border-rose-900/60 p-2 rounded-xl text-center min-w-[120px]">
              <span className="text-[9px] font-bold uppercase tracking-wider text-rose-400 block">Weakness Grid</span>
              <span className="text-xs font-black text-rose-300">{CLASS_DATA[archetype].weakness}</span>
            </div>
          </div>
        </header>

        {/* ROW 2: CRITICAL HP & ARMOR VITALS CONSOLE CARD GRID */}
        <section className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
          
          {/* WOUNDS STATUS MODULE */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-3 text-center flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">Wounds</span>
            <div className="flex items-center justify-center gap-2 my-1">
              <button onClick={() => setWounds(Math.max(0, wounds - 1))} className="text-xs bg-gray-800 hover:bg-gray-700 w-5 h-5 rounded font-bold">-</button>
              <span className={`text-xl font-black ${wounds > 0 ? 'text-red-400 animate-pulse' : 'text-gray-300'}`}>{wounds}</span>
              <button onClick={() => setWounds(wounds + 1)} className="text-xs bg-gray-800 hover:bg-gray-700 w-5 h-5 rounded font-bold">+</button>
            </div>
            <span className="text-[9px] text-gray-500 font-medium">Injury Stack</span>
          </div>

          {/* MAX HP STAT CONTAINER */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-3 text-center flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">Max HP</span>
            <input type="number" value={maxHp} onChange={(e) => setMaxHp(Number(e.target.value))} className="bg-transparent text-xl font-black text-gray-400 text-center w-full focus:outline-none my-1" />
            <span className="text-[9px] text-gray-600 font-medium">Vital Pool Ceiling</span>
          </div>

          {/* CURRENT HP BAR CORE */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-3 text-center flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">Current HP</span>
            <input type="number" value={hp} onChange={(e) => setHp(Number(e.target.value))} className="bg-transparent text-2xl font-black text-rose-400 text-center w-full focus:outline-none my-0.5" />
            <div className="w-full bg-gray-950 h-1.5 rounded-full overflow-hidden">
              <div className="bg-rose-500 h-full transition-all duration-300" style={{ width: `${Math.min(100, Math.max(0, (hp / maxHp) * 100))}%` }}></div>
            </div>
          </div>

          {/* TEMPORARY HEALTH POOL */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-3 text-center flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">THP</span>
            <input type="number" value={thp} onChange={(e) => setThp(Number(e.target.value))} className="bg-transparent text-xl font-black text-sky-400 text-center w-full focus:outline-none my-1" />
            <span className="text-[9px] text-sky-500 font-medium">Shield Buffs</span>
          </div>

          {/* BASE ARMOR CLASS CELL */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-3 text-center flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">Base AC</span>
            <input type="number" value={baseAc} onChange={(e) => setBaseAc(Number(e.target.value))} className="bg-transparent text-xl font-black text-blue-400 text-center w-full focus:outline-none my-1" />
            <span className="text-[9px] text-gray-600 font-medium">Static Armor</span>
          </div>

          {/* TEMPORARY DEFENSE POOL (TAC) */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-3 text-center flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">TAC Pool</span>
            <input type="number" value={tac} onChange={(e) => setTac(Number(e.target.value))} className="bg-transparent text-xl font-black text-teal-400 text-center w-full focus:outline-none my-1" />
            <span className="text-[9px] text-teal-600 font-medium">Deflect Modifier</span>
          </div>

          {/* CALCULATED TOTAL ARMOR MATRICES PANEL */}
          <div className={`border rounded-xl p-3 text-center flex flex-col justify-between transition-all col-span-2 sm:col-span-1 ${isPurgedActive ? 'bg-red-950/40 border-red-500 animate-pulse' : 'bg-emerald-950/20 border-emerald-800'}`}>
            <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block">Total AC</span>
            <span className={`text-2xl font-black block my-0.5 ${isPurgedActive ? 'text-red-400' : 'text-emerald-400'}`}>{finalCalculatedAc}</span>
            <span className="text-[8px] font-bold tracking-tight block text-gray-500 uppercase">
              {isPurgedActive ? '⚠️ PURGE HALVED' : 'Calculated Live'}
            </span>
          </div>

        </section>

        {/* DICE ACTION LOGGER STATUS BAR */}
        <div className="bg-gray-950 border border-gray-800 px-4 py-2.5 rounded-xl flex justify-between items-center text-xs">
          <div className="flex gap-2 items-center">
            <span className="text-gray-500 font-bold">DICE CONSOLE LOG:</span>
            <span className="font-mono text-emerald-400 font-bold">{diceLog}</span>
          </div>
          {diceLog !== 'Click a die to roll...' && (
            <button onClick={() => setDiceLog('Click a die to roll...')} className="text-[10px] bg-gray-900 hover:bg-gray-800 text-gray-400 px-2 py-0.5 rounded">Clear</button>
          )}
        </div>

        {/* ROW 3: TWO COLUMN MAIN OPERATIONS INTERFACE */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          
          {/* MAIN MATRIX ACTION GRID CONSOLE (LEFT 2 COLUMNS) */}
          <div className="lg:col-span-2 space-y-5">
            
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-lg">
              <div className="bg-gray-950 px-4 py-3 border-b border-gray-800 flex justify-between items-center">
                <h3 className="text-xs font-black uppercase tracking-wider text-gray-400">⚡ Engine Ability Modifier & Status Array</h3>
                <span className="text-[10px] text-gray-500 font-medium">Interactive Session Matrix</span>
              </div>

              <div className="divide-y divide-gray-800/60">
                {actionRows.map((row, index) => (
                  <div key={index} className={`p-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 transition-colors ${row.active ? 'bg-gray-950/40' : ''}`}>
                    
                    {/* Input modifier box */}
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-950 border border-gray-800 rounded-lg p-1 flex items-center shadow-inner">
                        <input 
                          type="number" value={row.val} onChange={(e) => updateRowVal(index, e.target.value)}
                          className="w-10 bg-transparent text-center font-black text-sm text-gray-200 focus:outline-none"
                        />
                      </div>
                      <span className={`text-xs font-bold ${row.active ? 'text-white' : 'text-gray-400'}`}>{row.label}</span>
                    </div>

                    {/* Interactive Toggles */}
                    <div className="flex items-center justify-between sm:justify-end gap-3">
                      <span className={`text-[10px] font-black uppercase px-2 py-1 rounded border tracking-wider text-center min-w-[75px] ${row.badgeColor}`}>
                        {row.status}
                      </span>

                      <button
                        type="button"
                        onClick={() => toggleRowActive(index)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all border w-24 text-center ${
                          row.active 
                            ? 'bg-red-950/50 text-red-400 border-red-500 shadow-sm font-black' 
                            : 'bg-gray-950 text-gray-500 border-gray-800 hover:border-gray-700'
                        }`}
                      >
                        {row.active ? '🔴 ACTIVE' : 'Inactive'}
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            </div>

            {/* ATTRIBUTES ROW NODES MATRIX */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 shadow-lg space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 border-b border-gray-800 pb-2">📊 Attribute Matrices</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                {Object.keys(stats).map(statName => {
                  const stat = stats[statName];
                  const isMastered = stat.state === 'Mastered';
                  const isWeak = stat.state === 'Weak';
                  
                  let stateColor = 'text-gray-400 border-gray-800 bg-gray-950';
                  if (isMastered) stateColor = 'text-emerald-400 border-emerald-900 bg-emerald-950/20';
                  if (isWeak) stateColor = 'text-amber-500 border-amber-900/60 bg-amber-950/20';

                  return (
                    <div 
                      key={statName} 
                      onClick={() => toggleStatState(statName, stat.state)}
                      className={`border rounded-xl p-2.5 text-center cursor-pointer hover:scale-[1.03] transition shadow-sm flex flex-col justify-between min-h-[85px] ${stateColor}`}
                    >
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-tight block">{statName}</span>
                      <span className="text-xl font-black block my-0.5 text-white">{stat.val}</span>
                      <span className="text-[9px] font-bold uppercase tracking-tighter opacity-80 block truncate">
                        {isMastered ? '⭐ Mstr' : isWeak ? '⚠️ Weak' : 'Normal'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* SIDEBAR OPERATIONAL INFORMATION CONSOLE (RIGHT 1 COLUMN) */}
          <div className="space-y-5">
            
            {/* ACTION ROLLER METRICS PANEL */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 shadow-lg space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-400">🎲 Dynamic Movement & Attrition Rollers</h3>
              
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => rollDice('spd', 'Speed (1d4+5)')}
                  className="bg-gray-950 hover:bg-gray-900 border border-gray-800 hover:border-gray-700 p-3 rounded-xl text-center group transition"
                >
                  <span className="text-[10px] font-bold text-gray-500 block uppercase">Speed Stat</span>
                  <span className="text-base font-black text-teal-400 group-hover:text-teal-300 block mt-1">🏃‍♂️ 1d4+5</span>
                </button>

                <button 
                  onClick={() => rollDice('attrition', 'Attrition (d4)')}
                  className="bg-gray-950 hover:bg-gray-900 border border-gray-800 hover:border-gray-700 p-3 rounded-xl text-center group transition"
                >
                  <span className="text-[10px] font-bold text-gray-500 block uppercase">Attrition Modifier</span>
                  <span className="text-base font-black text-amber-500 group-hover:text-amber-400 block mt-1">⏳ d4 Roll</span>
                </button>
              </div>
            </div>

            {/* ROLE ABILITY MECHANICS CARD */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 shadow-lg space-y-3">
              <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-gray-400">🛡️ Active Role Features</h3>
                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-teal-950 border border-teal-800 text-teal-400">
                  {CLASS_DATA[archetype].minor}
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="text-xs font-black text-emerald-400">Over Here!</h4>
                  <p className="text-[11px] text-gray-400 leading-relaxed mt-1">
                    Use an Action to roll <span className="text-white font-bold">Vitality against Vitality</span>. Target enemy you can see within 18 sq moves adjacent to the Defender. This movement can trigger Opportunity Attacks. On Critical, gain <span className="text-teal-400 font-bold">TAC</span> equal to your Vitality score.
                  </p>
                </div>
                <div className="bg-gray-950 border border-gray-800/80 p-2.5 rounded-xl">
                  <span className="text-[10px] font-black text-amber-400 block uppercase tracking-wider">⚠️ Critical Warning Rule</span>
                  <p className="text-[11px] text-gray-400 mt-0.5">On a roll of 1: Automatically gain <span className="text-teal-400 font-bold">1 TAC</span> asset point.</p>
                </div>
              </div>
            </div>

            {/* EXP & PROGRESS MANAGEMENT PANEL */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 shadow-lg space-y-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-gray-500">Experience Tracking (XP)</label>
                <input type="text" value={xp} onChange={(e) => setXp(e.target.value)} className="bg-gray-950 border border-gray-800 rounded-xl px-3 py-1.5 font-mono text-xs font-bold text-amber-400 focus:outline-none focus:border-emerald-500 w-full" />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-gray-500">Inventory Logs</label>
                <textarea 
                  value={inventory} rows={2} onChange={(e) => setInventory(e.target.value)}
                  className="bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-xs font-medium text-gray-300 focus:outline-none focus:border-emerald-500 w-full resize-none"
                />
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
