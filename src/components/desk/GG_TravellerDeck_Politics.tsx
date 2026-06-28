import React, { useState } from 'react';
import { useTTStore } from '../../store/useTTStore';
import { GG_TravellerDeck_Header } from './GG_TravellerDeck_Header';
import { FONT, type SubPage } from '../../lib/uiConstants';

interface Props {
  setSubPage: (p: SubPage) => void;
  popPage: () => void;
  triggerFeedback: (msg: string) => void;
}

interface Decree {
  id: string;
  title: string;
  icon: string;
  effect: string;
  cost: number;
  votesFor: number;
  votesAgainst: number;
}

export const GG_TravellerDeck_Politics: React.FC<Props> = ({
  setSubPage,
  popPage,
  triggerFeedback,
}) => {
  const { coins, spendCoins, addLegacy, legacyPoints } = useTTStore();

  const [decrees, setDecrees] = useState<Decree[]>([
    {
      id: 'purity-act',
      title: 'Cacao Purity Standards Act',
      icon: '🌿',
      effect: 'Ensures organic 99.8% grade chocolate countywide. Boosts Explorer XP gains by 15%.',
      cost: 15,
      votesFor: 142,
      votesAgainst: 34
    },
    {
      id: 'monorail-subsidy',
      title: 'Monorail Transit Subsidy Bill',
      icon: '🚂',
      effect: 'Funnels treasury funds to Monorail speed boosts. Shaves 20% off all travel times.',
      cost: 25,
      votesFor: 210,
      votesAgainst: 12
    },
    {
      id: 'curfew-decree',
      title: 'Canopy Quiet Hours Decree',
      icon: '🌙',
      effect: 'Enforces night curfews on forest paths. Boosts Healer study efficiency by +10 XP.',
      cost: 10,
      votesFor: 65,
      votesAgainst: 88
    }
  ]);

  const [votedDecrees, setVotedDecrees] = useState<string[]>(() => {
    const saved = localStorage.getItem('tt_voted_decrees');
    return saved ? JSON.parse(saved) : [];
  });

  const [petitionSigned, setPetitionSigned] = useState<boolean>(() => {
    return localStorage.getItem('tt_petition_signed') === 'true';
  });

  const handleVote = (decreeId: string, support: boolean) => {
    if (votedDecrees.includes(decreeId)) {
      triggerFeedback('❌ You have already cast your vote on this active decree!');
      return;
    }

    const decree = decrees.find(d => d.id === decreeId);
    if (!decree) return;

    if (coins < decree.cost) {
      triggerFeedback(`❌ casting a vote requires a ${decree.cost} Coin administrative stamp fee!`);
      return;
    }

    if (spendCoins(decree.cost, `Cast Vote: ${decree.title}`)) {
      setDecrees(prev => prev.map(d => {
        if (d.id === decreeId) {
          return {
            ...d,
            votesFor: support ? d.votesFor + 1 : d.votesFor,
            votesAgainst: !support ? d.votesAgainst + 1 : d.votesAgainst
          };
        }
        return d;
      }));

      const nextVotes = [...votedDecrees, decreeId];
      setVotedDecrees(nextVotes);
      localStorage.setItem('tt_voted_decrees', JSON.stringify(nextVotes));
      addLegacy(25);
      triggerFeedback(`🏛️ Vote cast successfully! Added +25 Legacy Standing.`);
    }
  };

  const handleSignPetition = () => {
    if (petitionSigned) return;
    if (coins < 50) {
      triggerFeedback('❌ Filing a civic proposal requires 50 Coins for municipal review stamps!');
      return;
    }

    if (spendCoins(50, 'Filed Civic Proposal: Pave Canopy Sidewalks')) {
      setPetitionSigned(true);
      localStorage.setItem('tt_petition_signed', 'true');
      addLegacy(120);
      triggerFeedback('📜 Civic proposal submitted to Council Assembly! Earned +120 Legacy Standing.');
    }
  };

  return (
    <div className="w-full flex-grow flex flex-col min-h-0 overflow-hidden text-white font-sans">
      <GG_TravellerDeck_Header
        title="🏛️ TOWN COUNCIL CHAMBER"
        setSubPage={setSubPage}
        popPage={popPage}
      />

      <div className="flex-grow min-h-0 overflow-y-auto custom-scrollbar grid grid-cols-1 xl:grid-cols-3 gap-5 py-3 pr-1">
        
        {/* LEFT PANEL: Active Ordinances */}
        <div className="bg-black/60 border border-amber-500/20 rounded-[2rem] p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden backdrop-blur-md">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-400 block mb-2">Legislative Docket</span>
            <h3 className="text-xl font-brand text-white uppercase mb-3" style={{ fontFamily: FONT }}>
              Active Decrees
            </h3>
            
            <p className="text-xs text-neutral-350 leading-relaxed font-sans mb-4 italic bg-white/5 border border-white/5 p-3 rounded-2xl">
              "Support or oppose active legislation by funding administrative stamp seals. Votes influence provincial standing."
            </p>

            <div className="space-y-3.5">
              {decrees.map((dec) => {
                const alreadyVoted = votedDecrees.includes(dec.id);
                return (
                  <div key={dec.id} className="p-3.5 bg-neutral-900/60 border border-white/5 rounded-2xl flex flex-col gap-2.5 text-xs">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{dec.icon}</span>
                        <span className="font-bold text-white leading-tight">{dec.title}</span>
                      </div>
                      <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-lg text-[8.5px] font-mono">
                        {dec.cost}🪙 Fee
                      </span>
                    </div>
                    <p className="text-[10.5px] text-neutral-300/90 leading-normal">{dec.effect}</p>
                    
                    <div className="flex items-center justify-between border-t border-white/5 pt-2">
                      <div className="text-[9px] text-neutral-400 font-mono">
                        <span>For: {dec.votesFor}</span>
                        <span className="mx-1.5">|</span>
                        <span>Against: {dec.votesAgainst}</span>
                      </div>

                      {alreadyVoted ? (
                        <span className="text-[8.5px] uppercase font-bold text-emerald-400 tracking-wider">
                          Vote Logged ✓
                        </span>
                      ) : (
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => handleVote(dec.id, true)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[9px] font-bold uppercase transition"
                          >
                            For 👍
                          </button>
                          <button
                            onClick={() => handleVote(dec.id, false)}
                            className="px-2.5 py-1 bg-red-800 hover:bg-red-700 text-white rounded-lg text-[9px] font-bold uppercase transition"
                          >
                            Against 👎
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-2 border-t border-white/10 text-[9.5px] text-neutral-450 italic">
            *Dues compliance checks apply to all voters.
          </div>
        </div>

        {/* MIDDLE PANEL: Submit Proposals */}
        <div className="bg-black/60 border border-amber-500/20 rounded-[2rem] p-6 flex flex-col justify-between shadow-2xl backdrop-blur-md">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-pink-400 block mb-2">Civic Petitions</span>
            <h3 className="text-xl font-brand text-white uppercase mb-3" style={{ fontFamily: FONT }}>
              Neighborhood upgrade
            </h3>

            <div className="p-4 bg-gradient-to-br from-purple-950/20 via-purple-900/10 to-stone-900 border border-purple-500/20 rounded-2xl text-center space-y-3">
              <span className="text-4xl block">🍁</span>
              <h5 className="font-bold text-white text-sm">Pave Mossberry Canopy Sidewalks</h5>
              <p className="text-xs text-neutral-350 leading-relaxed font-sans">
                Submit an official request to pave the high walkways with anti-slip cedar bark. Reduces resident minor fall injuries and boosts builder standing!
              </p>
            </div>

            <div className="p-3 bg-black/40 border border-white/5 rounded-2xl text-xs space-y-2 mt-4">
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Proposal Stamp Cost:</span>
                <span className={`font-mono font-bold ${coins >= 50 ? 'text-emerald-400' : 'text-red-400'}`}>
                  🪙 50 Coins {coins >= 50 ? '✓' : `(${coins} owned)`}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Yield Reward:</span>
                <span className="text-amber-400 font-bold">🎖️ +120 Legacy Standing</span>
              </div>
            </div>

            <button
              onClick={handleSignPetition}
              disabled={petitionSigned || coins < 50}
              className={`w-full py-3 rounded-2xl font-brand font-black uppercase text-[10px] tracking-wider transition mt-4 ${
                petitionSigned
                  ? 'bg-emerald-650/25 border border-emerald-500/20 text-emerald-400/60 cursor-not-allowed'
                  : coins >= 50
                    ? 'bg-pink-600 hover:bg-pink-500 text-white shadow-glow cursor-pointer'
                    : 'bg-neutral-800 text-white/40 cursor-not-allowed border border-white/5'
              }`}
              style={{ fontFamily: '"Josefin Sans", sans-serif' }}
            >
              {petitionSigned ? '📜 Proposal Submitted!' : '🚀 Submit Civic Proposal (50🪙)'}
            </button>
          </div>

          <div className="text-[10px] text-white/45 text-center border-t border-white/5 pt-3">
            Treasury Ledger Account Status: Verified
          </div>
        </div>

        {/* RIGHT PANEL: Assembly Records */}
        <div className="bg-black/60 border border-amber-500/20 rounded-[2rem] p-6 flex flex-col justify-between shadow-2xl backdrop-blur-md">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-cyan-400 block mb-2">Voter Registry</span>
            <h3 className="text-xl font-brand text-white uppercase mb-3" style={{ fontFamily: FONT }}>
              Voter Credentials
            </h3>

            <div className="space-y-4 text-xs font-sans">
              <div className="p-3 bg-white/5 border border-white/5 rounded-2xl space-y-2">
                <div className="flex justify-between items-center border-b border-white/5 pb-1.5">
                  <span className="text-neutral-450">Active Standings:</span>
                  <span className="text-white font-bold">{legacyPoints} Legacy Points</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-450">Chamber Privileges:</span>
                  <span className="text-emerald-400 font-bold">Standard Voting Power</span>
                </div>
              </div>

              <div className="p-3 bg-white/5 border border-white/5 rounded-2xl space-y-2">
                <span className="text-[9px] font-black uppercase text-neutral-450 block">Legislative Guidelines</span>
                <p className="text-[10.5px] text-neutral-350 leading-relaxed italic">
                  "Every citizen holds a voice in Ganache Grove. Council meetings take place every first Cocoawood Tuesday. Keep walkways safe, support local businesses, and register your presence."
                </p>
              </div>

              <div className="p-3.5 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl flex items-center gap-3">
                <span className="text-2xl">⚖️</span>
                <div>
                  <h6 className="font-bold text-white text-xs leading-none">Voter Standing Status</h6>
                  <p className="text-[9.5px] text-white/55 mt-1">Voters are entitled to receive community dispatches hourly.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-2 border-t border-white/5 text-center text-[10px] text-white/30 shrink-0">
            "Justice, sweetness, and equity under the canopy."
          </div>
        </div>

      </div>
    </div>
  );
};
