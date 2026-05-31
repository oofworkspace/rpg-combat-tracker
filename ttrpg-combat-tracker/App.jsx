import { useState } from 'react';

const CLASS_DATA = {
  Adept: { stat: 'Agility', weakness: 'Wind / Daze', minor: 'Move', color: 'border-amber-600 bg-amber-950/30 text-amber-400' },
  Defender: { stat: 'Vitality', weakness: 'Sand / Daze', minor: 'Defend', color: 'border-slate-600 bg-slate-900/40 text-slate-300' },
  Warrior: { stat: 'Might', weakness: 'Light / Panic', minor: 'Cleave', color: 'border-purple-600 bg-purple-950/30 text-purple-400' },
  Creator: { stat: 'Ingenuity', weakness: 'Water / Ignite', minor: 'Steady', color: 'border-red-600 bg-red-950/30 text-red-400' },
  Mender: { stat: 'Awareness', weakness: 'Shadow / Blind', minor: 'Take Cover', color: 'border-yellow-500 bg-yellow-950/30 text-yellow-400' },
  Mancer: { stat: 'Spirit', weakness: 'Fire / Purged', minor: 'Resist', color: 'border-blue-600 bg-blue-950/30 text-blue-400' },
};

const ARCHETYPES = ['Entertainer', 'Hero', 'Inventor', 'Outlaw', 'Scholar', 'Survivor'];

export default function App() {
  // Identity Block
  const [name, setName] = useState('');
  const [level, setLevel] = useState(2);
  const [classSelection, setClassSelection] = useState('Adept');
  const [archetypeSelection, setArchetypeSelection] = useState('Outlaw');

  // Vitals State Matrix
  const [wounds, setWounds] = useState(0);
  const [maxHp, setMaxHp] = useState(24);
  const [hp, setHp] = useState(24);
  const [thp, setThp] = useState(0);
  const [baseAc, setBaseAc] = useState(2);
  const [tempAc, setTempAc] = useState(0);
  const [totalAcMod, setTotalAcMod] = useState(0); // Manual leveling adjustments for Total AC
  
  // Custom Leveling Dice Formulas
  const [spdDice, setSpdDice] = useState({ count: 1, faces: 4, mod: 5 });
  const [attritionDice, setAttritionDice] = useState({ count: 1, faces: 4, mod: 0 });

  // Virtual Dice Log State
  const [diceLog, setDiceLog] = useState('Click a die or action to roll...');

  // Attribute Node States (Clamped cleanly 0-5)
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

  // On-Roll Attacks Manual Inputs Ledger
  const [onRollAttacks, setOnRollAttacks] = useState({
    1: 'Critical Fumble: Gain 1 TAC',
    3: 'Swift Strike trigger',
    5: '',
    7: '',
    9: '',
    11: '',
  });

  // Advanced Inventory Dice Engine
  const [inventoryList, setInventoryList] = useState([
    { id: 1, name: 'Iron Kite Shield', die: 'd8' },
    { id: 2, name: 'Heavy Plated Mail', die: 'd6' },
  ]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemDie, setNewItemDie] = useState('d6');

  const [xp, setXp] = useState('120 / 300');

  // Dynamic Rule Calculation Engine (Base + Temp AC + Leveling Modifiers)
  const isPurgedActive = actionRows.find(r => r.status === 'Purge')?.active;
  const computedTotalAc = baseAc + tempAc + totalAcMod;
  const finalCalculatedAc = isPurgedActive ? Math.floor(computedTotalAc / 2) : computedTotalAc;

  // Programmable Dice Roller
  const executeRoll = (count, faces, mod, labelText) => {
    let subTotal = 0;
    let individualRolls = [];
    for (let i = 0; i < count; i++) {
      const roll = Math.floor(Math.random() * faces) + 1;
      individualRolls.push(roll);
      subTotal += roll;
    }
    const finalTotal = subTotal + mod;
    const modSign = mod >= 0 ? `+${mod}` : `${mod}`;
    setDiceLog(`🎲 ${labelText} (${count}d${faces}${modSign}): [${individualRolls.join(', ')}] ${mod !== 0 ? modSign : ''} = Total [ ${finalTotal} ]`);
  };

  // Inventory Quick Roller
  const rollItemDie = (itemName, dieString) => {
    const faces = parseInt(dieString.replace('d', ''), 10);
    const roll = Math.floor(Math.random() * faces) + 1;
    setDiceLog(`⚔️ Used ${itemName} (${dieString}): Rolled [ ${roll} ]`);
  };

  // Inventory Handlers
  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    setInventoryList([...inventoryList, { id: Date.now(), name: newItemName.trim(), die: newItemDie }]);
    setNewItemName('');
  };

  const handleRemoveItem = (id) => {
    setInventoryList(inventoryList.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-3 md:p-6 font-sans selection:bg-emerald-500/20">
      <div className="max-w-5xl mx-auto space-y-5">
        
        {/* ROW 1: PROFILE CORNER IDENTITY HEADER */}
        <header className="bg-gray-900 border border-gray-800 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
          <div className="space-y-1 w-full md:w-auto">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Tactical Play Dashboard</span>
            <div className="flex flex-wrap items-baseline gap-3">
              <input 
                type="text" value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Enter Character Name..."
                className="bg-transparent text-2xl font-black text-white focus:outline-none border-b border-transparent hover:border-gray-700 focus:border-emerald-500 transition pb-0.5 placeholder-gray-700 min-w-[240px]"
              />
              <div className="flex items-center gap-1.5 bg-gray-950 border border-gray-800 px-2 py-0.5 rounded-lg text-xs">
                <span className="text-gray-500 font-bold">LVL</span>
                <input type="number" value={level} onChange={(e) => setLevel(Number(e.target.value))} className="w-8 bg-transparent font-black text-amber-400 text-center focus:outline-none" />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <select value={classSelection} onChange={(e) => setClassSelection(e.target.value)} className="bg-gray-950 border border-gray-800 text-xs font-black rounded-xl p-2 text-emerald-400 focus:outline-none">
              {Object.keys(CLASS_DATA).map(cls => <option key={cls} value={cls}>{cls}</option>)}
            </select>
            
            <select value={archetypeSelection} onChange={(e) => setArchetypeSelection(e.target.value)} className="bg-gray-950 border border-gray-800 text-xs font-black rounded-xl p-2 text-gray-300 focus:outline-none">
              {ARCHETYPES.map(arch => <option key={arch} value={arch}>{arch}</option>)}
            </select>
            
            <div className="bg-rose-950/30 border border-rose-900/60 p-2 rounded-xl text-center min-w-[120px]">
              <span className="text-[9px] font-bold uppercase tracking-wider text-rose-400 block">Weakness Grid</span>
              <span className="text-xs font-black text-rose-300">{CLASS_DATA[classSelection].weakness}</span>
            </div>
          </div>
        </header>

        {/* ROW 2: CRITICAL VITALS MATRIX */}
        <section className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
          
          {/* Wounds Module */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-3 text-center flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Wounds</span>
            <div className="flex items-center justify-between bg-gray-950 rounded-lg p-1 border border-gray-800 my-1">
              <button type="button" onClick={() => setWounds(Math.max(0, wounds - 1))} className="text-xs font-black text-gray-500 hover:text-white px-1.5">-</button>
              <input type="number" value={wounds} onChange={(e) => setWounds(Number(e.target.value))} className={`bg-transparent text-sm font-black text-center w-full focus:outline-none ${wounds > 0 ? 'text-red-400' : 'text-gray-300'}`} />
              <button type="button" onClick={() => setWounds(wounds + 1)} className="text-xs font-black text-gray-500 hover:text-white px-1.5">+</button>
            </div>
            <span className="text-[9px] text-gray-600 font-medium">Injuries</span>
          </div>

          {/* Max HP Stat Container */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-3 text-center flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Max HP</span>
            <input type="number" value={maxHp} onChange={(e) => setMaxHp(Number(e.target.value))} className="bg-transparent text-xl font-black text-gray-300 text-center w-full focus:outline-none my-1" />
            <span className="text-[9px] text-gray-600 font-medium">Ceiling Pool</span>
          </div>

          {/* Current HP Card */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-3 text-center flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Current HP</span>
            <div className="flex items-center justify-between bg-gray-950 rounded-lg p-1 border border-gray-800 my-1">
              <button type="button" onClick={() => setHp(Math.max(0, hp - 1))} className="text-xs font-black text-rose-500 hover:text-rose-400 px-1.5">-</button>
              <input type="number" value={hp} onChange={(e) => setHp(Number(e.target.value))} className="bg-transparent text-sm font-black text-center w-full focus:outline-none text-rose-400" />
              <button type="button" onClick={() => setHp(hp + 1)} className="text-xs font-black text-rose-500 hover:text-rose-400 px-1.5">+</button>
            </div>
            <div className="w-full bg-gray-950 h-1 rounded-full overflow-hidden mt-0.5">
              <div className="bg-rose-500 h-full transition-all duration-300" style={{ width: `${Math.min(100, Math.max(0, (hp / maxHp) * 100))}%` }}></div>
            </div>
          </div>

          {/* Temporary HP Card */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-3 text-center flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Temp HP</span>
            <div className="flex items-center justify-between bg-gray-950 rounded-lg p-1 border border-gray-800 my-1">
              <button type="button" onClick={() => setThp(Math.max(0, thp - 1))} className="text-xs font-black text-sky-500 hover:text-sky-400 px-1.5">-</button>
              <input type="number" value={thp} onChange={(e) => setThp(Number(e.target.value))} className="bg-transparent text-sm font-black text-center w-full focus:outline-none text-sky-400" />
              <button type="button" onClick={() => setThp(thp + 1)} className="text-xs font-black text-sky-500 hover:text-sky-400 px-1.5">+</button>
            </div>
            <span className="text-[9px] text-sky-600 font-medium">Shielding</span>
          </div>

          {/* Base AC Card */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-3 text-center flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Base AC</span>
            <input type="number" value={baseAc} onChange={(e) => setBaseAc(Number(e.target.value))} className="bg-transparent text-xl font-black text-blue-400 text-center w-full focus:outline-none my-1" />
            <span className="text-[9px] text-gray-600 font-medium">Static Armor</span>
          </div>

          {/* UPDATED: TEMP AC Card */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-3 text-center flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Temp AC</span>
            <div className="flex items-center justify-between bg-gray-950 rounded-lg p-1 border border-gray-800 my-1">
              <button type="button" onClick={() => setTempAc(Math.max(0, tempAc - 1))} className="text-xs font-black text-teal-500 hover:text-teal-400 px-1.5">-</button>
              <input type="number" value={tempAc} onChange={(e) => setTempAc(Number(e.target.value))} className="bg-transparent text-sm font-black text-center w-full focus:outline-none text-teal-400" />
              <button type="button" onClick={() => setTempAc(tempAc + 1)} className="text-xs font-black text-teal-500 hover:text-teal-400 px-1.5">+</button>
            </div>
            <span className="text-[9px] text-teal-600 font-medium">Deflections</span>
          </div>

          {/* UPDATED: INTERACTIVE TOTAL AC OVERRIDE */}
          <div className={`border rounded-xl p-3 text-center flex flex-col justify-between transition-all col-span-2 sm:col-span-1 ${isPurgedActive ? 'bg-red-950/40 border-red-500 animate-pulse' : 'bg-emerald-950/20 border-emerald-800'}`}>
            <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block">Total AC</span>
            <div className="flex items-center justify-between bg-gray-950/80 rounded-lg p-1 border border-gray-800/80 my-1">
              <button type="button" onClick={() => setTotalAcMod(totalAcMod - 1)} className="text-xs font-black text-gray-500 hover:text-white px-1.5" title="Lower total AC modifier">-</button>
              <span className={`text-base font-black ${isPurgedActive ? 'text-red-400' : 'text-emerald-400'}`}>{finalCalculatedAc}</span>
              <button type="button" onClick={() => setTotalAcMod(totalAcMod + 1)} className="text-xs font-black text-gray-500 hover:text-white px-1.5" title="Raise total AC modifier">+</button>
            </div>
            <span className="text-[8px] font-bold tracking-tight block text-gray-500 uppercase">
              {totalAcMod !== 0 ? `Level Mod: ${totalAcMod >= 0 ? '+' : ''}${totalAcMod}` : (isPurgedActive ? '⚠️ PURGED' : 'Live AC')}
            </span>
          </div>

        </section>

        {/* TERMINAL FEED MONITOR */}
        <div className="bg-gray-950 border border-gray-800 px-4 py-3 rounded-xl flex justify-between items-center text-xs shadow-inner">
          <div className="flex gap-2 items-center">
            <span className="text-gray-500 font-bold uppercase tracking-wider">Console Terminal:</span>
            <span className="font-mono text-emerald-400 font-bold">{diceLog}</span>
          </div>
          {diceLog !== 'Click a die or action to roll...' && (
            <button onClick={() => setDiceLog('Click a die or action to roll...')} className="text-[10px] bg-gray-900 hover:bg-gray-800 text-gray-400 px-2 py-0.5 rounded transition">Reset Feed</button>
          )}
        </div>

        {/* ROW 3: INTERACTIVE OPERATIONS FRAMEWORK */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          
          {/* MAIN INTERACTION BLOCK (LEFT/CENTER) */}
          <div className="lg:col-span-2 space-y-5">
            
            {/* UPDATED: FULLY DECOUPLED ATTRIBUTE NODES GRID */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 shadow-lg space-y-3">
              <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-gray-400">📊 Core Stats Array (0-5 Cap)</h3>
                <span className="text-[9px] bg-gray-950 text-gray-500 px-2 py-0.5 rounded font-mono">Independent Arrays</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                {Object.keys(stats).map(statName => {
                  const stat = stats[statName];
                  const isMastered = stat.state === 'Mastered';
                  const isWeak = stat.state === 'Weak';
                  
                  let themeStyles = 'border-gray-800 bg-gray-950';
                  if (isMastered) themeStyles = 'border-emerald-900 bg-emerald-950/20';
                  if (isWeak) themeStyles = 'border-amber-900/60 bg-amber-950/20';

                  return (
                    <div key={statName} className={`border rounded-xl p-2 text-center flex flex-col justify-between min-h-[110px] ${themeStyles}`}>
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-tight block">{statName}</span>
                      
                      {/* Independent Stepper Control Block for Value Tracking */}
                      <div className="flex items-center justify-between bg-gray-900/60 rounded-lg p-1 border border-gray-800/80 my-1 mx-auto w-full max-w-[70px]">
                        <button 
                          type="button" 
                          onClick={() => setStats(prev => ({
                            ...prev, 
                            [statName]: { ...prev[statName], val: Math.max(0, prev[statName].val - 1) }
                          }))}
                          className="text-xs font-black text-gray-500 hover:text-white px-1"
                        >-</button>
                        <span className="text-sm font-black text-white">{stat.val}</span>
                        <button 
                          type="button" 
                          onClick={() => setStats(prev => ({
                            ...prev, 
                            [statName]: { ...prev[statName], val: Math.min(5, prev[statName].val + 1) }
                          }))}
                          className="text-xs font-black text-gray-500 hover:text-white px-1"
                        >+</button>
                      </div>
                      
                      {/* Isolated Passive Status Trigger Toggles */}
                      <button
                        type="button"
                        onClick={() => {
                          const states = ['Normal', 'Weak', 'Mastered'];
                          const nextIndex = (states.indexOf(stat.state) + 1) % states.length;
                          setStats(prev => ({
                            ...prev,
                            [statName]: { ...prev[statName], state: states[nextIndex] }
                          }));
                        }}
                        className={`text-[9px] font-bold uppercase tracking-tighter py-0.5 w-full rounded transition ${
                          isMastered ? 'bg-emerald-900/40 text-emerald-400' : isWeak ? 'bg-amber-900/40 text-amber-500' : 'bg-gray-900 text-gray-400 hover:text-white'
                        }`}
                      >
                        {isMastered ? '⭐ Mstr' : isWeak ? '⚠️ Weak' : 'Normal'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* STATUS INFLICT ARRAY CONFIG */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-lg">
              <div className="bg-gray-950 px-4 py-2.5 border-b border-gray-800 flex justify-between items-center">
                <h3 className="text-xs font-black uppercase tracking-wider text-gray-400">⚡ Battle Action Modifiers & Conditions</h3>
              </div>
              <div className="divide-y divide-gray-800/60">
                {actionRows.map((row, index) => (
                  <div key={index} className={`p-2.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 transition-colors ${row.active ? 'bg-gray-950/30' : ''}`}>
                    <div className="flex items-center gap-3">
                      <input 
                        type="number" value={row.val} onChange={(e) => {
                          const updated = [...actionRows];
                          updated[index].val = Number(e.target.value);
                          setActionRows(updated);
                        }}
                        className="w-12 bg-gray-950 border border-gray-800 rounded-lg py-0.5 text-center font-black text-sm text-emerald-400 focus:outline-none focus:border-emerald-600"
                      />
                      <span className={`text-xs font-bold ${row.active ? 'text-white' : 'text-gray-400'}`}>{row.label}</span>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border tracking-wider text-center min-w-[75px] ${row.badgeColor}`}>{row.status}</span>
                      <button
                        type="button" onClick={() => {
                          const updated = [...actionRows];
                          updated[index].active = !updated[index].active;
                          setActionRows(updated);
                        }}
                        className={`text-xs font-bold px-3 py-1 rounded-xl border w-24 text-center transition ${row.active ? 'bg-red-950/50 text-red-400 border-red-500 font-black' : 'bg-gray-950 text-gray-500 border-gray-800'}`}
                      >
                        {row.active ? '🔴 ACTIVE' : 'Inactive'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ON-ROLL ATTACKS MANUAL LEDGER */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 shadow-lg space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 border-b border-gray-800 pb-2">⚔️ Manual On-Roll Attack Trigger Matrix</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[1, 3, 5, 7, 9, 11].map(num => (
                  <div key={num} className="flex gap-2 items-center bg-gray-950 border border-gray-800/80 p-2 rounded-xl shadow-inner">
                    <span className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs bg-gray-900 border border-gray-800 text-amber-500">
                      {num}
                    </span>
                    <input 
                      type="text" 
                      value={onRollAttacks[num] || ''} 
                      onChange={(e) => setOnRollAttacks({ ...onRollAttacks, [num]: e.target.value })}
                      placeholder="Enter passive or trigger feature..."
                      className="bg-transparent text-xs font-semibold text-gray-300 focus:outline-none flex-1 truncate placeholder-gray-700"
                    />
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* SIDEBAR OPERATIONAL INFORMATION CONSOLE (RIGHT 1 COLUMN) */}
          <div className="space-y-5">
            
            {/* MUTABLE DYNAMIC ROLLERS CONTAINER */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 shadow-lg space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 border-b border-gray-800 pb-1.5">🎲 Scalable Action Dice</h3>
              
              {/* Speed Roller Builder */}
              <div className="bg-gray-950 p-3 rounded-xl border border-gray-800 space-y-2">
                <span className="text-[10px] font-bold text-gray-500 block uppercase">Speed Modifier Builder</span>
                <div className="flex gap-1.5 items-center text-xs font-mono">
                  <input type="number" value={spdDice.count} onChange={(e) => setSpdDice({ ...spdDice, count: Number(e.target.value) })} className="w-6 bg-gray-900 text-center text-emerald-400 font-bold border border-gray-800 rounded" />
                  <span>d</span>
                  <input type="number" value={spdDice.faces} onChange={(e) => setSpdDice({ ...spdDice, faces: Number(e.target.value) })} className="w-8 bg-gray-900 text-center text-emerald-400 font-bold border border-gray-800 rounded" />
                  <span>+</span>
                  <input type="number" value={spdDice.mod} onChange={(e) => setSpdDice({ ...spdDice, mod: Number(e.target.value) })} className="w-8 bg-gray-900 text-center text-emerald-400 font-bold border border-gray-800 rounded" />
                </div>
                <button 
                  onClick={() => executeRoll(spdDice.count, spdDice.faces, spdDice.mod, 'Speed')}
                  className="w-full mt-1 bg-teal-900/60 hover:bg-teal-800 text-teal-300 font-black text-xs py-2 rounded-lg transition border border-teal-700/50"
                >
                  Roll Speed Action 🏃‍♂️
                </button>
              </div>

              {/* Attrition Roller Builder */}
              <div className="bg-gray-950 p-3 rounded-xl border border-gray-800 space-y-2">
                <span className="text-[10px] font-bold text-gray-500 block uppercase">Attrition Builder</span>
                <div className="flex gap-1.5 items-center text-xs font-mono">
                  <input type="number" value={attritionDice.count} onChange={(e) => setAttritionDice({ ...attritionDice, count: Number(e.target.value) })} className="w-6 bg-gray-900 text-center text-amber-400 font-bold border border-gray-800 rounded" />
                  <span>d</span>
                  <input type="number" value={attritionDice.faces} onChange={(e) => setAttritionDice({ ...attritionDice, faces: Number(e.target.value) })} className="w-8 bg-gray-900 text-center text-amber-400 font-bold border border-gray-800 rounded" />
                  <span>+</span>
                  <input type="number" value={attritionDice.mod} onChange={(e) => setAttritionDice({ ...attritionDice, mod: Number(e.target.value) })} className="w-8 bg-gray-900 text-center text-amber-400 font-bold border border-gray-800 rounded" />
                </div>
                <button 
                  onClick={() => executeRoll(attritionDice.count, attritionDice.faces, attritionDice.mod, 'Attrition')}
                  className="w-full mt-1 bg-amber-950/60 hover:bg-amber-900 text-amber-300 font-black text-xs py-2 rounded-lg transition border border-amber-800/50"
                >
                  Roll Attrition Modifier ⏳
                </button>
              </div>
            </div>

            {/* INVENTORY TRACKING LOGS WITH ASSOCIATED DICE CLASS SELECTIONS */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 shadow-lg space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-400">🎒 Dynamic Equipment Locker (Click Dice to Roll)</h3>
              
              <form onSubmit={handleAddItem} className="flex gap-1">
                <input 
                  type="text" placeholder="Item Name..." value={newItemName} onChange={(e) => setNewItemName(e.target.value)}
                  className="bg-gray-950 border border-gray-800 rounded-lg px-2 py-1 text-xs text-gray-200 focus:outline-none focus:border-emerald-500 flex-1"
                />
                <select 
                  value={newItemDie} onChange={(e) => setNewItemDie(e.target.value)}
                  className="bg-gray-950 border border-gray-800 text-xs rounded-lg px-1 text-amber-400 focus:outline-none"
                >
                  {['d4', 'd6', 'd8', 'd10', 'd12'].map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <button type="submit" className="bg-blue-600 hover:bg-blue-500 font-bold text-xs px-2.5 rounded-lg transition">+</button>
              </form>

              <div className="space-y-1.5 max-h-52 overflow-y-auto pt-1">
                {inventoryList.length === 0 ? (
                  <p className="text-xs text-gray-600 italic py-3 text-center border border-dashed border-gray-800 rounded-xl">Locker empty.</p>
                ) : (
                  inventoryList.map(item => (
                    <div key={item.id} className="flex justify-between items-center bg-gray-950 border border-gray-800 px-2.5 py-1.5 rounded-xl group">
                      <span className="text-xs font-bold text-gray-300 truncate max-w-[130px]">{item.name}</span>
                      <div className="flex gap-2 items-center">
                        <button 
                          type="button" 
                          onClick={() => rollItemDie(item.name, item.die)}
                          className="bg-blue-950 border border-blue-800 hover:border-blue-700 text-[10px] font-black uppercase text-blue-400 px-2 py-0.5 rounded shadow-sm tracking-wide transition active:scale-90"
                          title="Click to roll this weapon/armor asset die!"
                        >
                          🎲 {item.die}
                        </button>
                        <button type="button" onClick={() => handleRemoveItem(item.id)} className="text-gray-600 hover:text-red-400 font-bold text-xs transition">✕</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* CLASS TRAIT MECHANICS CARD */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 shadow-lg space-y-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 border-b border-gray-800 pb-1.5">🛡️ Active Archetype Blueprint</h3>
              <div className="text-[11px] text-gray-400 leading-relaxed space-y-2">
                <div>
                  <h4 className="font-bold text-emerald-400">Class Signature Asset</h4>
                  <p className="mt-0.5">Your primary class driver is configured to <span className="text-white font-semibold">{CLASS_DATA[classSelection].stat}</span> tracking rules. Status triggers are bound to active condition toggles.</p>
                </div>
              </div>
            </div>

            {/* EXP AND PROGRESSION CELL */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 shadow-lg flex flex-col gap-1">
              <label className="text-[10px] font-black uppercase tracking-wider text-gray-500">Session XP Progress</label>
              <input type="text" value={xp} onChange={(e) => setXp(e.target.value)} className="bg-gray-950 border border-gray-800 rounded-xl px-3 py-1 font-mono text-xs font-bold text-amber-400 focus:outline-none w-full" />
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
