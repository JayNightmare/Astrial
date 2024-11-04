<div align="center">
    <img src="./image.png" height="128" style="border-radius: 99999px">
</div>
<h1 align="center">Astrial Music Bot</h1>
<div align="center">
    <p>Repo Stats</p>
    <a href="https://github.com/JayNightmare/ASTRIAL/graphs/contributors">
      <img alt="GitHub Contributors" src="https://img.shields.io/github/contributors/JayNightmare/ASTRIAL?color=2db94d" />
    </a>
    <a href="https://github.com/JayNightmare/ASTRIAL/issues">
      <img alt="Issues" src="https://img.shields.io/github/issues/JayNightmare/ASTRIAL?color=0088ff" />
    </a>
    <a href="https://github.com/JayNightmare/ASTRIAL/pulls">
      <img alt="GitHub pull requests" src="https://img.shields.io/github/issues-pr/JayNightmare/ASTRIAL?color=0088ff" />
    </a>
    <br/> 
    <br/>
    <a href="https://www.codefactor.io/repository/github/JayNightmare/Astrial">
      <img src="https://www.codefactor.io/repository/github/JayNightmare/Astrial/badge">
    </a>
    <a href="https://opensource.org/licenses/MIT">
      <img src="https://img.shields.io/badge/License-MIT-yellow.svg">
    </a>
    <br/>
    <br/>
    <a href="https://opensource.org/licenses/MIT">
      <img src="https://img.shields.io/github/v/release/JayNightmare/Astrial">
    </a>
    <br/>
    <br/>
    <a href="https://discord.gg/U5ZszEc6tt">
        <img src="https://img.shields.io/discord/1236993916742668400?color=5865F2&logo=discord&logoColor=white" alt="Discord server" />
    </a>
    <br/>
</div>

---

<div align="center">
    <br/>
    <p>Dependency Checker</p>
    <a href="https://github.com/JayNightmare/ASTRIAL/actions/workflows/node.js.yml">
      <img alt="Node.js CI" src="https://github.com/JayNightmare/ASTRIAL/actions/workflows/node.js.yml/badge.svg"/>
    </a>
    <br/>
    <br/>
</div>

---

<div align="center">
    <br/>
    <p>Bot Votes</p>
    <a href="https://top.gg/bot/1050445107389804646">
      <img src="https://top.gg/api/widget/upvotes/1050445107389804646.svg">
    </a>
    <br/>
    <br/>
</div>

-----

<div align="center">
    <p></p>
</div>
<br/>
<br/>

<div align=center>

# BOT READY FOR PRODUCTION

</div>

## Have a bug?

Submit an `Issue` and tell me what's wrong.

## Things to note before cloning

This codebase is uses discord.js, sqlite3, .env, and a few other packages. If you experience a problem with a package, don't blame me.

The bot so far only supports Prefix commands. 

Road Map:
- v0.5: 
  - Will introduce slash commands.

# How to get working:
1. Do `npm install` to install all dependencies.
2. Navigate to the root (Astrial Folder) and create a `.env` file.
3. Fill out `.env`.
4. Run Bot.
   1. Local Machine: Use `Run and Debug` menu. Do NOT just do `node bot.js`, it wont break, you'll just look dumb. The `.vscode` folder has a launch.json file which points to the file that starts the bot.
   2. Server Machine: Install pm2 (`npm install pm2 -g`) and navigate to the `cd src/` do `pm2 start shard.js --name "name of bot"`. This will auto restart the bot if a critical error occurs and allows you to remotely monitor your bot on the [PM2](https://app.pm2.io) website.
