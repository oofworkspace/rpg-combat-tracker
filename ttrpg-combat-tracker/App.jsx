import { useState } from 'react';

export default function App() {
  const [combatants, setCombatants] = useState([
    { id: 1, name: 'Garrick (Paladin)', initiative: 18, hp: 45, maxHp: 45, type: 'player', conditions: [] },
    { id: 2, name: 'Lyra (Wizard)', initiative: 14, hp: 28, maxHp: 28, type: 'player', conditions: [] },
    { id: 3, name: 'Goblin Warg Rider', initiative: 12, hp: 18, maxHp: 18, type: 'enemy', conditions: [] },
  ]);

  const [name, setName] = useState('');
  const [initiative, setInitiative] = useState('');
  const [hp, setHp] = useState('');
  const [type, setType] = useState('player');
  
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [round, setRound] = useState(1);
  const [hpChangeAmount, setHpChangeAmount] = useState({});

  // Sort combatants by initiative (highest first)
  const sortedCombatants = [...combatants].sort((a, b) => b.initiative - a.initiative);

  const addCombatant = (e) => {
    e.preventDefault();
    if (!name || !initiative) return;

    const newCombatant = {
      id: Date.now(),
      name,
      initiative: Number(initiative),
      hp: hp ? Number(hp) : 10,
      maxHp: hp ? Number(hp) : 10,
      type,
      conditions: []
    };

    setCombatants([...combatants, newCombatant]);
    setName('');
    setInitiative('');
    setHp('');
  };

  const deleteCombatant = (id) => {
    setCombatants(combatants.filter(c => c.id !== id));
    if (currentTurnIndex >= combatants.length - 1) {
      setCurrentTurnIndex(0);
    }
  };

  const handleHpChange = (id, direction) => {
    const amount = Number(hpChangeAmount[id] || 0);
    if (!amount) return;

    setCombatants(combatants.map(c => {
      if (c.id === id) {
        const modifier = direction === 'heal' ? amount : -amount;
        const newHp = Math.min(c.maxHp, Math.max(0, c.hp + modifier));
        return { ...c, hp: newHp };
      }
      return c;
    }));

    setHpChangeAmount({ ...hpChangeAmount, [id]: '' });
  };

  const nextTurn = () => {
    if (sortedCombatants.length === 0) return;
    if (currentTurnIndex === sortedCombatants.length - 1) {
      setCurrentTurnIndex(0);
      setRound(round + 1);
    } else {
      setCurrentTurnIndex(currentTurnIndex + 1);
    }
  };

  const prevTurn = () => {
    if (sortedCombatants.length === 0) return;
    if (currentTurnIndex === 0) {
      if (round > 1) {
        setCurrentTurnIndex(sortedCombatants.length - 1);
        setRound(round - 1);
      }
    } else {
      setCurrentTurnIndex(currentTurnIndex - 1);
    }
  };

  const resetCombat = () => {
    setCurrentTurnIndex(0);
    setRound(1);
  };

  const toggleCondition = (id, condition) => {
    setCombatants(combatants.map(c => {
      if (c.id === id) {
        const hasCondition = c.conditions.includes(condition);
        const newConditions = hasCondition 
          ? c.conditions.filter(cond => cond !== condition)
          : [...c.conditions, condition];
        return { ...c, conditions: newConditions };
      }
      return c;
    }));
  };

  const activeCombatant = sortedCombatants[currentTurnIndex];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Dashboard */}
        <header className="flex flex-col md:flex-row justify-between items-center bg-gray-800 border border-gray-700 p-6 rounded-xl shadow-lg mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r bg-emerald-400 to-teal-500">
              ⚔️ TTRPG Combat Tracker
            </h1>
            <p className="text-gray-400 text-sm mt-1">Manage initiative, health, and statuses flawlessly.</p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-center bg-gray-950 px-4 py-2 rounded-lg border border-gray-700">
              <span className="text-xs uppercase tracking-wider text-gray-500 block">Round</span>
              <span className="text-2xl font-black text-amber-400">{round}</span>
            </div>
            <div className="text-center bg-gray-950 px-4 py-2 rounded-lg border border-gray-700 min-w-[140px]">
              <span className="text-xs uppercase tracking-wider text-gray-500 block">Active Turn</span>
              <span className="text-lg font-bold text-emerald-400 truncate block max-w-[150px]">
                {activeCombatant ? activeCombatant.name : 'No one'}
              </span>
            </div>
            <div className="flex gap-2">
              <button onClick={prevTurn} className="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg text-sm font-medium transition">⏮ Back</button>
              <button onClick={nextTurn} className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg text-sm font-bold transition shadow-md shadow-emerald-900/30">Next Turn ⏭</button>
              <button onClick={resetCombat} className="bg-rose-950 hover:bg-rose-900 text-rose-300 px-3 py-2 rounded-lg text-sm transition border border-rose-800/50">Reset</button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Add Character Form */}
          <div className="bg-gray-800 border border-gray-700 p-6 rounded-xl shadow-md h-fit">
            <h2 className="text-xl font-bold mb-4 text-gray-200 border-b border-gray-700 pb-2">➕ Add Combatant</h2>
            <form onSubmit={addCombatant} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1 font-semibold">Character Name</label>
                <input 
                  type="text" value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aragorn, Orc Chieftain" 
                  className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500 text-gray-200"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1 font-semibold">Initiative Roll</label>
                  <input 
                    type="number" value={initiative} onChange={(e) => setInitiative(e.target.value)}
                    placeholder="15" 
                    className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500 text-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1 font-semibold">Max HP (Optional)</label>
                  <input 
                    type="number" value={hp} onChange={(e) => setHp(e.target.value)}
                    placeholder="35" 
                    className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500 text-gray-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2 font-semibold">Faction Alignment</label>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    type="button" onClick={() => setType('player')}
                    className={`py-2 text-sm font-bold rounded-lg border transition ${type === 'player' ? 'bg-blue-900/40 text-blue-400 border-blue-500' : 'bg-gray-950 text-gray-500 border-gray-700 hover:border-gray-600'}`}
                  >
                    Friendly / Player
                  </button>
                  <button 
                    type="button" onClick={() => setType('enemy')}
                    className={`py-2 text-sm font-bold rounded-lg border transition ${type === 'enemy' ? 'bg-red-900/40 text-red-400 border-red-500' : 'bg-gray-950 text-gray-500 border-gray-700 hover:border-gray-600'}`}
                  >
                    Hostile / Monster
                  </button>
                </div>
              </div>

              <button type="submit" className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-2.5 rounded-lg transition shadow-md mt-2">
                Roll Into Initiative
              </button>
            </form>
          </div>

          {/* Right Column: Active Initiative Queue */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex justify-between items-center px-2 mb-2">
              <h2 className="text-xl font-bold text-gray-200">⚔️ Turn Order</h2>
              <span className="text-xs text-gray-400 bg-gray-800 border border-gray-700 px-2 py-1 rounded-md">{sortedCombatants.length} Entities Active</span>
            </div>

            {sortedCombatants.length === 0 ? (
              <div className="bg-gray-800/50 border border-dashed border-gray-700 rounded-xl p-12 text-center text-gray-500">
                <p className="text-lg font-medium mb-1">The battlefield is quiet...</p>
                <p className="text-sm">Add characters on the left to start the encounter.</p>
              </div>
            ) : (
              sortedCombatants.map((combatant, index) => {
                const isActive = index === currentTurnIndex;
                const isDead = combatant.hp <= 0;
                const hpPercent = (combatant.hp / combatant.maxHp) * 100;

                return (
                  <div 
                    key={combatant.id}
                    className={`relative overflow-hidden bg-gray-800 border rounded-xl p-4 transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 ${isActive ? 'ring-2 ring-emerald-500 border-transparent shadow-lg bg-gray-800/90 transform -translate-y-0.5' : 'border-gray-700 shadow-sm opacity-80'}`}
                  >
                    {/* Active Turn indicator accent line */}
                    {isActive && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500" />}

                    {/* Left details */}
                    <div className="flex items-center gap-4 min-w-[220px]">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-black text-lg border ${combatant.type === 'player' ? 'bg-blue-950 border-blue-800 text-blue-400' : 'bg-red-950 border-red-800 text-red-400'}`}>
                        {combatant.initiative}
                      </div>
                      
                      <div>
                        <h3 className={`font-bold text-base flex items-center gap-2 ${isDead ? 'line-through text-gray-500' : 'text-gray-100'}`}>
                          {combatant.name}
                          {isDead && <span className="text-xs px-1.5 py-0.5 rounded bg-red-950/80 border border-red-900 text-red-400 font-normal normal-case">💀 Down</span>}
                        </h3>
                        
                        {/* Status Tags */}
                        <div className="flex flex-wrap gap-1 mt-1">
                          {['Stunned', 'Blinded', 'Poisoned'].map(cond => {
                            const active = combatant.conditions.includes(cond);
                            return (
                              <button 
                                key={cond} onClick={() => toggleCondition(combatant.id, cond)}
                                className={`text-[10px] font-bold px-1.5 py-0.5 rounded transition ${active ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'bg-gray-950 text-gray-600 border border-transparent hover:border-gray-700'}`}
                              >
                                {cond}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Center HP Status Bar */}
                    <div className="flex-1 max-w-xs">
                      <div className="flex justify-between text-xs font-semibold text-gray-400 mb-1">
                        <span>Health Points</span>
                        <span className={combatant.hp < combatant.maxHp * 0.3 ? 'text-red-400 font-bold' : 'text-gray-300'}>
                          {combatant.hp} / {combatant.maxHp} HP
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-gray-950 rounded-full border border-gray-800 overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-300 ${combatant.type === 'player' ? 'bg-blue-500' : 'bg-gradient-to-r from-red-600 to-rose-500'}`}
                          style={{ width: `${hpPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Right interactive actions */}
                    <div className="flex items-center justify-between md:justify-end gap-3 border-t md:border-t-0 border-gray-700 pt-3 md:pt-0">
                      <div className="flex items-center gap-1.5 bg-gray-950 p-1 rounded-lg border border-gray-700">
                        <input 
                          type="number" 
                          placeholder="Amt"
                          value={hpChangeAmount[combatant.id] || ''}
                          onChange={(e) => setHpChangeAmount({ ...hpChangeAmount, [combatant.id]: e.target.value })}
                          className="w-12 bg-transparent text-center text-sm font-bold focus:outline-none text-gray-200"
                        />
                        <button onClick={() => handleHpChange(combatant.id, 'dmg')} className="bg-red-900/60 hover:bg-red-800 text-red-200 text-xs font-bold px-2 py-1 rounded transition">Dmg</button>
                        <button onClick={() => handleHpChange(combatant.id, 'heal')} className="bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 text-xs font-bold px-2 py-1 rounded transition">Heal</button>
                      </div>

                      <button 
                        onClick={() => deleteCombatant(combatant.id)} 
                        className="text-gray-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-gray-950 transition text-sm"
                        title="Delete combatant"
                      >
                        ❌
                      </button>
                    </div>

                  </div>
                );
              })
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
