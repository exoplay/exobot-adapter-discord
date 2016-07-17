# exobot-adapter-discord

## Installation

* `npm install --save @exoplay/exobot/exobot-adapter-slack`

## A Setup Example

```javascript
import Exobot from '@exoplay/exobot';
import Discord from '@exoplay/exobot-adapter-discord';

const Bot = new Exobot(BOT_NAME, {
  // ...,
  adapters: [
    new Discord({
      username: process.env.DISCORD_BOT_USERNAME,
      token: process.env.DISCORD_BOT_TOKEN,
      botId: process.env.DISCORD_BOT_ID
    })
  ],
});

```

## Setup Notes

Visit https://discordapp.com/developers/docs/topics/oauth2 to learn more about
setting up a bot user. In particular, make sure to visit the url under the
"Adding Bots to Guilds" section (substituting in your own bot id) to connect
the bot to your Discord server.

## License

MIT licensed. Copyright 2016 Exoplay, LLC. See LICENSE file for more details.
