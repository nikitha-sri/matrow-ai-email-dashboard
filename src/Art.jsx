import flower from "./assets/flower.png";
import robotBriefing from "./assets/robot-briefing.png";
import robotPromo from "./assets/robot-promo.png";
import plant from "./assets/plant.png";

// The illustrations are cropped straight from the design. Swap the files in
// src/assets/ for your own exports (ideally transparent PNGs) any time.

export function Logo() {
  return (
    <svg width="52" height="40" viewBox="0 0 52 40" aria-hidden="true">
      <path d="M8 36C6 18 18 4 40 2c1 20-8 34-30 34z" fill="#9DB36A" />
      <path d="M10 34C16 22 24 14 36 8" stroke="#3B2147" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

export const Flower = () => <img className="art-flower" src={flower} alt="" />;
export const BriefingRobot = () => <img src={robotBriefing} alt="" />;
export const PromoRobot = () => <img className="promo-img" src={robotPromo} alt="" />;
export const Plant = () => <img className="art-leaves" src={plant} alt="" />;
