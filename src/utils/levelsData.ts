import { LevelCategory, BoardState, Piece } from '../types/chess';

// Helper to generate empty 8x8 board
export function createEmptyBoard(): BoardState {
  return Array(8).fill(null).map(() => Array(8).fill(null));
}

// Helper to place pieces on empty board
export function setupBoard(placements: Array<{ row: number; col: number; piece: Piece }>): BoardState {
  const board = createEmptyBoard();
  placements.forEach(({ row, col, piece }) => {
    board[row][col] = piece;
  });
  return board;
}

export const LEVELS_DATA: LevelCategory[] = [
  // ================= LEVEL 1: PAWN (PIYADA) =================
  {
    id: 1,
    slug: 'pawn',
    nameEn: 'Level 1: The Brave Pawn',
    nameUr: 'Level 1: Bahadur Piyada (Pawn)',
    piece: 'p',
    iconName: 'Shield',
    badge: '1 pt',
    colorTheme: 'from-emerald-500 to-teal-700',
    descriptionEn: 'Learn Pawn movements, 2-step first turn, diagonal capture, and crowning promotion!',
    descriptionUr: 'Piyaday ki seedhi chaal, tircha shikar aur aakhri khane mein Wazir banna seekhein!',
    stages: [
      {
        id: '1-1',
        titleEn: 'First March & Step-by-Step',
        titleUr: 'Pehli Chaal aur Seedha Safar',
        subtitleEn: 'Pawns move 1 step forward, or 2 steps on their first move!',
        subtitleUr: 'Piyada pehli dafa 2 qadam aage chal sakta hai, aur baad mein 1 qadam!',
        explanationEn: [
          'The Pawn (Piyada) is your brave foot soldier.',
          'On its very first move from rank 2, a pawn can advance 1 or 2 squares straight forward.',
          'After that, it always advances 1 square at a time straight forward.',
          'Collect all glowing gems by moving forward!'
        ],
        explanationUr: [
          'Piyada shatranj ka bahadur sipahi hota hai.',
          'Apni pehli chaal par yeh 1 ya 2 qadam aage ja sakta hai.',
          'Uske baad yeh hamesha 1 qadam seedha aage chalta hai.',
          'Aage barhein aur raaste mein aane walay heere (gems) ikhate karein!'
        ],
        initialBoard: setupBoard([
          { row: 6, col: 4, piece: { type: 'p', color: 'w' } } // e2 pawn
        ]),
        playerColor: 'w',
        goal: {
          type: 'collect_gems',
          gems: [
            { row: 4, col: 4 }, // e4
            { row: 3, col: 4 }, // e5
            { row: 2, col: 4 }  // e6
          ],
          descriptionEn: 'Advance your pawn to collect all 3 gems along the file!',
          descriptionUr: 'Piyaday ko aage barha kar 3 heere (gems) jama karein!'
        },
        coachInitialEn: 'Piyada (Pawn) can leap 2 squares forward on its opening move! Tap the pawn to see where it can go!',
        coachInitialUr: 'Piyada apni pehli chaal par 2 qadam aage kood sakta hai! Mohray par tap karein aur chaal dekhein!',
        coachSuccessEn: 'Excellent march! You learned the straight path of the pawn!',
        coachSuccessUr: 'Zabardast! Aap ne piyaday ki seedhi chaal mukammal kar li!',
        coachHintEn: 'Tap the White Pawn on e2, then tap the highlighted square on e4 or e3.',
        coachHintUr: 'Piyaday par tap karein aur hari chamakti jagah par chalain.',
        bestMoves: [{ row: 4, col: 4 }]
      },
      {
        id: '1-2',
        titleEn: 'The Diagonal Strike (Shikar)',
        titleUr: 'Tircha Shikar (Diagonal Capture)',
        subtitleEn: 'Pawns only capture enemy pieces diagonally 1 step forward!',
        subtitleUr: 'Piyada dushman ko hamesha 1 qadam aage tircha (diagonal) mar kar uski jagah leta hai!',
        explanationEn: [
          'CRITICAL RULE: Pawns march straight, but they CANNOT capture straight ahead.',
          'Pawns capture enemy pieces 1 square diagonally forward to the left or right.',
          'If an enemy piece is directly in front of a pawn, the pawn is blocked and cannot move forward!'
        ],
        explanationUr: [
          'ZAROORI ASOOL: Piyada seedha chalta hai magar seedha dushman ko nahi maar sakta.',
          'Piyada sirf 1 qadam aage tircha (diagonal) dushman par hamla karke usey board se nikaal sakta hai.',
          'Agar dushman samne khara ho to piyada ruk jata hai.'
        ],
        initialBoard: setupBoard([
          { row: 5, col: 3, piece: { type: 'p', color: 'w' } }, // d3 pawn
          { row: 4, col: 4, piece: { type: 'p', color: 'b' } }, // e4 black pawn
          { row: 3, col: 3, piece: { type: 'n', color: 'b' } }  // d5 black knight (later diagonal target after capture)
        ]),
        playerColor: 'w',
        goal: {
          type: 'capture_all',
          descriptionEn: 'Capture all black target pieces diagonally with your pawn!',
          descriptionUr: 'Tirchi (diagonal) chaal se dushman ke tamam mohray shikar karein!'
        },
        coachInitialEn: 'Look! The black piece is diagonal to your pawn. Tap your pawn and capture it!',
        coachInitialUr: 'Dekhein! Dushman ka mohra aapke piyaday se tircha hai. Us par hamla karke capture karein!',
        coachSuccessEn: 'Shabash! You mastered the pawn diagonal capture!',
        coachSuccessUr: 'Shabash! Aap ne piyaday ka tircha shikar seekh liya!',
        coachHintEn: 'Tap your Pawn on d3 and click on the enemy piece on e4.',
        coachHintUr: 'Piyaday par tap karein aur e4 par mojood dushman ke mohray par click karein.',
        bestMoves: [{ row: 4, col: 4 }]
      },
      {
        id: '1-3',
        titleEn: 'The Royal Promotion (Wazir Banna)',
        titleUr: 'Piyaday Ki Taraqqi (Promotion)',
        subtitleEn: 'Reach the 8th rank to transform your pawn into a mighty Queen!',
        subtitleUr: 'Board ke aakhri siray (8th rank) par pohanch kar piyada Wazir ban jata hai!',
        explanationEn: [
          'When your pawn fights its way to the farthest edge (Rank 8), it achieves Promotion!',
          'You can transform it into a Queen, Rook, Bishop, or Knight.',
          'Most grandmasters choose the Queen because she is the most powerful piece on the board!'
        ],
        explanationUr: [
          'Jab aapka piyada dushman ki aakhri line (8th rank) par pohanchta hai, to uski Taraqqi (Promotion) hoti hai!',
          'Aap usay Wazir (Queen), Haathi (Rook), Feel (Bishop) ya Ghora (Knight) bana sakte hain.',
          'Aam tor par Wazir banaya jata hai kyunke Wazir sab se zyada taqatwar hai!'
        ],
        initialBoard: setupBoard([
          { row: 1, col: 3, piece: { type: 'p', color: 'w' } }, // d7 pawn
          { row: 0, col: 4, piece: { type: 'r', color: 'b' } }  // e8 black rook
        ]),
        playerColor: 'w',
        goal: {
          type: 'capture_all',
          descriptionEn: 'Strike the final enemy piece on the 8th rank and promote to a Queen!',
          descriptionUr: 'Aakhri line par dushman ke mohray ko mar kar Wazir banayein!'
        },
        coachInitialEn: 'One last diagonal step to reach the end of the board and crown your new Queen!',
        coachInitialUr: 'Sirf 1 qadam door hai aapka piyada Wazir banne ke liye! Hamla karein!',
        coachSuccessEn: 'Incredible! Your humble pawn transformed into a majestic Queen!',
        coachSuccessUr: 'Wah! Aapka chota piyada taqatwar Wazir (Queen) ban gaya!',
        coachHintEn: 'Move the Pawn from d7 to capture the Rook on e8 and crown your Queen.',
        coachHintUr: 'Piyaday ko d7 se e8 par chal kar Haathi ko capture karein.',
        bestMoves: [{ row: 0, col: 4 }]
      }
    ]
  },

  // ================= LEVEL 2: ROOK & BISHOP (HAATHI AUR FEEL) =================
  {
    id: 2,
    slug: 'rook-bishop',
    nameEn: 'Level 2: Rook & Bishop',
    nameUr: 'Level 2: Haathi (Rook) aur Feel / Oont (Bishop)',
    piece: 'r',
    iconName: 'Castle',
    badge: '5 pts & 3 pts',
    colorTheme: 'from-blue-600 to-indigo-800',
    descriptionEn: 'Control ranks and files with the Rook, and slice diagonals with the Bishop!',
    descriptionUr: 'Haathi ki seedhi qatarein aur Feel ki tirchhi long-range chalangein seekhein!',
    stages: [
      {
        id: '2-1',
        titleEn: 'The Mighty Rook Cannon',
        titleUr: 'Haathi (Rook) Ka Seedha Hamla',
        subtitleEn: 'Rooks move in straight horizontal and vertical lines with infinite range!',
        subtitleUr: 'Haathi seedhi line mein (dayen, bayen, aage, peeche) jahan tak rasta khula ho ja sakta hai!',
        explanationEn: [
          'The Rook (Haathi / Castle) is worth 5 points.',
          'It moves any number of squares along ranks (horizontal rows) and files (vertical columns).',
          'It cannot jump over obstacles, but it clears entire straight lanes!'
        ],
        explanationUr: [
          'Haathi ki qeemat 5 points hoti hai.',
          'Yeh seedhi lines mein aage, peeche, dayen aur bayen jitni door chahe chal sakta hai.',
          'Yeh kisi mohray ke upar se nahi kood sakta, magar seedhay raste saaf kar deta hai!'
        ],
        initialBoard: setupBoard([
          { row: 7, col: 0, piece: { type: 'r', color: 'w' } }, // a1
          { row: 1, col: 0, piece: { type: 'p', color: 'b' } }, // a7 target
          { row: 1, col: 7, piece: { type: 'p', color: 'b' } }, // h7 target
          { row: 7, col: 7, piece: { type: 'p', color: 'b' } }  // h1 target
        ]),
        playerColor: 'w',
        goal: {
          type: 'capture_all',
          descriptionEn: 'Use your Rook to capture all 3 enemy targets in straight lines!',
          descriptionUr: 'Haathi ke zariye seedhi lines mein teeno dushman mohray capture karein!'
        },
        coachInitialEn: 'Rooks rule straight lines! Sweep up the file first, then turn right!',
        coachInitialUr: 'Haathi seedhi line ka badshah hai! Pehle seedha upar jayein phir dayen murein!',
        coachSuccessEn: 'Flawless line control! The Rook cleared the entire perimeter!',
        coachSuccessUr: 'Zabardast! Haathi ne charon taraf se board saaf kar diya!',
        coachHintEn: 'Capture the piece on a7 first, then h7, then h1.',
        coachHintUr: 'Pehle a7 wale mohray ko maarein, phir h7 aur aakhir mein h1.',
        bestMoves: [{ row: 1, col: 0 }]
      },
      {
        id: '2-2',
        titleEn: 'The Bishop Color Sniper',
        titleUr: 'Feel / Oont (Bishop) Ka Tircha Teer',
        subtitleEn: 'Bishops move diagonally across the board, forever bound to their tile color!',
        subtitleUr: 'Feel hamesha apne shuruati rang (light ya dark) par tircha (diagonal) door tak chalta hai!',
        explanationEn: [
          'The Bishop (Feel / Oont) is worth 3 points.',
          'It moves diagonally any number of open squares.',
          'A Light-squared bishop will ALWAYS stay on light squares, and a Dark-squared bishop on dark squares!'
        ],
        explanationUr: [
          'Feel ki qeemat 3 points hoti hai.',
          'Yeh tirchay (diagonal) khano par jitna door chahe ja sakta hai.',
          'Safaid khane ka Feel hamesha safaid par rahega, aur kaale khane ka kaale par!'
        ],
        initialBoard: setupBoard([
          { row: 7, col: 2, piece: { type: 'b', color: 'w' } }, // c1 light bishop
          { row: 4, col: 5, piece: { type: 'n', color: 'b' } }, // f4 target
          { row: 2, col: 7, piece: { type: 'p', color: 'b' } }, // h6 target
          { row: 0, col: 5, piece: { type: 'p', color: 'b' } }  // f8 target
        ]),
        playerColor: 'w',
        goal: {
          type: 'capture_all',
          descriptionEn: 'Snipe the diagonal targets one by one with your Bishop!',
          descriptionUr: 'Feel se tirchay raste par dushman ke mohray capture karein!'
        },
        coachInitialEn: 'Trace the diagonal beam of your Bishop! It zips across light squares!',
        coachInitialUr: 'Feel ki tirchi nazar dekhein! Yeh light squares par tez raftari se chalta hai!',
        coachSuccessEn: 'Sharp diagonal aim! You understand the color-bound Bishop!',
        coachSuccessUr: 'Kamal ka nishana! Feel ka tircha rasta aap ne seekh liya!',
        coachHintEn: 'Move Bishop from c1 to f4 to capture the Knight.',
        coachHintUr: 'Feel ko c1 se f4 par chal kar Ghoray ko shikar karein.',
        bestMoves: [{ row: 4, col: 5 }]
      },
      {
        id: '2-3',
        titleEn: 'Rook & Bishop Combo Puzzle',
        titleUr: 'Haathi aur Feel Ka Shandar Jor (Combo)',
        subtitleEn: 'Coordinate straight and diagonal lines to solve the puzzle!',
        subtitleUr: 'Haathi aur Feel ko mila kar dushman ke mohron ka khatma karein!',
        explanationEn: [
          'In real chess games, Rooks and Bishops form a lethal team.',
          'Use the Rook for straight ranks and the Bishop for diagonal crossfires.'
        ],
        explanationUr: [
          'Asal shatranj mein Haathi aur Feel mil kar dushman par shandar hamla karte hain.',
          'Seedhay raste ke liye Haathi aur tirchay ke liye Feel istemal karein.'
        ],
        initialBoard: setupBoard([
          { row: 7, col: 3, piece: { type: 'r', color: 'w' } }, // d1 rook
          { row: 6, col: 2, piece: { type: 'b', color: 'w' } }, // c2 bishop
          { row: 3, col: 3, piece: { type: 'n', color: 'b' } }, // d5 target
          { row: 2, col: 6, piece: { type: 'q', color: 'b' } }  // g6 target
        ]),
        playerColor: 'w',
        goal: {
          type: 'capture_all',
          descriptionEn: 'Clear both black pieces using the proper line piece!',
          descriptionUr: 'Sahi mohra chun kar dono dushman mohray capture karein!'
        },
        coachInitialEn: 'Choose wisely: which piece attacks straight, and which attacks diagonally?',
        coachInitialUr: 'Ghor karein: kaunsa mohra seedha marega aur kaunsa tircha?',
        coachSuccessEn: 'Masterful teamwork! Straight and diagonal mastery achieved!',
        coachSuccessUr: 'Zabardast jori! Haathi aur Feel dono par uboor hasil ho gaya!',
        coachHintEn: 'First take the Knight on d5 with the Rook, then the Queen on g6 with the Bishop!',
        coachHintUr: 'Pehle Haathi se d5 par Ghora maarein, phir Feel se g6 par Wazir maarein.',
        bestMoves: [{ row: 3, col: 3 }]
      }
    ]
  },

  // ================= LEVEL 3: KNIGHT (GHORA) =================
  {
    id: 3,
    slug: 'knight',
    nameEn: 'Level 3: The Jumping Knight',
    nameUr: 'Level 3: Chhalaang Maarta Ghora (Knight)',
    piece: 'n',
    iconName: 'Award',
    badge: '3 pts (L-Jump)',
    colorTheme: 'from-amber-500 to-orange-700',
    descriptionEn: 'Master the tricky "L" shape jumps, hurdle over barriers, and land royal forks!',
    descriptionUr: '"L" shape chaal seekhein, mohron ke upar se koodna aur Fork hamlay!',
    stages: [
      {
        id: '3-1',
        titleEn: 'The Sacred "L" Hop',
        titleUr: '"L" Shape Chalaang',
        subtitleEn: 'Knights move 2 squares in one direction, then 1 square at a right angle!',
        subtitleUr: 'Ghora hamesha 2 qadam aage aur 1 qadam dayen/bayen ("L" shape) koodta hai!',
        explanationEn: [
          'The Knight (Ghora) is worth 3 points.',
          'It moves in an "L" pattern: 2 steps in one direction + 1 step perpendicular (or 1 step + 2 steps).',
          'It always lands on a square of the OPPOSITE color from where it started!'
        ],
        explanationUr: [
          'Ghoray ki qeemat 3 points hoti hai.',
          'Yeh "L" shakal mein chalta hai: 2 qadam seedha aur 1 qadam dayen ya bayen.',
          'Agar ghora safaid khane par hai, to chalne ke baad hamesha kaale khane par utrega!'
        ],
        initialBoard: setupBoard([
          { row: 5, col: 2, piece: { type: 'n', color: 'w' } }, // c3 knight
        ]),
        playerColor: 'w',
        goal: {
          type: 'collect_gems',
          gems: [
            { row: 3, col: 3 }, // d5
            { row: 2, col: 5 }, // f6
            { row: 0, col: 6 }  // g8
          ],
          descriptionEn: 'Hop in "L" shapes to collect the gems across the board!',
          descriptionUr: '"L" shape chalangein laga kar tamam heere ikhate karein!'
        },
        coachInitialEn: 'Count 1-2 forward, then 1 to the side! That is your Knight\'s "L" magic!',
        coachInitialUr: 'Ginti karein: 1-2 qadam aage, phir 1 qadam side par! Yeh hai ghoray ka "L" jaadu!',
        coachSuccessEn: 'Galloping perfection! You mastered the L-shaped hop!',
        coachSuccessUr: 'Kamal ki chalang! "L" shape chaal par aapki pakar mazboot ho gayi!',
        coachHintEn: 'Tap your Knight on c3 and jump to d5 to grab the first gem.',
        coachHintUr: 'c3 wale ghoray par tap karein aur d5 par kood kar pehla heera uthayein.',
        bestMoves: [{ row: 3, col: 3 }]
      },
      {
        id: '3-2',
        titleEn: 'Wall Jumper (Bypass Obstacles)',
        titleUr: 'Deewaron Ke Upar Se Chhalaang',
        subtitleEn: 'The Knight is the ONLY piece on the chessboard that can jump over other pieces!',
        subtitleUr: 'Ghora shatranj ka WAHID mohra hai jo kisi bhi mohray ke upar se kood sakta hai!',
        explanationEn: [
          'Every other piece is blocked if a piece is in its path.',
          'The Knight completely ignores barriers and leaps over pawns, rooks, queens, or kings!',
          'Use this jumping power to surprise trapped enemy pieces.'
        ],
        explanationUr: [
          'Baqi tamam mohray raaste mein kisi aur mohray ke aane se ruk jatay hain.',
          'Magar Ghora deewar aur kisi bhi mohray ke upar se chhalang laga kar paar nikal jata hai!',
          'Dushman ke band raste ke bawajood target ko shikar karein.'
        ],
        initialBoard: setupBoard([
          { row: 7, col: 1, piece: { type: 'n', color: 'w' } }, // b1 knight
          { row: 6, col: 0, piece: { type: 'p', color: 'w' } }, // a2 pawn
          { row: 6, col: 1, piece: { type: 'p', color: 'w' } }, // b2 pawn
          { row: 6, col: 2, piece: { type: 'p', color: 'w' } }, // c2 pawn
          { row: 5, col: 2, piece: { type: 'p', color: 'b' } }, // c3 obstacle
          { row: 3, col: 2, piece: { type: 'q', color: 'b' } }  // c5 target queen!
        ]),
        playerColor: 'w',
        goal: {
          type: 'capture_all',
          descriptionEn: 'Jump right over the pawn wall to hunt the black Queen!',
          descriptionUr: 'Piyadon ki deewar ke upar se kood kar dushman ki Queen capture karein!'
        },
        coachInitialEn: 'Don\'t worry about the pawns blocking your front. Knights can jump right over them!',
        coachInitialUr: 'Samne wale piyadon ki fikar na karein. Ghora unke upar se kood sakta hai!',
        coachSuccessEn: 'Awesome jump! Trapped walls mean nothing to the mighty Knight!',
        coachSuccessUr: 'Behtareen chhalang! Ghoray ke aage koi deewar nahi thehar sakti!',
        coachHintEn: 'Jump to a3 first, then hop to c5 to take the Queen.',
        coachHintUr: 'Pehle a3 par koodain, phir wahan se c5 par Queen ko maarein.',
        bestMoves: [{ row: 5, col: 0 }]
      },
      {
        id: '3-3',
        titleEn: 'The Royal Fork Tactic',
        titleUr: 'Shahi Fork Hamla (Dohra Hamla)',
        subtitleEn: 'Attack multiple powerful enemy pieces simultaneously with one knight move!',
        subtitleUr: 'Ek hi chaal se dushman ke 2 bare mohron par aik sath hamla (Fork) karein!',
        explanationEn: [
          'A "Fork" occurs when a single piece attacks two or more opponent pieces at the same time.',
          'Knights are the most dangerous forking pieces because their attacks cannot be blocked!',
          'Position your Knight to fork the enemy King and Queen!'
        ],
        explanationUr: [
          'Fork ka matlab hai ek mohray se dushman ke 2 ya zyada mohron par yak-waqt hamla karna.',
          'Ghoray ka Fork sab se khatarnak hota hai kyunke iska rasta koi block nahi kar sakta!',
          'Ghoray ko aisi jagah utarein jahan se Badshah aur Wazir dono par hamla ho.'
        ],
        initialBoard: setupBoard([
          { row: 4, col: 2, piece: { type: 'n', color: 'w' } }, // c4 knight
          { row: 1, col: 2, piece: { type: 'k', color: 'b' } }, // c7 black king
          { row: 1, col: 6, piece: { type: 'q', color: 'b' } }  // g7 black queen
        ]),
        playerColor: 'w',
        goal: {
          type: 'capture_all',
          descriptionEn: 'Hop your knight to e6 (row 2, col 4) to fork King and Queen, then capture Queen!',
          descriptionUr: 'Ghoray ko e6 par chal kar Fork karein aur phir Queen capture karein!'
        },
        coachInitialEn: 'Find the magic square that threatens both the King and the Queen at once!',
        coachInitialUr: 'Woh jaadui khana talash karein jahan se Badshah aur Wazir dono ghoray ke nishanay par aa jayein!',
        coachSuccessEn: 'Brilliant Royal Fork! You captured their queen with devastating tactics!',
        coachSuccessUr: 'Shahi Fork! Aap ne aik teer se do shikar karke Wazir ko capture kiya!',
        coachHintEn: 'Jump your Knight to e6 (square with glowing circle) to fork them.',
        coachHintUr: 'Ghoray ko e6 wale chamakdar khane par koodain.',
        bestMoves: [{ row: 2, col: 4 }]
      }
    ]
  },

  // ================= LEVEL 4: QUEEN & KING (WAZIR AUR BADSHAH) =================
  {
    id: 4,
    slug: 'queen-king',
    nameEn: 'Level 4: Queen & King',
    nameUr: 'Level 4: Wazir (Queen) aur Badshah (King)',
    piece: 'q',
    iconName: 'Crown',
    badge: '9 pts & Royal',
    colorTheme: 'from-purple-600 to-pink-700',
    descriptionEn: 'Unleash the supreme power of the Queen and master the sacred safety of the King!',
    descriptionUr: 'Wazir ki la-mehdood taqat aur Badshah ki hifazat ke asool seekhein!',
    stages: [
      {
        id: '4-1',
        titleEn: 'Queen\'s Supreme Dominion',
        titleUr: 'Wazir Ki Be-Misaal Taqat',
        subtitleEn: 'The Queen combines the power of BOTH the Rook and the Bishop!',
        subtitleUr: 'Wazir Haathi aur Feel dono ki tarah seedha aur tircha har taraf chal sakti hai!',
        explanationEn: [
          'The Queen (Wazir / Malika) is worth 9 points — the highest in the game.',
          'She can move in any straight line (horizontal, vertical) OR any diagonal line for any distance.',
          'She cannot jump over pieces, but commands massive board control.'
        ],
        explanationUr: [
          'Wazir ki qeemat 9 points hoti hai — shatranj ka sab se qeemti aur taqatwar mohra.',
          'Yeh seedhi lines mein bhi aur tirchay (diagonal) raste par bhi jahan tak rasta ho chal sakti hai.',
          'Iske zariye dushman ke mohron ka safaya karein!'
        ],
        initialBoard: setupBoard([
          { row: 4, col: 3, piece: { type: 'q', color: 'w' } }, // d4 queen
          { row: 1, col: 3, piece: { type: 'p', color: 'b' } }, // d7 (straight)
          { row: 1, col: 6, piece: { type: 'r', color: 'b' } }, // g7 (diagonal)
          { row: 4, col: 7, piece: { type: 'n', color: 'b' } }  // h4 (horizontal)
        ]),
        playerColor: 'w',
        goal: {
          type: 'capture_all',
          descriptionEn: 'Use your Queen to eliminate all 3 targets in any order!',
          descriptionUr: 'Wazir ki seedhi aur tirchi chaal se tamam 3 targets capture karein!'
        },
        coachInitialEn: 'Feel the Queen\'s absolute power! Straight up, sideways, and diagonal!',
        coachInitialUr: 'Wazir ki taqat dekhein! Seedha upar, side par aur tircha!',
        coachSuccessEn: 'Magnificent power! The Queen commands total board supremacy!',
        coachSuccessUr: 'Behtareen! Wazir ne pooray board par apna dabdaba qaim kar liya!',
        coachHintEn: 'Take the pawn on d7, then sweep diagonally to g7, then across to h4.',
        coachHintUr: 'Pehle d7 wala piyada maarein, phir tircha g7 aur aakhir mein h4.',
        bestMoves: [{ row: 1, col: 3 }]
      },
      {
        id: '4-2',
        titleEn: 'The King\'s Royal Step',
        titleUr: 'Badshah Ka Shahi Qadam',
        subtitleEn: 'The King moves exactly ONE square in any direction, and must never enter danger!',
        subtitleUr: 'Badshah har taraf sirf 1 qadam chal sakta hai, aur kisi khatarnak khane par nahi ja sakta!',
        explanationEn: [
          'The King (Badshah) is priceless. If he is checkmated, the game is immediately LOST.',
          'He can step 1 square forward, backward, left, right, or diagonally.',
          'The King CANNOT step onto a square that is being attacked by an enemy piece!'
        ],
        explanationUr: [
          'Badshah anmol hai. Agar Badshah ko Maat (Checkmate) ho jaye to game foran khatam ho jati hai.',
          'Badshah har simt mein sirf 1 qadam aage, peeche, dayen, bayen ya tircha chal sakta hai.',
          'Badshah kabhi kisi aisi jagah nahi ja sakta jahan dushman ka mohra hamla kar raha ho!'
        ],
        initialBoard: setupBoard([
          { row: 6, col: 4, piece: { type: 'k', color: 'w' } }, // e2 king
          { row: 2, col: 2, piece: { type: 'r', color: 'b' } }  // c6 black rook (controls column c)
        ]),
        playerColor: 'w',
        goal: {
          type: 'collect_gems',
          gems: [
            { row: 5, col: 4 }, // e3
            { row: 4, col: 5 }, // f4
            { row: 3, col: 6 }  // g5
          ],
          descriptionEn: 'Step your King 1 square at a time to collect gems while staying far from the Rook\'s attack line!',
          descriptionUr: 'Badshah ko 1, 1 qadam chala kar heere ikhate karein aur Haathi ke raste se door rahein!',
        },
        coachInitialEn: 'The King moves with regal dignity: exactly 1 square in any direction! Stay safe!',
        coachInitialUr: 'Badshah shahi andaz mein 1 qadam chalta hai! Khatray se hifazat zaroori hai!',
        coachSuccessEn: 'Noble leadership! You safely guided the King through the realm!',
        coachSuccessUr: 'Shabash! Badshah ko hifazat ke sath manzil tak pohancha diya!',
        coachHintEn: 'Step the King diagonally to e3, then f4, then g5.',
        coachHintUr: 'Badshah ko e3 par chalain, phir f4 aur phir g5.',
        bestMoves: [{ row: 5, col: 4 }]
      },
      {
        id: '4-3',
        titleEn: 'King\'s Self-Defense (Capture Attacker)',
        titleUr: 'Badshah Ka Apna Difaa (Self Defense)',
        subtitleEn: 'The King can fight! He can capture any unprotected enemy piece right next to him.',
        subtitleUr: 'Badshah khud bhi shikar kar sakta hai! Apne barabar khare be-sahara mohray ko maar sakta hai.',
        explanationEn: [
          'If an enemy piece steps right next to the King and has NO defenders, the King can capture it directly!',
          'Eliminate the nearby threats to secure total safety.'
        ],
        explanationUr: [
          'Agar dushman ka mohra Badshah ke bilkul qareeb aa jaye aur usay koi dushman piece bacha na raha ho, to Badshah khud usay maar sakta hai!',
          'Dushman ke mohray ko khatam karke aman qaim karein.'
        ],
        initialBoard: setupBoard([
          { row: 4, col: 4, piece: { type: 'k', color: 'w' } }, // e4 king
          { row: 3, col: 4, piece: { type: 'p', color: 'b' } }, // e5 black pawn (unprotected)
          { row: 2, col: 5, piece: { type: 'n', color: 'b' } }  // f6 black knight (unprotected after)
        ]),
        playerColor: 'w',
        goal: {
          type: 'capture_all',
          descriptionEn: 'Step with your King to strike both adjacent enemy pieces!',
          descriptionUr: 'Badshah se qareeb mojood dushman ke mohray capture karein!'
        },
        coachInitialEn: 'The King defends his kingdom! Capture the unprotected pawn in front of you!',
        coachInitialUr: 'Badshah apni riyasat ka difaa karega! Samne wale be-sahara piyaday ko maarein!',
        coachSuccessEn: 'Heroic King! You eliminated the danger with royal courage!',
        coachSuccessUr: 'Shahi Shujaat! Badshah ne khud khatra khatam kar diya!',
        coachHintEn: 'Step King to e5 to capture the pawn, then to f6 to capture the knight.',
        coachHintUr: 'Badshah ko e5 par chal kar piyada maarein, phir f6 par ghora.',
        bestMoves: [{ row: 3, col: 4 }]
      }
    ]
  },

  // ================= LEVEL 5: CHECK & CHECKMATE (KISHT AUR MAAT) =================
  {
    id: 5,
    slug: 'checkmate',
    nameEn: 'Level 5: Check & Checkmate',
    nameUr: 'Level 5: Kisht (Check) aur Maat (Checkmate)',
    piece: 'k',
    iconName: 'Zap',
    badge: 'Victory Goal',
    colorTheme: 'from-rose-600 to-red-900',
    descriptionEn: 'Learn how to deliver Check (Kisht), escape danger (CPR), and win with Checkmate (Maat)!',
    descriptionUr: 'Kisht dena, difaa ke 3 tareeqay (CPR) aur Maat kar ke game jeetna seekhein!',
    stages: [
      {
        id: '5-1',
        titleEn: 'Delivering Check (Kisht Dena)',
        titleUr: 'Dushman Ko Kisht (Check) Dena',
        subtitleEn: 'When you directly attack the enemy King, announce "CHECK!"',
        subtitleUr: 'Jab aapka koi mohra dushman ke Badshah par seedha hamla kare, to usay Kisht (Check) kehte hain!',
        explanationEn: [
          'CHECK (Kisht) is a direct threat to capture the King on the very next turn.',
          'The opponent MUST resolve the check immediately on their next move — they cannot ignore it!',
          'Move your Rook into position to deliver a direct check.'
        ],
        explanationUr: [
          'Kisht (Check) ka matlab hai Badshah par seedha hamla hona.',
          'Dushman ko foran aglay qadam par apne Badshah ko bachana parta hai — woh isay nazar-andaz nahi kar sakta!',
          'Apne Haathi ko chal kar dushman ke Badshah ko Kisht dein.'
        ],
        initialBoard: setupBoard([
          { row: 7, col: 0, piece: { type: 'r', color: 'w' } }, // a1 rook
          { row: 1, col: 4, piece: { type: 'k', color: 'b' } }  // e7 black king
        ]),
        playerColor: 'w',
        goal: {
          type: 'deliver_check',
          descriptionEn: 'Move your Rook to e1 or a7 to place the Black King in Check!',
          descriptionUr: 'Haathi ko e1 ya a7 par chal kar Badshah ko Kisht (Check) dein!'
        },
        coachInitialEn: 'Line up your Rook with the Black King on file "e" or rank 7 to yell CHECK!',
        coachInitialUr: 'Haathi ko dushman Badshah ki seedh mein layein aur Kisht dein!',
        coachSuccessEn: 'CHECK! The enemy King trembles before your Rook!',
        coachSuccessUr: 'KISHT (CHECK)! Dushman ka Badshah khatray mein aa gaya!',
        coachHintEn: 'Move your Rook from a1 to e1 to attack the King along the open file.',
        coachHintUr: 'Haathi ko a1 se e1 par chalain taakay Badshah par seedha hamla ho.',
        bestMoves: [{ row: 7, col: 4 }]
      },
      {
        id: '5-2',
        titleEn: 'The 3 Escapes from Check (C-P-R)',
        titleUr: 'Kisht Se Bachne Ke 3 Tareeqay (CPR Formula)',
        subtitleEn: 'Capture the attacker, Protect by blocking, or Run away with the King!',
        subtitleUr: 'C = Capture (Maar Dena), P = Protect (Block Karna), R = Run (Bhagna)!',
        explanationEn: [
          'Grandmasters remember CPR to escape check:',
          '1. C - Capture the attacking piece.',
          '2. P - Protect by blocking the path between attacker and King.',
          '3. R - Run the King to a safe square.',
          'In this stage, capture the sneaky enemy attacker to save your King!'
        ],
        explanationUr: [
          'Kisht se bachne ke 3 tareeqay (CPR):',
          '1. C (Capture): Hamla karne walay mohray ko maar dein.',
          '2. P (Protect/Block): Raste mein apna mohra laa kar rasta rok dein.',
          '3. R (Run): Badshah ko kisi mehfooz khane par bhaga lein.',
          'Yahan dushman ke hamla-awar mohray ko capture karein!'
        ],
        initialBoard: setupBoard([
          { row: 7, col: 4, piece: { type: 'k', color: 'w' } }, // e1 king (in check from black queen on e5)
          { row: 3, col: 4, piece: { type: 'q', color: 'b' } }, // e5 black queen attacking e1
          { row: 5, col: 2, piece: { type: 'n', color: 'w' } }  // c3 knight (can jump to e4 or e5!)
        ]),
        playerColor: 'w',
        goal: {
          type: 'capture_all',
          descriptionEn: 'Your King is in check! Use your Knight to CAPTURE the checking Queen!',
          descriptionUr: 'Aapke Badshah par Kisht hai! Ghoray se dushman ki Queen ko Capture karein!',
        },
        coachInitialEn: 'Red alert! Your King is in check! Don\'t panic — your Knight can capture the attacker!',
        coachInitialUr: 'Khatra! Badshah par Kisht hai! Ghoray se hamla karne wali Queen ko shikar karein!',
        coachSuccessEn: 'Heroic defense! You eliminated the threat using the "Capture" escape!',
        coachSuccessUr: 'Zabardast difaa! Aap ne hamla karne walay mohray ko maar kar Badshah bacha liya!',
        coachHintEn: 'Jump your Knight from c3 to e5 to capture the attacking Black Queen.',
        coachHintUr: 'c3 wale ghoray se e5 par mojood Queen ko capture karein.',
        bestMoves: [{ row: 3, col: 4 }]
      },
      {
        id: '5-3',
        titleEn: 'The Ultimate Checkmate (Maat)!',
        titleUr: 'Aakhri Maat (Checkmate) Se Jeet!',
        subtitleEn: 'Deliver Back-Rank Checkmate: King in check with NO escape, NO block, NO capture!',
        subtitleUr: 'Dushman Badshah ko aakhri line par aisi Kisht dein ke bachne ka koi rasta na rahe!',
        explanationEn: [
          'CHECKMATE (Maat) ends the game with instant victory!',
          'It happens when the King is in check, cannot run away, cannot block the attack, and cannot capture the attacker.',
          'Deliver the crushing back-rank blow with your Queen!'
        ],
        explanationUr: [
          'MAAT (Checkmate) shatranj ka aakhri maqsad hai aur is se aap foran jeet jatay hain!',
          'Jab Badshah par Kisht ho aur woh na bhaag sakay, na block kar sakay, aur na hamla-awar ko maar sakay.',
          'Apni Queen ko dushman ki aakhri line par laa kar MAAT karein!'
        ],
        initialBoard: setupBoard([
          { row: 0, col: 6, piece: { type: 'k', color: 'b' } }, // g8 black king
          { row: 1, col: 5, piece: { type: 'p', color: 'b' } }, // f7 black pawn
          { row: 1, col: 6, piece: { type: 'p', color: 'b' } }, // g7 black pawn
          { row: 1, col: 7, piece: { type: 'p', color: 'b' } }, // h7 black pawn
          { row: 6, col: 3, piece: { type: 'q', color: 'w' } }  // d2 white queen
        ]),
        playerColor: 'w',
        goal: {
          type: 'deliver_checkmate',
          descriptionEn: 'Move Queen to d8 to trap the trapped Black King behind his own pawns (Back Rank Mate)!',
          descriptionUr: 'Queen ko d8 par chal kar dushman Badshah ko Back-Rank MAAT (Checkmate) karein!'
        },
        coachInitialEn: 'Look at the Black King! He is trapped behind his own pawns. Deliver the Queen blow on rank 8!',
        coachInitialUr: 'Dushman Badshah apne hi piyadon ke peeche phansa hua hai! Queen ko 8th rank (d8) par layein aur MAAT karein!',
        coachSuccessEn: 'CHECKMATE! VICTORY! You have conquered the Grandmaster Quest!',
        coachSuccessUr: 'MAAT (CHECKMATE)! MUBARAK HO! Aap ne shatranj ke tamam bunyadi asool jeet liye!',
        coachHintEn: 'Move your Queen straight up the board to d8 for instant Checkmate.',
        coachHintUr: 'Queen ko seedha upar d8 par chalain aur Maat karein.',
        bestMoves: [{ row: 0, col: 3 }]
      }
    ]
  }
];
