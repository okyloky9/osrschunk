import { ClueDifficulty } from '../models';

import beginnerClueIcon from '../images/icons/Clue_scroll_(beginner).png';
import easyClueIcon from '../images/icons/Clue_scroll_(easy).png';
import mediumClueIcon from '../images/icons/Clue_scroll_(medium).png';
import hardClueIcon from '../images/icons/Clue_scroll_(hard).png';
import eliteClueIcon from '../images/icons/Clue_scroll_(elite).png';
import masterClueIcon from '../images/icons/Clue_scroll_(master).png';

const ClueIcon: React.FC<{
  difficulty: ClueDifficulty;
}> = ({ difficulty }) => {
  const icons = {
    Beginner: beginnerClueIcon,
    Easy: easyClueIcon,
    Medium: mediumClueIcon,
    Hard: hardClueIcon,
    Elite: eliteClueIcon,
    Master: masterClueIcon,
  };

  return <img src={icons[difficulty]} aria-hidden />;
};

export default ClueIcon;
