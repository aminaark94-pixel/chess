import { Language } from '../types/chess';

export const translations = {
  en: {
    appTitle: 'Chess Quest',
    appSubtitle: 'Master the Royal Game Step-by-Step',
    adventureMode: 'Adventure Quest',
    freePlayMode: 'AI Battle Arena',
    encyclopediaMode: 'Piece Academy',
    
    // Stats & Topbar
    xp: 'XP',
    level: 'Level',
    stage: 'Stage',
    streak: 'Day Streak',
    stars: 'Stars',
    language: 'Language',
    romanUrdu: 'Roman Urdu',
    english: 'English',
    sound: 'Sound',
    theme: 'Theme',
    
    // Action buttons
    hint: 'Get Hint',
    undo: 'Undo Move',
    restart: 'Restart Level',
    nextStage: 'Next Stage',
    backToMap: 'Level Map',
    flipBoard: 'Flip Board',
    playAgain: 'Play Again',
    continue: 'Continue',
    startChallenge: 'Start Level',
    tryAgain: 'Try Again',
    viewDetails: 'Learn Moves',
    
    // Level Names & descriptions
    level1Name: 'Level 1: The Brave Pawn',
    level1Sub: 'Movement, Diagonal Capture & Grand Promotion',
    level2Name: 'Level 2: Rook & Bishop',
    level2Sub: 'Straight Ranks, Files & Diagonal Long Strikes',
    level3Name: 'Level 3: The Jumping Knight',
    level3Sub: 'Master the "L" Shape Jump & Fork Tactics',
    level4Name: 'Level 4: Queen & King',
    level4Sub: 'Supreme Power vs. Protecting the Royal Crown',
    level5Name: 'Level 5: Check & Checkmate',
    level5Sub: 'Kisht, Defense Strategies & Winning Checkmate',
    
    // Pieces
    pawn: 'Pawn',
    knight: 'Knight',
    bishop: 'Bishop',
    rook: 'Rook',
    queen: 'Queen',
    king: 'King',
    
    // In game badges / status
    yourTurn: 'Your Turn (White)',
    aiTurn: 'Opponent Thinking...',
    inCheck: 'CHECK!',
    checkmate: 'CHECKMATE! Victory!',
    draw: 'Draw Game',
    gemsRemaining: 'Gems to Collect:',
    movesUsed: 'Moves:',
    targetReached: 'Goal Reached!',
    invalidMove: 'That piece cannot move there. Try following the glowing dots!',
    
    // AI Diff
    aiEasy: 'Easy (Apprentice Panda)',
    aiMedium: 'Medium (Tactician Falcon)',
    aiHard: 'Hard (Grandmaster Titan)',
    
    // Coach dialogues
    coachIntro: 'Welcome adventurer! I am Chekky, your Chess Grandmaster Coach! Let us start your journey!',
    coachDefault: 'Click a glowing piece to reveal valid path indicators, then tap a destination!',
    coachPawnRule: 'Remember: Pawns move 1 step forward (or 2 steps on their very first move), but capture enemies diagonally!',
    coachKnightRule: 'Knights move in a 2+1 "L" shape and are the ONLY pieces that can jump over other pieces!',
    coachRookRule: 'Rooks move in straight horizontal or vertical lines across the entire board as far as they can see!',
    coachBishopRule: 'Bishops move diagonally along their color paths across the open board!',
    coachQueenRule: 'The Queen is your strongest piece: she combines both Rook and Bishop powers in all directions!',
    coachKingRule: 'Protect your King at all costs! He steps 1 square in any direction and must never stay in danger.',
    coachCheckRule: 'When a piece attacks the enemy King, that is CHECK! The King must escape immediately.',
    coachCheckmateRule: 'Checkmate happens when the King is in Check and has NO legal escape, block, or capture left!',
    
    // Victory Modal
    stageComplete: 'Stage Conquered!',
    wellDone: 'Brilliant Tactics!',
    xpEarned: '+50 XP Gained',
    starsEarned: 'Mastery Stars',
    accuracy: 'Accuracy: 100%',
    nextMission: 'Ready for the next chess mystery?',
    
    // Academy
    academyTitle: 'Chess Academy & Piece Guide',
    academySubtitle: 'Interactive movement rules, values and pro tips for all 6 pieces',
    pieceValue: 'Piece Value',
    points: 'Points',
    howItMoves: 'How It Moves',
    proTip: 'Pro Grandmaster Tip',
    
    // Themes
    themeCyber: 'Cyber Neon',
    themeWood: 'Royal Wood',
    themeSlate: 'Midnight Slate'
  },
  
  ur: {
    appTitle: 'Shatranj Quest',
    appSubtitle: 'Shatranj Seekhein Khel Khel Mein (Gamified Chess)',
    adventureMode: 'Adventure Safari',
    freePlayMode: 'AI Muqabla (Practice)',
    encyclopediaMode: 'Mohron Ki Academy',
    
    // Stats & Topbar
    xp: 'XP Points',
    level: 'Sabaq (Level)',
    stage: 'Marhala (Stage)',
    streak: 'Rozana Streak',
    stars: 'Sitaray (Stars)',
    language: 'Zuban',
    romanUrdu: 'Roman Urdu',
    english: 'English',
    sound: 'Awaaz',
    theme: 'Theme',
    
    // Action buttons
    hint: 'Madad (Hint)',
    undo: 'Wapis (Undo)',
    restart: 'Dobara Shuru (Restart)',
    nextStage: 'Agla Marhala',
    backToMap: 'Sabaq Ka Naqsha (Map)',
    flipBoard: 'Board Paltein',
    playAgain: 'Dobara Khelein',
    continue: 'Aage Barhein',
    startChallenge: 'Shuru Karein',
    tryAgain: 'Dobara Koshish Karein',
    viewDetails: 'Chalna Seekhein',
    
    // Level Names & descriptions
    level1Name: 'Level 1: Bahadur Piyada (Pawn)',
    level1Sub: 'Seedhi Chaal, Tircha Shikar aur Wazir Banna (Promotion)',
    level2Name: 'Level 2: Haathi (Rook) aur Feel / Oont (Bishop)',
    level2Sub: 'Seedhi Qatarein aur Tirchhi Long-Range Chalangein',
    level3Name: 'Level 3: Chhalaang Maarta Ghora (Knight)',
    level3Sub: '"L" Shape Chaal aur Mohron ke Upar se Chhalang',
    level4Name: 'Level 4: Wazir (Queen) aur Badshah (King)',
    level4Sub: 'Sab se Badi Taqat vs Badshah Ki Hifazat',
    level5Name: 'Level 5: Kisht (Check) aur Maat (Checkmate)',
    level5Sub: 'Kisht Dena, Bachao ke Tareeqay aur Maat Kar Ke Jeetna',
    
    // Pieces
    pawn: 'Piyada (Pawn)',
    knight: 'Ghora (Knight)',
    bishop: 'Feel / Oont (Bishop)',
    rook: 'Haathi / Qila (Rook)',
    queen: 'Wazir / Malika (Queen)',
    king: 'Badshah (King)',
    
    // In game badges / status
    yourTurn: 'Aapki Baari (White)',
    aiTurn: 'Dushman Soch Raha Hai...',
    inCheck: 'KISHT (CHECK)!',
    checkmate: 'MAAT (CHECKMATE)! Mubarak, Aap Jeet Gaye!',
    draw: 'Muqabla Barabar (Draw)',
    gemsRemaining: 'Baqi Heere (Gems):',
    movesUsed: 'Chalein (Moves):',
    targetReached: 'Hadaf Mukammal!',
    invalidMove: 'Yeh mohra wahan nahi ja sakta. Chamakte hue nishanat dekhein!',
    
    // AI Diff
    aiEasy: 'Asaan (Shagird Panda)',
    aiMedium: 'Darmiyana (Chalaak Baaz)',
    aiHard: 'Sakht (Grandmaster Titan)',
    
    // Coach dialogues
    coachIntro: 'Khush Amdeed Dost! Main hoon Chekky, aapka Shatranj Ustaad! Aayein shatranj ki dunya mein qadam rakhein!',
    coachDefault: 'Apne chamakte mohray par click karein aur hari chamakti jagah par chalain!',
    coachPawnRule: 'Yaad rahe: Piyada seedha 1 ya 2 qadam chalta hai, magar dushman ko tircha (diagonal) marta hai!',
    coachKnightRule: 'Ghora hamesha "L" shakal (2 qadam aage, 1 qadam dayen/bayen) mein chalta hai aur dusre mohron ke upar se kood sakta hai!',
    coachRookRule: 'Haathi seedhi line (aage, peeche, dayen, bayen) mein jitna door chahe ja sakta hai!',
    coachBishopRule: 'Feel / Oont apne rang ke khano par tirchi (diagonal) chal chalta hai!',
    coachQueenRule: 'Wazir shatranj ka sab se taqatwar mohra hai, jo Haathi aur Feel dono ki tarah har taraf chal sakta hai!',
    coachKingRule: 'Badshah ki hifazat sab se zaroori hai! Yeh har taraf 1 qadam chal sakta hai magar khatre mein nahi reh sakta.',
    coachCheckRule: 'Jab dushman ka mohra seedha Badshah par hamla kare, to usay KISHT (Check) kehte hain!',
    coachCheckmateRule: 'MAAT (Checkmate) tab hoti hai jab Badshah par Kisht ho aur bachne ka koi rasta na bache! Is se jeet hoti hai!',
    
    // Victory Modal
    stageComplete: 'Shabash! Marhala Fateh Hua!',
    wellDone: 'Behtareen Hikmat-e-Amli!',
    xpEarned: '+50 XP Points Hasil Hue',
    starsEarned: 'Ustaadi Sitaray (Stars)',
    accuracy: 'Kamyaabi: 100%',
    nextMission: 'Agle marhale ke liye tayar hain?',
    
    // Academy
    academyTitle: 'Shatranj Ki Ustaad Academy',
    academySubtitle: 'Tamam 6 mohron ke qawaid, taqat aur Grandmaster tips',
    pieceValue: 'Mohray Ki Qeemat',
    points: 'Points',
    howItMoves: 'Kaisay Chalta Hai',
    proTip: 'Grandmaster Ka Mashwara',
    
    // Themes
    themeCyber: 'Cyber Neon Theme',
    themeWood: 'Shahi Lakri (Wood)',
    themeSlate: 'Midnight Slate'
  }
};

export function getTranslation(lang: Language, key: keyof typeof translations['en']): string {
  return translations[lang][key] || translations['en'][key] || key;
}
