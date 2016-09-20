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

  constructor ({ token, botId, username, adapterName, roleMapping }) {
    super(...arguments);
    this.name = adapterName || this.name;
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

    this.client.login(token);
  }

  send (message) {
    this.bot.log.debug(`Sending ${message.text} to ${message.channel}`);
    message.channel.sendMessage(message.text);
  }

  async getUserIdByUserName (name) {
    const user = this.client.users.find('username',name);
    if (user) {
      let botUser;
      try {
      botUser = await this.getUser(user.id, user.username, user);
      } catch (err) {
        this.bot.log.warn(err);
      }
      return botUser.id;
    } else {
      return;
    }
  }

  getRoleIdByRoleName (name, message) {
    const role = message.channel.guild.roles.find('name', name);
    if (role) {
      return role.id;
    }

    return;
  }

  getRolesForUser (userId) {
    if (this.adapterUsers[userId]) {
      return this.adapterUsers[userId].roles.map( (role) => {
        if (this.roleMapping[role]) {
          return this.roleMapping[role];
        }});
    }

    return [];
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
    this.bot.log.debug(content);

    const user = await this.getUser(author.id, author.username, member || author);

      // if it's a whisper, the channel is in directMessages
    if (channel.type === 'dm') {
      return super.receiveWhisper({ user, text: content, channel });
    }

    this.receive({ user, text: content, channel });
  }

  getRoles(adapterUserId, adapterUser) {
    const roles = [];
    if (adapterUser.roles) {
      adapterUser.roles.map((role) => {
        roles.push(role.name);
      });

      return roles;
    }

    return false;
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
