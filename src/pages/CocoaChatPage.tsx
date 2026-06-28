/* eslint-disable react-hooks/purity */
import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { useTTStore } from '../store/useTTStore';

const FONT_BRAND = '"Luckiest Guy", cursive';
const FONT_BODY = '"Josefin Sans", sans-serif';

interface ChatMessage {
  id: string;
  sender: 'pipkin' | 'user';
  text: string;
  date: string;
}

const HARSH_WORDS = [
  'fuck', 'shit', 'damn', 'bitch', 'bastard', 'hate', 'stupid', 'jerk',
  'fool', 'idiot', 'asshole', 'crap', 'dick', 'suck', 'useless', 'worst',
  'garbage', 'trash', 'horrible', 'shut up', 'kill', 'die', 'dumb', 'rubbish', 'wrongly'
];

const SUGGESTIONS = [
  { text: 'Who lives in Ganache Grove? 🎭', query: 'residents' },
  { text: 'Tell me about yourself, Pipkin! 🐿️', query: 'pipkin' },
  { text: 'What is the Honeyberry Incident? 🫐', query: 'honeyberry' },
  { text: 'How do I earn Cocoa Coins? 🪙', query: 'coin' },
  { text: 'Tell me a forest secret! 🤫', query: 'secret' },
  { text: 'How do I relocate to another town? 🏘️', query: 'relocate' }
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
        text: `My wallet advice:
*   🪙 **Starter Purse**: 200 Cocoa Coins is your initial pocket stash.
*   🎒 **Safety**: All your coins are synced to your Provincial Passport.`,
        nextTopic: 'coin'
      };
    }
    if (text.includes('earn') || text.includes('get') || text.includes('make') || text.includes('reward')) {
      return {
        text: `How to stack up those Cocoa Coins:
*   🧹 **Walkway Chores**: Complete community tasks on the desk hotspots.
*   🍪 **Baking & Apothecary**: Help Baker Bramble Mortimer or Dr. Cedric Oakenhart.
*   📰 **Gazette**: Answer daily campaigns and read bulletins.`,
        nextTopic: 'coin'
      };
    }
    if (text.includes('bankrupt') || text.includes('run out') || text.includes('zero') || text.includes('buy')) {
      return {
        text: `If you go completely flat broke:
*   🏛️ **Imperial Treasury**: Provides emergency relief to help you back up.
*   💳 **Treasury Exchange**: Recharge your Cocoa Coins pocket reserves anytime.`,
        nextTopic: 'coin'
      };
    }
  }

  // 2. RELOCATION TOPIC
  if (lastTopic === 'relocate') {
    if (text.includes('rank') || text.includes('level') || text.includes('xp')) {
      return {
        text: `Going somewhere? You'll need:
*   🏅 **Passport Rank**: Citizen Level 3 or higher.
*   ✨ **XP Threshold**: At least 3,000 total points of skill XP.`,
        nextTopic: 'relocate'
      };
    }
    if (text.includes('fee') || text.includes('cost') || text.includes('price')) {
      return {
        text: `Relocation invoice:
*   🪙 **Processing Fee**: 15 Coins is deducted upon filing.
*   💼 **Transit**: Fully managed by the Monorail & Wagon Guild.`,
        nextTopic: 'relocate'
      };
    }
  }

  // Specific residents check
  if (text.includes('winston')) {
    return {
      text: `**Captain Winston Butterfield** 🎩 (Boy): The bombastic Town Explorer & Detective! He wears the county's largest explorer helmet (14 inches tall with a secret pocket for emergency mints!). He has solved over 400 cases, like the great syrup barrel mystery.`,
      nextTopic: 'residents'
    };
  }
  if (text.includes('crumbleton') || text.includes('bramble') || text.includes('mortimer')) {
    return {
      text: `**Baker Bramble Mortimer** 🥐 (Boy): Our baker! He runs the bakery and believes a warm chocolate croissant can solve any political or environmental dispute. He once baked a cake so light it floated out of the chimney!`,
      nextTopic: 'residents'
    };
  }
  if (text.includes('page')) {
    return {
      text: `**Miss Page Bumblewick** 🕵️‍♀️ (Girl): The nosiest neighbor in Cocoawood County! Armed with silver spectacles and a folding umbrella (which has a hidden mirror to peek around corners). Nothing escapes her gaze!`,
      nextTopic: 'residents'
    };
  }
  if (text.includes('cedric') && !text.includes('oakenhart')) {
    return {
      text: `**Professor Finley** 🏫 (Boy): Our Academy Principal. He speaks in long, winding sentences that make pupils fall asleep and wake up in next month's calendar. He has 140 ancient scrolls on cocoa harvesting.`,
      nextTopic: 'residents'
    };
  }
  if (text.includes('horace')) {
    return {
      text: `**Horace Ticklebell** 🚝 (Boy): Meticulous monorail stationmaster. Obsessed with trains being on time to the exact second. Checks his brass watch seventy times a day! Once saved the express using a sack of flour.`,
      nextTopic: 'residents'
    };
  }
  if (text.includes('hazel') || text.includes('oakenhart')) {
    return {
      text: `**Dr. Cedric Oakenhart** 🍵 (Boy): Our Town Physician and owner of the clinic. He mixes healing herbal teas to soothe local ailments and knows exactly what gossip his patients need! His honey-mint tea can soothe even the most audited souls.`,
      nextTopic: 'residents'
    };
  }
  if (text.includes('hugo') || text.includes('crumblewise')) {
    return {
      text: `**Blacksmith Crumblewise** 🔨 (Boy): The soft-spoken giant blacksmith. He plays gentle tunes on his harmonica during breaks to soothe hot iron bars. He makes the precision 99-teeth gears for the clock tower.`,
      nextTopic: 'residents'
    };
  }
  if (text.includes('clara')) {
    return {
      text: `**Clara Bookfern** 📚 (Girl): Our quiet librarian. She binds books using a secret molasses glue and once shushed a rampaging caramel goat so effectively that it sat down and fell asleep.`,
      nextTopic: 'residents'
    };
  }
  if (text.includes('rowan') && (text.includes('thistle') || text.includes('apprentice') || text.includes('boy'))) {
    return {
      text: `**Rowan Thistle** 🧹 (Boy, 14): A 14-year-old dynamo builder apprentice who runs around helping orphans, finding lost pets, and cleaning green moss from walkways. He's found 43 lost cats, 12 bunnies, and one caramel goat.`,
      nextTopic: 'residents'
    };
  }
  if (text.includes('julie') || text.includes('frost') || text.includes('reporter')) {
    return {
      text: `**Julie Frost** 📰 (Girl, 14): The aspiring lead reporter of the Ganache Gazette. She's 14 and writes with immense dramatic flair. Once ran a three-part scoop on Sir Goldwhistle's slippers!`,
      nextTopic: 'residents'
    };
  }
  if (text.includes('bramfield') || text.includes('sheriff') || text.includes('aldous')) {
    return {
      text: `**Sheriff Aldous Bramfield** 👮 (Boy): The earnest town sheriff. He keeps the peace and ensures the bylaws are obeyed by everyone, including Pipkin!`,
      nextTopic: 'residents'
    };
  }
  if (text.includes('percival')) {
    return {
      text: `**Percival Tinkersprocket** 🔧 (Boy): The eccentric inventor! His workshop is full of steam pipes and automation models. His self-stirring cocoa mug occasionally shoots cocoa at the ceiling.`,
      nextTopic: 'residents'
    };
  }
  if (text.includes('molly')) {
    return {
      text: `**Molly Hearthwhisk** 🍲 (Girl): Cheerful owner of the Hearthstone Tavern & Inn. She brews a legendary potato-cocoa stew and washes linens with fresh mountain mint water.`,
      nextTopic: 'residents'
    };
  }
  if (text.includes('chirp')) {
    return {
      text: `**Chirp** 🐦 (Boy): A message-carrying bluebird who flies letters in a golden tube. He has a habit of pecking at shiny buttons and coins and stashing them in his nest.`,
      nextTopic: 'residents'
    };
  }
  if (text.includes('niglet')) {
    return {
      text: `**Niglet** 🐭 (Boy): My pocket mouse companion! He sleeps in my canvas pocket, loves cheese rinds, and can chew through a thick parcel rope in under ten seconds flat!`,
      nextTopic: 'residents'
    };
  }
  if (text.includes('biglet')) {
    return {
      text: `**Biglet** 🐿️ (Boy): A cheeky red squirrel who stashes nuts. He's banned from the bakery for pastry larceny and once caused a monorail delay by stashing nuts in the drive gears.`,
      nextTopic: 'residents'
    };
  }
  if (text.includes('maribel')) {
    return {
      text: `**Maribel Nutterby** 🧵 (Girl): My patient mother! She's the town's premier seamstress and can sew a button back on in three seconds flat. Patching my trousers has given her a patience of pure gold.`,
      nextTopic: 'residents'
    };
  }

  // Residents category
  if (text.includes('resident') || text.includes('citizen') || text.includes('people') || text.includes('character') || text.includes('cast')) {
    return {
      text: `Oh! The citizens of Ganache Grove are super fun! You can ask me about:
*   🎩 **Captain Winston Butterfield** (Boy · Town Explorer & Detective)
*   🥐 **Baker Bramble Mortimer** (Boy · Baker)
*   🕵️‍♀️ **Miss Page Bumblewick** (Girl · Amateur Investigator)
*   🏫 **Professor Finley** (Boy · Academy Principal)
*   🚝 **Horace Ticklebell** (Boy · Railway Stationmaster)
*   🍵 **Dr. Cedric Oakenhart** (Boy · Town Physician)
*   🔨 **Blacksmith Crumblewise** (Boy · Forge Master)
*   📚 **Clara Bookfern** (Girl · Librarian)
*   🧹 **Rowan Thistle** (Boy · Builder Apprentice)
*   📰 **Julie Frost** (Girl · Gazette Reporter)
*   👮 **Sheriff Aldous Bramfield** (Boy · Town Sheriff)
*   🔧 **Percival Tinkersprocket** (Boy · Town Head)
*   🍲 **Bounce McDrizzle** (Boy · Innkeeper)
*   🐦 **Chirp** (Boy · Bird Messenger)
*   🐭 **Niglet** (Boy · Mouse Companion) & 🐿️ **Biglet** (Boy · Squirrel Companion)
*   🧵 **Maribel Nutterby** (Girl · Seamstress)`,
      nextTopic: 'residents'
    };
  }

  // Secrets category
  if (text.includes('secret') || text.includes('gossip') || text.includes('whisper')) {
    const secrets = [
      "Miss Page Bumblewick's folding umbrella has a small mirror attached so she can peek around Gossip Corner without moving!",
      "Baker Bramble Mortimer maintains a locked diary containing the ratios for twelve secret chocolate glazes.",
      "Captain Winston Butterfield's 14-inch tall ceremonial hat contains a hidden compartment filled with emergency peppermint drops.",
      "Biglet the squirrel once stashed forty-two hazelnuts inside the Monorail's main drive gears, stopping the 10:14 Cocoa Express!",
      "Niglet the pocket mouse has chewed through fifteen cell locks in his lifetime to help adventure planners escape."
    ];
    const randSecret = secrets[Math.floor(Math.random() * secrets.length)];
    return {
      text: `🤫 **Psst! Here's a forest secret for you:**\n\n"${randSecret}"`,
      nextTopic: 'secret'
    };
  }

  // 3. GANACHE GROVE TOPIC
  if (lastTopic === 'ganache' || text.includes('ganache') || text.includes('grove')) {
    if (text.includes('canopy') || text.includes('tree')) {
      return {
        text: `Ganache Grove Canopy:
*   🌳 **Trees**: Giant chocolate cacao trees with deep, root networks.
*   ☀️ **Sunlight**: Filtered as a warm golden chocolate hue.`,
        nextTopic: 'ganache'
      };
    }
    if (text.includes('special') || text.includes('famous') || text.includes('product')) {
      return {
        text: `Grove specialties:
*   🍫 **Mirror-Finish**: Chocolate coating panels.
*   🧪 **Glaze Extracts**: Pure flavor drops boiled at high heat.`,
        nextTopic: 'ganache'
      };
    }
    return {
      text: `Welcome to **Ganache Grove**! 🌳🍫
What would you like to verify?
*   (**canopy**): giant chocolate canopy details
*   (**special**): famous local specialties
*   (**residents**): who lives here`,
      nextTopic: 'ganache'
    };
  }

  // 4. PIPKIN NUTTERBY TOPIC
  if (text.includes('pipkin') || text.includes('nutterby') || text.includes('sprite')) {
    if (text.includes('mischief') || text.includes('swipe') || text.includes('loaf')) {
      return {
        text: `Mortimer's Honeyberry Loaf:
*   🍞 **Loaf**: Masterpiece bread went missing.
*   🏃 **Chase**: Spanning high branches and the waterway.`,
        nextTopic: 'pipkin'
      };
    }
    if (text.includes('intent') || text.includes('why') || text.includes('reason')) {
      return {
        text: `My intentions:
*   🌳 **Elder Tree**: Feed hungry wood sprites to keep them safe.
*   🌸 **Intent**: Purely friendly, no malice was meant!`,
        nextTopic: 'pipkin'
      };
    }
    return {
      text: `That's me! **Pipkin Nutterby**! 🐿️
What would you like to verify?
*   (**mischief**): Mortimer's missing loaf pranks
*   (**intent**): my forest sprite intentions
*   (**residents**): my friends in town`,
      nextTopic: 'pipkin'
    };
  }

  // 5. HONEYBERRY INCIDENT TOPIC
  if (text.includes('honeyberry') || text.includes('incident') || text.includes('loaf') || text.includes('mortimer')) {
    return {
      text: `The **Honeyberry Loaf Incident**! 🫐
What would you like to verify?
*   (**mischief**): the missing masterpiece pranks
*   (**intent**): why it was taken`,
      nextTopic: 'honeyberry'
    };
  }

  // General coin queries
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

  // General relocation queries
  if (text.includes('relocat') || text.includes('move') || text.includes('hometown') || text.includes('choose')) {
    return {
      text: `Moving to a new town? How exciting! 🏘️
What would you like to verify?
*   (**rank**): rank requirement
*   (**fee**): relocation fee`,
      nextTopic: 'relocate'
    };
  }

  // General help queries
  if (text.includes('help') || text.includes('what can you do') || text.includes('question')) {
    return {
      text: `I'm here to guide you through the canopy! 🐿️
You can ask me about:
*   👥 **Residents** (who lives in Ganache Grove)
*   🪙 **Coins** (how to earn and spend them)
*   🏘️ **Relocating** (moving rules)
*   🌳 **Ganache Grove** (landmarks & canopy)
*   🤫 **Secrets** (fun gossip & trivia)
*   🫐 **Honeyberry Incident** (the missing loaf)

What shall we talk about, Yogesh? 🍫`,
      nextTopic: null
    };
  }

  if (text.includes('thank') || text.includes('thanks') || text.includes('appreciate') || text.includes('good bot')) {
    return {
      text: `Haha, you are very welcome! 🐿️
Always happy to chat between my slingshot practice!`,
      nextTopic: null
    };
  }

  if (text.includes('hello') || text.includes('hi') || text.includes('hey') || text.includes('greetings')) {
    return {
      text: `Hey there, Yogesh! 🐿️ Welcome to my chat corner!
*   **Status**: Ready to guide you.
*   **Prompt**: What shall we talk about? 🍫`,
      nextTopic: null
    };
  }

  return {
    text: `Oh, that's a cool question! 🐿️
I'm still exploring the deep woods, but you can ask me about:
*   👥 **Residents**
*   🪙 **Coins**
*   🏘️ **Relocating**
*   🤫 **Secrets**`,
    nextTopic: null
  };
};

const PipkinChatPage: React.FC = () => {
  const { coins, setPage, headerHidden, spendCoins } = useTTStore();
  const [lastTopic, setLastTopic] = useState<string | null>(null);
  const [showPenaltyCard, setShowPenaltyCard] = useState(false);
  const [penaltyMessage, setPenaltyMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'pipkin',
      text: `Hey there, Yogesh! I'm Pipkin Nutterby! 🐿️ Welcome to my chat corner!
*   **Role**: Resident adventurer & guide 🎒
*   **Topics**: Residents 👥, Coins 🪙, Secrets 🤫, Relocating 🏘️, Honeyberry Incident 🫐.

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
          sender: 'pipkin',
          text: `I think I have other work to do. We will talk later.`,
          date: new Date().toLocaleTimeString()
        };
        setMessages(prev => [...prev, warningMsg]);
        setIsThinking(false);

        // Deduct 50 coins
        spendCoins(50, 'Rude Conduct Fine', true);

        // Show penalty card
        setPenaltyMessage("Pipkin Nutterby has issued a ticket to Yogesh for rude/inappropriate language. Obey the local bylaws!");
        setShowPenaltyCard(true);

        // Redirect back to desk after 3 seconds
        setTimeout(() => {
          setPage('desk');
        }, 3000);
      }, 1000);
      return;
    }

    setIsThinking(true);
    setTimeout(() => {
      const botResult = getBotResponse(textToSend, lastTopic);
      setLastTopic(botResult.nextTopic);
      const botMsg: ChatMessage = {
        id: 'msg-' + Math.random().toString(36).slice(2),
        sender: 'pipkin',
        text: botResult.text,
        date: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, botMsg]);
      setIsThinking(false);
    }, 1200);
  };

  return (
    <div className={`min-h-full w-full flex flex-col items-center justify-start select-none relative font-sans text-white bg-transparent transition-all duration-700 ${headerHidden ? 'pt-2 pb-6 px-2' : 'pt-4 pb-8 px-4'}`}>
      
      {/* ── MAIN LAYOUT CONTAINER (Amber/Gold shaded glass panel - trimmed and zero-blur) ── */}
      <div className={`rounded-[2rem] border-[3px] border-blue-500/40 bg-black/60 p-5 flex flex-col justify-between overflow-hidden shadow-[8px_8px_0px_0px_rgba(59,130,246,0.35)] relative animate-fade-in transition-all duration-700 ease-in-out ${
        headerHidden
          ? 'w-[92vw] h-[90vh] max-h-[90vh] max-w-none'
          : 'w-full max-w-[960px] h-[580px] max-h-[82vh]'
      }`}>
        
        {/* Header */}
        <div className="relative flex items-center justify-between border-b border-amber-500/10 pb-3.5 shrink-0">
          <div className="z-10">
            <button
              onClick={() => setPage('desk')}
              className="px-4 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded-full text-xs font-black uppercase tracking-wider transition duration-200"
              style={{ fontFamily: FONT_BODY }}
            >
              🏠 Back to Desk
            </button>
          </div>
          <div className="absolute inset-x-0 top-0 bottom-3.5 flex items-center justify-center pointer-events-none">
            <h2 className="text-xl font-brand text-amber-300 uppercase tracking-wider flex items-center gap-2 pointer-events-auto" style={{ fontFamily: FONT_BRAND }}>
              💬 Pipkin Chat
            </h2>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-950/45 border border-amber-500/20 rounded-full text-xs font-semibold text-amber-300 z-10">
            🪙 {coins} Coins
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-grow mt-3 flex flex-row gap-5 overflow-hidden min-h-0 w-full">
          
          {/* LEFT: Bot introduction & Suggestions */}
          <div className="w-[320px] shrink-0 h-full flex flex-col justify-between border-2 border-blue-500/35 bg-transparent rounded-3xl p-5 overflow-y-auto custom-scrollbar">
            <div className="space-y-4">
              <div>
                <span className="text-[9px] font-black uppercase tracking-[0.25em] text-amber-400 block">Companion Lore Advisor</span>
                <h3 className="text-base font-brand text-amber-100 uppercase mt-0.5" style={{ fontFamily: FONT_BRAND }}>
                  Meet Pipkin
                </h3>
              </div>
              
              <div className="p-3 bg-amber-950/10 border border-amber-500/10 rounded-2xl text-[11px] text-amber-200/80 leading-relaxed font-sans">
                Pipkin is a local forest explorer and adventure planner. Ask Pipkin anything about the citizens, daily coins, secrets, or ongoing chronicles, and get cheeky but helpful forest advice!
              </div>

              <div className="space-y-2">
                <span className="text-[9px] font-black uppercase tracking-[0.25em] text-amber-400 block">Quick Suggestions</span>
                <div className="flex flex-col gap-2">
                  {SUGGESTIONS.map((sug, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(sug.query)}
                      className="w-full p-2.5 text-left text-xs bg-white/5 hover:bg-amber-500/10 border border-white/5 hover:border-amber-500/20 rounded-xl transition-all duration-200 text-amber-100 hover:text-white"
                      style={{ fontFamily: FONT_BODY }}
                    >
                      💡 {sug.text}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-[10px] text-amber-400/40 mt-6 pt-3 border-t border-amber-500/5 text-center">
              Please treat Pipkin with kindness. He value polite conversations between pranks.
            </div>
          </div>

          {/* RIGHT: Chat logs & Input */}
          <div className="flex-grow h-full border-2 border-blue-500/35 bg-transparent rounded-3xl p-5 flex flex-col justify-between overflow-hidden gap-4">
            
            {/* Scrollable messages container */}
            <div className="flex-grow overflow-y-auto custom-scrollbar pr-1 space-y-3 flex flex-col">
              {messages.map((msg) => {
                const isBot = msg.sender === 'pipkin';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col max-w-[85%] ${isBot ? 'self-start' : 'self-end'}`}
                  >
                    <span className={`text-[8px] font-semibold text-white/30 mb-0.5 px-2 ${isBot ? 'self-start' : 'self-end'}`}>
                      {isBot ? 'Pipkin' : 'You'} · {msg.date}
                    </span>
                    <div
                      className={`p-3 text-xs leading-relaxed font-sans rounded-2xl ${
                        isBot
                          ? 'bg-amber-950/40 text-amber-100 border border-amber-500/15 rounded-tl-none'
                          : 'bg-stone-800/40 text-stone-100 border border-stone-700/15 rounded-tr-none'
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
                    Pipkin
                  </span>
                  <div className="p-3 text-xs bg-amber-950/40 text-amber-100 border border-amber-500/15 rounded-2xl rounded-tl-none flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    <span className="text-[10px] text-amber-300/60 font-medium ml-1">Pipkin is checking his satchel...</span>
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
              className="flex gap-2.5 shrink-0 border-t border-amber-500/10 pt-4"
            >
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Ask Pipkin about citizens, coins, secrets, or relocations..."
                className="flex-1 px-4 py-2.5 bg-black/40 border border-amber-500/20 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 font-sans tracking-wide placeholder-white/20"
                disabled={isThinking}
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-brand font-black uppercase text-[10px] tracking-wider rounded-xl transition duration-150 shadow-md flex items-center gap-1 hover:scale-102 active:scale-98"
                style={{ fontFamily: FONT_BODY }}
                disabled={isThinking}
              >
                Send ✉️
              </button>
            </form>
          </div>

        </div>

      </div>

      {showPenaltyCard && (
        <div className="absolute inset-0 bg-black/85 z-[500] flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-neutral-900 border-2 border-rose-500/40 rounded-3xl p-8 max-w-md w-full text-center space-y-4 shadow-2xl relative text-white">
            <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-4xl mx-auto select-none animate-bounce">
              ⚠️
            </div>
            <div>
              <span className="text-[11px] font-black uppercase tracking-[0.25em] text-rose-400 block font-sans">Politeness Infraction</span>
              <h2 className="text-2xl font-brand text-rose-500 uppercase mt-1" style={{ fontFamily: FONT_BRAND }}>
                Rude Conduct Fine!
              </h2>
            </div>
            <p className="text-sm text-neutral-350 leading-relaxed font-sans text-center">
              {penaltyMessage || "A town marshal has issued a fine for rude or inappropriate conduct. Please treat all residents with respect."}
            </p>
            <div className="p-4 bg-rose-950/20 border border-rose-500/25 rounded-2xl font-sans">
              <span className="text-[11px] font-black text-neutral-400 uppercase tracking-widest block">Penalty Deducted</span>
              <span className="text-xl font-brand text-rose-400 block mt-1" style={{ fontFamily: FONT_BRAND }}>
                -50 Cocoa Coins 🪙
              </span>
            </div>
            <div className="text-[10px] text-neutral-500 italic font-sans animate-pulse text-center">
              Closing chat window in a moment...
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PipkinChatPage;
