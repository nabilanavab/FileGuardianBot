

[![Typing SVG](https://readme-typing-svg.demolab.com?font=Fira+Code&pause=1000&color=2EF7A1&random=false&width=435&lines=Introducing+a+Node.js+File+Share+Bot;++for+ultra-fast+file+transfers!)](https://git.io/typing-svg)


<img src="https://graph.org/file/ce45266da8d8aed7aa3ef.jpg" alt="Buy Me A Coffee" width="50%" align="right">


> **Note**
> : Please take a look at this <a href="https://telegram.dog/FileGuardianBot">bot</a> before hosting it yourself 🌟

# File Guardian bot [ ver: 2.0.0 ]

Welcome to File Guardian Bot – your powerful and versatile file-sharing companion! This bot is designed to make file sharing a seamless experience, allowing you to create both private and public URLs for various file types, including messages, text, stickers, and more.

##  The Ultimate Guide (No, Seriously, It's Great) - Version 2.0.0 🚀
- **🌐 Guardian of All Things Data :** ready to protect and serve any kind of your data with a side of charm.
- **⏰ Time-Traveling Data :** Delete Timer, Set a timer for shared files to automatically delete after a specified duration, ensuring data privacy and security.
- **🛡️ Password Protection - Because Files Have Secrets Too :** Private and Public URLs, Easily generate links for your files, ensuring flexible sharing options for both private and public audiences. By Adding an extra layer of  password protection.
- **🚫 The No-Forwarding Forcefield :** Prevent file forwarding to maintain control over the dissemination of your shared content
- **🔃 No Forward Quotes :** have the power to hide the owner of their content.
- **🔃 Multiple Language Support:** File Guardian Bot caters to a global audience with support for multiple languages.
- **✏ Add Custom Caption:** Set Custom Caption For Files saperately
- **😎 Add Custom Buttom:** Set Custom Button For Files saperately
- But hold on... That's not all! 🛑✨ Our Telegram bot doesn't stop there. In addition to the amazing features that we've already mentioned, **it supports batching multiple files as one**! 📦🚀 #NextLevelFileSharing"

## How to Use, The Basics (Because We Have to Start Somewhere)
<p><strong>Generating Links: 🚀</strong></p>

<p>For an individual message, it's a breeze! Simply use a simple forward or send the message to the bot's private chat, and voila, the link is ready!</p>

<ul>
  <li>
    <p><strong>Single Message:</strong></p>
    <ol>
      <li>Forward the message to the bot.</li>
      <li>Receive the magic link! 🪄✨</li>
    </ol>
  </li>
</ul>

<p>But wait, there's more! For multiple file batching, send <code>/batch</code> in the bot's private chat. Choose from two options:</p>

<ol>
  <li>
    <p><strong>Batch from Channel:</strong></p>
    <ul>
      <li>Batch up to 100 messages directly from your channel.</li>
    </ul>
  </li>
  <li>
    <p><strong>Batch from Message:</strong></p>
    <ul>
      <li>Batch up to 10 messages from your chat.</li>
    </ul>
  </li>
</ol>

## For Developers 👩‍💻
<i>Unlike other file share telegram bots, Our dev playground doesn't dance with the Python snakes – it grooves with Node.js, the JavaScript environment for snappy deployments and lightning-fast responses. 🚀</br></br>
This repo is merely a test ground for my learning journey. Expect bugs on this rollercoaster of education, and your insights are gold! Feel free to shout out those bugs</i>

### Deploying with Ease: A Quick Guide

Remembering all the things, let's breeze through deployment.  


1. **PaaS Setup:**
   - If you're on a PaaS with a worker, the Docker path is your secret sauce. 🐳✨
   - Ensure you have a PaaS with a worker (e.g., Heroku, Railways). 🚀

2. **VPS | Local Setup:**
   - Ensure that Node environment is installed on your the platform that you are using.
   - Confirm with the sacred command:
     ```bash
     node -v
     ```
   - Begin by cloning the Git project using:
     ```bash
     git clone https://github.com/nabilanavab/FileGuardianBot.git
     ```
   - Install the required packages using `npm`:
     ```bash
     npm install
     ```
     or using `yarn`:
     ```bash
     yarn install
     ```
   - Initiate the server enchantment using:
     ```bash
     node FileGuardian/FileGuardianBot
     ```
3. **Docker File Deployment:**
   - Navigate to the project home page, where the Docker file awaits.
   - Unleash the Docker magic using: 
     ```bash
     docker build -t nabilanavab .
     docker run -d nabilanavab
     ```
4. **For Web Servers (Concurrent Thread Setup):** 
   - Web servers like Render or Koyeb bring a concurrent thread party.
   - One thread for web requests, one for the bot - they dance together! 💃🤖
   - (Render, Koyeb, etc.)

## Environment Variables

Before deploying your Telegram bot, don't forget to review and configure the environment variables to ensure the smooth operation

### Mandatory Variables ( it just won't function properly without them! 🍪 )
- **API_HASH:** Your Telegram API hash. From: `my.telegram.org`
- **API_ID:** Your Telegram API ID. From: `my.telegram.org`
- **API_TOKEN:** Your Telegram bot token. From: `telegram.dog/botfather`
- **LOG_CHANNEL:** Telegram channel ID where logs messages will be sent. Example: `-100xxxxxxxxx`

### Highly Suggested (but not Mandatory)
- **MONGODB_URI:** If you want to keep customized data, consider setting up a [MongoDB](https://cloud.mongodb.com/) database.
  Example: `"mongodb+srv://your-username:your-password@your-cluster.mongodb.net/your-database-name"`

### Optional Variables
- **TIME_LIMIT:** The time (in mins) within which a user's message count will be considered for rate limiting.
- **NUMBER_LIMIT:** The maximum number of messages a user can send within the specified time limit.
- **WELCOME_PIC:** A URL pointing to a welcome picture that will be displayed when users starts the bot.
- **MULTIPLE_LANG:** Set this variable to `true` if you want to enable support for multiple languages in your bot.
- **FORCE_SUB:** Set Channel Id, if you want to enforce subscription to a specific channel.
- **REQUEST_CHANNEL:** If `FORCE_SUB` & its a private channel, this variable send join requests.
- **CHANNEL_ID:** If you want to broadcast a restart message, set this variable to the channel ID
- **MESSAGE_ID:** If `CHANNEL_ID` is specified, set this variable to the message ID of the restart message.


## Welcome to Version 3.0.0 and beyond!
- ADV_TOKEN Integration: Use ADV_TOKEN for personalized advertisement, separating domains with your API token. Maximize your earning potential with this innovative advertising approach.
- EXPIRATION_TIME: Set time limits with EXPIRATION_TIME (in hours). Add 24 to create a 24-hour window for users to visit the specified website, enhancing engagement and rewards.
> - Dual Shortening Modes:
>   - Shorten All Links: Automatically shorten every URL, optimizing monetization across your bot.
>   - 24-Hour One-Time Shortening: Encourage user visits within a 24-hour period for select URLs, creating a focused and time-sensitive earning opportunity.
## Troubleshooting (Because We Can't Predict Everything)
Things go wrong sometimes, and we get it. If you find yourself facing unexpected challenges or quirks while using File Guardian Bot, fret not. We're here to help, and your feedback is gold.
- **Suggestions or Changes :** If you have suggestions or ideas for improvements, or if you spot something that needs fixing, feel free to create an issue on GitHub. We love hearing from you!

- **Pull Requests :** Want to roll up your sleeves and contribute to making File Guardian Bot even better? Fantastic! Submit a pull request on GitHub, and let's build something awesome together.

<div align="center">
  <a href="https://github.com/nabilanavab/FileGuardianBot/stargazers">
    <img src="https://img.shields.io/github/stars/nabilanavab/FileGuardianBot?style=social">
  </a>
  <a href="https://github.com/nabilanavab/FileGuardianBot/fork">
    <img src="https://img.shields.io/github/forks/nabilanavab/FileGuardianBot?label=Fork&style=social">
  </a>  
</div>
