import Discord from 'discord.js';

import { Adapter, User } from '@exoplay/exobot';

export const EVENTS = {
  ready: 'discordReady',
  message: 'discordMessage',
  //presence: 'discordPresence',
  reconnecting: 'discordReconnecting',
};

export const DISCORD_MENTION_REGEX = /<@!(\d+)>/i;

export class DiscordAdapter extends Adapter {
  name = 'discord';

  channels = {};

  constructor ({ token, botId, username, adapterName }) {
    super(...arguments);
    console.log(this.name);
    this.name = adapterName || name;
    console.log(this.name);
    this.botId = botId;
    this.username = username;
    this.token = token;
  }

  register (bot) {
    super.register(...arguments);

    const { token, botId, username } = this;

    if (!token || !botId || !username) {
      this.status = Adapter.STATUS.ERROR;
      bot.log.error('token, botId, and username are required to connect to discord.');
      return;
    }

    this.client = new Discord.Client();
    Object.keys(EVENTS).forEach(discordEvent => {
      const mappedFn = this[EVENTS[discordEvent]];
      this.client.on(discordEvent, (...args) => mappedFn.bind(this)(...args));
      this.client.on(discordEvent, (...args) => {
        this.bot.emitter.emit(`discord-${discordEvent}`, ...args);
      });
    });

    this.initUsers();
    this.client.login(token);

  }

  send (message) {
    this.bot.log.debug(`Sending ${message.text} to ${message.channel}`);
    message.channel.sendMessage(message.text);
    /*this.client.sendMessage(
      message.channel,
      message.text
    );*/
  }

  async getUserIdByUserName (name) {
    const user = this.client.users.find('username',name);
    if (user) {
      const botuser = await this.addUser(user, );
      return botuser.id;
    } else {
      return;
    }
  }

  discordReady = () => {
    this.status = Adapter.STATUS.CONNECTED;

    this.bot.emitter.emit('connected', this.name);
    this.bot.log.notice('Connected to Discord.');
    this.client.user.game = 'Exobotting';

    this.client.guilds.forEach(s => {
      s.member(this.client.user).nickname = this.bot.name;
    });
  }

  discordReconnecting = () => {
    this.status = Adapter.STATUS.DISCONNECTED;
    this.bot.log.critical('Reconnecting to Discord.');
  }

  async discordMessage ({ channel, guild, author, content, member }) {
    if (author.username === this.username) { return; }
<<<<<<< 2f0e773868bc500cc8f609efc68ab07e31e3efee

    const user = new User(author.username, author.id);
=======
>>>>>>> Updated to support new exobot user DB

    const user = await this.addUser(author, member)
    console.log(user);
    console.log(content);
      // if it's a whisper, the channel is in directMessages
    if (channel.type === 'dm') {
      return super.receiveWhisper({ user, text: content, channel });
    }
    console.log('Processing message');
    console.log(user);
    this.receive({ user, text: content, channel });


  }

  async initUsers() {
    console.log('Discord.initUsers');

    await this.bot.databaseInitialized();
    console.log(this.bot.users);
    this.discordUsers = this.bot.db.get(`exobot-users.${this.name}`).value();
    if (this.discordUsers) {
      console.log('Users already inited');
      console.log(this.discordUsers);
      return;
    }
    console.log('Initing Users');
    this.bot.db.set(`exobot-users.${this.name}`, {}).value();
    this.discordUsers = this.bot.db.get(`exobot-users.${this.name}`).value();
    console.log(this.discordUsers);

  }

  async addUser(author, member) {
    console.log('Adding User');
    if (this.discordUsers) {
      await this.bot.databaseInitialized();
      if (this.discordUsers[author.id]) {
        if (member) {
          const roles = member.roles.map((u) => {u.name});
          console.log(roles);
          this.discordUsers[author.id].roles = roles;
        }
        return this.bot.users.botUsers[this.discordUsers[author.id].botID];
      } else {
        console.log('Creating new user');
        let roles;
        if (member) {
          console.log('Member object present setting roles');
          roles = member.roles.map((m) => {m.name});
          console.log(roles);
        }
        console.log('Creating exobot.user');
        const user = new User(author.username);
        console.log(user);
        this.discordUsers[author.id] = {name: author.username,
                                        botID: user.id,
                                        roles: roles,}; //stub
        console.log(this.bot.users);
        this.bot.users.botUsers[user.id] = user;
        console.log('After adding');
        console.log(this.bot.users);
        return user;
      }
    }
    return new User(author.username, author.id);
  }
  /*
  discordPresence (username, userId, status, gameName, rawEvent) {
    if (userId !== this.botId) {
      const user = new User(username, userId);

      if (status === 'online') {
        return super.enter({ user, channel: rawEvent.d.channel_id });
      } else if (status === 'offline') {
        return super.leave({ user, channel: rawEvent.d.channel_id });
      }
    }
  }
  */
}
