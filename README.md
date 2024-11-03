<div align="center">
    <img src="./image.png" height="128" style="border-radius: 99999px">
</div>
<h1 align="center">Astrial Music Bot</h1>
<div align="center">
    <p>Says "repo not found" due to repo being private. Make repo public to fix this</p>
    <a href="https://github.com/JayNightmare/ASTRIAL/graphs/contributors">
      <img alt="GitHub Contributors" src="https://img.shields.io/github/contributors/JayNightmare/ASTRIAL?color=2db94d" />
    </a>
    <a href="https://github.com/JayNightmare/ASTRIAL/issues">
      <img alt="Issues" src="https://img.shields.io/github/issues/JayNightmare/ASTRIAL?color=0088ff" />
    </a>
    <a href="https://github.com/JayNightmare/ASTRIAL/pulls">
      <img alt="GitHub pull requests" src="https://img.shields.io/github/issues-pr/JayNightmare/ASTRIAL?color=0088ff" />
    </a>
    <a href="https://github.com/JayNightmare/ASTRIAL/actions/workflows/node.js.yml">
      <img alt="Node.js CI" src="https://github.com/JayNightmare/ASTRIAL/actions/workflows/node.js.yml/badge.svg"/>
    </a>
    <br/>
</div>

<div align="center">
  <div>
    <a href="https://top.gg/bot/1050445107389804646">
      <img src="https://top.gg/api/widget/upvotes/1050445107389804646.svg">
    </a>
  </div>
</div>

<br/>

<div align="center">
    <p></p> 
</div>

<div align=center>

# BOT READY FOR PRODUCTION

</div>

## Have a bug?

Submit an `Issue` and tell me what's wrong.

## Things to note before cloning

This codebase is uses discord.js, sqlite3, .env, and a few other packages. If you experience a problem with a package, don't blame me.

# How to get working:
1. Do `npm install` to install all dependencies.
2. Navigate to the Config folder (`cd src/config`) and edit the `config.js` file to 
3. Fill out `.env`.
4. Run Bot.
   1. Local Machine: Use `Run and Debug` menu. Do NOT just do `node bot.js`, it wont break, you'll just look dumb.
   2. Server Machine: Install pm2 (`npm install pm2 -g`) and do `pm2 start bot.js --name "name of bot"`. This will auto restart the bot if a critical error occurs and allows you to remotely monitor your bot on the [PM2](https://app.pm2.io) website.

