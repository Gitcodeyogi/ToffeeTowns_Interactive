/* eslint-disable react-hooks/purity */
import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { useTTStore } from '../store/useTTStore';

const FONT_BRAND = '"Luckiest Guy", cursive';
const FONT_BODY = '"Josefin Sans", sans-serif';

interface ChatMessage {
  id: string;
  sender: 'cocoa' | 'user';
  text: string;
  date: string;
}

const HARSH_WORDS = [
  'fuck', 'shit', 'damn', 'bitch', 'bastard', 'hate', 'stupid', 'jerk',
  'fool', 'idiot', 'asshole', 'crap', 'dick', 'suck', 'useless', 'worst',
  'garbage', 'trash', 'horrible', 'shut up', 'kill', 'die', 'dumb'
];

const SUGGESTIONS = [
  { text: 'What are Cocoa Coins?', query: 'coin' },
  { text: 'How do I relocate to another town?', query: 'relocate' },
  { text: 'Tell me about Ganache Grove!', query: 'ganache' },
  { text: 'Who is Pipkin Nutterby?', query: 'pipkin' },
  { text: 'What was the Honeyberry Loaf Incident?', query: 'honeyberry' },
  { text: 'How does the living town logic work?', query: 'logic' }
];

interface BotResult {
  text: string;
  nextTopic: string | null;
}

const getBotResponse = (input: string, lastTopic: string | null): BotResult => {
  const text = input.toLowerCase().trim();

  // 1. COIN TOPIC
  if (lastTopic === 'coin') {
    if (text.includes('start') || text.includes('purse') || text.includes('pocket') || text.includes('how many')) {
      return {
        text: `Wallet details:
*   🪙 **Starter Purse**: 200 Cocoa Coins.
*   🎒 **Stash**: Placed directly in your passport.`,
        nextTopic: 'coin'
      };
    }
    if (text.includes('earn') || text.includes('get') || text.includes('make') || text.includes('reward')) {
      return {
        text: `How to earn more:
*   🧁 **Baking Recipes**: Balancing ingredients.
*   🧪 **Apothecary**: Running safety checks.
*   📰 **Gazette**: Answering daily riddles.`,
        nextTopic: 'coin'
      };
    }
    if (text.includes('bankrupt') || text.includes('run out') || text.includes('zero') || text.includes('buy')) {
      return {
        text: `If you run out of funds:
*   🏛️ **Imperial Treasury**: Guides you back.
*   💳 **Treasury Shop**: Recharge pocket coins.`,
        nextTopic: 'coin'
      };
    }
  }

  // 2. RELOCATION TOPIC
  if (lastTopic === 'relocate') {
    if (text.includes('rank') || text.includes('level') || text.includes('xp')) {
      return {
        text: `Citizenship demands:
*   🏅 **Rank**: Citizen Level 3.
*   ✨ **Requirement**: 3,000+ total skill XP.`,
        nextTopic: 'relocate'
      };
    }
    if (text.includes('fee') || text.includes('cost') || text.includes('price')) {
      return {
        text: `Relocation invoice:
*   🪙 **Guild Processing Fee**: 15 Coins.
*   💰 **Charge**: Deducted on authorization.`,
        nextTopic: 'relocate'
      };
    }
    if (text.includes('how') || text.includes('choose') || text.includes('where') || text.includes('step')) {
      return {
        text: `Relocation process:
*   🖥️ **Desk**: Click the Relocate button.
*   🏘️ **Selector**: Choose a new town layout.`,
        nextTopic: 'relocate'
      };
    }
  }

  // 3. GANACHE GROVE TOPIC
  if (lastTopic === 'ganache') {
    if (text.includes('canopy') || text.includes('tree')) {
      return {
        text: `Ganache Grove Canopy:
*   🌳 **Trees**: Giant chocolate cacao trees.
*   ☀️ **Sunlight**: Warm golden chocolate glow.`,
        nextTopic: 'ganache'
      };
    }
    if (text.includes('special') || text.includes('famous') || text.includes('product')) {
      return {
        text: `Our local specialties:
*   🍫 **Mirror-Finish**: Chocolate coating.
*   🧪 **Glaze Extracts**: Pure flavor drops.`,
        nextTopic: 'ganache'
      };
    }
    if (text.includes('matter') || text.includes('work') || text.includes('current')) {
      return {
        text: `Active community projects:
*   🌊 **River dredging**: Keeping path open.
*   🐌 **Snail sanctuary**: Glowcap shelter.
*   🍞 **Mortimer's Loaf**: Honeyberry search.`,
        nextTopic: 'ganache'
      };
    }
  }

  // 4. PIPKIN NUTTERBY TOPIC
  if (lastTopic === 'pipkin') {
    if (text.includes('mischief') || text.includes('swipe') || text.includes('loaf')) {
      return {
        text: `Pipkin's prank:
*   🍞 **Stolen Loaf**: Mortimer's honeyberry bread.
*   🏃 **Chase**: Ran off to the canopy pathways.`,
        nextTopic: 'pipkin'
      };
    }
    if (text.includes('intent') || text.includes('why') || text.includes('reason')) {
      return {
        text: `Pipkin's motive:
*   🌳 **Elder Tree**: Feed hungry wood sprites.
*   🌸 **Intent**: Friendly help, no malice meant!`,
        nextTopic: 'pipkin'
      };
    }
    if (text.includes('hero') || text.includes('friend') || text.includes('accidental')) {
      return {
        text: `Accidental hero status:
*   🤝 **Resolution**: The town forgave his mischief.
*   ✨ **Helper**: Helps volunteers with wood-gathering.`,
        nextTopic: 'pipkin'
      };
    }
  }

  // 5. HONEYBERRY INCIDENT TOPIC
  if (lastTopic === 'honeyberry') {
    if (text.includes('missing') || text.includes('day 1')) {
      return {
        text: `Day 1 Incident:
*   🍞 **Masterpiece**: The loaf disappears.
*   📋 **Volunteers**: Rowan organizes crews.`,
        nextTopic: 'honeyberry'
      };
    }
    if (text.includes('chase') || text.includes('day 2') || text.includes('day 3') || text.includes('day 4')) {
      return {
        text: `Days 2-4 Chase:
*   🌳 **Day 2**: Branches confrontation.
*   🌊 **Day 3**: Waterway pursuit.
*   🌲 **Day 4**: Elder Tree resolution.`,
        nextTopic: 'honeyberry'
      };
    }
    if (text.includes('feast') || text.includes('day 5') || text.includes('end')) {
      return {
        text: `Day 5 Resolution:
*   🎪 **Festival**: Town square gathering.
*   🍓 **Feast**: Eating honeyberry slices and crowning Pipkin.`,
        nextTopic: 'honeyberry'
      };
    }
  }

  // 6. LIVING CANOPY LOGIC TOPIC
  if (lastTopic === 'logic') {
    if (text.includes('cycle') || text.includes('how') || text.includes('step')) {
      return {
        text: `Incident Cycle:
*   💥 **Incident**: A new event occurs.
*   📢 **Reaction**: Residents react.
*   🌱 **Evolution**: Your help triggers change.`,
        nextTopic: 'logic'
      };
    }
    if (text.includes('volunteer') || text.includes('help') || text.includes('items')) {
      return {
        text: `How you help:
*   🛠️ **Inventory**: Submitting crafted items.
*   🪙 **Coins**: Sponsoring town logistics.`,
        nextTopic: 'logic'
      };
    }
    if (text.includes('consequence') || text.includes('result') || text.includes('chain')) {
      return {
        text: `Living consequences:
*   📈 **State**: Changes the town permanently.
*   🔄 **Chapters**: Triggers the next episode.`,
        nextTopic: 'logic'
      };
    }
  }

  // General entry queries
  if (text.includes('coin') || text.includes('money') || text.includes('wallet') || text.includes('purse') || text.includes('price')) {
    return {
      text: `Oh, Cocoa Coins! 🪙
Sweet local currency. What would you like to verify?
*   (**start**): starter purse details
*   (**earn**): how to accumulate coins
*   (**bankrupt**): what to do if you run out`,
      nextTopic: 'coin'
    };
  }

  if (text.includes('relocat') || text.includes('move') || text.includes('hometown') || text.includes('choose')) {
    return {
      text: `Moving to a new town? How exciting! 🏘️
What would you like to verify?
*   (**rank**): rank requirement
*   (**fee**): relocation fee
*   (**how**): desk relocation process`,
      nextTopic: 'relocate'
    };
  }

  if (text.includes('ganache') || text.includes('grove')) {
    return {
      text: `Welcome to **Ganache Grove**! 🌳🍫
What would you like to verify?
*   (**canopy**): giant chocolate canopy details
*   (**special**): famous local specialties
*   (**matter**): active community matters`,
      nextTopic: 'ganache'
    };
  }

  if (text.includes('pipkin') || text.includes('nutterby') || text.includes('sprite')) {
    return {
      text: `Ah, **Pipkin Nutterby**! 🐿️
What would you like to verify?
*   (**mischief**): Mortimer's missing loaf pranks
*   (**intent**): his forest sprite intentions
*   (**hero**): Accidental Hero resolution`,
      nextTopic: 'pipkin'
    };
  }

  if (text.includes('honeyberry') || text.includes('incident') || text.includes('loaf') || text.includes('mortimer')) {
    return {
      text: `The **Honeyberry Loaf Incident**! 🫐
What would you like to verify?
*   (**missing**): Mortimer's missing masterpiece
*   (**chase**): canopy and waterway chase
*   (**feast**): Day 5 square festival feast`,
      nextTopic: 'honeyberry'
    };
  }

  if (text.includes('logic') || text.includes('living') || text.includes('blueprint') || text.includes('consequence') || text.includes('chain')) {
    return {
      text: `Our town runs on a **Living Canopy Blueprint**! 🌳
What would you like to verify?
*   (**cycle**): how events evolve
*   (**volunteer**): how you participate
*   (**consequence**): permanent passport records`,
      nextTopic: 'logic'
    };
  }

  if (text.includes('name') || text.includes('who are you') || text.includes('who is this') || text.includes('whats your name')) {
    return {
      text: `Hey, I am Cocoa! 🌸 How is my name? Pretty sweet, isn't it?
*   **Role**: Dedicated lore advisor & companion 🍫
*   **Prompt**: What would you like to verify today?`,
      nextTopic: null
    };
  }

  if (text.includes('how are you') || text.includes('how is it going') || text.includes('how\'s it going') || text.includes('how do you do')) {
    return {
      text: `I'm doing wonderful, thank you! 🌸
*   **Status**: Stir-mixing my chocolate thoughts.
*   **Prompt**: How are you doing today, companion?`,
      nextTopic: null
    };
  }

  if (text.includes('hello') || text.includes('hi') || text.includes('hey') || text.includes('greetings')) {
    return {
      text: `Hey there, my dear companion! 🌸 How is my name? Pretty sweet, isn't it?
*   **Status**: Ready to guide you.
*   **Prompt**: What shall we talk about? 🍫`,
      nextTopic: null
    };
  }

  if (text.includes('help') || text.includes('what can you do') || text.includes('question')) {
    return {
      text: `I'm here to guide you patiently! 🌸
You can ask me about:
*   🪙 **Coins** (allowances)
*   🏘️ **Relocating** (moving rules)
*   🌳 **Ganache Grove** (landmarks)
*   🐿️ **Pipkin** (the accidental hero)
*   🫐 **Honeyberry Incident** (synopsis)
*   🔄 **Living Town Blueprint** (cycle)

What shall we explore, traveller? 🍫`,
      nextTopic: null
    };
  }

  if (text.includes('thank') || text.includes('thanks') || text.includes('appreciate') || text.includes('good bot')) {
    return {
      text: `Oh, you are very welcome! 🌸
*   **Status**: It makes my heart warm to help! ✨`,
      nextTopic: null
    };
  }

  return {
    text: `Oh, that is a lovely question! 🌸
While I'm still learning county secrets, ask me about:
*   🪙 **Coins**
*   🏘️ **Relocating**
*   🌳 **Ganache Grove**
*   🐿️ **Pipkin**`,
    nextTopic: null
  };
};

const CocoaChatPage: React.FC = () => {
  const { coins, setPage } = useTTStore();
  const [lastTopic, setLastTopic] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'cocoa',
      text: `Hey, I am Cocoa! 🌸 How is my name? Pretty sweet, isn't it?
*   **Role**: Dedicated lore advisor & companion 🍫
*   **Topics**: Coins 🪙, relocation 🏘️, Ganache Grove 🌳, Pipkin 🐿️.

How can I help you today? ✨`,
      date: new Date().toLocaleTimeString()
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim() || isThinking) return;

    // Check for harsh words
    const lowerText = textToSend.toLowerCase();
    const containsHarsh = HARSH_WORDS.some(word => lowerText.includes(word));

    const userMsg: ChatMessage = {
      id: 'msg-' + Math.random().toString(36).slice(2),
      sender: 'user',
      text: textToSend,
      date: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');

    if (containsHarsh) {
      setIsThinking(true);
      setTimeout(() => {
        const warningMsg: ChatMessage = {
          id: 'msg-' + Math.random().toString(36).slice(2),
          sender: 'cocoa',
          text: `I think we can chat later, I need a break... 🌸`,
          date: new Date().toLocaleTimeString()
        };
        setMessages(prev => [...prev, warningMsg]);
        setIsThinking(false);

        // Redirect back to desk after a brief delay
        setTimeout(() => {
          setPage('desk');
        }, 2000);
      }, 1000);
      return;
    }

    setIsThinking(true);
    setTimeout(() => {
      const botResult = getBotResponse(textToSend, lastTopic);
      setLastTopic(botResult.nextTopic);
      const botMsg: ChatMessage = {
        id: 'msg-' + Math.random().toString(36).slice(2),
        sender: 'cocoa',
        text: botResult.text,
        date: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, botMsg]);
      setIsThinking(false);
    }, 1200);
  };

  return (
    <div className="h-full w-full flex items-center justify-center p-6 select-none relative font-sans text-white bg-black/60">
      
      {/* ── MAIN LAYOUT CONTAINER (Pink shaded glass panel - trimmed and zero-blur) ── */}
      <div className="w-full max-w-[960px] h-[580px] max-h-[85vh] rounded-[2rem] border border-pink-500/30 bg-black/60 p-5 flex flex-col justify-between overflow-hidden shadow-[0_24px_80px_rgba(244,63,94,0.25)] relative animate-fade-in">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-pink-500/10 pb-3.5 shrink-0">
          <button
            onClick={() => setPage('desk')}
            className="px-4 py-1.5 bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 text-pink-300 rounded-full text-xs font-black uppercase tracking-wider transition duration-200"
            style={{ fontFamily: FONT_BODY }}
          >
            🏠 Back to Desk
          </button>
          <h2 className="text-xl font-brand text-pink-300 uppercase tracking-wider flex items-center gap-2" style={{ fontFamily: FONT_BRAND }}>
            💬 Cocoa Chat
          </h2>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-pink-950/45 border border-pink-500/20 rounded-full text-xs font-semibold text-pink-300">
            🪙 {coins} Coins
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-grow mt-3 flex flex-row gap-5 overflow-hidden min-h-0 w-full">
          
          {/* LEFT: Bot introduction & Suggestions */}
          <div className="w-[320px] shrink-0 h-full flex flex-col justify-between border border-pink-500/10 bg-black/25 rounded-3xl p-5 overflow-y-auto custom-scrollbar">
            <div className="space-y-4">
              <div>
                <span className="text-[9px] font-black uppercase tracking-[0.25em] text-pink-400 block">Companion Lore Advisor</span>
                <h3 className="text-base font-brand text-pink-100 uppercase mt-0.5" style={{ fontFamily: FONT_BRAND }}>
                  Meet Cocoa
                </h3>
              </div>
              
              <div className="p-3 bg-pink-950/10 border border-pink-500/10 rounded-2xl text-[11px] text-pink-200/80 leading-relaxed font-sans">
                Cocoa is a magical advisor construct created from sweet cacao and vanilla beans. 
                Ask Cocoa anything about the towns, coins, citizens, or ongoing stories, and get companionable, polite advice.
              </div>

              <div className="space-y-2">
                <span className="text-[9px] font-black uppercase tracking-[0.25em] text-pink-400 block">Quick Suggestions</span>
                <div className="flex flex-col gap-2">
                  {SUGGESTIONS.map((sug, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(sug.query)}
                      className="w-full p-2.5 text-left text-xs bg-white/5 hover:bg-pink-500/10 border border-white/5 hover:border-pink-500/20 rounded-xl transition-all duration-200 text-pink-100 hover:text-white"
                      style={{ fontFamily: FONT_BODY }}
                    >
                      💡 {sug.text}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-[10px] text-pink-400/40 mt-6 pt-3 border-t border-pink-500/5 text-center">
              Please treat Cocoa with kindness. Cocoa values polite conversations.
            </div>
          </div>

          {/* RIGHT: Chat logs & Input */}
          <div className="flex-grow h-full border border-pink-500/10 bg-black/30 rounded-3xl p-5 flex flex-col justify-between overflow-hidden gap-4">
            
            {/* Scrollable messages container */}
            <div className="flex-grow overflow-y-auto custom-scrollbar pr-1 space-y-3 flex flex-col">
              {messages.map((msg) => {
                const isBot = msg.sender === 'cocoa';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col max-w-[85%] ${isBot ? 'self-start' : 'self-end'}`}
                  >
                    <span className={`text-[8px] font-semibold text-white/30 mb-0.5 px-2 ${isBot ? 'self-start' : 'self-end'}`}>
                      {isBot ? 'Cocoa' : 'You'} · {msg.date}
                    </span>
                    <div
                      className={`p-3 text-xs leading-relaxed font-sans rounded-2xl ${
                        isBot
                          ? 'bg-pink-950/40 text-pink-100 border border-pink-500/15 rounded-tl-none'
                          : 'bg-amber-600/10 text-amber-100 border border-amber-500/15 rounded-tr-none'
                      }`}
                    >
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                  </div>
                );
              })}

              {isThinking && (
                <div className="flex flex-col max-w-[85%] self-start animate-pulse">
                  <span className="text-[8px] font-semibold text-white/30 mb-0.5 px-2">
                    Cocoa
                  </span>
                  <div className="p-3 text-xs bg-pink-950/40 text-pink-100 border border-pink-500/15 rounded-2xl rounded-tl-none flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    <span className="text-[10px] text-pink-300/60 font-medium ml-1">Cocoa is stir-mixing recipes...</span>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputVal);
              }}
              className="flex gap-2.5 shrink-0 border-t border-pink-500/10 pt-4"
            >
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Ask Cocoa about coins, relocation, or towns..."
                className="flex-1 px-4 py-2.5 bg-black/40 border border-pink-500/20 rounded-xl text-xs text-white focus:outline-none focus:border-pink-500 font-sans tracking-wide placeholder-white/20"
                disabled={isThinking}
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-brand font-black uppercase text-[10px] tracking-wider rounded-xl transition duration-150 shadow-md flex items-center gap-1 hover:scale-102 active:scale-98"
                style={{ fontFamily: FONT_BODY }}
                disabled={isThinking}
              >
                Send ✉️
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};

export default CocoaChatPage;
