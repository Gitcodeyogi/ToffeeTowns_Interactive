const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/pages/TravellersDesk.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Fix the top part around skillEmoji
// Wait, we should use a safer regex that doesn't care about the exact corrupted characters on the line
const targetTopRegex = /const skillGrad: Record<string,string> = \{ builder:'from-orange-500 to-amber-400', explorer:'from-cyan-500 to-teal-400', healer:'from-pink-500 to-rose-400' \};\s*const skillEmoji: Record<string,string> = \{ builder:'[^\n]*\{!showCanalAssignment \? \(/;

const replacementTop = `const skillGrad: Record<string,string> = { builder:'from-orange-500 to-amber-400', explorer:'from-cyan-500 to-teal-400', healer:'from-pink-500 to-rose-400' };
          const skillEmoji: Record<string,string> = { builder:'🔨', explorer:'🧭', healer:'🌿' };
          const isCompleted = completedSeriesSteps.includes(currentSeriesStep.id);

          return (
            <div className="absolute inset-0 bg-black/85 flex items-center justify-center z-[230] p-4 select-none animate-fade-in">
              <div className="relative bg-[#0a0a0c]/90 border border-white/10 rounded-3xl h-[90vh] w-[95vw] max-w-7xl overflow-hidden flex shadow-2xl">
                {!showCanalAssignment ? (`;

if (targetTopRegex.test(content)) {
  console.log('Found top target pattern!');
  content = content.replace(targetTopRegex, replacementTop);
} else {
  console.error('Could not find top target pattern in TravellersDesk.tsx!');
}

// 2. Fix the bottom duplicated button/div block
const targetBottomSearch = `                    {/* Floating Toggle handle on the right edge of assignment page */}
                    <button
                      onClick={() => setShowCanalAssignment(false)}
                      className="absolute right-0 top-1/2 transform -translate-y-1/2 w-6 h-32 rounded-l-full border-y border-l border-emerald-500/30 bg-[#111116] flex flex-col items-center justify-between py-3.5 shadow-[0_0_20px_rgba(52,211,153,0.15)] cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 z-50 animate-fade-in"
                      title="Back to Story Cinematic"
                    >
                      <span className="text-[10px] text-emerald-400">📖</span>
                      <div className="flex flex-col items-center gap-1 font-black text-[9px] tracking-wider text-emerald-400 font-mono">
                        <span>S</span>
                        <span>T</span>
                        <span>O</span>
                        <span>R</span>
                        <span>Y</span>
                      </div>
                      <span className="text-[10px] text-emerald-400">◀</span>
                    </button>

                  </div>
                )}           </button>
                              </div>
                            )}
                          </div>
                        )}

                      </div>
                    </div>

                    {/* Floating Toggle handle on the right edge of assignment page */}
                    <button
                      onClick={() => setShowCanalAssignment(false)}
                      className="absolute right-0 top-1/2 transform -translate-y-1/2 w-6 h-32 rounded-l-full border-y border-l border-emerald-500/30 bg-[#111116] flex flex-col items-center justify-between py-3.5 shadow-[0_0_20px_rgba(52,211,153,0.15)] cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 z-50"
                      title="Back to Story Cinematic"
                    >
                      <span className="text-[10px] text-emerald-400">📖</span>
                      <div className="flex flex-col items-center gap-1 font-black text-[9px] tracking-wider text-emerald-400 font-mono">
                        <span>S</span>
                        <span>T</span>
                        <span>O</span>
                        <span>R</span>
                        <span>Y</span>
                      </div>
                      <span className="text-[10px] text-emerald-400">◀</span>
                    </button>

                  </div>
                )}`;

const replacementBottom = `                    {/* Floating Toggle handle on the right edge of assignment page */}
                    <button
                      onClick={() => setShowCanalAssignment(false)}
                      className="absolute right-0 top-1/2 transform -translate-y-1/2 w-6 h-32 rounded-l-full border-y border-l border-emerald-500/30 bg-[#111116] flex flex-col items-center justify-between py-3.5 shadow-[0_0_20px_rgba(52,211,153,0.15)] cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 z-50 animate-fade-in"
                      title="Back to Story Cinematic"
                    >
                      <span className="text-[10px] text-emerald-400">📖</span>
                      <div className="flex flex-col items-center gap-1 font-black text-[9px] tracking-wider text-emerald-400 font-mono">
                        <span>S</span>
                        <span>T</span>
                        <span>O</span>
                        <span>R</span>
                        <span>Y</span>
                      </div>
                      <span className="text-[10px] text-emerald-400">◀</span>
                    </button>

                  </div>
                )}`;

const normalize = str => str.replace(/\r\n/g, '\n').trim();

// Convert content to unified LF for matching
content = content.replace(/\r\n/g, '\n');
const targetSplit = targetBottomSearch.replace(/\r\n/g, '\n');
const replacementSplit = replacementBottom.replace(/\r\n/g, '\n');

if (content.includes(targetSplit)) {
  console.log('Found bottom target pattern!');
  content = content.replace(targetSplit, replacementSplit);
} else {
  console.error('Could not find bottom target pattern in TravellersDesk.tsx!');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated TravellersDesk.tsx!');
