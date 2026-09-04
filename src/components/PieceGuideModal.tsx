import React, { useState } from 'react';
import { PieceType, Language, BoardState, SquareCoord } from '../types/chess';
import { ChessPieceSvg } from './ChessPieceSvg';
import { ChessBoard } from './ChessBoard';
import { setupBoard } from '../utils/levelsData';
import { getTranslation } from '../utils/translations';
import { getLegalMovesForPiece } from '../utils/chessLogic';
import { Sparkles, Shield, Castle, Award, Crown, Zap, Check, Lightbulb } from 'lucide-react';

interface PieceGuideModalProps {
  lang: Language;
}

interface PieceGuideInfo {
  type: PieceType;
  nameEn: string;
  nameUr: string;
  urduPronounce: string;
  value: string;
  icon: React.ReactNode;
  howMovesEn: string[];
  howMovesUr: string[];
  proTipEn: string;
  proTipUr: string;
  sampleSetup: Array<{ row: number; col: number; piece: { type: PieceType; color: 'w' | 'b' } }>;
  samplePieceCoord: SquareCoord;
}

export const PieceGuideModal: React.FC<PieceGuideModalProps> = ({ lang }) => {
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(lang, key);
  const [selectedPieceType, setSelectedPieceType] = useState<PieceType>('p');

  const PIECE_GUIDES: PieceGuideInfo[] = [
    {
      type: 'p',
      nameEn: 'Pawn',
      nameUr: 'Piyada (Pawn)',
      urduPronounce: 'پیادہ',
      value: '1 Point',
      icon: <Shield className="w-5 h-5" />,
      howMovesEn: [
        'Moves 1 square forward (or optionally 2 squares on its very first move).',
        'Captures enemy pieces 1 square diagonally forward.',
        'Cannot move or capture backwards.',
        'Promotes to a Queen, Rook, Bishop, or Knight upon reaching the 8th rank!'
      ],
      howMovesUr: [
        'Pehli chaal par 1 ya 2 qadam seedha aage chalta hai, baad mein sirf 1 qadam.',
        'Dushman ko sirf 1 qadam tircha (diagonal) mar sakta hai.',
        'Kabhi peeche nahi mur sakta.',
        'Aakhri line (8th rank) par pohanch kar Wazir (Queen) ban jata hai!'
      ],
      proTipEn: 'Use pawns to control the center squares (e4, d4) early and build protective pawn shields for your King.',
      proTipUr: 'Shuruat mein d4 aur e4 ke center khanon par qabza karein aur Badshah ke samne deewar banayein.',
      sampleSetup: [
        { row: 6, col: 3, piece: { type: 'p', color: 'w' } },
        { row: 5, col: 4, piece: { type: 'p', color: 'b' } }
      ],
      samplePieceCoord: { row: 6, col: 3 }
    },
    {
      type: 'n',
      nameEn: 'Knight',
      nameUr: 'Ghora (Knight)',
      urduPronounce: 'گھوڑا',
      value: '3 Points',
      icon: <Award className="w-5 h-5" />,
      howMovesEn: [
        'Moves in a strict "L" shape: 2 squares straight + 1 square turn.',
        'The ONLY piece on the chessboard that can jump over other pieces!',
        'Always lands on a square of the opposite color.',
        'Deadly at executing "Forks" (attacking 2 pieces at once).'
      ],
      howMovesUr: [
        'Hamesha "L" shape (2 qadam aage, 1 qadam side par) mein chalta hai.',
        'Shatranj ka wahid mohra jo deewar aur doosre mohron ke upar se kood sakta hai!',
        'Hamesha mukhalif rang ke khane par utarta hai.',
        'Aik sath do mohron par dohra hamla (Fork) karne mein maahir hai.'
      ],
      proTipEn: 'Knights are strongest in the center of the board where they control 8 squares! "A knight on the rim is dim."',
      proTipUr: 'Ghora board ke darmiyan mein sab se taqatwar hota hai jahan se 8 khanon par hamla kar sakta hai.',
      sampleSetup: [
        { row: 4, col: 4, piece: { type: 'n', color: 'w' } },
        { row: 2, col: 5, piece: { type: 'p', color: 'b' } },
        { row: 2, col: 3, piece: { type: 'p', color: 'b' } }
      ],
      samplePieceCoord: { row: 4, col: 4 }
    },
    {
      type: 'b',
      nameEn: 'Bishop',
      nameUr: 'Feel / Oont (Bishop)',
      urduPronounce: 'فیل / اونٹ',
      value: '3 Points',
      icon: <Sparkles className="w-5 h-5" />,
      howMovesEn: [
        'Moves diagonally as far as the path is clear.',
        'Stays on its designated color (light or dark) for the entire match.',
        'Pairs wonderfully with another bishop to control both light and dark squares.'
      ],
      howMovesUr: [
        'Tirchi (diagonal) lines mein jitni door chahe chal sakta hai.',
        'Apne shuruati rang (light ya dark) par hi poori game rehta hai.',
        'Dono Feel mil kar pooray board par tirchi deewar qaim karte hain.'
      ],
      proTipEn: 'Fianchetto your bishop (placing it on b2/g2) to create a long-range diagonal sniper across the board.',
      proTipUr: 'Feel ke raastay se apne piyaday hata kar diagonal khuli rakhein taakay door tak nishana lagaye.',
      sampleSetup: [
        { row: 4, col: 3, piece: { type: 'b', color: 'w' } },
        { row: 1, col: 6, piece: { type: 'p', color: 'b' } }
      ],
      samplePieceCoord: { row: 4, col: 3 }
    },
    {
      type: 'r',
      nameEn: 'Rook',
      nameUr: 'Haathi / Qila (Rook)',
      urduPronounce: 'ہاتھی / قلعہ',
      value: '5 Points',
      icon: <Castle className="w-5 h-5" />,
      howMovesEn: [
        'Moves in straight horizontal ranks and vertical files with infinite range.',
        'Cannot jump over pieces.',
        'Can participate in "Castling" with the King for royal safety.',
        'Devastating on open files and 7th rank invasions.'
      ],
      howMovesUr: [
        'Seedhi lines (aage, peeche, dayen, bayen) mein jahan tak rasta khula ho chalta hai.',
        'Mohron ke upar se nahi kood sakta.',
        'Badshah ke sath mil kar "Castling" karke Badshah ko mehfooz karta hai.',
        '7th rank par dushman ke piyadon ka safaya karta hai.'
      ],
      proTipEn: 'Place your Rooks on open files (columns without pawns) to infiltrate deep into enemy territory.',
      proTipUr: 'Haathi ko hamesha khuli line (open file) par layein jahan koi piyada rasta na rok raha ho.',
      sampleSetup: [
        { row: 7, col: 3, piece: { type: 'r', color: 'w' } },
        { row: 2, col: 3, piece: { type: 'p', color: 'b' } },
        { row: 7, col: 6, piece: { type: 'p', color: 'b' } }
      ],
      samplePieceCoord: { row: 7, col: 3 }
    },
    {
      type: 'q',
      nameEn: 'Queen',
      nameUr: 'Wazir / Malika (Queen)',
      urduPronounce: 'وزیر / ملکہ',
      value: '9 Points (Supreme)',
      icon: <Crown className="w-5 h-5" />,
      howMovesEn: [
        'Combines the full powers of the Rook and Bishop!',
        'Moves in any straight line OR any diagonal line for any distance.',
        'The most versatile and lethal attacking piece in chess.',
        'Avoid bringing her out too early where minor pieces can attack her.'
      ],
      howMovesUr: [
        'Haathi aur Feel dono ki taqat aik sath rakhti hai!',
        'Seedha aur tircha har taraf jahan tak rasta ho chal sakti hai.',
        'Shatranj ka sab se taqatwar aur qeemti mohra.',
        'Shuru mein Wazir ko foran aage na layein warna dushman ghoray is par hamla kar denge.'
      ],
      proTipEn: 'Coordinate your Queen with a Knight or Bishop for unstoppable checkmate delivery patterns.',
      proTipUr: 'Wazir ko akele hamlay par na bhejein, doosre mohron ke sath mil kar Checkmate karein.',
      sampleSetup: [
        { row: 4, col: 3, piece: { type: 'q', color: 'w' } },
        { row: 1, col: 3, piece: { type: 'p', color: 'b' } },
        { row: 2, col: 5, piece: { type: 'p', color: 'b' } }
      ],
      samplePieceCoord: { row: 4, col: 3 }
    },
    {
      type: 'k',
      nameEn: 'King',
      nameUr: 'Badshah (King)',
      urduPronounce: 'بادشاہ',
      value: 'Priceless (Royal)',
      icon: <Zap className="w-5 h-5" />,
      howMovesEn: [
        'Steps exactly 1 square in any direction (horizontal, vertical, diagonal).',
        'Cannot step into check or attacked squares.',
        'Must be defended at all costs — if checkmated, game ends immediately.',
        'In the endgame, the King becomes an active hero to escort passed pawns.'
      ],
      howMovesUr: [
        'Har simt mein sirf 1 qadam chal sakta hai.',
        'Kisi aisi jagah nahi ja sakta jahan dushman hamla kar raha ho.',
        'Iska difaa sab se ahem hai — Maat hone par game khatam!',
        'Game ke aakhri hissay (Endgame) mein Badshah aage aa kar madad karta hai.'
      ],
      proTipEn: 'Castle early to tuck your King safely in the corner behind a shield of three pawns.',
      proTipUr: 'Shuruat mein hi Castling karke Badshah ko kone mein mehfooz kar lein.',
      sampleSetup: [
        { row: 4, col: 4, piece: { type: 'k', color: 'w' } },
        { row: 3, col: 4, piece: { type: 'p', color: 'b' } }
      ],
      samplePieceCoord: { row: 4, col: 4 }
    }
  ];

  const currentGuide = PIECE_GUIDES.find((g) => g.type === selectedPieceType) || PIECE_GUIDES[0];
  const demoBoard = setupBoard(currentGuide.sampleSetup);
  const demoMoves = getLegalMovesForPiece(demoBoard, currentGuide.samplePieceCoord, false);

  return (
    <div id="academy-container" className="w-full max-w-5xl mx-auto px-4 py-6">
      {/* Header Title */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-black uppercase tracking-wider mb-2 border border-indigo-500/30">
          <Sparkles className="w-3.5 h-3.5" />
          {t('academyTitle')}
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
          {lang === 'ur' ? 'Shatranj Ke Mohray aur Unki Taqat' : 'Chess Pieces & Master Rules'}
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl mx-auto">
          {t('academySubtitle')}
        </p>
      </div>

      {/* Piece Selector Tabs */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 mb-8">
        {PIECE_GUIDES.map((guide) => {
          const isSelected = guide.type === selectedPieceType;
          return (
            <button
              key={guide.type}
              id={`academy-tab-${guide.type}`}
              onClick={() => setSelectedPieceType(guide.type)}
              className={`p-3.5 rounded-2xl border transition-all flex flex-col items-center gap-2 cursor-pointer ${
                isSelected
                  ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-[0_0_15px_rgba(79,70,229,0.3)]'
                  : 'bg-zinc-900/90 border-slate-800 text-slate-400 hover:bg-zinc-800 hover:text-slate-200'
              }`}
            >
              <div className="w-10 h-10 flex items-center justify-center">
                <ChessPieceSvg type={guide.type} color={isSelected ? 'w' : 'w'} isGlowing={isSelected} />
              </div>
              <div className="text-center">
                <div className="text-xs font-black">
                  {lang === 'ur' ? guide.nameUr.split(' ')[0] : guide.nameEn}
                </div>
                <div className="text-[10px] text-indigo-400 font-bold">{guide.value}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Piece In-Depth Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#16161a] rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-2xl">
        {/* Interactive Demo Board Column */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full max-w-[340px]">
            <ChessBoard
              board={demoBoard}
              selectedSquare={currentGuide.samplePieceCoord}
              validMoves={demoMoves}
              interactive={false}
              onSquareClick={() => {}}
            />
          </div>
          <p className="text-xs text-center text-slate-400 mt-3">
            {lang === 'ur'
              ? '🟣 Glowing nishanat dikhate hain ke yeh mohra kahan chal sakta hai'
              : '🟣 Glowing nodes demonstrate all valid moves and captures'}
          </p>
        </div>

        {/* Rules & Pro Tips Column */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black text-white flex items-center gap-2">
                {lang === 'ur' ? currentGuide.nameUr : currentGuide.nameEn}
              </h3>
              <span className="px-3 py-1 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-black">
                {currentGuide.value}
              </span>
            </div>
            <div className="text-xs text-indigo-400 font-bold mt-1">
              {lang === 'ur' ? `Urdu Naam: ${currentGuide.urduPronounce}` : `Urdu Term: ${currentGuide.urduPronounce}`}
            </div>
          </div>

          {/* Movement rules */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">
              {t('howItMoves')}
            </h4>
            <ul className="space-y-2.5">
              {(lang === 'ur' ? currentGuide.howMovesUr : currentGuide.howMovesEn).map((rule, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200 leading-relaxed">
                  <div className="w-5 h-5 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-indigo-400" />
                  </div>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pro Grandmaster Tip */}
          <div className="p-4 rounded-2xl bg-indigo-600/10 border border-indigo-500/30">
            <div className="flex items-center gap-2 text-xs font-black text-indigo-400 uppercase tracking-wider mb-1">
              <Lightbulb className="w-4 h-4" />
              {t('proTip')}
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {lang === 'ur' ? currentGuide.proTipUr : currentGuide.proTipEn}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
