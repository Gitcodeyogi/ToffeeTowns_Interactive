import React, { useState } from 'react';

interface CanalCalculatorProps {
  currentSeriesStep: any;
  travellerName: string;
  onVerifySuccess: () => void;
  triggerFeedback: (msg: string) => void;
}

export const CanalCalculator: React.FC<CanalCalculatorProps> = ({
  currentSeriesStep,
  travellerName,
  onVerifySuccess,
  triggerFeedback,
}) => {
  const [calcInput, setCalcInput] = useState<string>('');

  const getCalcData = (stepId: string) => {
    switch (stepId) {
      case 'canal-s1-1':
        return {
          title: 'Emergency Priority Weighted Score',
          question: `Rowan Thistle needs to compile the total priority weights for the town council meeting.
          
Hey ${travellerName || 'Probationer'}! If we apply a multiplier factor of 5 to Mrs. Petalworth's wildflowers (1 star), 8 to Baker Bramble's cart (2 stars), and 12 to Tiber Reedwell's sluice gate (3 stars), what is the total weighted score of our emergency report?
          
Calculate: (5 * 1) + (8 * 2) + (12 * 3)`,
          hint: 'Calculate Mrs. Petalworth (5 * 1 = 5) plus Baker Bramble (8 * 2 = 16) plus Tiber (12 * 3 = 36). Sum them up!',
          answer: '57',
          placeholder: 'Enter total weighted score...',
          cta: 'Submit Survey Report 📝',
        };
      case 'canal-s1-2':
        return {
          title: 'Reservoir Safety Margin Calculation',
          question: `Tiber Reedwell needs a quick calculation of the safety margin before we adjust the bypass junctions.
          
Hey ${travellerName || 'Probationer'}! If our reservoir inflow is 32 L/s, but the main drainage canal can only process 24 L/s, how many total liters of water will overflow onto the cobblestone path in 15 seconds if we do not adjust the vents?
          
Calculate: (32 - 24) * 15`,
          hint: 'Calculate flow difference first (32 - 24 = 8 L/s), then multiply by 15 seconds.',
          answer: '120',
          placeholder: 'Enter overflow volume in liters...',
          cta: 'Submit Safety Estimate 📐',
        };
      case 'canal-s1-3':
        return {
          title: 'Volunteer Provisions Ledger',
          question: `Baker Bramble Mortimer is setting up the mobile soup kitchen and needs to verify the logistics ledger.
          
Hey ${travellerName || 'Probationer'}! We have 150 volunteers registered for the work crews. If each volunteer consumes 2 hot meals and 3 cups of herbal tea during their shift, how many total food and drink items must we prepare in the kitchen wagon?
          
Calculate: 150 * (2 + 3)`,
          hint: 'Calculate total items per volunteer first (2 + 3 = 5 items), then multiply by 150 volunteers.',
          answer: '750',
          placeholder: 'Enter total items count...',
          cta: 'Confirm Kitchen Ledger 📦',
        };
      case 'canal-s1-4':
        return {
          title: 'Pulley Mechanical Advantage Review',
          question: `Blacksmith Crumblewise is preparing the heavy pulley ropes to lift the giant boulder out of the upstream channel.
          
Hey ${travellerName || 'Probationer'}! The giant boulder weighs exactly 350 kg. If we set up a compound pulley system that gives us a mechanical advantage of 5, how much total input force (in kilograms-force) must our crew apply collectively to lift it clear of the stream?
          
Calculate: 350 / 5`,
          hint: 'Divide the boulder weight (350 kg) by the mechanical advantage of the pulley system (5).',
          answer: '70',
          placeholder: 'Enter required force in kgf...',
          cta: 'Confirm Force Calculations 🪓',
        };
      case 'canal-s1-5':
        return {
          title: 'Gazette Circulation Vellum Sheets Count',
          question: `Julie Frost is setting up the heavy iron printing presses for the Celebration Edition.
          
Hey ${travellerName || 'Probationer'}! Our printing press yields exactly 45 newspapers for every single large sheet of premium vellum. If we need to print and distribute exactly 900 newspapers across Cocoawood County, how many sheets of vellum must we load into the press?
          
Calculate: 900 / 45`,
          hint: 'Divide the total required newspapers (900) by the yield per sheet (45).',
          answer: '20',
          placeholder: 'Enter required sheets count...',
          cta: 'Publish Print Order 🗞️',
        };
      default:
        return null;
    }
  };

  const calcData = getCalcData(currentSeriesStep.id);

  const handleVerify = () => {
    if (calcInput.trim() === calcData?.answer) {
      triggerFeedback("✨ Correct answer! Calculation verified.");
      onVerifySuccess();
    } else {
      triggerFeedback("❌ Incorrect calculation answer. Check the hint!");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4 animate-fade-in">
      <div>
        <h4 className="font-black text-white text-[18px] leading-snug mb-1" style={{ fontFamily: '"Josefin Sans",sans-serif' }}>
          Assignment 2: {calcData?.title}
        </h4>
        <p className="text-[14.5px] text-cyan-400 font-bold uppercase tracking-wider">Calculate logic values to verify report</p>
      </div>

      <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-[15px] text-neutral-300 leading-relaxed whitespace-pre-line">
        {calcData?.question}
      </div>

      <div className="space-y-2.5 pt-1">
        <label className="text-[13.5px] font-bold text-white/50 block">Your Calculated Answer:</label>
        <div className="flex gap-3">
          <input
            type="text"
            value={calcInput}
            onChange={(e) => setCalcInput(e.target.value)}
            placeholder={calcData?.placeholder}
            className="flex-1 px-4 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white font-mono text-sm focus:border-amber-400 focus:outline-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleVerify();
            }}
          />
          <button
            onClick={handleVerify}
            className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-black uppercase tracking-wider text-[14.5px] rounded-xl transition active:scale-98 hover:scale-[1.01]"
          >
            Verify
          </button>
        </div>
      </div>
    </div>
  );
};
