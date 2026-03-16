const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*", methods: ["GET", "POST"] },
  pingInterval: 8000,   // ping lebih sering
  pingTimeout: 4000,    // declare dead lebih cepat → deteksi putus ~12s max
  connectTimeout: 10000,
});

app.use(express.static(path.join(__dirname, "public")));

// ═══════════════════════════════════════
//   CURATED ANSWER POOL (common 5-letter words)
// ═══════════════════════════════════════
const ANSWER_WORDS = [
  "ABOUT","ABOVE","ABUSE","ACTOR","ACUTE","ADMIT","ADOPT","ADULT","AFTER","AGAIN",
  "AGENT","AGREE","AHEAD","ALARM","ALBUM","ALERT","ALIKE","ALIVE","ALLEY","ALLOW",
  "ALONE","ALONG","ALTER","ANGEL","ANGER","ANGLE","ANGRY","ANIME","ANKLE","ANNOY",
  "APART","APPLE","APPLY","ARISE","ARMOR","AROMA","AROSE","ARRAY","ARROW","ASIDE",
  "ASSET","ATLAS","AVOID","AWAKE","AWARD","AWARE","AWFUL","BACON","BADGE","BASIC",
  "BASIS","BATCH","BEACH","BEARD","BEAST","BEGAN","BEGIN","BEING","BELOW","BENCH",
  "BINGO","BLACK","BLADE","BLAME","BLAND","BLANK","BLAST","BLAZE","BLEED","BLEND",
  "BLESS","BLIND","BLOCK","BLOOD","BLOWN","BOARD","BONUS","BOOST","BOOTH","BRAVE",
  "BREAD","BREAK","BREED","BRICK","BRIDE","BRIEF","BRING","BROAD","BROKE","BROWN",
  "BUILD","BUILT","BUNCH","CABIN","CANDY","CARRY","CATCH","CAUSE","CHAIR","CHAOS",
  "CHARM","CHART","CHASE","CHEAP","CHECK","CHEEK","CHEER","CHESS","CHEST","CHIEF",
  "CHILD","CHILL","CHINA","CHOIR","CHOSE","CIVIL","CLAIM","CLASS","CLEAN","CLEAR",
  "CLERK","CLICK","CLIFF","CLIMB","CLONE","CLOSE","CLOUD","COACH","COAST","COLOR",
  "COMBO","COMIC","CORAL","COUCH","COUNT","COURT","COVER","CRACK","CRAFT","CRASH",
  "CRAZY","CREAM","CREST","CRIME","CROSS","CROWD","CROWN","CRUEL","CRUSH","CYBER",
  "CYCLE","DAILY","DANCE","DAUNT","DEBUG","DECAY","DELAY","DEPTH","DEVIL","DIARY",
  "DIGIT","DISCO","DITCH","DIZZY","DODGE","DOUBT","DRAFT","DRAIN","DRAMA","DRANK",
  "DRAWN","DREAM","DRESS","DRIFT","DRINK","DRIVE","DROPS","DROVE","DRYER","DUSTY",
  "DWARF","DYING","EARLY","EARTH","EIGHT","ELITE","EMPTY","ENJOY","ENTER","EQUAL",
  "ERROR","ESSAY","EVENT","EVERY","EXACT","EXIST","EXTRA","FABLE","FAINT","FAITH",
  "FALSE","FANCY","FATAL","FAULT","FEAST","FENCE","FEVER","FIBER","FIELD","FIFTH",
  "FIFTY","FIGHT","FINAL","FIXED","FLAME","FLASK","FLEET","FLESH","FLAIR","FLOAT",
  "FLOOR","FLUID","FLUSH","FOCUS","FOGGY","FORCE","FORGE","FORTH","FORUM","FOUND",
  "FRANK","FRAUD","FRESH","FRONT","FROZE","FRUIT","FULLY","FUNNY","GENRE","GHOST",
  "GIVEN","GLASS","GLOOM","GLORY","GLOVE","GOOFY","GRACE","GRADE","GRAIN","GRAND",
  "GRANT","GRAPH","GRASP","GRASS","GREAT","GREEN","GREET","GRIEF","GRILL","GRIND",
  "GROAN","GROUP","GUARD","GUESS","GUEST","GUIDE","GUILD","GUILT","GUSTO","HAUNT",
  "HEART","HEAVY","HENCE","HERBS","HINGE","HIPPO","HOBBY","HONOR","HORSE","HOTEL",
  "HOUSE","HUMAN","HUMOR","HURRY","HYPER","IDEAL","IMAGE","IMPLY","INDEX","INNER",
  "INPUT","IRONY","ISSUE","IVORY","JELLY","JEWEL","JOINT","JOKER","JUICE","JUMPY",
  "KARMA","KNIFE","KNOCK","KNOWN","LABEL","LANCE","LATER","LAUGH","LAYER","LEARN",
  "LEASE","LEAST","LEGAL","LEMON","LEVEL","LIGHT","LIMIT","LINGO","LOCAL","LODGE",
  "LOGIC","LOOSE","LOWER","LOYAL","LUCKY","LUNAR","LUNCH","MAGIC","MAJOR","MAKER",
  "MANGA","MANOR","MARCH","MARSH","MATCH","MEDIA","MERCY","MERGE","MERIT","MIGHT",
  "MINOR","MINUS","MODEL","MONEY","MONTH","MORAL","MOTTO","MOUNT","MOUSE","MOUTH",
  "MOVIE","MUDDY","MUSIC","NAIVE","NERVE","NIGHT","NINJA","NOBLE","NOISE","NORTH",
  "NOTED","NOVEL","NURSE","OCCUR","OCEAN","OFFER","OFTEN","ORDER","OTHER","OUTER",
  "OZONE","PAINT","PANEL","PANIC","PAPER","PARTY","PATCH","PAUSE","PEACE","PEACH",
  "PEARL","PENNY","PERKY","PHASE","PHONE","PHOTO","PIANO","PILOT","PIZZA","PLACE",
  "PLAIN","PLANE","PLANT","PLUMB","PLUME","PLUMP","POINT","POKER","POLAR","PORCH",
  "POWER","PRESS","PRICE","PRIDE","PRIME","PRINT","PRIOR","PRIZE","PROBE","PROOF",
  "PROSE","PROUD","PROVE","PROWL","QUEEN","QUEST","QUICK","QUIET","QUOTA","QUOTE",
  "RADAR","RADIO","RAISE","RALLY","RANGE","RAPID","RATIO","REACH","READY","REALM",
  "REBEL","REFER","REIGN","RELAY","RELAX","REMIX","REPAY","RESET","RIDER","RIDGE",
  "RIFLE","RIGHT","RISKY","RIVAL","RIVER","ROBOT","ROCKY","ROUGH","ROUND","ROUTE",
  "ROYAL","RUGBY","RULER","RURAL","RUSTY","SAINT","SALAD","SANDY","SAUCE","SCALE",
  "SCENE","SCOPE","SCORE","SCOUT","SEIZE","SENSE","SERVE","SEVEN","SHADE","SHAKE",
  "SHALL","SHAME","SHAPE","SHARE","SHARK","SHARP","SHIFT","SHINE","SHIRT","SHOCK",
  "SHOOT","SHORT","SHOUT","SIGHT","SIGMA","SILLY","SINCE","SIXTH","SIXTY","SKILL",
  "SKULL","SLATE","SLEEK","SLIDE","SMALL","SMART","SMELL","SMILE","SMOKE","SNACK",
  "SNAKE","SOLAR","SOLVE","SORRY","SOUTH","SPACE","SPARE","SPARK","SPAWN","SPEED",
  "SPELL","SPEND","SPICE","SPILL","SPITE","SPLIT","SPORT","SQUAD","STACK","STAGE",
  "STAIN","STALE","STAMP","STAND","STARK","STASH","STATE","STEAM","STEEL","STEEP",
  "STEER","STERN","STICK","STILL","STOCK","STONE","STOOD","STORM","STORY","STOUT",
  "STOVE","STRAP","STRAW","STRAY","STRIP","STUCK","STYLE","SUGAR","SUITE","SUNNY",
  "SUPER","SURGE","SWEEP","SWEET","SWIFT","SWORD","SWORN","SYNTH","TABOO","TASTE",
  "TEACH","TEASE","TERMS","THORN","THREE","THREW","THROW","TIGER","TIRED","TITLE",
  "TODAY","TOKEN","TOTAL","TOUCH","TOUGH","TOWER","TOXIC","TRACK","TRADE","TRAIL",
  "TRAIN","TRAIT","TRASH","TREAT","TREND","TRIAL","TRIBE","TRICK","TRIED","TROOP",
  "TROVE","TRUCK","TRULY","TRUNK","TRUTH","TUMOR","TWEAK","TWICE","TWIST","ULTRA",
  "UNDER","UNION","UNITY","UNTIL","UPPER","URBAN","USAGE","USUAL","UTTER","VALID",
  "VALUE","VIDEO","VIRAL","VIRUS","VISIT","VITAL","VIVID","VOCAL","VOTER","WAGER",
  "WASTE","WATCH","WATER","WEARY","WEAVE","WEIRD","WHERE","WHICH","WHILE","WHITE",
  "WHOLE","WITCH","WOMAN","WOMEN","WOODS","WORLD","WORRY","WORTH","WOULD","WOUND",
  "WRATH","WRITE","WRONG","YACHT","YIELD","YOUNG","YOUTH","ZEBRA","ZESTY","ZOMBIE"
];

// ═══════════════════════════════════════
//   VALID WORD SET (for guess validation)
//   This starts with ANSWER_WORDS and gets
//   expanded with the dwyl list on startup.
// ═══════════════════════════════════════
let validWords = new Set(ANSWER_WORDS);

async function loadExternalWordList() {
  try {
    console.log("📚 Fetching word list from GitHub...");
    const res = await fetch(
      "https://raw.githubusercontent.com/dwyl/english-words/refs/heads/master/words.txt"
    );
    const text = await res.text();
    let count = 0;
    text.split("\n").forEach((w) => {
      const word = w.trim().toUpperCase();
      if (word.length === 5 && /^[A-Z]+$/.test(word)) {
        validWords.add(word);
        count++;
      }
    });
    console.log(`✅ Loaded ${validWords.size} valid words (${count} from GitHub)`);
  } catch (e) {
    console.warn("⚠️  Could not fetch external word list, using built-in only.", e.message);
  }
}

// ═══════════════════════════════════════
//   GAME STATE
// ═══════════════════════════════════════
function getDayNumber() {
  return Math.floor((Date.now() - new Date("2024-01-01").getTime()) / 86400000);
}

function getDailyWord() {
  return ANSWER_WORDS[getDayNumber() % ANSWER_WORDS.length];
}

// One game session per "room" (default = "daily")
// rooms: { roomId -> RoomState }
const rooms = {};

function getOrCreateRoom(roomId = "daily") {
  if (!rooms[roomId]) {
    const isDailyRoom = roomId === "daily";
    rooms[roomId] = {
      id: roomId,
      answer: ANSWER_WORDS[Math.floor(Math.random() * ANSWER_WORDS.length)],
      dayNumber: isDailyRoom ? getDayNumber() : null,
      players: {},       // socketId -> player data
      startedAt: Date.now(),
      status: "playing", // playing | finished
    };
    console.log(`🏠 Room "${roomId}" created — answer: ${rooms[roomId].answer}`);
  }
  return rooms[roomId];
}

function evaluateGuess(guess, answer) {
  const result = Array(5).fill("absent");
  const used = Array(5).fill(false);
  for (let i = 0; i < 5; i++) {
    if (guess[i] === answer[i]) { result[i] = "correct"; used[i] = true; }
  }
  for (let i = 0; i < 5; i++) {
    if (result[i] === "correct") continue;
    for (let j = 0; j < 5; j++) {
      if (!used[j] && guess[i] === answer[j]) { result[i] = "present"; used[j] = true; break; }
    }
  }
  return result;
}

function roomSnapshot(room) {
  return {
    roomId: room.id,
    dayNumber: room.dayNumber,
    status: room.status,
    players: Object.values(room.players),
  };
}

function checkRoomFinished(room) {
  const ps = Object.values(room.players);
  if (ps.length === 0) return false;
  const allDone = ps.every((p) => p.status === "won" || p.status === "lost");
  if (allDone && room.status === "playing") {
    room.status = "finished";
    return true;
  }
  return false;
}

function broadcastRoomFinished(room) {
  const currentAnswer = (room.pendingRound ? room.pendingRound.answer : room.answer);
  console.log(`🏁 Room "${room.id}" finished! Answer: ${currentAnswer}`);
  io.to(room.id).emit("room_finished", {
    answer: currentAnswer,
    players: Object.values(room.players).sort((a, b) => {
      if (a.status === "won" && b.status === "won") return a.guesses.length - b.guesses.length;
      if (a.status === "won") return -1;
      if (b.status === "won") return 1;
      return 0;
    }),
  });
}

// ═══════════════════════════════════════
//   REST: word validation endpoint
// ═══════════════════════════════════════
app.get("/api/valid/:word", (req, res) => {
  const word = req.params.word.toUpperCase();
  res.json({ valid: validWords.has(word) });
});

app.get("/api/state", (req, res) => {
  const room = getOrCreateRoom("daily");
  res.json({ dayNumber: room.dayNumber, playerCount: Object.keys(room.players).length });
});

// ═══════════════════════════════════════
//   SOCKET.IO
// ═══════════════════════════════════════
io.on("connection", (socket) => {
  let currentRoom = null;
  let playerId = null;

  // ── JOIN ──
  socket.on("join", ({ name, avatar, roomId = "daily" }) => {
    if (!name || !avatar) return;

    const room = getOrCreateRoom(roomId);
    currentRoom = roomId;
    playerId = socket.id;

    // Check if daily word changed (new day)
    if (roomId === "daily" && room.dayNumber !== getDayNumber()) {
      room.answer = getDailyWord();
      room.dayNumber = getDayNumber();
      room.players = {};
      room.status = "playing";
      room.startedAt = Date.now();
      console.log(`🌅 New day! Room "daily" reset — answer: ${room.answer}`);
    }

    room.players[socket.id] = {
      id: socket.id,
      name: name.slice(0, 16),
      avatar,
      status: "playing",
      guesses: [],      // [{word, result:[]}]
      joinedAt: Date.now(),
    };

    socket.join(roomId);

    // Send room state to the new player
    socket.emit("room_state", {
      ...roomSnapshot(room),
      answer: null, // never send answer to client
    });

    // Tell everyone else about new player
    socket.to(roomId).emit("player_joined", room.players[socket.id]);

    console.log(`👤 ${name} joined room "${roomId}" (${Object.keys(room.players).length} players)`);
  });

  // ── GUESS ──
  socket.on("guess", ({ word }) => {
    if (!currentRoom || !playerId) return;
    const room = rooms[currentRoom];
    if (!room) return;
    const player = room.players[socket.id];
    if (!player || player.status !== "playing") return;

    const w = word.toUpperCase().trim();
    if (w.length !== 5 || !/^[A-Z]+$/.test(w)) {
      socket.emit("guess_error", { message: "Kata harus 5 huruf!" });
      return;
    }
    if (!validWords.has(w)) {
      socket.emit("guess_error", { message: `"${w}" gak ada di kamus! 🤔` });
      return;
    }
    if (player.guesses.length >= 6) {
      socket.emit("guess_error", { message: "Udah habis tebakan!" });
      return;
    }

    // Pakai answer yang tersimpan langsung di player (anti-overwrite bug)
    const effectiveAnswer = player.roundAnswer || room.answer;
    const result = evaluateGuess(w, effectiveAnswer);
    const guessObj = { word: w, result };
    player.guesses.push(guessObj);

    const won = result.every((r) => r === "correct");
    const lost = !won && player.guesses.length >= 6;

    if (won) player.status = "won";
    else if (lost) player.status = "lost";

    // Send result back to the guesser
    socket.emit("guess_result", {
      word: w,
      result,
      status: player.status,
      answer: (won || lost) ? effectiveAnswer : null,
    });

    // Broadcast mini-board update to everyone in room
    io.to(currentRoom).emit("player_update", {
      id: socket.id,
      name: player.name,
      avatar: player.avatar,
      status: player.status,
      guesses: player.guesses,
    });

    // Check if all done
    if (checkRoomFinished(room)) {
      broadcastRoomFinished(room);
    }
  });

  // ── PLAY AGAIN ──
  // Only the initiator starts immediately; others get an invite banner.
  socket.on("play_again", () => {
    if (!currentRoom) return;
    const room = rooms[currentRoom];
    if (!room) return;
    const player = room.players[socket.id];
    if (!player) return;

    const newRoundId = "practice_" + Date.now();
    const newAnswer  = ANSWER_WORDS[Math.floor(Math.random() * ANSWER_WORDS.length)];

    // Simpan di map rounds supaya beberapa round bisa koeksist tanpa overwrite
    if (!room.rounds) room.rounds = {};
    room.rounds[newRoundId] = { id: newRoundId, answer: newAnswer, startedAt: Date.now() };
    room.pendingRound = room.rounds[newRoundId];
    room.status = "playing";

    player.status      = "playing";
    player.guesses     = [];
    player.roundId     = newRoundId;
    player.roundAnswer = newAnswer; // answer disimpan langsung di player, anti-overwrite

    socket.emit("round_joined", {
      roundId: newRoundId,
      players: Object.values(room.players).filter(p => p.roundId === newRoundId),
    });

    // Hanya kirim invite ke player yang SUDAH selesai, bukan yang lagi aktif main
    Object.values(room.players).forEach(p => {
      if (p.id !== socket.id && (p.status === "won" || p.status === "lost")) {
        io.to(p.id).emit("round_invite", {
          roundId: newRoundId,
          by: { name: player.name, avatar: player.avatar },
        });
      }
    });

    console.log(`🔄 ${player.name} started new round in room "${currentRoom}" — answer: ${newAnswer}`);
  });

  // ── JOIN ROUND (accept invite) ──
  socket.on("join_round", ({ roundId }) => {
    if (!currentRoom) return;
    const room = rooms[currentRoom];
    if (!room) return;
    const player = room.players[socket.id];
    if (!player) return;

    // Cari round dari map rounds, fallback ke pendingRound
    const round = (room.rounds && room.rounds[roundId])
      || (room.pendingRound && room.pendingRound.id === roundId ? room.pendingRound : null);
    if (!round) return;

    player.status      = "playing";
    player.guesses     = [];
    player.roundId     = roundId;
    player.roundAnswer = round.answer; // answer disimpan langsung di player

    const roundPlayers = Object.values(room.players).filter(p => p.roundId === roundId);
    socket.emit("round_joined", { roundId, players: roundPlayers });
    socket.to(currentRoom).emit("player_update", player);

    console.log(`➕ ${player.name} joined round "${roundId}" — answer: ${round.answer}`);
  });

  // ── DISCONNECT ──
  socket.on("disconnect", (reason) => {
    if (!currentRoom || !rooms[currentRoom]) return;
    const room = rooms[currentRoom];
    const player = room.players[socket.id];
    if (!player) return;

    console.log(`👋 ${player.name} disconnected from room "${currentRoom}" (${reason})`);

    // Remove player immediately from room
    delete room.players[socket.id];

    // Tell everyone the player is gone (includes updating outro if open)
    io.to(currentRoom).emit("player_left", {
      id: socket.id,
      name: player.name,
      avatar: player.avatar,
    });

    const remaining = Object.values(room.players);

    // If room is now empty, reset it (keep daily room alive)
    if (remaining.length === 0) {
      if (currentRoom === "daily") {
        // Keep the room but reset with a new random word for the next player
        room.answer = ANSWER_WORDS[Math.floor(Math.random() * ANSWER_WORDS.length)];
        room.pendingRound = null;
        room.status = "playing";
        console.log(`🏠 Daily room now empty, new word: ${room.answer}`);
      } else {
        delete rooms[currentRoom];
        console.log(`🗑️  Room "${currentRoom}" deleted (empty)`);
      }
      return;
    }

    // If the disconnecting player was still "playing",
    // check if the remaining players are now all done → trigger outro
    if (player.status === "playing" && room.status === "playing") {
      if (checkRoomFinished(room)) {
        broadcastRoomFinished(room);
      }
    }
  });
});

// ═══════════════════════════════════════
//   START
// ═══════════════════════════════════════
const PORT = process.env.PORT || 3000;

(async () => {
  await loadExternalWordList();
  getOrCreateRoom("daily"); // pre-create daily room

  httpServer.listen(PORT, () => {
    console.log(`\n🟩 Wordle Friends running on port ${PORT}`);
    console.log(`📅 Today's word: ${getDailyWord()} (Day #${getDayNumber()})`);
    console.log(`📚 Valid words: ${validWords.size.toLocaleString()}\n`);
  });
})();
