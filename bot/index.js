import express from "express";
import { Telegraf } from "telegraf";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());

const bot = new Telegraf(process.env.BOT_TOKEN);

// Отправляем пользователю кнопку для запуска Mini App
bot.start((ctx) => {
  ctx.reply(
    "🎰 Казино с оплатой через Stars! Сделай ставку и крути слот!",
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Играть 🎮",
              web_app: { url: process.env.WEBAPP_URL },
            },
          ],
        ],
      },
    }
  );
});

// Генерация инвойса (через Telegram Stars)
app.get("/pay", async (req, res) => {
  const amount = parseInt(req.query.amount || "5");
  const payload = "casino_spin_" + Date.now();

  // Создаём ссылку на Stars-инвойс
  const invoiceUrl = `https://t.me/${process.env.BOT_USERNAME}?startapp=pay_${payload}`;

  res.json({ url: invoiceUrl });
});

// Когда пользователь выиграл — можно отправить подарок Stars
app.post("/win", async (req, res) => {
  const { query_id, prize } = req.body;

  try {
    await bot.telegram.answerWebAppQuery(query_id, {
      type: "article",
      id: "win1",
      title: `Вы выиграли ${prize}⭐!`,
      input_message_content: {
        message_text: `🎉 Поздравляем! Вы выиграли ${prize}⭐`,
      },
    });

    res.sendStatus(200);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

bot.launch();
app.listen(3000, () => console.log("Bot + Mini App running on port 3000"));
