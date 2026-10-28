const TelegramBot = require('node-telegram-bot-api');

// CONFIGURATION

const MAIN_BOT_TOKEN = '8725085217:AAGEwRDvuWTF5o6R1L-vHL0dPtobor4AubY';

const WORKER_BOT_TOKENS = [
'8983949431:AAGDfgGNcLeFjTtCx0YMpFEDBXIP5kpKeiM',
'8777168647:AAGXwsjZ5HeHEVuiFyK934gyTWxOUidZvDI',
'8920890264:AAFlZcsdPkLnIf9HsDs0q6YEZ4MLYAI9CS4',
'9036368499:AAGN-tMUSizARstoEx11LDkXCkMfIAa82K4',
'9185845966:AAG6W7BgPgiI55JtjYTgKIsHugdmwckYTws',
'9286146038:AAFWBOMlbgxaGkyh_PQau_3CZ2Ai_hsW2xA',
'9246972548:AAGve1ia_stSftEThtNRIGLLFLQiZx0i5Xw',
'9210068789:AAHIerATpEgrAEYpO7LgeBytmSUkW7e296k',
'9292310503:AAEsjnustCM_IakqsLUZBy45bRezL8AmYFw',
];

const ALLOWED_USERS = [8661785324];

// BOT SETUP
const mainBot = new TelegramBot(MAIN_BOT_TOKEN, {
    polling: true,
    filepath: false,
    onlyFirstMatch: true
});
const workerBots = WORKER_BOT_TOKENS.map(token => new TelegramBot(token, {
    polling: false,
    filepath: false
}));
const allBots = [mainBot, ...workerBots];

for (const b of allBots) {
    b.on('polling_error', () => {});
    b.on('error', () => {});
}

console.clear();
console.log(`╔══════════════════════════════════════════╗`);
console.log(`║    🚀 ᴜʟᴛɪᴍᴀᴛᴇ ʙᴏᴛ ꜱʏꜱᴛᴇᴍ ᴠ3.0     ║`);
console.log(`║    ${allBots.length} ʙᴏᴛꜱ ᴀᴄᴛɪᴠᴀᴛᴇᴅ        ║`);
console.log(`║    ⚡ ᴘʀᴏꜰᴇꜱꜱɪᴏɴᴀʟ ᴍᴏᴅᴇ           ║`);
console.log(`║    🎨 ꜱᴛʏʟɪꜱʜ ᴇᴅɪᴛɪᴏɴ             ║`);
console.log(`╚══════════════════════════════════════════╝\n`);

// ════════════════════════════════════════════════════════════════
// 🛡️ GLOBAL ERROR HANDLER
// ════════════════════════════════════════════════════════════════
process.on('unhandledRejection', (reason) => {
    // Silent - prevents crashes
});

// ════════════════════════════════════════════════════════════════
// 📨 SAFE SENDER
// ════════════════════════════════════════════════════════════════
async function safeMainSend(chatId, text, options = {}) {
    try {
        await mainBot.sendMessage(chatId, text, options);
    } catch (err) {
        // Silently ignore
    }
}

// ════════════════════════════════════════════════════════════════
// 💬 REPLY CONTEXT (auto reply-to owner's message)
// ════════════════════════════════════════════════════════════════
const replyContext = new Map();

function sendMessageAllBots(chatId, text, options = {}) {
    const opts = { parse_mode: 'HTML', ...options };
    const rid = replyContext.get(chatId);
    if (rid && !opts.reply_to_message_id) opts.reply_to_message_id = rid;
    mainBot.sendMessage(chatId, text, opts).catch(() => {});
}

// ════════════════════════════════════════════════════════════════
// 💾 ꜱʜᴀʀᴇᴅ ꜱᴛᴀᴛᴇ
// ════════════════════════════════════════════════════════════════
const sharedState = {
    chatState: new Map(),
    swipeState: new Map(),
    raidState: new Map(),
    raidTimerState: new Map(),
    slideTargets: new Set(),
    slidespamTargets: new Set(),
    swipeModeBase: {},
    funMode: new Map(),
    roastMode: new Map(),
    loveMode: new Map(),
    hypeMode: new Map()
};

let defaultSwipeDelay = 500;
let defaultRaidDelay = 500;
let defaultRaidTimerDelay = 500;

// ════════════════════════════════════════════════════════════════
// 🎭 ꜰᴜɴ ᴛᴇxᴛꜱ & ᴇᴍᴏᴊɪꜱ
// ════════════════════════════════════════════════════════════════
const RAID_TEXTS = [
   "kahin Chudke marr to ny gya na tu",
    "trima cute rnd",
    "tri rndi ma ke bhosde me replyraid",
    "Teri mummy mere piche itni pgl kyu he",
    "Abe sun teri maa ko ulta karke aise chodunga jaise usse lagega earthquake aaya h🤪🔥",
    "chudi randi side hatt",
    "Teri maa ke kaale bhosde me jcb chala dunga pura bhosda saaf hojayega😂🥀",
    "trima marr gyi chudte chudte",
    "तेरी मम्मी 5g network मैं चुदती हूं",
    "trima chudgyi gang bang me",
    "Sun teri behen ke chut me sperm dalke teri behen ko pregnant kr dunga😂🔥",
    "Try mummy ke muh me 101 kg jhaant ghusa kar dam ghutwa kr maar dalunga rndike😂😂😂😂😂😂😂",
    "Tmkc me 121 kar dunga😂😂😂😂😂😂😂🙏🏿😂🙏🏿😂🙏🏿😂🙏🏿😂🙏🏿😂🙏🏿😂🙏🏿😂🙏🏿😂🙏🏿😂🙏🏿",
    "Tere bund pe 1x lund marunga to tri maut hojayegi tatte😂🙏🏻💔",
    "Trima s1n me chudti he kya jab dekho s1n s1n😫🥀"
];

const NCEMO_EMOJIS = [
    "😋","😝","😜","🤪","😑","🤫","🤭","🥱","🤗","😡","😠","😤",
    "😮💨","🙄","😒","🥶","🥵","🤢","😎","🥸",
    "😹","💫","😼","😽","🙀","😿","😾",
    "🙈","🙉","🙊",
    "⭐","🌟","✨","⚡","💥","💨",
    "💛","💙","💜","🤎","🤍","💘","💝"
];

// 🎉 ꜰᴜɴ ᴄᴏʟʟᴇᴄᴛɪᴏɴꜱ
const ROASTS = [
    "🔥 You're not stupid; you just have bad luck thinking.",
    "😂 If I wanted to kill myself, I'd climb your ego and jump to your IQ.",
    "💀 You bring everyone so much joy, when you leave the room.",
    "🤡 You're proof that evolution can go in reverse.",
    "😭 You're not the dumbest person on earth, but you better hope they don't die.",
    "👀 I'd agree with you, but then we'd both be wrong.",
    "🧠 You have the right to remain silent. Please use it.",
    "💅 You're like a cloud: when you disappear, it's a beautiful day.",
    "🎪 You're the reason the gene pool needs a lifeguard.",
    "🤡 You're not a clown, you're the entire circus."
];

const COMPLIMENTS = [
    "✨ You're amazing! Never forget that.",
    "💫 You shine brighter than the stars!",
    "🌟 You're a legend in the making!",
    "🔥 Keep being awesome!",
    "💪 You're stronger than you think!",
    "🌈 You bring color to this world!",
    "🎯 You're a true champion!",
    "👑 You're royalty in my book!",
    "🚀 You're destined for greatness!",
    "💎 You're one of a kind!"
];

const HYPE_TEXTS = [
    "🔥 LET'S GOOOOOO! 🔥",
    "💪 YOU GOT THIS! 💪",
    "🚀 TO THE MOON! 🚀",
    "🎯 ABSOLUTE LEGEND! 🎯",
    "⚡ UNSTOPPABLE! ⚡",
    "🌟 MAIN CHARACTER ENERGY! 🌟",
    "🔥 SHEEEEEESH! 🔥",
    "💯 STRAIGHT FIRE! 💯",
    "👑 GOD MODE ACTIVATED! 👑",
    "🎊 GOAT STATUS! 🎊"
];

const LOVE_TEXTS = [
    "💖 I love you to the moon and back!",
    "❤️ You're my favorite person ever!",
    "💕 My heart belongs to you!",
    "💗 You're the best thing that happened to me!",
    "💝 I'd choose you every single time!",
    "💘 You make my heart skip a beat!",
    "💓 You're my sunshine on a sunny day!",
    "💞 Together forever, never apart!",
    "💟 You're my happily ever after!",
    "💖 You're my everything!"
];

const RIZZ_LINES = [
    "🔥 ɴᴏ ᴡᴀʏ, ᴛʜᴀᴛ'ꜱ ᴀ ᴄʀɪᴍᴇ ʟᴇᴠᴇʟ ʀɪᴢᴢ 🗿",
    "💀 ᴛʜᴀᴛ ʀɪᴢᴢ ᴄᴀᴍᴇ ꜰʀᴏᴍ ᴀ ᴛᴇᴍᴜ ᴘᴀᴄᴋᴇᴛ",
    "👑 ᴄᴇʀᴛɪꜰɪᴇᴅ ʀɪᴢᴢʟᴇʀ",
    "😭 ʀɪᴢᴢ ꜱᴏ ʙᴀᴅ ɪᴛ ᴍᴀᴅᴇ ᴛʜᴇ ɢʀᴏᴜᴘ ʟᴇᴀᴠᴇ",
    "🚀 ᴡ ᴏꜰ ᴛʜᴇ ᴡᴇᴇᴋ"
];

const SIMP_LINES = [
    "💀 100% ꜱɪᴍᴘ",
    "🤡 90% ꜱɪᴍᴘ",
    "😐 50% ꜱɪᴍᴘ",
    "😎 5% ꜱɪᴍᴘ",
    "👑 ɴᴏᴛ ᴀ ꜱɪᴍᴘ"
];

const GAY_LINES = [
    "🏳️‍🌈 100% ɢᴀʏ",
    "🌈 75% ɢᴀʏ",
    "😐 50% ɢᴀʏ",
    "😎 15% ɢᴀʏ",
    "💪 0% ɢᴀʏ"
];

const SIGMA_LINES = [
    "🗿 ꜱɪɢᴍᴀ ɢʀɪɴᴅꜱᴇᴛ",
    "👑 ᴜʟᴛʀᴀ ꜱɪɢᴍᴀ",
    "🔥 ʙᴇᴛᴀ ᴛʀʏɪɴɢ ᴛᴏ ʙᴇ ꜱɪɢᴍᴀ",
    "💀 ɴᴏᴛ ꜱɪɢᴍᴀ ᴀᴛ ᴀʟʟ"
];

const CHAD_LINES = [
    "🗿 ᴍᴇɢᴀ ᴄʜᴀᴅ",
    "👑 ɢɪɢᴀ ᴄʜᴀᴅ",
    "💪 ʟɪᴛᴛʟᴇ ᴄʜᴀᴅ",
    "😐 ᴍɪᴅ ᴄʜᴀᴅ",
    "💀 ᴀɴᴛɪ-ᴄʜᴀᴅ"
];

const VIBE_LINES = [
    "✨ ɪᴍᴍᴀᴄᴜʟᴀᴛᴇ ᴠɪʙᴇꜱ",
    "🔥 ʜᴇᴀᴛᴇᴅ ᴠɪʙᴇꜱ",
    "🌊 ᴄʜɪʟʟ ᴠɪʙᴇꜱ",
    "💀 ᴄʀɪɴɢᴇ ᴠɪʙᴇꜱ",
    "😭 ᴅᴇᴘʀᴇꜱꜱɪɴɢ ᴠɪʙᴇꜱ"
];

// ════════════════════════════════════════════════════════════════
// 🛡️ ʜᴇʟᴘᴇʀ ꜰᴜɴᴄᴛɪᴏɴꜱ
// ════════════════════════════════════════════════════════════════
function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function isAuthorized(userId) {
    return ALLOWED_USERS.includes(userId);
}

function esc(s) {
    return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

// ════════════════════════════════════════════════════════════════
// 🧠 ꜱᴍᴀʀᴛ ᴘᴀɪʀɪɴɢ ꜱʏꜱᴛᴇᴍ
// ════════════════════════════════════════════════════════════════
class SmartPairManager {
    constructor() {
        this.botPerformance = new Map();
        this.pairRotationIndex = new Map();
    }

    initializeChatTracking(chatId) {
        if (!this.botPerformance.has(chatId)) {
            const m = new Map();
            allBots.forEach((_, i) => m.set(i, {
                successRate: 1.0,
                avgResponseTime: 100,
                lastUsed: 0,
                failureCount: 0
            }));
            this.botPerformance.set(chatId, m);
        }
    }

    updateBotPerformance(chatId, botIndex, success, responseTime = 100) {
        this.initializeChatTracking(chatId);
        const s = this.botPerformance.get(chatId).get(botIndex);
        if (!s) return;

        if (success) {
            s.successRate = Math.min(1.0, s.successRate + 0.02);
            s.avgResponseTime = s.avgResponseTime * 0.8 + responseTime * 0.2;
            s.failureCount = Math.max(0, s.failureCount - 1);
        } else {
            s.successRate = Math.max(0.1, s.successRate - 0.1);
            s.failureCount += 1;
        }
        s.lastUsed = Date.now();
    }

    getBestBots(chatId, count = 2) {
        this.initializeChatTracking(chatId);
        const p = this.botPerformance.get(chatId);
        const list = [];

        for (let i = 0; i < allBots.length; i++) {
            const s = p.get(i);
            list.push({
                index: i,
                score: s.successRate * 100 - s.avgResponseTime - s.failureCount * 10
            });
        }

        list.sort((a, b) => b.score - a.score);
        return list.slice(0, count).map(x => x.index);
    }

    getNextSmartPair(chatId, size = 2) {
        const best = this.getBestBots(chatId, size * 2);
        if (!best.length) return Array.from({ length: size }, (_, i) => i);

        if (!this.pairRotationIndex.has(chatId)) {
            this.pairRotationIndex.set(chatId, 0);
        }

        const r = this.pairRotationIndex.get(chatId);
        const out = [];

        for (let i = 0; i < Math.min(size, best.length); i++) {
            out.push(best[(r + i) % best.length]);
        }

        this.pairRotationIndex.set(chatId, (r + 1) % best.length);
        return out;
    }

    getPerformanceStatus(chatId) {
        this.initializeChatTracking(chatId);
        const p = this.botPerformance.get(chatId);
        const out = [];

        for (let i = 0; i < allBots.length; i++) {
            const s = p.get(i);
            out.push({
                botIndex: i,
                successRate: Math.round(s.successRate * 100),
                avgResponseTime: Math.round(s.avgResponseTime),
                failureCount: s.failureCount
            });
        }
        return out;
    }
}

const smartPairManager = new SmartPairManager();

// ════════════════════════════════════════════════════════════════
// ⚡ ᴜʟᴛʀᴀ-ꜰᴀꜱᴛ ᴏᴘᴇʀᴀᴛɪᴏɴꜱ (fire-and-forget, no stuck)
// ════════════════════════════════════════════════════════════════
function smartPairSendMessage(chatId, text, options = {}, pairSize = 1) {
    const bots = smartPairManager.getNextSmartPair(chatId, pairSize);

    for (const i of bots) {
        const t0 = Date.now();
        allBots[i].sendMessage(chatId, text, options)
            .then(() => {
                smartPairManager.updateBotPerformance(chatId, i, true, Date.now() - t0);
            })
            .catch(() => {
                smartPairManager.updateBotPerformance(chatId, i, false, Date.now() - t0);
            });
    }
}

function ultraFastRename(chatId, title, pairSize = 1) {
    const bots = smartPairManager.getNextSmartPair(chatId, pairSize);

    for (const i of bots) {
        const t0 = Date.now();
        allBots[i].setChatTitle(chatId, String(title).substring(0, 255))
            .then(() => {
                smartPairManager.updateBotPerformance(chatId, i, true, Date.now() - t0);
            })
            .catch((e) => {
                if (e && e.message && e.message.includes('CHAT_NOT_MODIFIED')) {
                    smartPairManager.updateBotPerformance(chatId, i, true, Date.now() - t0);
                } else {
                    smartPairManager.updateBotPerformance(chatId, i, false, Date.now() - t0);
                }
            });
    }
}

// ════════════════════════════════════════════════════════════════
// 🔄 ɴᴏɴ-ꜱᴛᴜᴄᴋ ʟᴏᴏᴘ (recursive setTimeout)
// ════════════════════════════════════════════════════════════════
function startLoop(intervalMs, fn) {
    const state = { stopped: false, timeout: null };

    state.stop = () => {
        state.stopped = true;
        if (state.timeout) clearTimeout(state.timeout);
        state.timeout = null;
    };

    const tick = () => {
        if (state.stopped) return;
        try { fn(); } catch {}
        if (state.stopped) return;
        state.timeout = setTimeout(tick, intervalMs);
    };

    state.timeout = setTimeout(tick, intervalMs);
    return state;
}

// ════════════════════════════════════════════════════════════════
// 🛡️ ᴘʀᴏᴛᴇᴄᴛᴇᴅ ᴄᴏᴍᴍᴀɴᴅ (reply-to-owner)
// ════════════════════════════════════════════════════════════════
function protectedCommand(regex, callback) {
    mainBot.onText(regex, async (msg, match) => {
        if (!isAuthorized(msg.from.id)) {
            await safeMainSend(msg.chat.id, '❌ <i>You are not my son.</i>', {
                parse_mode: 'HTML',
                reply_to_message_id: msg.message_id
            });
            return;
        }

        replyContext.set(msg.chat.id, msg.message_id);
        try { await callback(msg, match); } catch {}

        setTimeout(() => {
            if (replyContext.get(msg.chat.id) === msg.message_id) {
                replyContext.delete(msg.chat.id);
            }
        }, 10000);
    });
}

// ════════════════════════════════════════════════════════════════
// 🎯 ꜱᴍᴀʀᴛ ᴘᴀɪʀ ᴄᴏᴍᴍᴀɴᴅꜱ
// ════════════════════════════════════════════════════════════════
protectedCommand(/^\/setpairs\s+(\d+)$/i, async (msg, match) => {
    const chatId = msg.chat.id;
    const pairSize = parseInt(match[1]);

    if (pairSize < 1 || pairSize > allBots.length) {
        return sendMessageAllBots(chatId, `❌ <b>ᴘᴀɪʀ ꜱɪᴢᴇ</b> ᴍᴜꜱᴛ ʙᴇ 1-${allBots.length}`);
    }

    const st = sharedState.chatState.get(chatId) || {};
    st.pairSize = pairSize;
    sharedState.chatState.set(chatId, st);
    sendMessageAllBots(chatId, `✅ <b>ᴘᴀɪʀ ꜱɪᴢᴇ ꜱᴇᴛ ᴛᴏ</b> <i>${pairSize}</i>`);
});

protectedCommand(/^\/pairinfo$/i, async (msg) => {
    const chatId = msg.chat.id;
    const st = sharedState.chatState.get(chatId) || {};
    const pairSize = st.pairSize || 2;
    const performanceStatus = smartPairManager.getPerformanceStatus(chatId);

    let statusMsg = `╔════════════════════════════════╗\n`;
    statusMsg += `║     📊 <b>ᴘᴀɪʀ ꜱᴛᴀᴛᴜꜱ</b>       ║\n`;
    statusMsg += `╚════════════════════════════════╝\n\n`;
    statusMsg += `⚙️ ᴘᴀɪʀ ꜱɪᴢᴇ: <b>${pairSize}</b>\n`;
    statusMsg += `✅ ᴀᴠᴀɪʟᴀʙʟᴇ: <b>${allBots.length}/${allBots.length}</b>\n\n`;
    statusMsg += `📊 <b>ᴘᴇʀꜰᴏʀᴍᴀɴᴄᴇ</b>:\n`;

    performanceStatus.forEach(bot => {
        statusMsg += `🤖 ʙᴏᴛ ${bot.botIndex}: <i>${bot.successRate}%</i>\n`;
    });

    sendMessageAllBots(chatId, statusMsg);
});

protectedCommand(/^\/resetperformance$/i, async (msg) => {
    const chatId = msg.chat.id;
    smartPairManager.botPerformance.delete(chatId);
    smartPairManager.pairRotationIndex.delete(chatId);
    sendMessageAllBots(chatId, `✅ <b>ᴘᴇʀꜰᴏʀᴍᴀɴᴄᴇ ᴍᴇᴛʀɪᴄꜱ ʀᴇꜱᴇᴛ</b>`);
});

// ════════════════════════════════════════════════════════════════
// 🤖 ᴀᴜᴛᴏ-ᴘʀᴏᴍᴏᴛᴇ
// ════════════════════════════════════════════════════════════════
async function promoteAllWorkerBots(chatId) {
    const results = [];

    for (let i = 0; i < workerBots.length; i++) {
        try {
            const botInfo = await workerBots[i].getMe();
            await mainBot.promoteChatMember(chatId, botInfo.id, {
                can_manage_chat: true,
                can_delete_messages: true,
                can_manage_video_chats: true,
                can_restrict_members: true,
                can_promote_members: false,
                can_change_info: true,
                can_invite_users: true,
                can_pin_messages: true,
                can_manage_topics: true
            });
            results.push({ status: 'promoted' });
            await new Promise(resolve => setTimeout(resolve, 400));
        } catch (err) {
            results.push({ status: 'failed' });
        }
    }
    return results;
}

mainBot.on('my_chat_member', async (update) => {
    try {
        const chatId = update.chat.id;
        const newStatus = update.new_chat_member.status;
        const oldStatus = update.old_chat_member.status;

        if (newStatus === 'administrator' && oldStatus !== 'administrator') {
            await safeMainSend(chatId, '🤖 <i>ᴀᴜᴛᴏ-ᴘʀᴏᴍᴏᴛɪɴɢ ᴀʟʟ ᴡᴏʀᴋᴇʀ ʙᴏᴛꜱ...</i>', { parse_mode: 'HTML' });
            await new Promise(resolve => setTimeout(resolve, 1500));
            const results = await promoteAllWorkerBots(chatId);
            const successCount = results.filter(r => r.status === 'promoted').length;
            await safeMainSend(chatId, `✅ <b>ᴘʀᴏᴍᴏᴛᴇᴅ ${successCount}/${workerBots.length} ʙᴏᴛꜱ</b>`, { parse_mode: 'HTML' });
        }
    } catch (err) {}
});

protectedCommand(/^\/promoteall$/i, async (msg) => {
    const chatId = msg.chat.id;
    await safeMainSend(chatId, '🔄 <i>ᴘʀᴏᴍᴏᴛɪɴɢ ᴀʟʟ ᴡᴏʀᴋᴇʀ ʙᴏᴛꜱ...</i>', {
        parse_mode: 'HTML',
        reply_to_message_id: msg.message_id
    });

    const results = await promoteAllWorkerBots(chatId);
    const successCount = results.filter(r => r.status === 'promoted').length;

    sendMessageAllBots(chatId, `✅ <b>${successCount}/${workerBots.length} ᴘʀᴏᴍᴏᴛᴇᴅ</b>`);
});

protectedCommand(/^\/checkperms$/i, async (msg) => {
    const chatId = msg.chat.id;
    try {
        let statusMsg = `╔════════════════════════════════╗\n`;
        statusMsg += `║     🔍 <b>ᴘᴇʀᴍɪꜱꜱɪᴏɴꜱ</b>       ║\n`;
        statusMsg += `╚════════════════════════════════╝\n\n`;

        const mainBotInfo = await mainBot.getMe();
        const mainBotMember = await mainBot.getChatMember(chatId, mainBotInfo.id);
        statusMsg += `🎯 ᴍᴀɪɴ: <b>${mainBotMember.status}</b>\n\n`;

        for (let i = 0; i < workerBots.length; i++) {
            try {
                const botInfo = await workerBots[i].getMe();
                const botMember = await mainBot.getChatMember(chatId, botInfo.id);
                const icon = botMember.status === 'administrator' ? '✅' : '⚠️';
                statusMsg += `${icon} ʙᴏᴛ ${i + 1}: <i>${botMember.status}</i>\n`;
            } catch (err) {
                statusMsg += `❌ ʙᴏᴛ ${i + 1}: ᴇʀʀᴏʀ\n`;
            }
        }

        sendMessageAllBots(chatId, statusMsg);
    } catch (err) {
        sendMessageAllBots(chatId, '❌ ᴇʀʀᴏʀ ᴄʜᴇᴄᴋɪɴɢ ᴘᴇʀᴍɪꜱꜱɪᴏɴꜱ');
    }
});

// ════════════════════════════════════════════════════════════════
// 👑 ꜱᴏɴ ᴍᴀɴᴀɢᴇᴍᴇɴᴛ
// ════════════════════════════════════════════════════════════════
protectedCommand(/^\/addson\s+(\d+)$/i, async (msg, match) => {
    const mainOwnerId = ALLOWED_USERS[0];
    if (msg.from.id !== mainOwnerId) {
        return safeMainSend(msg.chat.id, '❌ <b>ᴏɴʟʏ ᴏᴡɴᴇʀ ᴄᴀɴ ᴀᴅᴅ ꜱᴏɴꜱ</b>', {
            parse_mode: 'HTML',
            reply_to_message_id: msg.message_id
        });
    }

    const userId = parseInt(match[1], 10);
    if (!ALLOWED_USERS.includes(userId)) {
        ALLOWED_USERS.push(userId);
        sendMessageAllBots(msg.chat.id, `✅ <b>ᴜꜱᴇʀ ${userId} ᴀᴅᴅᴇᴅ ᴀꜱ ꜱᴏɴ</b>`);
    } else {
        sendMessageAllBots(msg.chat.id, `ℹ️ ᴜꜱᴇʀ ${userId} ɪꜱ ᴀʟʀᴇᴀᴅʏ ᴀ ꜱᴏɴ`);
    }
});

protectedCommand(/^\/delson\s+(\d+)$/i, async (msg, match) => {
    const mainOwnerId = ALLOWED_USERS[0];
    if (msg.from.id !== mainOwnerId) {
        return safeMainSend(msg.chat.id, '❌ <b>ᴏɴʟʏ ᴏᴡɴᴇʀ ᴄᴀɴ ʀᴇᴍᴏᴠᴇ ꜱᴏɴꜱ</b>', {
            parse_mode: 'HTML',
            reply_to_message_id: msg.message_id
        });
    }

    const userId = parseInt(match[1], 10);
    if (userId === mainOwnerId) {
        return safeMainSend(msg.chat.id, '❌ <b>ᴄᴀɴɴᴏᴛ ʀᴇᴍᴏᴠᴇ ᴏᴡɴᴇʀ</b>', {
            parse_mode: 'HTML',
            reply_to_message_id: msg.message_id
        });
    }

    const index = ALLOWED_USERS.indexOf(userId);
    if (index > -1) {
        ALLOWED_USERS.splice(index, 1);
        sendMessageAllBots(msg.chat.id, `✅ <b>ᴜꜱᴇʀ ${userId} ʀᴇᴍᴏᴠᴇᴅ ꜰʀᴏᴍ ꜱᴏɴꜱ</b>`);
    } else {
        sendMessageAllBots(msg.chat.id, `ℹ️ ᴜꜱᴇʀ ${userId} ɪꜱ ɴᴏᴛ ᴀ ꜱᴏɴ`);
    }
});

protectedCommand(/^\/listsons$/i, async (msg) => {
    const chatId = msg.chat.id;
    let listMsg = `╔════════════════════════════════╗\n`;
    listMsg += `║     👑 <b>ꜱᴏɴꜱ ʟɪꜱᴛ</b>       ║\n`;
    listMsg += `╚════════════════════════════════╝\n\n`;

    ALLOWED_USERS.forEach((userId, index) => {
        if (index === 0) {
            listMsg += `👑 ᴏᴡɴᴇʀ: <code>${userId}</code>\n`;
        } else {
            listMsg += `👤 ꜱᴏɴ ${index}: <code>${userId}</code>\n`;
        }
    });

    listMsg += `\n📊 ᴛᴏᴛᴀʟ: <b>${ALLOWED_USERS.length}</b> ᴜꜱᴇʀꜱ`;
    sendMessageAllBots(chatId, listMsg);
});

// ════════════════════════════════════════════════════════════════
// 🔄 ɢʀᴏᴜᴘ ɴᴀᴍᴇ ᴄʜᴀɴɢᴇʀ
// ════════════════════════════════════════════════════════════════
protectedCommand(/^\/setgcnc\s+([\s\S]+)$/i, async (msg, match) => {
    const chatId = msg.chat.id;
    const title = match[1].trim();
    const st = sharedState.chatState.get(chatId) || {};
    sharedState.chatState.set(chatId, { ...st, title });
    sendMessageAllBots(chatId, `✅ <b>ʙᴀꜱᴇ ɴᴀᴍᴇ ꜱᴇᴛ:</b> <i>${esc(title)}</i>`);
});

protectedCommand(/^\/addemoji\s+([\s\S]+)$/i, async (msg, match) => {
    const chatId = msg.chat.id;
    const emojis = match[1].trim().split(/\s+/);
    const st = sharedState.chatState.get(chatId) || {};
    st.emojis = st.emojis ? st.emojis.concat(emojis) : emojis;
    sharedState.chatState.set(chatId, st);
    sendMessageAllBots(chatId, `✅ <b>ᴀᴅᴅᴇᴅ ᴇᴍᴏᴊɪꜱ:</b> <i>${emojis.join(' ')}</i>`);
});

protectedCommand(/^\/clearemojis$/i, async (msg) => {
    const chatId = msg.chat.id;
    const st = sharedState.chatState.get(chatId) || {};
    st.emojis = [];
    sharedState.chatState.set(chatId, st);
    sendMessageAllBots(chatId, `✅ <b>ᴄʟᴇᴀʀᴇᴅ ᴀʟʟ ᴇᴍᴏᴊɪꜱ</b>`);
});

function stopAllLoops(cid) {
    const st = sharedState.chatState.get(cid);
    if (st && st.loop) st.loop.stop();

    const sw = sharedState.swipeState.get(cid);
    if (sw && sw.loop) sw.loop.stop();

    const rd = sharedState.raidState.get(cid);
    if (rd && rd.loop) rd.loop.stop();

    const rt = sharedState.raidTimerState.get(cid);
    if (rt && rt.loop) rt.loop.stop();
}

protectedCommand(/^\/gcnc\s+([\s\S]+)$/i, async (msg, match) => {
    const chatId = msg.chat.id;
    const base = match[1].trim();

    stopAllLoops(chatId);

    const st = sharedState.chatState.get(chatId) || {};
    const pairSize = st.pairSize || 1;

    let index = 0;
    const loop = startLoop(300, () => {
        const text = RAID_TEXTS[index % RAID_TEXTS.length];
        ultraFastRename(chatId, `${base} ${text}`, pairSize);
        index++;
    });

    sharedState.chatState.set(chatId, {
        ...st,
        loop,
        type: 'gcnc',
        base,
        pairSize
    });

    sendMessageAllBots(chatId, `🚀 <b>ɢᴄɴᴄ ꜱᴛᴀʀᴛᴇᴅ</b> <i>(${pairSize} ʙᴏᴛꜱ, 300ᴍꜱ)</i>`);
});

protectedCommand(/^\/ncemo\s+([\s\S]+)$/i, async (msg, match) => {
    const chatId = msg.chat.id;
    const base = match[1].trim();

    stopAllLoops(chatId);

    const st = sharedState.chatState.get(chatId) || {};
    const pairSize = st.pairSize || 1;

    let index = 0;
    const loop = startLoop(300, () => {
        const emoji = NCEMO_EMOJIS[index % NCEMO_EMOJIS.length];
        ultraFastRename(chatId, `${base} ${emoji}`, pairSize);
        index++;
    });

    sharedState.chatState.set(chatId, {
        ...st,
        loop,
        type: 'ncemo',
        base,
        pairSize
    });

    sendMessageAllBots(chatId, `🚀 <b>ᴇᴍᴏᴊɪ ʟᴏᴏᴘ ꜱᴛᴀʀᴛᴇᴅ</b> <i>(${pairSize} ʙᴏᴛꜱ, 300ᴍꜱ)</i>`);
});

protectedCommand(/^\/gcnc_start\s+(\d+(?:\.\d+)?)$/i, async (msg, match) => {
    const chatId = msg.chat.id;
    let intervalS = Number(match[1]);
    if (intervalS < 0.3) intervalS = 0.3;

    const st = sharedState.chatState.get(chatId) || {};
    const title = st.title || 'My Group';
    const emojis = st.emojis && st.emojis.length > 0
        ? st.emojis
        : ['🌑','🌒','🌓','🌔','🌕','🌖','🌗','🌘'];
    const pairSize = st.pairSize || 1;

    stopAllLoops(chatId);

    let index = 0;
    const loop = startLoop(intervalS * 1000, () => {
        index = (index + 1) % emojis.length;
        ultraFastRename(chatId, `${emojis[index]} ${title} ${emojis[index]}`, pairSize);
    });

    sharedState.chatState.set(chatId, {
        ...st,
        loop,
        intervalS,
        title,
        emojis,
        pairSize,
        type: 'custom'
    });

    sendMessageAllBots(chatId, `🚀 <b>ꜱᴛᴀʀᴛᴇᴅ</b> <i>(${intervalS}ꜱ, ${pairSize} ʙᴏᴛꜱ)</i>`);
});

protectedCommand(/^\/stopgcnc$/i, async (msg) => {
    const chatId = msg.chat.id;
    stopAllLoops(chatId);
    sendMessageAllBots(chatId, '✅ <b>ʟᴏᴏᴘ ꜱᴛᴏᴘᴘᴇᴅ</b>');
});

protectedCommand(/^\/gcnc_stop$/i, async (msg) => {
    const chatId = msg.chat.id;
    stopAllLoops(chatId);
    sendMessageAllBots(chatId, '✅ <b>ꜱᴛᴏᴘᴘᴇᴅ</b>');
});

protectedCommand(/^\/delay\s+(\d+(?:\.\d+)?)$/i, async (msg, match) => {
    const chatId = msg.chat.id;
    let intervalS = Number(match[1]);
    if (intervalS < 0.3) intervalS = 0.3;

    const st = sharedState.chatState.get(chatId);
    if (!st || !st.loop) {
        return sendMessageAllBots(chatId, '❌ ɴᴏ ʟᴏᴏᴘ ʀᴜɴɴɪɴɢ');
    }

    st.loop.stop();

    const pairSize = st.pairSize || 1;
    let index = 0;

    const loop = startLoop(intervalS * 1000, () => {
        if (st.type === 'gcnc') {
            const text = RAID_TEXTS[index % RAID_TEXTS.length];
            ultraFastRename(chatId, `${st.base} ${text}`, pairSize);
            index++;
        } else if (st.type === 'ncemo') {
            const emoji = NCEMO_EMOJIS[index % NCEMO_EMOJIS.length];
            ultraFastRename(chatId, `${st.base} ${emoji}`, pairSize);
            index++;
        } else if (st.emojis && st.emojis.length > 0) {
            index = (index + 1) % st.emojis.length;
            ultraFastRename(chatId, `${st.emojis[index]} ${st.title} ${st.emojis[index]}`, pairSize);
        }
    });

    sharedState.chatState.set(chatId, { ...st, loop, intervalS });
    sendMessageAllBots(chatId, `⚡ <b>ᴅᴇʟᴀʏ:</b> <i>${intervalS}ꜱ</i>`);
});

// ════════════════════════════════════════════════════════════════
// 🎯 ꜱʟɪᴅᴇ & ꜱʟɪᴅᴇꜱᴘᴀᴍ
// ════════════════════════════════════════════════════════════════
protectedCommand(/^\/targetslide$/i, async (msg) => {
    const chatId = msg.chat.id;
    if (!msg.reply_to_message) {
        return sendMessageAllBots(chatId, '❌ ʀᴇᴘʟʏ ᴛᴏ ᴀ ᴍᴇꜱꜱᴀɢᴇ ꜰɪʀꜱᴛ!');
    }

    const userId = msg.reply_to_message.from.id;
    const name = msg.reply_to_message.from.first_name ||
                 msg.reply_to_message.from.username ||
                 userId;

    sharedState.slideTargets.add(userId);
    sendMessageAllBots(chatId, `🎯 <b>ꜱʟɪᴅᴇ:</b> <i>${esc(name)}</i>`);
});

protectedCommand(/^\/stopslide$/i, async (msg) => {
    const chatId = msg.chat.id;
    if (!msg.reply_to_message) {
        return sendMessageAllBots(chatId, '❌ ʀᴇᴘʟʏ ᴛᴏ ᴀ ᴍᴇꜱꜱᴀɢᴇ ꜰɪʀꜱᴛ!');
    }

    const userId = msg.reply_to_message.from.id;
    sharedState.slideTargets.delete(userId);
    sendMessageAllBots(chatId, `🛑 <b>ꜱʟɪᴅᴇ ꜱᴛᴏᴘᴘᴇᴅ</b>`);
});

protectedCommand(/^\/slidespam$/i, async (msg) => {
    const chatId = msg.chat.id;
    if (!msg.reply_to_message) {
        return sendMessageAllBots(chatId, '❌ ʀᴇᴘʟʏ ᴛᴏ ᴀ ᴍᴇꜱꜱᴀɢᴇ ꜰɪʀꜱᴛ!');
    }

    const userId = msg.reply_to_message.from.id;
    const name = msg.reply_to_message.from.first_name ||
                 msg.reply_to_message.from.username ||
                 userId;

    sharedState.slidespamTargets.add(userId);
    sendMessageAllBots(chatId, `💥 <b>ꜱᴘᴀᴍ:</b> <i>${esc(name)}</i>`);
});

protectedCommand(/^\/stopslidespam$/i, async (msg) => {
    const chatId = msg.chat.id;
    if (!msg.reply_to_message) {
        return sendMessageAllBots(chatId, '❌ ʀᴇᴘʟʏ ᴛᴏ ᴀ ᴍᴇꜱꜱᴀɢᴇ ꜰɪʀꜱᴛ!');
    }

    const userId = msg.reply_to_message.from.id;
    sharedState.slidespamTargets.delete(userId);
    sendMessageAllBots(chatId, `🛑 <b>ꜱᴘᴀᴍ ꜱᴛᴏᴘᴘᴇᴅ</b>`);
});

protectedCommand(/^\/quickslide$/i, async (msg) => {
    const chatId = msg.chat.id;
    if (!msg.reply_to_message) {
        return sendMessageAllBots(chatId, '❌ ʀᴇᴘʟʏ ᴛᴏ ᴀ ᴍᴇꜱꜱᴀɢᴇ ꜰɪʀꜱᴛ!');
    }

    const u = msg.reply_to_message.from;
    sharedState.slideTargets.add(u.id);

    for (let i = 0; i < 5; i++) {
        smartPairSendMessage(chatId, getRandomItem(RAID_TEXTS), {
            reply_to_message_id: msg.reply_to_message.message_id
        }, 1);
        await new Promise(resolve => setTimeout(resolve, 150));
    }

    sendMessageAllBots(chatId, `⚡ <b>Qᴜɪᴄᴋ ꜱʟɪᴅᴇ:</b> <i>${esc(u.first_name || u.username)}</i>`);
});

// ════════════════════════════════════════════════════════════════
// 💨 ꜱᴡɪᴘᴇ
// ════════════════════════════════════════════════════════════════
protectedCommand(/^\/swipe\s+([\s\S]+)$/i, async (msg, match) => {
    const chatId = msg.chat.id;
    const text = match[1].trim();

    if (msg.reply_to_message) {
        const replyMessageId = msg.reply_to_message.message_id;
        const st = sharedState.chatState.get(chatId) || {};
        const pairSize = st.pairSize || 1;

        const existing = sharedState.swipeState.get(chatId);
        if (existing && existing.loop) existing.loop.stop();

        const loop = startLoop(defaultSwipeDelay, () => {
            smartPairSendMessage(chatId, text, {
                reply_to_message_id: replyMessageId
            }, pairSize);
        });

        sharedState.swipeState.set(chatId, {
            loop,
            message: text,
            replyTo: replyMessageId,
            pairSize
        });

        sendMessageAllBots(chatId, `🚀 <b>ꜱᴡɪᴘᴇ ꜱᴛᴀʀᴛᴇᴅ</b> <i>(${pairSize} ʙᴏᴛꜱ)</i>`);
    } else {
        const base = text.trim();
        sharedState.swipeModeBase[chatId] = base;
        sendMessageAllBots(chatId, `⚡ <b>ꜱᴡɪᴘᴇ ᴍᴏᴅᴇ ᴏɴ:</b> <i>${esc(base)}</i>`);
    }
});

protectedCommand(/^\/stopswipe$/i, async (msg) => {
    const chatId = msg.chat.id;

    if (sharedState.swipeModeBase[chatId]) {
        delete sharedState.swipeModeBase[chatId];
        sendMessageAllBots(chatId, '🛑 <b>ꜱᴡɪᴘᴇ ᴍᴏᴅᴇ ᴏꜰꜰ</b>');
        return;
    }

    const st = sharedState.swipeState.get(chatId);
    if (!st || !st.loop) {
        return sendMessageAllBots(chatId, '❌ ɴᴏ ꜱᴡɪᴘᴇ ʀᴜɴɴɪɴɢ');
    }

    st.loop.stop();
    sharedState.swipeState.delete(chatId);
    sendMessageAllBots(chatId, '✅ <b>ꜱᴡɪᴘᴇ ꜱᴛᴏᴘᴘᴇᴅ</b>');
});

protectedCommand(/^\/swipdelay\s+(\d+(?:\.\d+)?)$/i, async (msg, match) => {
    const chatId = msg.chat.id;
    let delayS = Number(match[1]);
    if (delayS <= 0) return sendMessageAllBots(chatId, '❌ ɪɴᴠᴀʟɪᴅ ᴅᴇʟᴀʏ');

    defaultSwipeDelay = delayS * 1000;

    const st = sharedState.swipeState.get(chatId);
    if (st && st.loop) {
        st.loop.stop();
        const loop = startLoop(defaultSwipeDelay, () => {
            smartPairSendMessage(chatId, st.message, {
                reply_to_message_id: st.replyTo
            }, st.pairSize || 1);
        });
        sharedState.swipeState.set(chatId, { ...st, loop });
    }

    sendMessageAllBots(chatId, `⚡ <b>ꜱᴡɪᴘᴇ ᴅᴇʟᴀʏ:</b> <i>${delayS}ꜱ</i>`);
});

// ════════════════════════════════════════════════════════════════
// 💨 ʀᴀɪᴅ
// ════════════════════════════════════════════════════════════════
protectedCommand(/^\/raid\s+([\s\S]+)$/i, async (msg, match) => {
    const chatId = msg.chat.id;
    const text = match[1].trim();
    const st = sharedState.chatState.get(chatId) || {};
    const pairSize = st.pairSize || 1;

    const existing = sharedState.raidState.get(chatId);
    if (existing && existing.loop) existing.loop.stop();

    const loop = startLoop(defaultRaidDelay, () => {
        smartPairSendMessage(chatId, text, {}, pairSize);
    });

    sharedState.raidState.set(chatId, { loop, message: text, pairSize });
    sendMessageAllBots(chatId, `🚀 <b>ʀᴀɪᴅ ꜱᴛᴀʀᴛᴇᴅ</b> <i>(${pairSize} ʙᴏᴛꜱ)</i>`);
});

protectedCommand(/^\/raiddelay\s+(\d+(?:\.\d+)?)$/i, async (msg, match) => {
    const chatId = msg.chat.id;
    let delayS = Number(match[1]);
    if (delayS <= 0) return sendMessageAllBots(chatId, '❌ ɪɴᴠᴀʟɪᴅ ᴅᴇʟᴀʏ');

    defaultRaidDelay = delayS * 1000;

    const st = sharedState.raidState.get(chatId);
    if (st && st.loop) {
        st.loop.stop();
        const loop = startLoop(defaultRaidDelay, () => {
            smartPairSendMessage(chatId, st.message, {}, st.pairSize || 1);
        });
        sharedState.raidState.set(chatId, { ...st, loop });
    }

    sendMessageAllBots(chatId, `⚡ <b>ʀᴀɪᴅ ᴅᴇʟᴀʏ:</b> <i>${delayS}ꜱ</i>`);
});

protectedCommand(/^\/raidstop$/i, async (msg) => {
    const chatId = msg.chat.id;
    const st = sharedState.raidState.get(chatId);
    if (!st || !st.loop) {
        return sendMessageAllBots(chatId, '❌ ɴᴏ ʀᴀɪᴅ ʀᴜɴɴɪɴɢ');
    }

    st.loop.stop();
    sharedState.raidState.delete(chatId);
    sendMessageAllBots(chatId, '✅ <b>ʀᴀɪᴅ ꜱᴛᴏᴘᴘᴇᴅ</b>');
});

// ════════════════════════════════════════════════════════════════
// ⏰ ᴛɪᴍᴇʀ ʀᴀɪᴅ
// ════════════════════════════════════════════════════════════════
protectedCommand(/^\/raidwithtimer\s+([\s\S]+)$/i, async (msg, match) => {
    const chatId = msg.chat.id;
    const text = match[1].trim();
    const st = sharedState.chatState.get(chatId) || {};
    const pairSize = st.pairSize || 1;

    const existing = sharedState.raidTimerState.get(chatId);
    if (existing && existing.loop) existing.loop.stop();

    const loop = startLoop(defaultRaidTimerDelay, () => {
        const now = new Date();
        const h = String(now.getHours()).padStart(2, '0');
        const m = String(now.getMinutes()).padStart(2, '0');
        smartPairSendMessage(chatId, `${text} ᴀᴛ ${h}:${m}`, {}, pairSize);
    });

    sharedState.raidTimerState.set(chatId, { loop, message: text, pairSize });
    sendMessageAllBots(chatId, `🚀 <b>ᴛɪᴍᴇʀ ʀᴀɪᴅ ꜱᴛᴀʀᴛᴇᴅ</b> <i>(${pairSize} ʙᴏᴛꜱ)</i>`);
});

protectedCommand(/^\/raidtimedelay\s+(\d+(?:\.\d+)?)$/i, async (msg, match) => {
    const chatId = msg.chat.id;
    let delayS = Number(match[1]);
    if (delayS <= 0) return sendMessageAllBots(chatId, '❌ ɪɴᴠᴀʟɪᴅ ᴅᴇʟᴀʏ');

    defaultRaidTimerDelay = delayS * 1000;

    const st = sharedState.raidTimerState.get(chatId);
    if (st && st.loop) {
        st.loop.stop();
        const loop = startLoop(defaultRaidTimerDelay, () => {
            const now = new Date();
            const h = String(now.getHours()).padStart(2, '0');
            const m = String(now.getMinutes()).padStart(2, '0');
            smartPairSendMessage(chatId, `${st.message} ᴀᴛ ${h}:${m}`, {}, st.pairSize || 1);
        });
        sharedState.raidTimerState.set(chatId, { ...st, loop });
    }

    sendMessageAllBots(chatId, `⚡ <b>ᴛɪᴍᴇʀ ᴅᴇʟᴀʏ:</b> <i>${delayS}ꜱ</i>`);
});

protectedCommand(/^\/raidtimestop$/i, async (msg) => {
    const chatId = msg.chat.id;
    const st = sharedState.raidTimerState.get(chatId);
    if (!st || !st.loop) {
        return sendMessageAllBots(chatId, '❌ ɴᴏ ᴛɪᴍᴇʀ ʀᴀɪᴅ ʀᴜɴɴɪɴɢ');
    }

    st.loop.stop();
    sharedState.raidTimerState.delete(chatId);
    sendMessageAllBots(chatId, '✅ <b>ᴛɪᴍᴇʀ ʀᴀɪᴅ ꜱᴛᴏᴘᴘᴇᴅ</b>');
});

// ════════════════════════════════════════════════════════════════
// 🎨 ᴍᴏᴅᴇꜱ
// ════════════════════════════════════════════════════════════════
protectedCommand(/^\/massemoji$/i, async (msg) => {
    const chatId = msg.chat.id;
    const st = sharedState.chatState.get(chatId) || {};
    const pairSize = st.pairSize || 1;

    if (st.loop) st.loop.stop();

    let index = 0;
    const loop = startLoop(400, () => {
        const e1 = NCEMO_EMOJIS[index % NCEMO_EMOJIS.length];
        const e2 = NCEMO_EMOJIS[(index + 1) % NCEMO_EMOJIS.length];
        const e3 = NCEMO_EMOJIS[(index + 2) % NCEMO_EMOJIS.length];
        ultraFastRename(chatId, `${e1}${e2}${e3} ɢʀᴏᴜᴘ ${e3}${e2}${e1}`, pairSize);
        index++;
    });

    sharedState.chatState.set(chatId, { ...st, loop, type: 'massemoji' });
    sendMessageAllBots(chatId, '🌀 <b>ᴍᴀꜱꜱ ᴇᴍᴏᴊɪ ᴀᴄᴛɪᴠᴀᴛᴇᴅ</b>');
});

protectedCommand(/^\/rainbow$/i, async (msg) => {
    const chatId = msg.chat.id;
    const st = sharedState.chatState.get(chatId) || {};
    const pairSize = st.pairSize || 1;

    if (st.loop) st.loop.stop();

    const colors = ["🟥", "🟧", "🟨", "🟩", "🟦", "🟪", "🟫"];
    let index = 0;

    const loop = startLoop(300, () => {
        ultraFastRename(chatId, `${colors[index]} ʀᴀɪɴʙᴏᴡ ${colors[index]}`, pairSize);
        index = (index + 1) % colors.length;
    });

    sharedState.chatState.set(chatId, { ...st, loop, type: 'rainbow' });
    sendMessageAllBots(chatId, '🌈 <b>ʀᴀɪɴʙᴏᴡ ᴀᴄᴛɪᴠᴀᴛᴇᴅ</b>');
});

protectedCommand(/^\/pulse$/i, async (msg) => {
    const chatId = msg.chat.id;
    const st = sharedState.chatState.get(chatId) || {};
    const pairSize = st.pairSize || 1;

    if (st.loop) st.loop.stop();

    const symbols = ["●", "○", "◉", "◎", "◯"];
    let index = 0;

    const loop = startLoop(300, () => {
        ultraFastRename(chatId, `${symbols[index]} ᴘᴜʟꜱᴇ ${symbols[index]}`, pairSize);
        index = (index + 1) % symbols.length;
    });

    sharedState.chatState.set(chatId, { ...st, loop, type: 'pulse' });
    sendMessageAllBots(chatId, '💓 <b>ᴘᴜʟꜱᴇ ᴀᴄᴛɪᴠᴀᴛᴇᴅ</b>');
});

protectedCommand(/^\/matrix$/i, async (msg) => {
    const chatId = msg.chat.id;
    const st = sharedState.chatState.get(chatId) || {};
    const pairSize = st.pairSize || 1;

    if (st.loop) st.loop.stop();

    const chars = ["0", "1", "░", "▒", "▓", "█", "▄", "▀"];

    const loop = startLoop(400, () => {
        const a = chars[Math.floor(Math.random() * chars.length)];
        const b = chars[Math.floor(Math.random() * chars.length)];
        ultraFastRename(chatId, `${a}${b} ᴍᴀᴛʀɪx ${b}${a}`, pairSize);
    });

    sharedState.chatState.set(chatId, { ...st, loop, type: 'matrix' });
    sendMessageAllBots(chatId, '💾 <b>ᴍᴀᴛʀɪx ᴀᴄᴛɪᴠᴀᴛᴇᴅ</b>');
});
// ════════════════════════════════════════════════════════════════
// 🎮 ꜰᴜɴ ᴄᴏᴍᴍᴀɴᴅꜱ
// ════════════════════════════════════════════════════════════════
function targetName(msg) {
    if (!msg.reply_to_message) return 'ʏᴏᴜ';
    const u = msg.reply_to_message.from;
    return esc(u.first_name || u.username || 'ᴛʜᴇᴍ');
}

protectedCommand(/^\/roast$/i, async (msg) => {
    sendMessageAllBots(msg.chat.id, `🔥 <b>${targetName(msg)}</b>, <i>${getRandomItem(ROASTS)}</i>`);
});

protectedCommand(/^\/compliment$/i, async (msg) => {
    sendMessageAllBots(msg.chat.id, `<i>${getRandomItem(COMPLIMENTS)}</i> <b>${targetName(msg)}</b>!`);
});

protectedCommand(/^\/hype$/i, async (msg) => {
    sendMessageAllBots(msg.chat.id, `<b>${getRandomItem(HYPE_TEXTS)}</b>`);
});

protectedCommand(/^\/love$/i, async (msg) => {
    sendMessageAllBots(msg.chat.id, `💕 <b>${targetName(msg)}</b>, <i>${getRandomItem(LOVE_TEXTS)}</i>`);
});

protectedCommand(/^\/coin$/i, async (msg) => {
    const result = Math.random() < 0.5 ? '🪙 <b>ʜᴇᴀᴅꜱ!</b>' : '🪙 <b>ᴛᴀɪʟꜱ!</b>';
    sendMessageAllBots(msg.chat.id, result);
});

protectedCommand(/^\/dice$/i, async (msg) => {
    const number = Math.floor(Math.random() * 6) + 1;
    const diceEmojis = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
    sendMessageAllBots(msg.chat.id, `🎲 ʏᴏᴜ ʀᴏʟʟᴇᴅ: <b>${diceEmojis[number-1]} ${number}</b>`);
});

protectedCommand(/^\/rate\s+([\s\S]+)$/i, async (msg, match) => {
    const thing = esc(match[1].trim());
    const rating = Math.floor(Math.random() * 11);
    const emoji = rating > 7 ? '🔥' : rating > 4 ? '👍' : '💀';
    sendMessageAllBots(msg.chat.id, `${emoji} ɪ ʀᴀᴛᴇ "<i>${thing}</i>" ᴀ <b>${rating}/10</b>`);
});

protectedCommand(/^\/8ball\s+([\s\S]+)$/i, async (msg, match) => {
    const question = esc(match[1].trim());
    const answers = [
        '🎱 ʏᴇꜱ',
        '🎱 ɴᴏ',
        '🎱 ᴍᴀʏʙᴇ',
        '🎱 ᴅᴇꜰɪɴɪᴛᴇʟʏ',
        '🎱 ʟɪᴋᴇʟʏ',
        '🎱 ᴜɴʟɪᴋᴇʟʏ',
        '🎱 ᴀꜱᴋ ᴀɢᴀɪɴ',
        '🎱 ᴄᴀɴ\'ᴛ ꜱᴀʏ ɴᴏᴡ',
        '🎱 ᴏᴜᴛʟᴏᴏᴋ ɢᴏᴏᴅ',
        '🎱 ᴅᴏɴ\'ᴛ ᴄᴏᴜɴᴛ ᴏɴ ɪᴛ'
    ];
    sendMessageAllBots(msg.chat.id, `❓ <i>${question}</i>\n<b>${getRandomItem(answers)}</b>`);
});

protectedCommand(/^\/meme$/i, async (msg) => {
    const memes = [
        "😂 ʏ'ᴀʟʟ ɢᴏᴛ ᴀɴʏ ᴍᴇᴍᴇꜱ?",
        "🔥 ᴛʜɪꜱ ɪꜱ ꜰɪɴᴇ 🔥",
        "💀 ɪ'ᴍ ᴅᴇᴀᴅ 💀",
        "🤡 ᴡᴇʟᴄᴏᴍᴇ ᴛᴏ ᴛʜᴇ ᴄɪʀᴄᴜꜱ 🤡",
        "👀 ᴡʜᴀᴛ ɪꜱ ʜᴀᴘᴘᴇɴɪɴɢ? 👀",
        "🚀 ᴛᴏ ᴛʜᴇ ᴍᴏᴏɴ! 🚀",
        "💅 ᴏᴋ ᴜʀ ᴅᴏɴᴇ 💅",
        "🎪 ᴡᴇʟᴄᴏᴍᴇ ᴛᴏ ᴛʜᴇ ꜱʜᴏᴡ 🎪"
    ];
    sendMessageAllBots(msg.chat.id, getRandomItem(memes));
});

protectedCommand(/^\/fact$/i, async (msg) => {
    const facts = [
        "🧠 ᴛʜᴇ ʜᴜᴍᴀɴ ʙʀᴀɪɴ ᴄᴀɴ ʀᴇᴀᴅ ᴜᴘ ᴛᴏ 700 ᴡᴏʀᴅꜱ ᴘᴇʀ ᴍɪɴᴜᴛᴇ.",
        "🌍 ʙᴀɴᴀɴᴀꜱ ᴀʀᴇ ʙᴇʀʀɪᴇꜱ.",
        "🐙 ᴏᴄᴛᴏᴘᴜꜱᴇꜱ ʜᴀᴠᴇ ᴛʜʀᴇᴇ ʜᴇᴀʀᴛꜱ.",
        "🦒 ɢɪʀᴀꜰꜰᴇꜱ ʜᴀᴠᴇ ɴᴏ ᴠᴏᴄᴀʟ ᴄᴏʀᴅꜱ.",
        "🐧 ᴘᴇɴɢᴜɪɴꜱ ᴄᴀɴ ᴊᴜᴍᴘ ᴜᴘ ᴛᴏ 6 ꜰᴇᴇᴛ.",
        "🦈 ꜱʜᴀʀᴋꜱ ᴅᴏɴ'ᴛ ʜᴀᴠᴇ ʙᴏɴᴇꜱ.",
        "🐝 ʜᴏɴᴇʏ ɴᴇᴠᴇʀ ꜱᴘᴏɪʟꜱ.",
        "🌊 ᴛʜᴇ ᴏᴄᴇᴀɴ ɪꜱ ᴅᴇᴇᴘᴇʀ ᴛʜᴀɴ ᴇᴠᴇʀᴇꜱᴛ."
    ];
    sendMessageAllBots(msg.chat.id, getRandomItem(facts));
});

protectedCommand(/^\/joke$/i, async (msg) => {
    const jokes = [
        "😄 ᴡʜʏ ᴅᴏ ꜱᴄɪᴇɴᴛɪꜱᴛꜱ ᴛʀᴜꜱᴛ ᴀᴛᴏᴍꜱ? ʙᴇᴄᴀᴜꜱᴇ ᴛʜᴇʏ ᴍᴀᴋᴇ ᴜᴘ ᴇᴠᴇʀʏᴛʜɪɴɢ!",
        "😂 ᴡʜʏ ᴅᴏɴ'ᴛ ꜱᴋᴇʟᴇᴛᴏɴꜱ ꜰɪɢʜᴛ? ᴛʜᴇʏ ᴅᴏɴ'ᴛ ʜᴀᴠᴇ ɢᴜᴛꜱ!",
        "😆 ᴡʜᴀᴛ ᴅᴏ ʏᴏᴜ ᴄᴀʟʟ ᴀ ꜰɪꜱʜ ᴡɪᴛʜ ɴᴏ ᴇʏᴇꜱ? ᴀ ꜰꜱʜ!",
        "🤣 ᴡʜʏ ᴅɪᴅ ᴛʜᴇ ᴍᴀᴛʜ ʙᴏᴏᴋ ʟᴏᴏᴋ ꜱᴀᴅ? ᴛᴏᴏ ᴍᴀɴʏ ᴘʀᴏʙʟᴇᴍꜱ!",
        "😹 ᴄᴏᴍᴘᴜᴛᴇʀ'ꜱ ꜰᴀᴠ ꜱɴᴀᴄᴋ? ᴍɪᴄʀᴏᴡᴀᴠᴇ ᴄʜɪᴘꜱ!",
        "😂 ᴡʜʏ ᴅᴏɴ'ᴛ ᴘʀᴏɢʀᴀᴍᴍᴇʀꜱ ʟɪᴋᴇ ɴᴀᴛᴜʀᴇ? ᴛᴏᴏ ᴍᴀɴʏ ʙᴜɢꜱ!"
    ];
    sendMessageAllBots(msg.chat.id, getRandomItem(jokes));
});

protectedCommand(/^\/quote$/i, async (msg) => {
    const quotes = [
        "💪 'ᴛʜᴇ ᴏɴʟʏ ᴡᴀʏ ᴛᴏ ᴅᴏ ɢʀᴇᴀᴛ ᴡᴏʀᴋ ɪꜱ ᴛᴏ ʟᴏᴠᴇ ᴡʜᴀᴛ ʏᴏᴜ ᴅᴏ.'",
        "🌟 'ꜱᴜᴄᴄᴇꜱꜱ ɪꜱ ɴᴏᴛ ꜰɪɴᴀʟ, ꜰᴀɪʟᴜʀᴇ ɪꜱ ɴᴏᴛ ꜰᴀᴛᴀʟ.'",
        "🔥 'ʙᴇʟɪᴇᴠᴇ ʏᴏᴜ ᴄᴀɴ ᴀɴᴅ ʏᴏᴜ'ʀᴇ ʜᴀʟꜰᴡᴀʏ ᴛʜᴇʀᴇ.'",
        "✨ 'ᴛʜᴇ ꜰᴜᴛᴜʀᴇ ʙᴇʟᴏɴɢꜱ ᴛᴏ ᴛʜᴏꜱᴇ ᴡʜᴏ ʙᴇʟɪᴇᴠᴇ.'",
        "💯 'ɪᴛ ᴅᴏᴇꜱ ɴᴏᴛ ᴍᴀᴛᴛᴇʀ ʜᴏᴡ ꜱʟᴏᴡʟʏ ʏᴏᴜ ɢᴏ.'"
    ];
    sendMessageAllBots(msg.chat.id, `<i>${getRandomItem(quotes)}</i>`);
});

protectedCommand(/^\/random\s+(\d+)\s+(\d+)$/i, async (msg, match) => {
    const min = parseInt(match[1]);
    const max = parseInt(match[2]);
    if (min >= max) {
        return sendMessageAllBots(msg.chat.id, '❌ ᴍɪɴ ᴍᴜꜱᴛ ʙᴇ ʟᴇꜱꜱ ᴛʜᴀɴ ᴍᴀx!');
    }
    const random = Math.floor(Math.random() * (max - min + 1)) + min;
    sendMessageAllBots(msg.chat.id, `🎲 <b>${random}</b>`);
});

protectedCommand(/^\/wyr$/i, async (msg) => {
    const options = [
        "🤔 ᴡᴏᴜʟᴅ ʏᴏᴜ ʀᴀᴛʜᴇʀ ꜰʟʏ ᴏʀ ʙᴇ ɪɴᴠɪꜱɪʙʟᴇ?",
        "🤔 ᴡᴏᴜʟᴅ ʏᴏᴜ ʀᴀᴛʜᴇʀ ʟɪᴠᴇ ɪɴ ᴀ ᴄᴀꜱᴛʟᴇ ᴏʀ ᴀ ꜱᴘᴀᴄᴇ ꜱᴛᴀᴛɪᴏɴ?",
        "🤔 ᴡᴏᴜʟᴅ ʏᴏᴜ ʀᴀᴛʜᴇʀ ʙᴇ ᴀ ᴘɪʀᴀᴛᴇ ᴏʀ ᴀ ɴɪɴᴊᴀ?",
        "🤔 ᴡᴏᴜʟᴅ ʏᴏᴜ ʀᴀᴛʜᴇʀ ʜᴀᴠᴇ ᴀ ᴅʀᴀɢᴏɴ ᴏʀ ᴀ ᴜɴɪᴄᴏʀɴ ᴀꜱ ᴀ ᴘᴇᴛ?",
        "🤔 ꜱᴘᴇᴀᴋ ᴀʟʟ ᴀɴɪᴍᴀʟ ʟᴀɴɢᴜᴀɢᴇꜱ ᴏʀ ᴀʟʟ ʜᴜᴍᴀɴ ʟᴀɴɢᴜᴀɢᴇꜱ?"
    ];
    sendMessageAllBots(msg.chat.id, getRandomItem(options));
});

protectedCommand(/^\/nickgen$/i, async (msg) => {
    const prefixes = ["ᴄʏʙᴇʀ", "ᴅᴀʀᴋ", "ɴɪɢʜᴛ", "ꜱʜᴀᴅᴏᴡ", "ɢʜᴏꜱᴛ", "ᴢᴇʀᴏ", "ᴏᴍɴɪ", "ᴜʟᴛʀᴀ", "ᴍᴇɢᴀ", "ᴛᴜʀʙᴏ"];
    const suffixes = ["x", "ᴋɪʟʟᴇʀ", "ʙᴏᴛ", "ʜᴀᴄᴋ", "ɢᴏᴅ", "ʟᴏʀᴅ", "ᴋɪɴɢ", "ǫᴜᴇᴇɴ", "ᴍᴀꜱᴛᴇʀ", "ʟᴇɢᴇɴᴅ"];
    const number = Math.floor(Math.random() * 100);
    const nickname = `${getRandomItem(prefixes)}${getRandomItem(suffixes)}${number}`;
    sendMessageAllBots(msg.chat.id, `🎮 ʏᴏᴜʀ ɴɪᴄᴋɴᴀᴍᴇ: <b>${nickname}</b>`);
});

protectedCommand(/^\/emojimix\s+(\d+)$/i, async (msg, match) => {
    const count = Math.min(parseInt(match[1]), 20);
    let emojiString = '';
    for (let i = 0; i < count; i++) {
        emojiString += getRandomItem(NCEMO_EMOJIS);
    }
    sendMessageAllBots(msg.chat.id, `🎨 ${emojiString}`);
});

protectedCommand(/^\/echo\s+([\s\S]+)$/i, async (msg, match) => {
    const text = esc(match[1].trim());
    const styles = [
        '<b>' + text + '</b>',
        '<i>' + text + '</i>',
        '<code>' + text + '</code>',
        '<b><i>' + text + '</i></b>',
        text
    ];
    sendMessageAllBots(msg.chat.id, getRandomItem(styles));
});

protectedCommand(/^\/shrug$/i, async (msg) => {
    sendMessageAllBots(msg.chat.id, '¯\\_(ツ)_/¯');
});

protectedCommand(/^\/tableflip$/i, async (msg) => {
    sendMessageAllBots(msg.chat.id, '(╯°□°）╯︵ ┻━┻');
});

protectedCommand(/^\/unflip$/i, async (msg) => {
    sendMessageAllBots(msg.chat.id, '┬─┬ノ( º _ ºノ)');
});

// ════════════════════════════════════════════════════════════════
// ✨ ᴇxᴛʀᴀ ᴄᴏᴍᴍᴀɴᴅꜱ
// ════════════════════════════════════════════════════════════════
protectedCommand(/^\/rizz$/i, async (msg) => {
    const score = Math.floor(Math.random() * 101);
    sendMessageAllBots(msg.chat.id, `🎯 <b>${targetName(msg)}</b>'ꜱ ʀɪᴢᴢ: <b>${score}%</b>\n<i>${getRandomItem(RIZZ_LINES)}</i>`);
});

protectedCommand(/^\/simp$/i, async (msg) => {
    sendMessageAllBots(msg.chat.id, `💀 <b>${targetName(msg)}</b>: <i>${getRandomItem(SIMP_LINES)}</i>`);
});

protectedCommand(/^\/ship$/i, async (msg) => {
    if (!msg.reply_to_message) {
        return sendMessageAllBots(msg.chat.id, '❌ ʀᴇᴘʟʏ ᴛᴏ ꜱᴏᴍᴇᴏɴᴇ ꜰɪʀꜱᴛ!');
    }
    const a = esc(msg.from.first_name || msg.from.username || 'ʏᴏᴜ');
    const b = targetName(msg);
    const pct = Math.floor(Math.random() * 101);
    const bar = '█'.repeat(Math.floor(pct / 5)) + '░'.repeat(20 - Math.floor(pct / 5));
    sendMessageAllBots(msg.chat.id, `💞 <b>${a}</b> ❤️ <b>${b}</b>\n${bar}\n💯 <b>${pct}%</b>`);
});

protectedCommand(/^\/slap$/i, async (msg) => {
    const from = esc(msg.from.first_name || 'ᴜꜱᴇʀ');
    sendMessageAllBots(msg.chat.id, `👋 <b>${from}</b> ꜱʟᴀᴘᴘᴇᴅ <b>${targetName(msg)}</b>!`);
});

protectedCommand(/^\/hug$/i, async (msg) => {
    const from = esc(msg.from.first_name || 'ᴜꜱᴇʀ');
    sendMessageAllBots(msg.chat.id, `🤗 <b>${from}</b> ʜᴜɢɢᴇᴅ <b>${targetName(msg)}</b>!`);
});

protectedCommand(/^\/pat$/i, async (msg) => {
    const from = esc(msg.from.first_name || 'ᴜꜱᴇʀ');
    sendMessageAllBots(msg.chat.id, `👐 <b>${from}</b> ᴘᴀᴛᴛᴇᴅ <b>${targetName(msg)}</b>!`);
});

protectedCommand(/^\/kiss$/i, async (msg) => {
    const from = esc(msg.from.first_name || 'ᴜꜱᴇʀ');
    sendMessageAllBots(msg.chat.id, `💋 <b>${from}</b> ᴋɪꜱꜱᴇᴅ <b>${targetName(msg)}</b>!`);
});

protectedCommand(/^\/gay$/i, async (msg) => {
    sendMessageAllBots(msg.chat.id, `<b>${getRandomItem(GAY_LINES)}</b> — <i>${targetName(msg)}</i>`);
});

protectedCommand(/^\/sigma$/i, async (msg) => {
    sendMessageAllBots(msg.chat.id, `🗿 <b>${targetName(msg)}</b>: <i>${getRandomItem(SIGMA_LINES)}</i>`);
});

protectedCommand(/^\/chad$/i, async (msg) => {
    sendMessageAllBots(msg.chat.id, `🗿 <b>${targetName(msg)}</b>: <i>${getRandomItem(CHAD_LINES)}</i>`);
});

protectedCommand(/^\/iq$/i, async (msg) => {
    const iq = Math.floor(Math.random() * 180) + 20;
    sendMessageAllBots(msg.chat.id, `🧠 <b>${targetName(msg)}</b>'ꜱ ɪQ: <b>${iq}</b>`);
});

protectedCommand(/^\/pp$/i, async (msg) => {
    const size = Math.floor(Math.random() * 15);
    sendMessageAllBots(msg.chat.id, `🍆 <b>${targetName(msg)}</b>: <b>${size}ᴄᴍ</b>\n<code>${'8'.repeat(size)}${size ? 'D' : '😭'}</code>`);
});

protectedCommand(/^\/vibe$/i, async (msg) => {
    sendMessageAllBots(msg.chat.id, `<i>${getRandomItem(VIBE_LINES)}</i>`);
});

protectedCommand(/^\/dox$/i, async (msg) => {
    const fakeIp = `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;
    sendMessageAllBots(msg.chat.id, `🔍 ᴅᴏxxɪɴɢ <b>${targetName(msg)}</b>...\n📍 ɪᴘ: <code>${fakeIp}</code>\n⚠️ <i>ᴛʜɪꜱ ɪꜱ ᴀ ᴊᴏᴋᴇ!</i>`);
});

// ════════════════════════════════════════════════════════════════
// ⚡ ᴘᴇʀꜰᴏʀᴍᴀɴᴄᴇ
// ════════════════════════════════════════════════════════════════
protectedCommand(/^\/fast$/i, async (msg) => {
    defaultSwipeDelay = 300;
    defaultRaidDelay = 300;
    defaultRaidTimerDelay = 300;
    sendMessageAllBots(msg.chat.id, '⚡ <b>ꜰᴀꜱᴛ ᴍᴏᴅᴇ</b> <i>(300ᴍꜱ)</i>');
});

protectedCommand(/^\/turbo$/i, async (msg) => {
    defaultSwipeDelay = 200;
    defaultRaidDelay = 200;
    defaultRaidTimerDelay = 200;
    sendMessageAllBots(msg.chat.id, '🚀 <b>ᴛᴜʀʙᴏ ᴍᴏᴅᴇ</b> <i>(200ᴍꜱ)</i>');
});

protectedCommand(/^\/boost$/i, async (msg) => {
    const chatId = msg.chat.id;
    const st = sharedState.chatState.get(chatId) || {};
    st.pairSize = Math.min(3, allBots.length);
    sharedState.chatState.set(chatId, st);
    sendMessageAllBots(chatId, `🚀 <b>ʙᴏᴏꜱᴛ</b> <i>(${st.pairSize} ʙᴏᴛꜱ)</i>`);
});

protectedCommand(/^\/speedtest$/i, async (msg) => {
    const chatId = msg.chat.id;
    const start = Date.now();

    for (let i = 0; i < 5; i++) {
        smartPairSendMessage(chatId, `⚡ ᴛᴇꜱᴛ ${i + 1}`, {}, 1);
    }

    const totalTime = Date.now() - start;
    sendMessageAllBots(chatId, `📊 <b>ꜱᴘᴇᴇᴅ ᴛᴇꜱᴛ</b>\n⏱️ <i>${totalTime}ᴍꜱ (ꜰɪʀᴇᴅ)</i>`);
});

protectedCommand(/^\/mode$/i, async (msg) => {
    const chatId = msg.chat.id;
    const st = sharedState.chatState.get(chatId);

    let modeMsg = `╔════════════════════════════════╗\n`;
    modeMsg += `║     🎮 <b>ᴀᴄᴛɪᴠᴇ ᴍᴏᴅᴇ</b>       ║\n`;
    modeMsg += `╚════════════════════════════════╝\n\n`;

    if (st && st.type) {
        modeMsg += `✨ ᴍᴏᴅᴇ: <b>${st.type.toUpperCase()}</b>\n`;
        modeMsg += `🤖 ᴘᴀɪʀꜱ: <b>${st.pairSize || 1}</b>\n`;
        modeMsg += `⏱️ ɪɴᴛᴇʀᴠᴀʟ: <b>${st.intervalS || '0.3'}ꜱ</b>\n`;
    } else {
        modeMsg += '❌ <i>ɴᴏ ᴀᴄᴛɪᴠᴇ ᴍᴏᴅᴇ</i>';
    }

    sendMessageAllBots(chatId, modeMsg);
});

// ════════════════════════════════════════════════════════════════
// 📊 ꜱʏꜱᴛᴇᴍ ɪɴꜰᴏ
// ════════════════════════════════════════════════════════════════
protectedCommand(/^\/botcount$/i, async (msg) => {
    sendMessageAllBots(msg.chat.id,
        `🤖 ᴛᴏᴛᴀʟ ʙᴏᴛꜱ: <b>${allBots.length}</b>\n` +
        `🎯 ᴍᴀɪɴ: <b>1</b>\n` +
        `👷 ᴡᴏʀᴋᴇʀꜱ: <b>${workerBots.length}</b>`
    );
});

protectedCommand(/^\/version$/i, async (msg) => {
    sendMessageAllBots(msg.chat.id,
        '🚀 <b>ᴜʟᴛɪᴍᴀᴛᴇ ʙᴏᴛ ᴠ3.0</b>\n' +
        '⚡ <i>ᴘʀᴏꜰᴇꜱꜱɪᴏɴᴀʟ ᴇᴅɪᴛɪᴏɴ</i>\n' +
        '🎨 <i>ꜱᴛʏʟɪꜱʜ</i>\n' +
        '📅 <i>2024</i>'
    );
});

protectedCommand(/^\/helpall$/i, async (msg) => {
    sendMessageAllBots(msg.chat.id,
        '📚 ᴜꜱᴇ <code>/info</code> ꜰᴏʀ ꜰᴜʟʟ ʟɪꜱᴛ\n' +
        '⚡ /ꜰᴀꜱᴛ\n' +
        '🚀 /ᴛᴜʀʙᴏ\n' +
        '🎯 /ꜱᴛᴀᴛᴜꜱ\n' +
        '🛑 /ꜱᴛᴏᴘᴀʟʟ'
    );
});

protectedCommand(/^\/delaystatus$/i, async (msg) => {
    sendMessageAllBots(msg.chat.id,
        `⏱️ ᴄᴜʀʀᴇɴᴛ ᴅᴇʟᴀʏꜱ:\n` +
        `⚡ ꜱᴡɪᴘᴇ: <b>${defaultSwipeDelay}ᴍꜱ</b>\n` +
        `💨 ʀᴀɪᴅ: <b>${defaultRaidDelay}ᴍꜱ</b>\n` +
        `⏰ ᴛɪᴍᴇʀ: <b>${defaultRaidTimerDelay}ᴍꜱ</b>`
    );
});

protectedCommand(/^\/cleartargets$/i, async (msg) => {
    sharedState.slideTargets.clear();
    sharedState.slidespamTargets.clear();
    sendMessageAllBots(msg.chat.id, '🎯 <b>ᴀʟʟ ᴛᴀʀɢᴇᴛꜱ ᴄʟᴇᴀʀᴇᴅ</b>');
});

// ════════════════════════════════════════════════════════════════
// 🛑 ꜱᴛᴏᴘ
// ════════════════════════════════════════════════════════════════
protectedCommand(/^\/stop$/i, async (msg) => {
    const chatId = msg.chat.id;
    stopAllLoops(chatId);

    sharedState.swipeState.delete(chatId);
    sharedState.raidState.delete(chatId);
    sharedState.raidTimerState.delete(chatId);
    if (sharedState.swipeModeBase[chatId]) {
        delete sharedState.swipeModeBase[chatId];
    }

    sendMessageAllBots(chatId, '✅ <b>ᴀʟʟ ᴏᴘᴇʀᴀᴛɪᴏɴꜱ ꜱᴛᴏᴘᴘᴇᴅ</b>');
});

protectedCommand(/^\/stopall$/i, async (msg) => {
    const chatId = msg.chat.id;

    for (const [, state] of sharedState.chatState.entries()) {
        if (state.loop) state.loop.stop();
    }
    sharedState.chatState.clear();

    for (const [, state] of sharedState.swipeState.entries()) {
        if (state.loop) state.loop.stop();
    }
    sharedState.swipeState.clear();

    for (const [, state] of sharedState.raidState.entries()) {
        if (state.loop) state.loop.stop();
    }
    sharedState.raidState.clear();

    for (const [, state] of sharedState.raidTimerState.entries()) {
        if (state.loop) state.loop.stop();
    }
    sharedState.raidTimerState.clear();

    sharedState.swipeModeBase = {};

    sendMessageAllBots(chatId, '⏹ <b>ᴀʟʟ ʟᴏᴏᴘꜱ ꜱᴛᴏᴘᴘᴇᴅ</b>');
});

protectedCommand(/^\/restart$/i, async (msg) => {
    const chatId = msg.chat.id;

    for (const [, state] of sharedState.chatState.entries()) {
        if (state.loop) state.loop.stop();
    }
    sharedState.chatState.clear();

    for (const [, state] of sharedState.swipeState.entries()) {
        if (state.loop) state.loop.stop();
    }
    sharedState.swipeState.clear();

    for (const [, state] of sharedState.raidState.entries()) {
        if (state.loop) state.loop.stop();
    }
    sharedState.raidState.clear();

    for (const [, state] of sharedState.raidTimerState.entries()) {
        if (state.loop) state.loop.stop();
    }
    sharedState.raidTimerState.clear();

    sharedState.swipeModeBase = {};

    sendMessageAllBots(chatId, '🔄 <b>ꜱʏꜱᴛᴇᴍ ʀᴇꜱᴛᴀʀᴛᴇᴅ</b>');
});

// ════════════════════════════════════════════════════════════════
// 📈 ꜱᴛᴀᴛᴜꜱ
// ════════════════════════════════════════════════════════════════
protectedCommand(/^\/status$/i, async (msg) => {
    const chatId = msg.chat.id;
    let statusMsg = `╔════════════════════════════════╗\n`;
    statusMsg += `║     📊 <b>ᴀᴄᴛɪᴠᴇ ꜱᴛᴀᴛᴜꜱ</b>     ║\n`;
    statusMsg += `╚════════════════════════════════╝\n\n`;

    for (const [cId, state] of sharedState.chatState.entries()) {
        if (state.loop) {
            statusMsg += `💬 ᴄʜᴀᴛ ${cId}: <i>${state.type || 'renaming'}</i>\n`;
        }
    }

    statusMsg += `\n🎯 ꜱʟɪᴅᴇꜱ: <b>${sharedState.slideTargets.size}</b>\n`;
    statusMsg += `💥 ꜱᴘᴀᴍꜱ: <b>${sharedState.slidespamTargets.size}</b>\n`;
    statusMsg += `⚡ ꜱᴡɪᴘᴇꜱ: <b>${Object.keys(sharedState.swipeModeBase).length}</b>`;

    sendMessageAllBots(chatId, statusMsg);
});

protectedCommand(/^\/sysinfo$/i, async (msg) => {
    const chatId = msg.chat.id;
    let infoMsg = `╔════════════════════════════════╗\n`;
    infoMsg += `║     🤖 <b>ꜱʏꜱᴛᴇᴍ ɪɴꜰᴏ</b>       ║\n`;
    infoMsg += `╚════════════════════════════════╝\n\n`;
    infoMsg += `🚀 ʙᴏᴛꜱ: <b>${allBots.length}</b>\n`;
    infoMsg += `👑 ꜱᴏɴꜱ: <b>${ALLOWED_USERS.length}</b>\n`;
    infoMsg += `⚡ ᴅᴇʟᴀʏ: <b>${defaultSwipeDelay}ᴍꜱ</b>\n`;
    infoMsg += `📊 ᴛᴀʀɢᴇᴛꜱ: <b>${sharedState.slideTargets.size}</b>\n`;
    infoMsg += `💥 ꜱᴘᴀᴍꜱ: <b>${sharedState.slidespamTargets.size}</b>\n`;
    infoMsg += `🎯 ᴀᴄᴛɪᴠᴇ: <b>${sharedState.chatState.size}</b>`;
    sendMessageAllBots(chatId, infoMsg);
});

protectedCommand(/^\/checkall$/i, async (msg) => {
    const chatId = msg.chat.id;
    let checkMsg = `╔════════════════════════════════╗\n`;
    checkMsg += `║     🤖 <b>ʙᴏᴛꜱ ꜱᴛᴀᴛᴜꜱ</b>     ║\n`;
    checkMsg += `╚════════════════════════════════╝\n\n`;
    checkMsg += `✅ ᴍᴀɪɴ: <i>ᴀᴄᴛɪᴠᴇ</i>\n`;

    for (let i = 0; i < Math.min(5, workerBots.length); i++) {
        checkMsg += `✅ ᴡᴏʀᴋᴇʀ ${i + 1}: <i>ᴀᴄᴛɪᴠᴇ</i>\n`;
    }

    if (workerBots.length > 5) {
        checkMsg += `<i>... ᴀɴᴅ ${workerBots.length - 5} ᴍᴏʀᴇ</i>\n`;
    }

    checkMsg += `\n📊 ᴛᴏᴛᴀʟ: <b>${allBots.length}</b>`;
    sendMessageAllBots(chatId, checkMsg);
});

// ════════════════════════════════════════════════════════════════
// 🏓 ᴘɪɴɢ / ᴜᴛɪʟꜱ
// ════════════════════════════════════════════════════════════════
protectedCommand(/^\/ping$/i, async (msg) => {
    const chatId = msg.chat.id;
    const start = Date.now();
    try {
        const sent = await mainBot.sendMessage(chatId, '🏓 <i>ᴘɪɴɢɪɴɢ...</i>', {
            parse_mode: 'HTML',
            reply_to_message_id: msg.message_id
        });
        await mainBot.editMessageText(
            `🏓 <b>ᴘᴏɴɢ!</b> <i>${Date.now() - start}ᴍꜱ</i>\n🤖 <b>${allBots.length}</b> ʙᴏᴛꜱ`,
            { chat_id: chatId, message_id: sent.message_id, parse_mode: 'HTML' }
        );
    } catch (err) {}
});

protectedCommand(/^\/ping2$/i, async (msg) => {
    const chatId = msg.chat.id;
    const start = Date.now();
    try {
        const sent = await mainBot.sendMessage(chatId, '🏓 <i>ᴘɪɴɢɪɴɢ...</i>', {
            parse_mode: 'HTML',
            reply_to_message_id: msg.message_id
        });
        await mainBot.editMessageText(
            `🏓 <b>ᴘᴏɴɢ!</b> <i>${Date.now() - start}ᴍꜱ</i>\n⚡ <b>ᴀᴄᴛɪᴠᴇ</b>\n🤖 <b>${allBots.length}</b>`,
            { chat_id: chatId, message_id: sent.message_id, parse_mode: 'HTML' }
        );
    } catch (err) {}
});

protectedCommand(/^\/myid$/i, async (msg) => {
    sendMessageAllBots(msg.chat.id,
        `🆔 ʏᴏᴜʀ ɪᴅ: <code>${msg.from.id}</code>\n` +
        `👑 <b>${isAuthorized(msg.from.id) ? 'ꜱᴏɴ' : 'ᴜꜱᴇʀ'}</b>`
    );
});

protectedCommand(/^\/help$/i, async (msg) => {
    sendMessageAllBots(msg.chat.id,
        '📚 ᴜꜱᴇ <code>/info</code>\n' +
        '⚡ /ꜰᴀꜱᴛ\n' +
        '🚀 /ᴛᴜʀʙᴏ\n' +
        '🎮 /ʀᴏᴀꜱᴛ, /ᴊᴏᴋᴇ, /ᴄᴏɪɴ'
    );
});

protectedCommand(/^\/start$/i, async (msg) => {
    sendMessageAllBots(msg.chat.id,
        '🚀 <b>ᴜʟᴛɪᴍᴀᴛᴇ ʙᴏᴛ ᴠ3.0</b>\n' +
        '⚡ <i>ᴘʀᴏꜰᴇꜱꜱɪᴏɴᴀʟ ᴇᴅɪᴛɪᴏɴ</i>\n\n' +
        '📌 <b>ᴘʀᴇꜰɪx:</b>\n' +
        '• <code>/command</code> → ʙᴏᴛ / ᴡᴏʀᴋᴇʀꜱ\n' +
        '• <code>.command</code> → ʏᴏᴜʀ ᴜꜱᴇʀʙᴏᴛ\n\n' +
        '📚 /ɪɴꜰᴏ\n' +
        '🚀 /ꜰᴀꜱᴛ'
    );
});

// ════════════════════════════════════════════════════════════════
// 📱 ɪɴꜰᴏ
// ════════════════════════════════════════════════════════════════
protectedCommand(/^\/info$/i, async (msg) => {
    const chatId = msg.chat.id;
    const commands = `
╔══════════════════════════════════════════╗
║      🚀 <b>ᴜʟᴛɪᴍᴀᴛᴇ ʙᴏᴛ ᴠ3.0</b>          ║
║         ✨ <i>ꜱᴛʏʟɪꜱʜ ᴇᴅɪᴛɪᴏɴ</i>          ║
╚══════════════════════════════════════════╝

<b>🧠 ꜱᴍᴀʀᴛ ᴘᴀɪʀɪɴɢ</b>
/ꜱᴇᴛᴘᴀɪʀꜱ <1-${allBots.length}> · /ᴘᴀɪʀɪɴꜰᴏ · /ʀᴇꜱᴇᴛᴘᴇʀꜰᴏʀᴍᴀɴᴄᴇ

<b>🔧 ᴘʀᴏᴍᴏᴛɪᴏɴ</b>
/ᴘʀᴏᴍᴏᴛᴇᴀʟʟ · /ᴄʜᴇᴄᴋᴘᴇʀᴍꜱ

<b>👑 ꜱᴏɴ ᴍᴀɴᴀɢᴇᴍᴇɴᴛ</b>
/ᴀᴅᴅꜱᴏɴ <ɪᴅ> · /ᴅᴇʟꜱᴏɴ <ɪᴅ> · /ʟɪꜱᴛꜱᴏɴꜱ

<b>⚡ ʀᴇɴᴀᴍɪɴɢ</b>
/ɢᴄɴᴄ <ʙᴀꜱᴇ> · /ɴᴄᴇᴍᴏ <ʙᴀꜱᴇ> · /ꜱᴇᴛɢᴄɴᴄ
/ᴀᴅᴅᴇᴍᴏᴊɪ · /ᴄʟᴇᴀʀᴇᴍᴏᴊɪꜱ · /ɢᴄɴᴄ_ꜱᴛᴀʀᴛ <ꜱᴇᴄ> · /ꜱᴛᴏᴘɢᴄɴᴄ · /ᴅᴇʟᴀʏ <ꜱᴇᴄ>

<b>🎨 ᴍᴏᴅᴇꜱ</b>
/ᴍᴀꜱꜱᴇᴍᴏᴊɪ · /ʀᴀɪɴʙᴏᴡ · /ᴘᴜʟꜱᴇ · /ᴍᴀᴛʀɪx

<b>🎯 ᴛᴀʀɢᴇᴛᴇᴅ</b>
/ᴛᴀʀɢᴇᴛꜱʟɪᴅᴇ · /ꜱᴛᴏᴘꜱʟɪᴅᴇ · /ꜱʟɪᴅᴇꜱᴘᴀᴍ · /ꜱᴛᴏᴘꜱʟɪᴅᴇꜱᴘᴀᴍ · /Qᴜɪᴄᴋꜱʟɪᴅᴇ
<i>(ᴀʟʟ ʀᴇQᴜɪʀᴇ ʀᴇᴘʟʏ)</i>

<b>💨 ᴀᴛᴛᴀᴄᴋ</b>
/ꜱᴡɪᴘᴇ <ᴛᴇxᴛ> · /ꜱᴛᴏᴘꜱᴡɪᴘᴇ · /ꜱᴡɪᴘᴅᴇʟᴀʏ <ꜱᴇᴄ>
/ʀᴀɪᴅ <ᴛᴇxᴛ> · /ʀᴀɪᴅᴅᴇʟᴀʏ <ꜱᴇᴄ> · /ʀᴀɪᴅꜱᴛᴏᴘ
/ʀᴀɪᴅᴡɪᴛʜᴛɪᴍᴇʀ · /ʀᴀɪᴅᴛɪᴍᴇᴅᴇʟᴀʏ · /ʀᴀɪᴅᴛɪᴍᴇꜱᴛᴏᴘ

<b>🎮 ꜰᴜɴ</b>
/ʀᴏᴀꜱᴛ · /ᴄᴏᴍᴘʟɪᴍᴇɴᴛ · /ʜʏᴘᴇ · /ʟᴏᴠᴇ
/ᴄᴏɪɴ · /ᴅɪᴄᴇ · /ʀᴀᴛᴇ · /8ʙᴀʟʟ · /ᴍᴇᴍᴇ · /ꜰᴀᴄᴛ · /ᴊᴏᴋᴇ · /Qᴜᴏᴛᴇ
/ʀᴀɴᴅᴏᴍ · /ᴡʏʀ · /ɴɪᴄᴋɢᴇɴ · /ᴇᴍᴏᴊɪᴍɪx · /ᴇᴄʜᴏ · /ꜱʜʀᴜɢ · /ᴛᴀʙʟᴇꜰʟɪᴘ · /ᴜɴꜰʟɪᴘ

<b>✨ ᴇxᴛʀᴀ</b>
/ʀɪᴢᴢ · /ꜱɪᴍᴘ · /ꜱʜɪᴘ · /ꜱʟᴀᴘ · /ʜᴜɢ · /ᴘᴀᴛ · /ᴋɪꜱꜱ
/ɢᴀʏ · /ꜱɪɢᴍᴀ · /ᴄʜᴀᴅ · /ɪQ · /ᴘᴘ · /ᴠɪʙᴇ · /ᴅᴏx

<b>⚡ ᴘᴇʀꜰᴏʀᴍᴀɴᴄᴇ</b>
/ꜰᴀꜱᴛ · /ᴛᴜʀʙᴏ · /ʙᴏᴏꜱᴛ · /ꜱᴘᴇᴇᴅᴛᴇꜱᴛ · /ᴍᴏᴅᴇ

<b>📊 ꜱʏꜱᴛᴇᴍ</b>
/ꜱᴛᴀᴛᴜꜱ · /ꜱʏꜱɪɴꜰᴏ · /ʙᴏᴛᴄᴏᴜɴᴛ · /ᴠᴇʀꜱɪᴏɴ · /ᴅᴇʟᴀʏꜱᴛᴀᴛᴜꜱ · /ᴄʜᴇᴄᴋᴀʟʟ · /ʀᴇꜱᴛᴀʀᴛ

<b>🛑 ᴄᴏɴᴛʀᴏʟ</b>
/ꜱᴛᴏᴘ · /ꜱᴛᴏᴘᴀʟʟ · /ᴘɪɴɢ · /ᴘɪɴɢ2 · /ᴍʏɪᴅ · /ʜᴇʟᴘ · /ʜᴇʟᴘᴀʟʟ

<b>👤 ᴜꜱᴇʀʙᴏᴛ</b>
/ʟᴏɢɪɴ · /ʟᴏɢᴏᴜᴛ · /ᴜʙꜱᴛᴀᴛᴜꜱ

╔══════════════════════════════════════════╗
║  <b>ᴛᴏᴛᴀʟ:</b> 70+ ᴄᴏᴍᴍᴀɴᴅꜱ · <b>${allBots.length}</b> ʙᴏᴛꜱ  ║
╚══════════════════════════════════════════╝`;
    sendMessageAllBots(chatId, commands);
});

// ════════════════════════════════════════════════════════════════
// 🤖 ᴀᴜᴛᴏ-ʀᴇᴘʟʏ ʜᴀɴᴅʟᴇʀ
// ════════════════════════════════════════════════════════════════
mainBot.on('message', async (msg) => {
    if (!msg.text || msg.text.startsWith('/') || msg.text.startsWith('.')) return;

    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const msgId = msg.message_id;

    const st = sharedState.chatState.get(chatId) || {};
    const pairSize = st.pairSize || 1;

    if (sharedState.slideTargets.has(userId)) {
        const text = RAID_TEXTS[Math.floor(Math.random() * RAID_TEXTS.length)];
        smartPairSendMessage(chatId, text, { reply_to_message_id: msgId }, pairSize);
    }

    if (sharedState.slidespamTargets.has(userId)) {
        for (const text of RAID_TEXTS) {
            smartPairSendMessage(chatId, text, { reply_to_message_id: msgId }, pairSize);
        }
    }

    if (sharedState.swipeModeBase[chatId]) {
        const base = sharedState.swipeModeBase[chatId];
        for (const text of RAID_TEXTS) {
            smartPairSendMessage(chatId, `${base} ${text}`, { reply_to_message_id: msgId }, pairSize);
        }
    }
});

// ════════════════════════════════════════════════════════════════
// 👤 USERBOT
// ════════════════════════════════════════════════════════════════
const readlineUB = require('readline');
const fsUB = require('fs');
const pathUB = require('path');

let UB_TelegramClient = null;
let UB_StringSession = null;
let UB_Api = null;
let UB_NewMessage = null;

try {
    const tg = require('telegram');
    UB_TelegramClient = tg.TelegramClient;
    UB_Api = tg.Api;
    UB_StringSession = require('telegram/sessions').StringSession;
    UB_NewMessage = require('telegram/events').NewMessage;
} catch (e) {
    UB_TelegramClient = null;
}

let userbotClient = null;
let USERBOT_OWNER_ID = null;

const UB_SESSION_FILE = pathUB.join(__dirname, '.userbot.session');
const UB_CONFIG_FILE = pathUB.join(__dirname, '.userbot.config.json');
const UB_DATA_FILE = pathUB.join(__dirname, '.userbot.data.json');

const ubState = {
    chatState: new Map(),
    swipeState: new Map(),
    raidState: new Map(),
    raidTimerState: new Map(),
    slideTargets: new Set(),
    slidespamTargets: new Set(),
    swipeModeBase: {}
};

let ubDefaultSwipeDelay = 500;
let ubDefaultRaidDelay = 500;
let ubDefaultRaidTimerDelay = 500;

// ════════════════════════════════════════════════════════════════
// 💾 ᴜꜱᴇʀʙᴏᴛ ᴘᴇʀꜱɪꜱᴛᴇɴᴛ ꜱᴛᴏʀᴀɢᴇ
// ════════════════════════════════════════════════════════════════
const ubData = {
    warnings: {},
    rules: {},
    settings: {
        WARN_LIMIT: 3,
        WARN_ACTION: 'ban',
        TAGALL_MAX: 50,
        TAGALL_DELAY: 1500
    }
};

function ubLoadData() {
    try {
        if (fsUB.existsSync(UB_DATA_FILE)) {
            const d = JSON.parse(fsUB.readFileSync(UB_DATA_FILE, 'utf8'));
            Object.assign(ubData.warnings, d.warnings || {});
            Object.assign(ubData.rules, d.rules || {});
            Object.assign(ubData.settings, d.settings || {});
        }
    } catch (e) {}
}

function ubSaveData() {
    try {
        fsUB.writeFileSync(UB_DATA_FILE, JSON.stringify(ubData, null, 2));
    } catch (e) {}
}

ubLoadData();

// ════════════════════════════════════════════════════════════════
// 🛠️ ᴜꜱᴇʀʙᴏᴛ ʜᴇʟᴘᴇʀꜱ
// ════════════════════════════════════════════════════════════════
function ubErr(e) {
    return (e && (e.errorMessage || e.message)) || String(e);
}

async function ubInvoke(method) {
    try {
        return { ok: true, r: await userbotClient.invoke(method) };
    } catch (e) {
        return { ok: false, e: ubErr(e) };
    }
}

async function ubIsAdmin(chatId) {
    try {
        const me = await userbotClient.getMe();
        const p = await userbotClient.getParticipant(chatId, me.id);
        return p && (p.className === 'ChannelParticipantCreator' || p.className === 'ChannelParticipantAdmin');
    } catch (e) {
        return false;
    }
}

async function ubInputUser(id) {
    try {
        return await userbotClient.getInputEntity(id);
    } catch (e) {
        return null;
    }
}

function ubAsk(rl, q) {
    return new Promise(res => rl.question(q, res));
}

function ubSaveCfg(c) {
    try { fsUB.writeFileSync(UB_CONFIG_FILE, JSON.stringify(c)); } catch (e) {}
}

function ubLoadCfg() {
    try {
        return fsUB.existsSync(UB_CONFIG_FILE)
            ? JSON.parse(fsUB.readFileSync(UB_CONFIG_FILE, 'utf8'))
            : null;
    } catch (e) { return null; }
}

async function ubSend(chatId, text, replyTo) {
    try {
        const opts = { message: text, parseMode: 'html' };
        if (replyTo) opts.replyTo = replyTo;
        await userbotClient.sendMessage(chatId, opts);
    } catch (e) {}
}

function ubRename(chatId, title) {
    userbotClient.invoke(new UB_Api.channels.EditTitle({
        channel: chatId,
        title: String(title).substring(0, 255)
    })).catch(() => {});
}

async function ubGetReplyTarget(message, chatId) {
    try {
        if (!message.replyTo || !message.replyTo.replyToMsgId) return null;
        const [rep] = await userbotClient.getMessages(chatId, {
            ids: [message.replyTo.replyToMsgId]
        });
        if (!rep || !rep.senderId) return null;
        const id = Number(rep.senderId.toString());
        let name = String(id);
        try {
            const s = await rep.getSender();
            if (s) name = s.firstName || s.username || name;
        } catch (e) {}
        return { id, name };
    } catch (e) {
        return null;
    }
}

function ubStartLoop(ms, fn) {
    const s = { stopped: false, timeout: null };
    s.stop = () => {
        s.stopped = true;
        if (s.timeout) clearTimeout(s.timeout);
        s.timeout = null;
    };
    const tick = () => {
        if (s.stopped) return;
        try { fn(); } catch (e) {}
        if (s.stopped) return;
        s.timeout = setTimeout(tick, ms);
    };
    s.timeout = setTimeout(tick, ms);
    return s;
}

function ubStopAll(cid) {
    for (const m of [ubState.chatState, ubState.swipeState, ubState.raidState, ubState.raidTimerState]) {
        const st = m.get(cid);
        if (st && st.loop) st.loop.stop();
    }
}

const ubLoginState = new Map();

// ════════════════════════════════════════════════════════════════
// 📜 ᴄᴏɴꜱᴏʟᴇ ʟᴏɢɪɴ (legacy - kept for backwards compat)
// ════════════════════════════════════════════════════════════════
async function initUserbot() {
    if (!UB_TelegramClient) {
        console.log('\n⚠️  GramJS not installed. Run: npm install telegram  (userbot skipped)\n');
        return;
    }

    const rl = readlineUB.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    console.log('\n╔══════════════════════════════════════════╗');
    console.log('║      👤 USERBOT SETUP (OWNER ONLY)       ║');
    console.log('╚══════════════════════════════════════════╝\n');

    const apiId = parseInt((await ubAsk(rl, '🔑 Enter API ID: ')).trim(), 10);
    const apiHash = (await ubAsk(rl, '🔑 Enter API Hash: ')).trim();
    const phoneNumber = (await ubAsk(rl, '📱 Enter Phone Number: ')).trim();

    let savedSession = '';
    try {
        if (fsUB.existsSync(UB_SESSION_FILE)) {
            savedSession = fsUB.readFileSync(UB_SESSION_FILE, 'utf8').trim();
        }
    } catch (e) {}

    userbotClient = new UB_TelegramClient(
        new UB_StringSession(savedSession),
        apiId,
        apiHash,
        { connectionRetries: 5 }
    );

    try {
        await userbotClient.start({
            phoneNumber: async () => phoneNumber,
            password: async () => (await ubAsk(rl, '🔐 2FA password: ')).trim(),
            phoneCode: async () => (await ubAsk(rl, '📨 Telegram code: ')).trim(),
            onError: (err) => console.log('Login error:', err && err.message ? err.message : err)
        });
    } catch (err) {
        console.log('❌ Userbot login failed:', err && err.message ? err.message : err);
        rl.close();
        return;
    }

    USERBOT_OWNER_ID = parseInt((await ubAsk(rl, '👑 Owner ID: ')).trim(), 10);
    rl.close();

    try {
        fsUB.writeFileSync(UB_SESSION_FILE, userbotClient.session.save());
    } catch (e) {}

    console.log(`\n✅ Userbot online — Owner ID: ${USERBOT_OWNER_ID}\n`);
}
// ════════════════════════════════════════════════════════════════
// 👤 ᴜꜱᴇʀʙᴏᴛ ᴍᴇꜱꜱᴀɢᴇ ᴘʀᴏᴄᴇꜱꜱᴏʀ
// ════════════════════════════════════════════════════════════════
async function ubMessageProcessor(event) {
    try {
        const message = event.message;
        if (!message || !message.text) return;

        const senderId = message.senderId ? Number(message.senderId.toString()) : 0;
        if (senderId !== USERBOT_OWNER_ID) return;

        const chatId = event.chatId
            ? event.chatId.toString()
            : (message.chatId ? message.chatId.toString() : null);
        if (!chatId) return;

        const text = message.text;

        // ════════════════════════════════════════════════════════
        // 🔄 ᴀᴜᴛᴏ-ʀᴇᴘʟʏ (non-dot messages)
        // ════════════════════════════════════════════════════════
        if (!text.startsWith('.')) {
            if (ubState.slideTargets.has(senderId)) {
                ubSend(chatId, getRandomItem(RAID_TEXTS), message.id);
            }
            if (ubState.slidespamTargets.has(senderId)) {
                for (const t of RAID_TEXTS) ubSend(chatId, t, message.id);
            }
            if (ubState.swipeModeBase[chatId]) {
                const b = ubState.swipeModeBase[chatId];
                for (const t of RAID_TEXTS) ubSend(chatId, `${b} ${t}`, message.id);
            }
            return;
        }

        const normalized = '/' + text.slice(1);
        const parts = normalized.split(/\s+/);
        const cmd = parts[0].toLowerCase();
        const rest = normalized.slice(parts[0].length).trim();
        const reply = await ubGetReplyTarget(message, chatId);

        switch (cmd) {
            // ════════════════════════════════════════════════════════
            // 🚀 ʙᴀꜱɪᴄ
            // ════════════════════════════════════════════════════════
            case '/start':
                await ubSend(chatId, '🚀 <b>ᴜʟᴛɪᴍᴀᴛᴇ ᴜꜱᴇʀʙᴏᴛ ᴠ3.0</b>\n📚 ᴜꜱᴇ .info ꜰᴏʀ ᴄᴏᴍᴍᴀɴᴅꜱ', message.id);
                break;

            case '/help':
            case '/helpall':
                await ubSend(chatId, '📚 ᴜꜱᴇ <code>.info</code> ꜰᴏʀ ꜰᴜʟʟ ʟɪꜱᴛ', message.id);
                break;

            case '/ping':
                await ubSend(chatId, '🏓 <b>ᴘᴏɴɢ</b> <i>(ᴜꜱᴇʀʙᴏᴛ)</i>', message.id);
                break;

            case '/ping2':
                await ubSend(chatId, `🏓 <b>ᴘᴏɴɢ</b>\n🤖 <b>${allBots.length}</b> ʙᴏᴛꜱ`, message.id);
                break;

            case '/myid':
                await ubSend(chatId, `🆔 <code>${senderId}</code>\n👑 <b>ᴏᴡɴᴇʀ</b>`, message.id);
                break;

            case '/version':
                await ubSend(chatId, '🚀 <b>ᴜʟᴛɪᴍᴀᴛᴇ ᴜꜱᴇʀʙᴏᴛ ᴠ3.0</b>', message.id);
                break;

            case '/sysinfo':
                await ubSend(chatId,
                    `🤖 ʙᴏᴛꜱ: <b>${allBots.length}</b>\n` +
                    `👑 ᴏᴡɴᴇʀ: <code>${USERBOT_OWNER_ID}</code>\n` +
                    `🎯 ᴛᴀʀɢᴇᴛꜱ: <b>${ubState.slideTargets.size}</b>`,
                    message.id
                );
                break;

            case '/mode': {
                const st = ubState.chatState.get(chatId);
                await ubSend(chatId,
                    st && st.type
                        ? `✨ <b>ᴍᴏᴅᴇ:</b> <i>${st.type}</i>`
                        : '❌ <i>ɴᴏ ᴀᴄᴛɪᴠᴇ ᴍᴏᴅᴇ</i>',
                    message.id
                );
                break;
            }

            case '/status':
                await ubSend(chatId,
                    `📊 <b>ᴜꜱᴇʀʙᴏᴛ ꜱᴛᴀᴛᴜꜱ</b>\n` +
                    `🎯 ꜱʟɪᴅᴇꜱ: <b>${ubState.slideTargets.size}</b>\n` +
                    `💥 ꜱᴘᴀᴍꜱ: <b>${ubState.slidespamTargets.size}</b>`,
                    message.id
                );
                break;

            case '/cleartargets':
                ubState.slideTargets.clear();
                ubState.slidespamTargets.clear();
                await ubSend(chatId, '🎯 <b>ᴄʟᴇᴀʀᴇᴅ</b>', message.id);
                break;

            case '/fast':
                ubDefaultSwipeDelay = ubDefaultRaidDelay = ubDefaultRaidTimerDelay = 300;
                await ubSend(chatId, '⚡ <b>ꜰᴀꜱᴛ ᴍᴏᴅᴇ</b> <i>(300ᴍꜱ)</i>', message.id);
                break;

            case '/turbo':
                ubDefaultSwipeDelay = ubDefaultRaidDelay = ubDefaultRaidTimerDelay = 200;
                await ubSend(chatId, '🚀 <b>ᴛᴜʀʙᴏ ᴍᴏᴅᴇ</b> <i>(200ᴍꜱ)</i>', message.id);
                break;

            case '/delaystatus':
                await ubSend(chatId,
                    `⏱️ ꜱᴡɪᴘᴇ <b>${ubDefaultSwipeDelay}ᴍꜱ</b>\n` +
                    `💨 ʀᴀɪᴅ <b>${ubDefaultRaidDelay}ᴍꜱ</b>\n` +
                    `⏰ ᴛɪᴍᴇʀ <b>${ubDefaultRaidTimerDelay}ᴍꜱ</b>`,
                    message.id
                );
                break;

            case '/botcount':
                await ubSend(chatId, `🤖 <b>${allBots.length}</b> ʙᴏᴛꜱ`, message.id);
                break;

            // ════════════════════════════════════════════════════════
            // 🛡️ ᴀᴅᴍɪɴ
            // ════════════════════════════════════════════════════════
            case '/admin': {
                if (!reply) {
                    await ubSend(chatId, '❌ <b>ᴜꜱᴀɢᴇ:</b> <i>ʀᴇᴘʟʏ ᴛᴏ ᴀ ᴜꜱᴇʀ</i>', message.id);
                    break;
                }
                const input = await ubInputUser(reply.id);
                if (!input) {
                    await ubSend(chatId, '❌ <b>ᴜꜱᴇʀ ɴᴏᴛ ꜰᴏᴜɴᴅ</b>', message.id);
                    break;
                }
                const r = await ubInvoke(new UB_Api.channels.EditAdmin({
                    channel: chatId,
                    userId: input,
                    adminRights: new UB_Api.ChatAdminRights({
                        changeInfo: true,
                        deleteMessages: true,
                        banUsers: true,
                        inviteUsers: true,
                        pinMessages: true,
                        manageCall: true,
                        other: true
                    }),
                    rank: ''
                }));
                await ubSend(chatId,
                    r.ok
                        ? `✅ <b>ᴘʀᴏᴍᴏᴛᴇᴅ</b> <i>${reply.name}</i>`
                        : `❌ <i>${r.e}</i>`,
                    message.id
                );
                break;
            }

            case '/demote': {
                if (!reply) {
                    await ubSend(chatId, '❌ <b>ʀᴇᴘʟʏ ᴛᴏ ᴀɴ ᴀᴅᴍɪɴ</b>', message.id);
                    break;
                }
                const input = await ubInputUser(reply.id);
                if (!input) {
                    await ubSend(chatId, '❌ <b>ɴᴏᴛ ꜰᴏᴜɴᴅ</b>', message.id);
                    break;
                }
                const r = await ubInvoke(new UB_Api.channels.EditAdmin({
                    channel: chatId,
                    userId: input,
                    adminRights: new UB_Api.ChatAdminRights({}),
                    rank: ''
                }));
                await ubSend(chatId,
                    r.ok
                        ? `✅ <b>ᴅᴇᴍᴏᴛᴇᴅ</b> <i>${reply.name}</i>`
                        : `❌ <i>${r.e}</i>`,
                    message.id
                );
                break;
            }

            case '/kick': {
                if (!reply) {
                    await ubSend(chatId, '❌ <b>ʀᴇᴘʟʏ ᴛᴏ ᴀ ᴜꜱᴇʀ</b>', message.id);
                    break;
                }
                const input = await ubInputUser(reply.id);
                if (!input) {
                    await ubSend(chatId, '❌ <b>ɴᴏᴛ ꜰᴏᴜɴᴅ</b>', message.id);
                    break;
                }
                const r = await ubInvoke(new UB_Api.channels.EditBanned({
                    channel: chatId,
                    participant: input,
                    bannedRights: new UB_Api.ChatBannedRights({
                        untilDate: 0,
                        viewMessages: true,
                        sendMessages: true,
                        sendMedia: true,
                        sendStickers: true,
                        sendGifs: true,
                        sendGames: true,
                        sendInline: true,
                        embedLinks: true
                    })
                }));
                if (r.ok) {
                    await ubInvoke(new UB_Api.channels.EditBanned({
                        channel: chatId,
                        participant: input,
                        bannedRights: new UB_Api.ChatBannedRights({ untilDate: 0 })
                    }));
                }
                await ubSend(chatId,
                    r.ok
                        ? `👢 <b>ᴋɪᴄᴋᴇᴅ</b> <i>${reply.name}</i>`
                        : `❌ <i>${r.e}</i>`,
                    message.id
                );
                break;
            }

            case '/ban': {
                if (!reply) {
                    await ubSend(chatId, '❌ <b>ʀᴇᴘʟʏ ᴛᴏ ᴀ ᴜꜱᴇʀ</b>', message.id);
                    break;
                }
                const input = await ubInputUser(reply.id);
                if (!input) {
                    await ubSend(chatId, '❌ <b>ɴᴏᴛ ꜰᴏᴜɴᴅ</b>', message.id);
                    break;
                }
                const r = await ubInvoke(new UB_Api.channels.EditBanned({
                    channel: chatId,
                    participant: input,
                    bannedRights: new UB_Api.ChatBannedRights({
                        untilDate: 0,
                        viewMessages: true,
                        sendMessages: true,
                        sendMedia: true,
                        sendStickers: true,
                        sendGifs: true,
                        sendGames: true,
                        sendInline: true,
                        embedLinks: true
                    })
                }));
                await ubSend(chatId,
                    r.ok
                        ? `🔨 <b>ʙᴀɴɴᴇᴅ</b> <i>${reply.name}</i>`
                        : `❌ <i>${r.e}</i>`,
                    message.id
                );
                break;
            }

            case '/unban': {
                if (!reply) {
                    await ubSend(chatId, '❌ <b>ʀᴇᴘʟʏ ᴛᴏ ᴀ ᴜꜱᴇʀ</b>', message.id);
                    break;
                }
                const input = await ubInputUser(reply.id);
                if (!input) {
                    await ubSend(chatId, '❌ <b>ɴᴏᴛ ꜰᴏᴜɴᴅ</b>', message.id);
                    break;
                }
                const r = await ubInvoke(new UB_Api.channels.EditBanned({
                    channel: chatId,
                    participant: input,
                    bannedRights: new UB_Api.ChatBannedRights({ untilDate: 0 })
                }));
                await ubSend(chatId,
                    r.ok
                        ? `✅ <b>ᴜɴʙᴀɴɴᴇᴅ</b> <i>${reply.name}</i>`
                        : `❌ <i>${r.e}</i>`,
                    message.id
                );
                break;
            }

            // ════════════════════════════════════════════════════════
            // ⚠️ ᴍᴏᴅᴇʀᴀᴛɪᴏɴ
            // ════════════════════════════════════════════════════════
            case '/warn': {
                if (!reply) {
                    await ubSend(chatId, '❌ <b>ʀᴇᴘʟʏ ᴛᴏ ᴀ ᴜꜱᴇʀ</b>', message.id);
                    break;
                }
                if (!ubData.warnings[chatId]) ubData.warnings[chatId] = {};
                const uid = String(reply.id);
                ubData.warnings[chatId][uid] = (ubData.warnings[chatId][uid] || 0) + 1;
                ubSaveData();

                const count = ubData.warnings[chatId][uid];
                await ubSend(chatId,
                    `⚠️ <b>ᴡᴀʀɴɪɴɢ</b> <i>${count}/${ubData.settings.WARN_LIMIT}</i> — <b>${reply.name}</b>`,
                    message.id
                );

                if (count >= ubData.settings.WARN_LIMIT) {
                    ubData.warnings[chatId][uid] = 0;
                    ubSaveData();

                    const input = await ubInputUser(reply.id);
                    if (input) {
                        if (ubData.settings.WARN_ACTION === 'ban') {
                            await ubInvoke(new UB_Api.channels.EditBanned({
                                channel: chatId,
                                participant: input,
                                bannedRights: new UB_Api.ChatBannedRights({
                                    untilDate: 0,
                                    viewMessages: true,
                                    sendMessages: true
                                })
                            }));
                            await ubSend(chatId, `🔨 <b>ᴀᴜᴛᴏ-ʙᴀɴɴᴇᴅ</b> <i>${reply.name}</i>`, message.id);
                        } else if (ubData.settings.WARN_ACTION === 'kick') {
                            await ubInvoke(new UB_Api.channels.EditBanned({
                                channel: chatId,
                                participant: input,
                                bannedRights: new UB_Api.ChatBannedRights({
                                    untilDate: 0,
                                    viewMessages: true,
                                    sendMessages: true
                                })
                            }));
                            await ubInvoke(new UB_Api.channels.EditBanned({
                                channel: chatId,
                                participant: input,
                                bannedRights: new UB_Api.ChatBannedRights({ untilDate: 0 })
                            }));
                            await ubSend(chatId, `👢 <b>ᴀᴜᴛᴏ-ᴋɪᴄᴋᴇᴅ</b> <i>${reply.name}</i>`, message.id);
                        }
                    }
                }
                break;
            }

            case '/unwarn': {
                if (!reply) {
                    await ubSend(chatId, '❌ <b>ʀᴇᴘʟʏ ᴛᴏ ᴀ ᴜꜱᴇʀ</b>', message.id);
                    break;
                }
                const uid = String(reply.id);
                if (!ubData.warnings[chatId] || !ubData.warnings[chatId][uid]) {
                    await ubSend(chatId, 'ℹ️ <i>ɴᴏ ᴡᴀʀɴɪɴɢꜱ</i>', message.id);
                    break;
                }
                ubData.warnings[chatId][uid] = Math.max(0, ubData.warnings[chatId][uid] - 1);
                ubSaveData();
                await ubSend(chatId,
                    `✅ <b>ᴡᴀʀɴɪɴɢ ʀᴇᴍᴏᴠᴇᴅ</b> — <i>${ubData.warnings[chatId][uid]}/${ubData.settings.WARN_LIMIT}</i>`,
                    message.id
                );
                break;
            }

            case '/warnings': {
                if (!reply) {
                    await ubSend(chatId, '❌ <b>ʀᴇᴘʟʏ ᴛᴏ ᴀ ᴜꜱᴇʀ</b>', message.id);
                    break;
                }
                const count = ubData.warnings[chatId]?.[String(reply.id)] || 0;
                await ubSend(chatId,
                    `📊 <b>${reply.name}</b>: <b>${count}</b>/${ubData.settings.WARN_LIMIT}`,
                    message.id
                );
                break;
            }

            case '/del': {
                if (!message.replyTo || !message.replyTo.replyToMsgId) {
                    await ubSend(chatId, '❌ <b>ʀᴇᴘʟʏ ᴛᴏ ᴀ ᴍꜱɢ</b>', message.id);
                    break;
                }
                await ubInvoke(new UB_Api.channels.DeleteMessages({
                    channel: chatId,
                    id: [message.replyTo.replyToMsgId]
                }));
                try {
                    await userbotClient.deleteMessages(chatId, [message.id], { revoke: true });
                } catch (e) {}
                break;
            }

            case '/purge': {
                if (!message.replyTo || !message.replyTo.replyToMsgId) {
                    await ubSend(chatId, '❌ <b>ʀᴇᴘʟʏ ᴛᴏ ᴛʜᴇ ꜰɪʀꜱᴛ ᴍꜱɢ</b>', message.id);
                    break;
                }
                const from = message.replyTo.replyToMsgId;
                const to = message.id;
                const ids = [];
                for (let i = from; i <= to; i++) ids.push(i);

                let deleted = 0;
                for (let i = 0; i < ids.length; i += 100) {
                    const batch = ids.slice(i, i + 100);
                    const r = await ubInvoke(new UB_Api.channels.DeleteMessages({
                        channel: chatId,
                        id: batch
                    }));
                    if (r.ok) deleted += batch.length;
                    await new Promise(res => setTimeout(res, 200));
                }
                await ubSend(chatId, `🗑️ <b>ᴘᴜʀɢᴇᴅ</b> <i>${deleted} ᴍꜱɢꜱ</i>`, message.id);
                break;
            }

            case '/pin': {
                if (!message.replyTo || !message.replyTo.replyToMsgId) {
                    await ubSend(chatId, '❌ <b>ʀᴇᴘʟʏ ᴛᴏ ᴀ ᴍꜱɢ</b>', message.id);
                    break;
                }
                const r = await ubInvoke(new UB_Api.messages.UpdatePinnedMessage({
                    peer: chatId,
                    id: message.replyTo.replyToMsgId,
                    silent: true
                }));
                await ubSend(chatId,
                    r.ok ? '📌 <b>ᴘɪɴɴᴇᴅ</b>' : `❌ <i>${r.e}</i>`,
                    message.id
                );
                break;
            }

            case '/unpin': {
                if (!message.replyTo || !message.replyTo.replyToMsgId) {
                    await ubSend(chatId, '❌ <b>ʀᴇᴘʟʏ ᴛᴏ ᴀ ᴘɪɴɴᴇᴅ ᴍꜱɢ</b>', message.id);
                    break;
                }
                const r = await ubInvoke(new UB_Api.messages.UpdatePinnedMessage({
                    peer: chatId,
                    id: message.replyTo.replyToMsgId,
                    unpin: true
                }));
                await ubSend(chatId,
                    r.ok ? '📍 <b>ᴜɴᴘɪɴɴᴇᴅ</b>' : `❌ <i>${r.e}</i>`,
                    message.id
                );
                break;
            }

            // ════════════════════════════════════════════════════════
            // 🏘️ ɢʀᴏᴜᴘ
            // ════════════════════════════════════════════════════════
            case '/lock': {
                const r = await ubInvoke(new UB_Api.messages.EditChatDefaultBannedRights({
                    peer: chatId,
                    bannedRights: new UB_Api.ChatBannedRights({
                        untilDate: 0,
                        sendMessages: true,
                        sendMedia: true,
                        sendStickers: true,
                        sendGifs: true,
                        sendGames: true,
                        sendInline: true,
                        embedLinks: true
                    })
                }));
                await ubSend(chatId,
                    r.ok ? '🔒 <b>ɢʀᴏᴜᴘ ʟᴏᴄᴋᴇᴅ</b>' : `❌ <i>${r.e}</i>`,
                    message.id
                );
                break;
            }

            case '/unlock': {
                const r = await ubInvoke(new UB_Api.messages.EditChatDefaultBannedRights({
                    peer: chatId,
                    bannedRights: new UB_Api.ChatBannedRights({ untilDate: 0 })
                }));
                await ubSend(chatId,
                    r.ok ? '🔓 <b>ɢʀᴏᴜᴘ ᴜɴʟᴏᴄᴋᴇᴅ</b>' : `❌ <i>${r.e}</i>`,
                    message.id
                );
                break;
            }

            case '/slowmode': {
                const sec = parseInt(rest, 10);
                if (isNaN(sec) || sec < 0 || sec > 86400) {
                    await ubSend(chatId,
                        '❌ <b>ᴜꜱᴀɢᴇ:</b> <code>.slowmode 10</code> <i>(0-86400)</i>',
                        message.id
                    );
                    break;
                }
                const r = await ubInvoke(new UB_Api.channels.ToggleSlowMode({
                    channel: chatId,
                    seconds: sec
                }));
                await ubSend(chatId,
                    r.ok
                        ? `🐢 <b>ꜱʟᴏᴡᴍᴏᴅᴇ:</b> <i>${sec}ꜱ</i>`
                        : `❌ <i>${r.e}</i>`,
                    message.id
                );
                break;
            }

            case '/title': {
                if (!rest) {
                    await ubSend(chatId,
                        '❌ <b>ᴜꜱᴀɢᴇ:</b> <code>.title New Name</code>',
                        message.id
                    );
                    break;
                }
                const r = await ubInvoke(new UB_Api.channels.EditTitle({
                    channel: chatId,
                    title: rest.substring(0, 128)
                }));
                await ubSend(chatId,
                    r.ok
                        ? `✅ <b>ᴛɪᴛʟᴇ:</b> <i>${esc(rest)}</i>`
                        : `❌ <i>${r.e}</i>`,
                    message.id
                );
                break;
            }

            case '/desc': {
                if (!rest) {
                    await ubSend(chatId,
                        '❌ <b>ᴜꜱᴀɢᴇ:</b> <code>.desc New description</code>',
                        message.id
                    );
                    break;
                }
                const r = await ubInvoke(new UB_Api.messages.EditChatAbout({
                    peer: chatId,
                    about: rest.substring(0, 255)
                }));
                await ubSend(chatId,
                    r.ok
                        ? '✅ <b>ᴅᴇꜱᴄʀɪᴘᴛɪᴏɴ ᴜᴘᴅᴀᴛᴇᴅ</b>'
                        : `❌ <i>${r.e}</i>`,
                    message.id
                );
                break;
            }

            case '/link': {
                const r = await ubInvoke(new UB_Api.messages.ExportChatInvite({
                    peer: chatId
                }));
                await ubSend(chatId,
                    r.ok
                        ? `🔗 <code>${r.r.link}</code>`
                        : `❌ <i>${r.e}</i>`,
                    message.id
                );
                break;
            }

            case '/rules': {
                if (rest) {
                    ubData.rules[chatId] = rest;
                    ubSaveData();
                    await ubSend(chatId, '✅ <b>ʀᴜʟᴇꜱ ꜱᴀᴠᴇᴅ</b>', message.id);
                    break;
                }
                const rules = ubData.rules[chatId] || '<i>ɴᴏ ʀᴜʟᴇꜱ ꜱᴇᴛ</i>';
                await ubSend(chatId, `📜 <b>ɢʀᴏᴜᴘ ʀᴜʟᴇꜱ</b>\n\n${rules}`, message.id);
                break;
            }

            case '/tagall': {
                try {
                    const participants = await userbotClient.getParticipants(chatId, {
                        limit: ubData.settings.TAGALL_MAX
                    });
                    if (!participants.length) {
                        await ubSend(chatId, '❌ <i>ɴᴏ ᴍᴇᴍʙᴇʀꜱ</i>', message.id);
                        break;
                    }

                    const header = rest || '📢 <b>ᴀᴛᴛᴇɴᴛɪᴏɴ ᴇᴠᴇʀʏᴏɴᴇ</b>';
                    const mentions = participants
                        .filter(p => !p.bot)
                        .map(p => `<a href="tg://user?id=${p.id}">${esc(p.firstName || 'User')}</a>`);

                    const chunks = [];
                    let cur = '';
                    for (const m of mentions) {
                        if ((cur + ' ' + m).length > 3500) {
                            chunks.push(cur);
                            cur = m;
                        } else {
                            cur = cur ? cur + ' ' + m : m;
                        }
                    }
                    if (cur) chunks.push(cur);

                    await ubSend(chatId, header, message.id);
                    for (const chunk of chunks) {
                        await ubSend(chatId, chunk);
                        await new Promise(res => setTimeout(res, ubData.settings.TAGALL_DELAY));
                    }
                } catch (e) {
                    await ubSend(chatId, `❌ <i>${ubErr(e)}</i>`, message.id);
                }
                break;
            }

            case '/leave': {
                if (rest !== 'confirm') {
                    await ubSend(chatId,
                        '⚠️ <b>ᴄᴏɴꜰɪʀᴍ ʟᴇᴀᴠᴇ</b>\nᴜꜱᴇ <code>.leave confirm</code>',
                        message.id
                    );
                    break;
                }
                await ubSend(chatId, '👋 <b>ʟᴇᴀᴠɪɴɢ...</b>', message.id);
                await new Promise(res => setTimeout(res, 800));
                await ubInvoke(new UB_Api.channels.LeaveChannel({ channel: chatId }));
                break;
            }

            case '/chatinfo': {
                try {
                    const entity = await userbotClient.getEntity(chatId);
                    const full = await ubInvoke(new UB_Api.channels.GetFullChannel({
                        channel: chatId
                    }));
                    const count = full.ok && full.r.fullChat
                        ? (full.r.fullChat.participantsCount || 0)
                        : '—';

                    let s = `📋 <b>ᴄʜᴀᴛ ɪɴꜰᴏ</b>\n\n`;
                    s += `🆔 <code>${chatId}</code>\n`;
                    s += `📛 <b>${esc(entity.title || 'Unnamed')}</b>\n`;
                    s += `🔗 ${entity.username ? '@' + entity.username : '<i>no username</i>'}\n`;
                    s += `👥 ᴍᴇᴍʙᴇʀꜱ: <b>${count}</b>\n`;
                    s += `📁 ᴛʏᴘᴇ: <i>${entity.className || 'chat'}</i>`;

                    await ubSend(chatId, s, message.id);
                } catch (e) {
                    await ubSend(chatId, `❌ <i>${ubErr(e)}</i>`, message.id);
                }
                break;
            }

            // ════════════════════════════════════════════════════════
            // 🔧 ᴜᴛɪʟɪᴛʏ
            // ════════════════════════════════════════════════════════
            case '/id': {
                let s = `🆔 <b>ʏᴏᴜʀ ɪᴅ:</b> <code>${senderId}</code>\n`;
                s += `💬 <b>ᴄʜᴀᴛ ɪᴅ:</b> <code>${chatId}</code>\n`;
                s += `📨 <b>ᴍꜱɢ ɪᴅ:</b> <code>${message.id}</code>`;
                if (reply) s += `\n👤 <b>ʀᴇᴘʟʏ ɪᴅ:</b> <code>${reply.id}</code>`;
                await ubSend(chatId, s, message.id);
                break;
            }

            case '/info': {
                if (reply) {
                    try {
                        const u = await userbotClient.getEntity(reply.id);
                        let s = `👤 <b>ᴜꜱᴇʀ ɪɴꜰᴏ</b>\n\n`;
                        s += `🆔 <code>${u.id}</code>\n`;
                        s += `📛 <b>${esc(u.firstName || '')} ${esc(u.lastName || '')}</b>\n`;
                        s += `🔗 ${u.username ? '@' + u.username : '<i>no username</i>'}\n`;
                        s += `${u.bot ? '🤖 <b>Bot</b>' : '👤 <b>User</b>'}`;
                        await ubSend(chatId, s, message.id);
                    } catch (e) {
                        await ubSend(chatId, `❌ <i>${ubErr(e)}</i>`, message.id);
                    }
                } else {
                    await ubSend(chatId,
                        `🚀 <b>ᴜʟᴛɪᴍᴀᴛᴇ ᴜꜱᴇʀʙᴏᴛ ᴠ3.0</b>\n` +
                        `📍 ᴘʀᴇꜰɪx: <code>.</code>\n\n` +
                        `<b>🛡️ ᴀᴅᴍɪɴ:</b>\n.admin .demote .kick .ban .unban\n\n` +
                        `<b>⚠️ ᴍᴏᴅᴇʀᴀᴛɪᴏɴ:</b>\n.warn .unwarn .warnings .del .purge .pin .unpin\n\n` +
                        `<b>🏘️ ɢʀᴏᴜᴘ:</b>\n.lock .unlock .slowmode .title .desc .link .rules .tagall .chatinfo .leave\n\n` +
                        `<b>🔧 ᴜᴛɪʟɪᴛʏ:</b>\n.id .info\n\n` +
                        `<b>🎮 ꜰᴜɴ:</b>\n.roast .compliment .hype .love .coin .dice .rate .8ball .meme .fact .joke .quote .shrug .tableflip .unflip .echo .nickgen .emojimix .random .wyr\n\n` +
                        `<b>✨ ᴇxᴛʀᴀ:</b>\n.rizz .simp .ship .slap .hug .pat .kiss .gay .sigma .chad .iq .pp .vibe .dox\n\n` +
                        `<b>🎯 ᴛᴀʀɢᴇᴛ:</b>\n.targetslide .stopslide .slidespam .stopslidespam .quickslide\n\n` +
                        `<b>💨 ᴀᴛᴛᴀᴄᴋ:</b>\n.raid .raidstop .raiddelay .swipe .stopswipe .swipdelay .raidwithtimer .raidtimedelay .raidtimestop\n\n` +
                        `<b>⚡ ʀᴇɴᴀᴍᴇ:</b>\n.gcnc .ncemo .stopgcnc\n\n` +
                        `<b>🛑 ᴄᴛʀʟ:</b>\n.stop .stopall .fast .turbo .status .sysinfo .botcount .version .mode .delay .delaystatus .boost .cleartargets .ping .ping2 .myid .help .start`,
                        message.id
                    );
                }
                break;
            }

            // ════════════════════════════════════════════════════════
            // 🎮 ꜰᴜɴ
            // ════════════════════════════════════════════════════════
            case '/roast':
                await ubSend(chatId, `🔥 <b>${reply ? reply.name : 'ʏᴏᴜ'}</b>, <i>${getRandomItem(ROASTS)}</i>`, message.id);
                break;

            case '/compliment':
                await ubSend(chatId, `<i>${getRandomItem(COMPLIMENTS)}</i> <b>${reply ? reply.name : 'ʏᴏᴜ'}</b>!`, message.id);
                break;

            case '/hype':
                await ubSend(chatId, `<b>${getRandomItem(HYPE_TEXTS)}</b>`, message.id);
                break;

            case '/love':
                await ubSend(chatId, `💕 <b>${reply ? reply.name : 'ʏᴏᴜ'}</b>, <i>${getRandomItem(LOVE_TEXTS)}</i>`, message.id);
                break;

            case '/coin':
                await ubSend(chatId, Math.random() < 0.5 ? '🪙 <b>ʜᴇᴀᴅꜱ!</b>' : '🪙 <b>ᴛᴀɪʟꜱ!</b>', message.id);
                break;

            case '/dice': {
                const n = Math.floor(Math.random() * 6) + 1;
                const d = ['⚀','⚁','⚂','⚃','⚄','⚅'];
                await ubSend(chatId, `🎲 <b>${d[n-1]} ${n}</b>`, message.id);
                break;
            }

            case '/rate': {
                const r = Math.floor(Math.random() * 11);
                const e = r > 7 ? '🔥' : r > 4 ? '👍' : '💀';
                await ubSend(chatId, `${e} "<i>${rest}</i>" <b>${r}/10</b>`, message.id);
                break;
            }

            case '/8ball': {
                const a = [
                    '🎱 ʏᴇꜱ', '🎱 ɴᴏ', '🎱 ᴍᴀʏʙᴇ', '🎱 ᴅᴇꜰɪɴɪᴛᴇʟʏ',
                    '🎱 ʟɪᴋᴇʟʏ', '🎱 ᴜɴʟɪᴋᴇʟʏ', '🎱 ᴀꜱᴋ ᴀɢᴀɪɴ',
                    '🎱 ᴄᴀɴ\'ᴛ ꜱᴀʏ ɴᴏᴡ', '🎱 ᴏᴜᴛʟᴏᴏᴋ ɢᴏᴏᴅ', '🎱 ᴅᴏɴ\'ᴛ ᴄᴏᴜɴᴛ ᴏɴ ɪᴛ'
                ];
                await ubSend(chatId, `❓ <i>${rest}</i>\n<b>${getRandomItem(a)}</b>`, message.id);
                break;
            }

            case '/meme':
                await ubSend(chatId, getRandomItem([
                    '😂 ʏ\'ᴀʟʟ ɢᴏᴛ ᴀɴʏ ᴍᴇᴍᴇꜱ?',
                    '🔥 ᴛʜɪꜱ ɪꜱ ꜰɪɴᴇ 🔥',
                    '💀 ɪ\'ᴍ ᴅᴇᴀᴅ 💀',
                    '🤡 ᴡᴇʟᴄᴏᴍᴇ ᴛᴏ ᴛʜᴇ ᴄɪʀᴄᴜꜱ 🤡',
                    '🚀 ᴛᴏ ᴛʜᴇ ᴍᴏᴏɴ! 🚀'
                ]), message.id);
                break;

            case '/fact':
                await ubSend(chatId, getRandomItem([
                    '🧠 ʙʀᴀɪɴ ʀᴇᴀᴅꜱ 700 ᴡᴏʀᴅꜱ/ᴍɪɴ.',
                    '🌍 ʙᴀɴᴀɴᴀꜱ ᴀʀᴇ ʙᴇʀʀɪᴇꜱ.',
                    '🐙 ᴏᴄᴛᴏᴘᴜꜱ ʜᴀꜱ 3 ʜᴇᴀʀᴛꜱ.',
                    '🦈 ꜱʜᴀʀᴋꜱ ʜᴀᴠᴇ ɴᴏ ʙᴏɴᴇꜱ.',
                    '🐝 ʜᴏɴᴇʏ ɴᴇᴠᴇʀ ꜱᴘᴏɪʟꜱ.'
                ]), message.id);
                break;

            case '/joke':
                await ubSend(chatId, getRandomItem([
                    '😄 ʙᴇᴄᴀᴜꜱᴇ ᴛʜᴇʏ ᴍᴀᴋᴇ ᴜᴘ ᴇᴠᴇʀʏᴛʜɪɴɢ!',
                    '😂 ᴛʜᴇʏ ᴅᴏɴ\'ᴛ ʜᴀᴠᴇ ɢᴜᴛꜱ!',
                    '😆 ᴀ ꜰꜱʜ!'
                ]), message.id);
                break;

            case '/quote':
                await ubSend(chatId, `<i>${getRandomItem([
                    '💪 \'ʟᴏᴠᴇ ᴡʜᴀᴛ ʏᴏᴜ ᴅᴏ.\'',
                    '🌟 \'ᴛʜᴇ ᴄᴏᴜʀᴀɢᴇ ᴛᴏ ᴄᴏɴᴛɪɴᴜᴇ.\'',
                    '🔥 \'ʙᴇʟɪᴇᴠᴇ ʏᴏᴜ ᴄᴀɴ.\''
                ])}</i>`, message.id);
                break;

            case '/shrug':
                await ubSend(chatId, '¯\\_(ツ)_/¯', message.id);
                break;

            case '/tableflip':
                await ubSend(chatId, '(╯°□°）╯︵ ┻━┻', message.id);
                break;

            case '/unflip':
                await ubSend(chatId, '┬─┬ノ( º _ ºノ)', message.id);
                break;

            case '/echo':
                await ubSend(chatId, rest, message.id);
                break;

            case '/random': {
                const a = parseInt(parts[1]);
                const b = parseInt(parts[2]);
                if (!isNaN(a) && !isNaN(b) && a < b) {
                    await ubSend(chatId, `🎲 <b>${Math.floor(Math.random() * (b - a + 1)) + a}</b>`, message.id);
                }
                break;
            }

            case '/nickgen': {
                const p = ['ᴄʏʙᴇʀ','ᴅᴀʀᴋ','ɴɪɢʜᴛ','ꜱʜᴀᴅᴏᴡ','ᴢᴇʀᴏ','ᴏᴍɴɪ','ᴜʟᴛʀᴀ','ᴍᴇɢᴀ','ᴛᴜʀʙᴏ'];
                const s = ['x','ᴋɪʟʟᴇʀ','ʙᴏᴛ','ʜᴀᴄᴋ','ɢᴏᴅ','ʟᴏʀᴅ','ᴋɪɴɢ','ᴍᴀꜱᴛᴇʀ','ʟᴇɢᴇɴᴅ'];
                await ubSend(chatId, `🎮 <b>${getRandomItem(p)}${getRandomItem(s)}${Math.floor(Math.random()*100)}</b>`, message.id);
                break;
            }

            case '/emojimix': {
                const n = Math.min(parseInt(parts[1]) || 5, 20);
                let s = '';
                for (let i = 0; i < n; i++) s += getRandomItem(NCEMO_EMOJIS);
                await ubSend(chatId, `🎨 ${s}`, message.id);
                break;
            }

            case '/wyr':
                await ubSend(chatId, getRandomItem([
                    '🤔 ꜰʟʏ ᴏʀ ɪɴᴠɪꜱɪʙʟᴇ?',
                    '🤔 ᴄᴀꜱᴛʟᴇ ᴏʀ ꜱᴘᴀᴄᴇ ꜱᴛᴀᴛɪᴏɴ?',
                    '🤔 ᴘɪʀᴀᴛᴇ ᴏʀ ɴɪɴᴊᴀ?'
                ]), message.id);
                break;

            case '/rizz':
                await ubSend(chatId, `🎯 <b>${reply ? reply.name : 'ʏᴏᴜ'}</b>: <b>${Math.floor(Math.random()*101)}%</b>\n<i>${getRandomItem(RIZZ_LINES)}</i>`, message.id);
                break;

            case '/simp':
                await ubSend(chatId, `💀 <b>${reply ? reply.name : 'ʏᴏᴜ'}</b>: <i>${getRandomItem(SIMP_LINES)}</i>`, message.id);
                break;

            case '/gay':
                await ubSend(chatId, `<b>${getRandomItem(GAY_LINES)}</b> — <i>${reply ? reply.name : 'ʏᴏᴜ'}</i>`, message.id);
                break;

            case '/sigma':
                await ubSend(chatId, `🗿 <b>${reply ? reply.name : 'ʏᴏᴜ'}</b>: <i>${getRandomItem(SIGMA_LINES)}</i>`, message.id);
                break;

            case '/chad':
                await ubSend(chatId, `🗿 <b>${reply ? reply.name : 'ʏᴏᴜ'}</b>: <i>${getRandomItem(CHAD_LINES)}</i>`, message.id);
                break;

            case '/iq':
                await ubSend(chatId, `🧠 <b>${reply ? reply.name : 'ʏᴏᴜ'}</b>: <b>${Math.floor(Math.random()*180)+20}</b>`, message.id);
                break;

            case '/pp': {
                const s = Math.floor(Math.random() * 15);
                await ubSend(chatId, `🍆 <b>${reply ? reply.name : 'ʏᴏᴜ'}</b>: <b>${s}ᴄᴍ</b>\n<code>${'8'.repeat(s)}${s ? 'D' : '😭'}</code>`, message.id);
                break;
            }

            case '/vibe':
                await ubSend(chatId, `<i>${getRandomItem(VIBE_LINES)}</i>`, message.id);
                break;

            case '/ship': {
                if (!reply) {
                    await ubSend(chatId, '❌ ʀᴇᴘʟʏ ꜰɪʀꜱᴛ', message.id);
                    break;
                }
                const pct = Math.floor(Math.random() * 101);
                const bar = '█'.repeat(Math.floor(pct / 5)) + '░'.repeat(20 - Math.floor(pct / 5));
                await ubSend(chatId, `💞 <b>ᴏᴡɴᴇʀ</b> ❤️ <b>${reply.name}</b>\n${bar}\n💯 <b>${pct}%</b>`, message.id);
                break;
            }

            case '/slap':
                await ubSend(chatId, `👋 <b>ᴏᴡɴᴇʀ</b> ꜱʟᴀᴘᴘᴇᴅ <b>${reply ? reply.name : 'ᴛʜᴇᴍꜱᴇʟᴠᴇꜱ'}</b>!`, message.id);
                break;

            case '/hug':
                await ubSend(chatId, `🤗 <b>ᴏᴡɴᴇʀ</b> ʜᴜɢɢᴇᴅ <b>${reply ? reply.name : 'ᴛʜᴇᴍꜱᴇʟᴠᴇꜱ'}</b>!`, message.id);
                break;

            case '/pat':
                await ubSend(chatId, `👐 <b>ᴏᴡɴᴇʀ</b> ᴘᴀᴛᴛᴇᴅ <b>${reply ? reply.name : 'ᴛʜᴇᴍꜱᴇʟᴠᴇꜱ'}</b>!`, message.id);
                break;

            case '/kiss':
                await ubSend(chatId, `💋 <b>ᴏᴡɴᴇʀ</b> ᴋɪꜱꜱᴇᴅ <b>${reply ? reply.name : 'ᴛʜᴇᴍꜱᴇʟᴠᴇꜱ'}</b>!`, message.id);
                break;

            case '/dox': {
                const ip = `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;
                await ubSend(chatId, `🔍 ᴅᴏxxɪɴɢ <b>${reply ? reply.name : 'ᴛʜᴇᴍ'}</b>\n📍 <code>${ip}</code>`, message.id);
                break;
            }

            // ════════════════════════════════════════════════════════
            // 🎯 ᴛᴀʀɢᴇᴛᴇᴅ
            // ════════════════════════════════════════════════════════
            case '/targetslide': {
                if (reply) {
                    ubState.slideTargets.add(reply.id);
                    await ubSend(chatId, `🎯 <b>ꜱʟɪᴅᴇ:</b> <i>${reply.name}</i>`, message.id);
                } else {
                    await ubSend(chatId, '❌ ʀᴇᴘʟʏ ꜰɪʀꜱᴛ', message.id);
                }
                break;
            }

            case '/stopslide': {
                if (reply) {
                    ubState.slideTargets.delete(reply.id);
                    await ubSend(chatId, '🛑 <b>ꜱᴛᴏᴘᴘᴇᴅ</b>', message.id);
                }
                break;
            }

            case '/slidespam': {
                if (reply) {
                    ubState.slidespamTargets.add(reply.id);
                    await ubSend(chatId, `💥 <b>ꜱᴘᴀᴍ:</b> <i>${reply.name}</i>`, message.id);
                }
                break;
            }

            case '/stopslidespam': {
                if (reply) {
                    ubState.slidespamTargets.delete(reply.id);
                    await ubSend(chatId, '🛑 <b>ꜱᴛᴏᴘᴘᴇᴅ</b>', message.id);
                }
                break;
            }

            case '/quickslide': {
                if (!reply) {
                    await ubSend(chatId, '❌ ʀᴇᴘʟʏ', message.id);
                    break;
                }
                ubState.slideTargets.add(reply.id);
                for (let i = 0; i < 5; i++) {
                    ubSend(chatId, getRandomItem(RAID_TEXTS), message.id);
                    await new Promise(r => setTimeout(r, 150));
                }
                break;
            }

            // ════════════════════════════════════════════════════════
            // 💨 ᴀᴛᴛᴀᴄᴋ
            // ════════════════════════════════════════════════════════
            case '/raid': {
                ubStopAll(chatId);
                const loop = ubStartLoop(ubDefaultRaidDelay, () => ubSend(chatId, rest));
                ubState.raidState.set(chatId, { loop, message: rest });
                await ubSend(chatId, '🚀 <b>ʀᴀɪᴅ ꜱᴛᴀʀᴛᴇᴅ</b>', message.id);
                break;
            }

            case '/raidstop': {
                const st = ubState.raidState.get(chatId);
                if (st && st.loop) st.loop.stop();
                ubState.raidState.delete(chatId);
                await ubSend(chatId, '✅ <b>ꜱᴛᴏᴘᴘᴇᴅ</b>', message.id);
                break;
            }

            case '/raiddelay': {
                const d = parseFloat(parts[1]);
                if (!isNaN(d) && d > 0) {
                    ubDefaultRaidDelay = d * 1000;
                    await ubSend(chatId, `⚡ <b>ʀᴀɪᴅ ᴅᴇʟᴀʏ ${d}ꜱ</b>`, message.id);
                }
                break;
            }

            case '/swipe': {
                if (reply) {
                    ubStopAll(chatId);
                    const loop = ubStartLoop(ubDefaultSwipeDelay, () => ubSend(chatId, rest, message.id));
                    ubState.swipeState.set(chatId, { loop });
                    await ubSend(chatId, '🚀 <b>ꜱᴡɪᴘᴇ ꜱᴛᴀʀᴛᴇᴅ</b>', message.id);
                } else {
                    ubState.swipeModeBase[chatId] = rest;
                    await ubSend(chatId, `⚡ <b>ꜱᴡɪᴘᴇ ᴍᴏᴅᴇ:</b> <i>${rest}</i>`, message.id);
                }
                break;
            }

            case '/stopswipe': {
                if (ubState.swipeModeBase[chatId]) delete ubState.swipeModeBase[chatId];
                const st = ubState.swipeState.get(chatId);
                if (st && st.loop) st.loop.stop();
                ubState.swipeState.delete(chatId);
                await ubSend(chatId, '🛑 <b>ꜱᴛᴏᴘᴘᴇᴅ</b>', message.id);
                break;
            }

            case '/swipdelay': {
                const d = parseFloat(parts[1]);
                if (!isNaN(d) && d > 0) {
                    ubDefaultSwipeDelay = d * 1000;
                    await ubSend(chatId, `⚡ <b>ꜱᴡɪᴘᴇ ᴅᴇʟᴀʏ ${d}ꜱ</b>`, message.id);
                }
                break;
            }

            case '/raidwithtimer': {
                ubStopAll(chatId);
                const loop = ubStartLoop(ubDefaultRaidTimerDelay, () => {
                    const n = new Date();
                    const h = String(n.getHours()).padStart(2, '0');
                    const m = String(n.getMinutes()).padStart(2, '0');
                    ubSend(chatId, `${rest} ᴀᴛ ${h}:${m}`);
                });
                ubState.raidTimerState.set(chatId, { loop, message: rest });
                await ubSend(chatId, '🚀 <b>ᴛɪᴍᴇʀ ʀᴀɪᴅ</b>', message.id);
                break;
            }

            case '/raidtimedelay': {
                const d = parseFloat(parts[1]);
                if (!isNaN(d) && d > 0) {
                    ubDefaultRaidTimerDelay = d * 1000;
                    await ubSend(chatId, `⚡ <b>ᴛɪᴍᴇʀ ᴅᴇʟᴀʏ ${d}ꜱ</b>`, message.id);
                }
                break;
            }

            case '/raidtimestop': {
                const st = ubState.raidTimerState.get(chatId);
                if (st && st.loop) st.loop.stop();
                ubState.raidTimerState.delete(chatId);
                await ubSend(chatId, '✅ <b>ꜱᴛᴏᴘᴘᴇᴅ</b>', message.id);
                break;
            }

            case '/delay': {
                const sec = Number(parts[1]);
                if (!isNaN(sec) && sec > 0) {
                    ubDefaultSwipeDelay = ubDefaultRaidDelay = sec * 1000;
                    await ubSend(chatId, `⚡ <b>ᴅᴇʟᴀʏ ${sec}ꜱ</b>`, message.id);
                }
                break;
            }

            case '/boost':
                await ubSend(chatId, '🚀 <b>ʙᴏᴏꜱᴛ</b>', message.id);
                break;

            case '/speedtest': {
                const t0 = Date.now();
                await ubSend(chatId, `📊 <b>ꜱᴘᴇᴇᴅᴛᴇꜱᴛ</b> <i>${Date.now() - t0}ᴍꜱ</i>`, message.id);
                break;
            }

            // ════════════════════════════════════════════════════════
            // ⚡ ʀᴇɴᴀᴍᴇ
            // ════════════════════════════════════════════════════════
            case '/gcnc':
            case '/ncemo': {
                const base = rest || 'ɢʀᴏᴜᴘ';
                ubStopAll(chatId);

                let idx = 0;
                const isE = cmd === '/ncemo';
                const loop = ubStartLoop(300, () => {
                    const t = isE
                        ? NCEMO_EMOJIS[idx % NCEMO_EMOJIS.length]
                        : RAID_TEXTS[idx % RAID_TEXTS.length];
                    ubRename(chatId, `${base} ${t}`);
                    idx++;
                });

                ubState.chatState.set(chatId, {
                    loop,
                    type: isE ? 'ncemo' : 'gcnc',
                    base
                });

                await ubSend(chatId, `🚀 <b>${isE ? 'ᴇᴍᴏᴊɪ' : 'ɢᴄɴᴄ'} ꜱᴛᴀʀᴛᴇᴅ</b>`, message.id);
                break;
            }

            case '/stopgcnc':
            case '/gcnc_stop': {
                ubStopAll(chatId);
                await ubSend(chatId, '✅ <b>ꜱᴛᴏᴘᴘᴇᴅ</b>', message.id);
                break;
            }

            // ════════════════════════════════════════════════════════
            // 🛑 ᴄᴛʀʟ
            // ════════════════════════════════════════════════════════
            case '/stop':
            case '/stopall': {
                for (const m of [ubState.chatState, ubState.swipeState, ubState.raidState, ubState.raidTimerState]) {
                    for (const s of m.values()) {
                        if (s.loop) s.loop.stop();
                    }
                }
                ubState.chatState.clear();
                ubState.swipeState.clear();
                ubState.raidState.clear();
                ubState.raidTimerState.clear();
                ubState.swipeModeBase = {};
                await ubSend(chatId, '⏹ <b>ᴀʟʟ ꜱᴛᴏᴘᴘᴇᴅ</b>', message.id);
                break;
            }

            default: break;
        }
    } catch (e) {
        // silent
    }
}

function ubAttachHandler() {
    if (!userbotClient) return;
    userbotClient.addEventHandler(ubMessageProcessor, new UB_NewMessage({}));
}

// ════════════════════════════════════════════════════════════════
// 🔌 ᴀᴜᴛᴏ-ᴄᴏɴɴᴇᴄᴛ
// ════════════════════════════════════════════════════════════════
async function ubAutoConnect() {
    if (!UB_TelegramClient) {
        console.log('⚠️  Run: npm install telegram');
        return;
    }

    const cfg = ubLoadCfg();
    let saved = '';
    try {
        if (fsUB.existsSync(UB_SESSION_FILE)) {
            saved = fsUB.readFileSync(UB_SESSION_FILE, 'utf8').trim();
        }
    } catch (e) {}

    if (!cfg || !saved) {
        console.log('ℹ️  Use /login in Telegram to log in');
        return;
    }

    try {
        userbotClient = new UB_TelegramClient(
            new UB_StringSession(saved),
            cfg.apiId,
            cfg.apiHash,
            { connectionRetries: 3 }
        );
        await userbotClient.connect();
        USERBOT_OWNER_ID = cfg.ownerId;
        ubAttachHandler();
        console.log(`✅ Userbot auto-connected (owner: ${USERBOT_OWNER_ID})`);
    } catch (err) {
        console.log('⚠️  /login required:', err && err.message);
        userbotClient = null;
    }
}

// ════════════════════════════════════════════════════════════════
// 🔐 /login
// ════════════════════════════════════════════════════════════════
protectedCommand(/^\/login$/i, async (msg) => {
    const cid = msg.chat.id;
    if (!UB_TelegramClient) {
        return sendMessageAllBots(cid, '❌ ɢʀᴀᴍᴊꜱ ᴍɪꜱꜱɪɴɢ. ʀᴜɴ: npm install telegram');
    }
    if (userbotClient) {
        try { await userbotClient.disconnect(); } catch (e) {}
        userbotClient = null;
    }
    ubLoginState.set(cid, { step: 'api_id' });
    sendMessageAllBots(cid,
        `👤 <b>ᴜꜱᴇʀʙᴏᴛ ʟᴏɢɪɴ</b>\n\n` +
        `🔑 <b>ꜱᴛᴇᴘ 1/4</b> — ꜱᴇɴᴅ ʏᴏᴜʀ <b>API ID</b>\n\n` +
        `<i>ᴛʏᴘᴇ /ᴄᴀɴᴄᴇʟ ᴛᴏ ᴀʙᴏʀᴛ</i>`
    );
});

// ════════════════════════════════════════════════════════════════
// 🚪 /logout
// ════════════════════════════════════════════════════════════════
protectedCommand(/^\/logout$/i, async (msg) => {
    const cid = msg.chat.id;
    try {
        if (userbotClient) await userbotClient.disconnect();
    } catch (e) {}
    userbotClient = null;
    USERBOT_OWNER_ID = null;

    try {
        if (fsUB.existsSync(UB_SESSION_FILE)) fsUB.unlinkSync(UB_SESSION_FILE);
    } catch (e) {}
    try {
        if (fsUB.existsSync(UB_CONFIG_FILE)) fsUB.unlinkSync(UB_CONFIG_FILE);
    } catch (e) {}

    sendMessageAllBots(cid, '✅ <b>ʟᴏɢɢᴇᴅ ᴏᴜᴛ & ꜱᴇꜱꜱɪᴏɴ ᴅᴇʟᴇᴛᴇᴅ</b>');
});

// ════════════════════════════════════════════════════════════════
// 📊 /ubstatus
// ════════════════════════════════════════════════════════════════
protectedCommand(/^\/ubstatus$/i, async (msg) => {
    sendMessageAllBots(msg.chat.id,
        `👤 ᴜꜱᴇʀʙᴏᴛ: <b>${userbotClient ? '✅ ᴏɴʟɪɴᴇ' : '❌ ᴏꜰꜰʟɪɴᴇ'}</b>\n` +
        `👑 ᴏᴡɴᴇʀ: <code>${USERBOT_OWNER_ID || '—'}</code>`
    );
});

// ════════════════════════════════════════════════════════════════
// 🔐 ʟᴏɢɪɴ ꜰʟᴏᴡ ɪɴᴛᴇʀᴄᴇᴘᴛᴏʀ
// ════════════════════════════════════════════════════════════════
mainBot.on('message', async (msg) => {
    const cid = msg.chat.id;
    const uid = msg.from.id;
    const st = ubLoginState.get(cid);
    if (!st) return;

    const text = (msg.text || '').trim();

    if (text === '/cancel') {
        ubLoginState.delete(cid);
        return safeMainSend(cid, '❌ ᴄᴀɴᴄᴇʟʟᴇᴅ.', {
            reply_to_message_id: msg.message_id,
            parse_mode: 'HTML'
        });
    }

    if (text.startsWith('/')) return;

    if (!isAuthorized(uid)) {
        ubLoginState.delete(cid);
        return safeMainSend(cid, '❌ ᴜɴᴀᴜᴛʜᴏʀɪᴢᴇᴅ', {
            reply_to_message_id: msg.message_id
        });
    }

    const ro = { reply_to_message_id: msg.message_id, parse_mode: 'HTML' };

    switch (st.step) {
        case 'api_id': {
            const id = parseInt(text, 10);
            if (!id || isNaN(id)) {
                return safeMainSend(cid, '❌ ɪɴᴠᴀʟɪᴅ API ID', ro);
            }
            st.apiId = id;
            st.step = 'api_hash';
            ubLoginState.set(cid, st);
            return safeMainSend(cid, '🔑 <b>ꜱᴛᴇᴘ 2/4</b> — ꜱᴇɴᴅ ʏᴏᴜʀ <b>API HASH</b>', ro);
        }

        case 'api_hash': {
            st.apiHash = text;
            st.step = 'phone';
            ubLoginState.set(cid, st);
            return safeMainSend(cid, '📱 <b>ꜱᴛᴇᴘ 3/4</b> — ꜱᴇɴᴅ ʏᴏᴜʀ <b>ᴘʜᴏɴᴇ ɴᴜᴍʙᴇʀ</b> (+ᴄᴏᴜɴᴛʀʏ ᴄᴏᴅᴇ)', ro);
        }

        case 'phone': {
            st.phone = text;
            st.step = 'code';
            ubLoginState.set(cid, st);

            safeMainSend(cid, '📨 <b>ꜱᴛᴇᴘ 4/4</b> — ꜱᴇɴᴅ ᴛʜᴇ <b>ᴄᴏᴅᴇ</b>', ro);

            (async () => {
                try {
                   const client = new UB_TelegramClient(
    new UB_StringSession(saved),
    cfg.apiId,
    cfg.apiHash,
    {
        connectionRetries: 10,
        retryDelay: 2000,
        useWSS: true,          // 👈 key fix for Termux
        useIPv6: false,
        timeout: 30,
        autoReconnect: true,
        floodSleepThreshold: 60
    }
);

                    await client.start({
                        phoneNumber: async () => st.phone,
                        password: async () => {
                            st.step = 'password';
                            ubLoginState.set(cid, st);
                            safeMainSend(cid, '🔐 <b>2ꜰᴀ ᴇɴᴀʙʟᴇᴅ</b> — ꜱᴇɴᴅ ʏᴏᴜʀ <b>ᴘᴀꜱꜱᴡᴏʀᴅ</b>', ro);
                            return new Promise(r => { st.resolvePassword = r; });
                        },
                        phoneCode: async () => new Promise(r => { st.resolveCode = r; }),
                        onError: (e) => safeMainSend(cid, `❌ ${e.message || e}`, ro)
                    });

                    userbotClient = client;
                    USERBOT_OWNER_ID = uid;

                    try {
                        fsUB.writeFileSync(UB_SESSION_FILE, client.session.save());
                    } catch (e) {}

                    ubSaveCfg({
                        apiId: st.apiId,
                        apiHash: st.apiHash,
                        ownerId: uid,
                        phone: st.phone
                    });

                    ubAttachHandler();
                    ubLoginState.delete(cid);

                    safeMainSend(cid,
                        `✅ <b>ᴜꜱᴇʀʙᴏᴛ ᴏɴʟɪɴᴇ!</b>\n` +
                        `👑 <code>${USERBOT_OWNER_ID}</code>\n\n` +
                        `📍 ᴜꜱᴇ <code>.</code> ᴘʀᴇꜰɪx — ᴇ.ɢ. <code>.info</code>, <code>.admin</code> (ʀᴇᴘʟʏ)`,
                        { parse_mode: 'HTML' }
                    );
                } catch (err) {
                    ubLoginState.delete(cid);
                    safeMainSend(cid, `❌ ʟᴏɢɪɴ ꜰᴀɪʟᴇᴅ: ${err.message || err}`, ro);
                }
            })();
            return;
        }

        case 'code': {
            if (st.resolveCode) {
                st.resolveCode(text);
                st.resolveCode = null;
                safeMainSend(cid, '⏳ ᴠᴇʀɪꜰʏɪɴɢ...', ro);
            }
            return;
        }

        case 'password': {
            if (st.resolvePassword) {
                st.resolvePassword(text);
                st.resolvePassword = null;
                safeMainSend(cid, '⏳ ᴠᴇʀɪꜰʏɪɴɢ 2ꜰᴀ...', ro);
            }
            return;
        }
    }
});

// ════════════════════════════════════════════════════════════════
// 🚀 ꜱᴛᴀʀᴛᴜᴘ
// ════════════════════════════════════════════════════════════════
ubAutoConnect().catch(() => {});

console.log(`✨ ꜰᴇᴀᴛᴜʀᴇꜱ:\n• ${allBots.length} ʙᴏᴛꜱ ᴀᴄᴛɪᴠᴀᴛᴇᴅ\n• ᴜʟᴛʀᴀ-ꜰᴀꜱᴛ\n• 70+ ᴄᴏᴍᴍᴀɴᴅꜱ\n• 🛡️ ᴀᴅᴍɪɴ · ⚠️ ᴍᴏᴅ · 🏘️ ɢʀᴏᴜᴘ · 🎮 ꜰᴜɴ\n• 🎨 ꜱᴛʏʟɪꜱʜ HTML\n`);
console.log(`╔══════════════════════════════════════════╗`);
console.log(`║     ʙᴏᴛ ɪꜱ ʀᴇᴀᴅʏ ᴀɴᴅ ᴡᴀɪᴛɪɴɢ...    ║`);
console.log(`║     🎮 70+ ᴄᴏᴍᴍᴀɴᴅꜱ ʟᴏᴀᴅᴇᴅ        ║`);
console.log(`╚══════════════════════════════════════════╝`);