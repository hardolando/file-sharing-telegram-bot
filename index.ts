import { Bot, webhookCallback } from "grammy";
import express from "express";
import { getFile, storeFile } from "./services";
import { botID, botToken } from "./config";
import sendMediaFunction from "./utils/sendMediaFunction";

const bot = new Bot(botToken);

bot.command("start", async (ctx) => {
  try {
    if (ctx.match && ctx.match.length === 8) {
      const file = await getFile(ctx.match);
      if (!file) {
        await ctx.reply(
          "KODE TIDAK VALID, PASTIKAN KODEMU VALID BRO"
        );
        return;
      }
      await ctx.reply("BENTAR GW BIKININ DULU KOPINYA...");
      await sendMediaFunction(ctx, file);
      return;
    }
    return ctx.reply(
      "SELAMAT DATANG< GW ASSISTEN YANG MAHA KUASA PAPANDA, SILAHKAN UPLOAD FILE LO..."
    );
  } catch (error) {
    console.error(error);
    await ctx.reply("GABISA TOT, yang bener.. :(");
  }
});

bot.on("message:text", async (ctx) => {
  await ctx.reply(
    "GAUSAH RIBET GITU COK, UPLOADNYA FILE DOANG JANGAN YANG LAEN"
  );
});

bot.on("message:file", async (ctx) => {
  try {
    const file = await ctx.getFile();
    const fileCode = await storeFile(file.file_id);
    return ctx.reply(
      `FILE LO TERSIMPAN ${fileCode}. INI LINK LU https://t.me/${botID}?start=${fileCode}`
    );
  } catch (error) {
    console.error(error);
    await ctx.reply("GABISA TOT, ELU SALAH :(");
  }
});

if (process.env.NODE_ENV === "production") {
  const app = express();
  app.use(express.json());
  app.use(webhookCallback(bot, "express"));

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`bentar ${PORT}`);
  });
} else {
  bot.start();
}

console.log("GW MASIH HIDUP KOK..");
