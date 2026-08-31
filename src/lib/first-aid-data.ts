/**
 * First-Aid Reference — static content.
 * This is deliberately NOT AI-generated.
 * Content is stored in-app so it works fully offline.
 *
 * Source guidance: WHO/Red Cross basic first aid principles.
 * Always consult qualified medical professionals for real emergencies.
 */

export interface FirstAidGuide {
  id: string;
  title: string;
  icon: string;
  steps: string[];
  warnings: string[];
}

export const FIRST_AID_GUIDES: FirstAidGuide[] = [
  {
    id: "bleeding",
    title: "Severe Bleeding",
    icon: "🩸",
    steps: [
      "Apply firm, direct pressure with a clean cloth or gauze.",
      "Keep pressure on the wound for at least 15 minutes — do not lift the cloth to check.",
      "If blood soaks through, add more cloth on top — do not remove the first layer.",
      "If possible, raise the injured limb above the level of the heart.",
      "Tie a tight bandage or tourniquet only as a last resort for life-threatening limb bleeding.",
      "Call for medical help immediately.",
    ],
    warnings: [
      "Do not remove objects embedded in a wound.",
      "Do not use a tourniquet unless bleeding is life-threatening and other methods have failed.",
    ],
  },
  {
    id: "burns",
    title: "Burns & Scalds",
    icon: "🔥",
    steps: [
      "Cool the burn under cool (not ice-cold) running water for at least 20 minutes.",
      "Remove any clothing or jewellery near the burn, but do not remove anything stuck to the skin.",
      "Cover loosely with a clean, non-fluffy dressing or cling film.",
      "Give paracetamol or ibuprofen for pain if available.",
      "Seek medical help for burns larger than the palm of the hand, or on face/hands/joints.",
    ],
    warnings: [
      "Do not apply butter, oil, toothpaste, or any home remedy to burns.",
      "Do not pop blisters.",
      "Do not use ice directly on the burn.",
    ],
  },
  {
    id: "choking",
    title: "Choking",
    icon: "🫁",
    steps: [
      "If the person can cough forcefully, encourage them to keep coughing.",
      "If they cannot cough, speak, or breathe: stand behind them, place a fist just above their navel.",
      "Give 5 quick upward abdominal thrusts (Heimlich manoeuvre).",
      "If still choking, call for emergency help.",
      "For infants: hold face-down on your forearm and give 5 back blows, then 5 chest thrusts.",
      "If the person becomes unconscious, begin CPR.",
    ],
    warnings: [
      "Do not perform abdominal thrusts on pregnant women or infants under 1 year.",
    ],
  },
  {
    id: "fractures",
    title: "Fractures & Sprains",
    icon: "🦴",
    steps: [
      "Keep the injured limb still — do not try to straighten it.",
      "Splint the limb using rigid material (sticks, rolled newspaper) padded with cloth.",
      "Tie the splint firmly but not so tight it cuts off circulation.",
      "Apply a cold pack (wrapped in cloth) to reduce swelling.",
      "Elevate the limb if possible.",
      "Get medical help as soon as possible.",
    ],
    warnings: [
      "Do not attempt to realign a broken bone.",
      "Check for circulation below the injury (pulse, warmth, colour) after splinting.",
    ],
  },
  {
    id: "shock",
    title: "Shock (Cold & Clammy Skin)",
    icon: "😰",
    steps: [
      "Lay the person flat on their back.",
      "Elevate their legs 12 inches (30 cm) if no spinal or leg injury is suspected.",
      "Keep them warm with blankets or clothing.",
      "Do not give food or drink.",
      "If vomiting, turn them on their side.",
      "Call for emergency medical help immediately.",
    ],
    warnings: [
      "Do not elevate legs if head, neck, or back injury is suspected.",
      "Shock is a medical emergency — always seek professional help.",
    ],
  },
  {
    id: "cpr",
    title: "Basic CPR Steps",
    icon: "❤️",
    steps: [
      "Check for response: shout and gently shake the person.",
      "If no response, call for emergency help immediately (or ask someone to call).",
      "Place the heel of your hand on the centre of their chest.",
      "Push hard and fast — at least 5 cm deep, at a rate of 100–120 compressions per minute.",
      "After 30 compressions, give 2 rescue breaths (tilt head back, lift chin, pinch nose, blow into mouth).",
      "Continue 30 compressions : 2 breaths until help arrives or the person starts breathing.",
    ],
    warnings: [
      "If you are not trained in rescue breaths, do chest compressions only.",
      "Do not stop CPR until professional help takes over.",
    ],
  },
];
