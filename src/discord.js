import Discord from 'discord.js';

import { Adapter, AdapterOperationTypes as AT, PropTypes as T } from '@exoplay/exobot';

export const EVENTS = {
  ready: 'discordReady',
  message: 'discordMessage',
  // presence: 'discordPresence',
  disconnect: 'discordDisconnect',
  reconnecting: 'discordReconnecting',
};

export const DISCORD_MENTION_REGEX = /<@!(\d+)>/i;

export default class DiscordAdapter extends Adapter {
  static type = 'discord';

  static propTypes = {
    botId: T.string,
    username: T.string.isRequired,
    token: T.string.isRequired,
    roleMapping: T.object,
    disabledEvents: T.array,
    gameName: T.string,
  };

  static defaultProps = {
    disabledEvents: ['TYPING_START'],
    gameName: 'Exobotting',
  };

  channels = {};

  constructor() {
    super(...arguments);
    const { token } = this.options;
    const disabledEvents = this.options.disabledEvents.filter((event) => {
      if (Discord.Constants.WSEvents[event]) {
        return true;
      }

      return false;
    }) || [];

    this.client = new Discord.Client({
      disabledEvents,
    });
    Object.keys(EVENTS).forEach((discordEvent) => {
      const mappedFn = this[EVENTS[discordEvent]];
      this.client.on(discordEvent, (...args) => mappedFn.bind(this)(...args));
      this.client.on(discordEvent, (...args) => {
        this.bot.emitter.emit(`discord-${discordEvent}`, ...args);
      });
    });
    this.configureAdapterOperations();
    this.client.login(token);
  }

  send(message) {
    this.bot.log.debug(`Sending ${message.text} to ${message.channel}`);
    message.channel.sendMessage(message.text);
  }

  async getUserIdByUserName(name) {
    const user = this.client.users.find('username', name);
    if (user) {
      let botUser;
      try {
        botUser = await this.getUser(user.id, user.username, user);
      } catch (err) {
        this.bot.log.warn(err);
      }
      return botUser.id;
    }
  }

  getRoleIdByRoleName(name, message) {
    const role = message.channel.guild.roles.find('name', name);
    if (role) {
      return role.id;
    }
  }

  getRolesForUser(userId) {
    if (this.roleMapping && this.adapterUsers && this.adapterUsers[userId]) {
      return this.adapterUsers[userId].roles
        .filter(role => this.roleMapping[role])
        .map(role => this.roleMapping[role]);
    }

    return [];
  }

  discordReady = () => {
    this.status = Adapter.STATUS.CONNECTED;

    this.bot.emitter.emit('connected', this.name);
    this.bot.log.notice('Connected to Discord.');
    this.client.user.setGame(this.options.gameName);

    this.client.guilds.forEach((s) => {
      const member = s.member(this.client.user);
      member.nickname = this.bot.name;
    });
  }

  onConfigChange = () => {
    this.client.user.setGame(this.options.gameName);
  }

  discordReconnecting = () => {
    this.status = Adapter.STATUS.DISCONNECTED;
    this.bot.log.critical('Reconnecting to Discord.');
  }

  discordDisconnect = (closeEvent) => {
    this.status = Adapter.STATUS.DISCONNECTED;
    this.bot.log.critical(`Disconnected from Discord ${closeEvent.code}: ${closeEvent.reason}`);
  }

  async discordMessage({ channel, author, cleanContent, member }) {
    if (author.username === this.options.username) { return; }
    this.bot.log.debug(cleanContent);

    const user = await this.getUser(author.id, author.username, member || author);

    // if it's a whisper, the channel is in directMessages
    if (channel.type === 'dm') {
      return super.receiveWhisper({ user, text: cleanContent, channel });
    }

    this.receive({ user, text: cleanContent, channel });
  }

  getRoles(adapterUserId, adapterUser) {
    if (adapterUser.roles) {
      return adapterUser.roles.map(role => role.name);
    }

    return false;
  }

  configureAdapterOperations() {
    this.bot.emitter.on(AT.DISCIPLINE_USER_WARNING, this.whisperUser, this);
    this.bot.emitter.on(AT.DISCIPLINE_USER_TEMPORARY, this.kickUser, this);
    this.bot.emitter.on(AT.DISCIPLINE_USER_PERMANENT, this.banUser, this);
    this.bot.emitter.on(AT.WHISPER_USER, this.whisperUser, this);
  }

  whisperUser(adapterName, options) {
    if (!adapterName || adapterName === this.name) {
      const adapterUserId = this.getAdapterUserIdById(options.userId);
      if (adapterUserId) {
        this.client.fetchUser(adapterUserId)
          .then((user) => {
            user.sendMessage(options.messageText)
            .catch((reason) => { this.bot.log.warning(reason.response.text); });
          });
      }
    }
  }

  async kickUser(adapterName, options) {
    if (!adapterName || adapterName === this.name) {
      const adapterUserId = this.getAdapterUserIdById(options.userId);
      if (adapterUserId) {
        const messageText = `You are being kicked due to ${options.messageText}`;
        try {
          const user = await this.client.fetchUser(adapterUserId);
          await user.sendMessage(messageText);
          const members = await Promise.all(this.client.guilds.map(g => g.fetchMember(user)));
          members.forEach((m) => {
            m.kick();
          });
        } catch (err) {
          if (err.response) {
            this.bot.log.warning(err.response.text);
          } else {
            this.bot.log.warning(err);
          }
        }
      }
    }
  }

  async banUser(adapterName, options) {
    if (!adapterName || adapterName === this.name) {
      const adapterUserId = this.getAdapterUserIdById(options.userId);
      if (adapterUserId) {
        const messageText = `You are being banned due to ${options.messageText}`;
        try {
          const user = await this.client.fetchUser(adapterUserId);
          await user.sendMessage(messageText);
          const members = await Promise.all(this.client.guilds.map(g => g.fetchMember(user)));
          members.forEach((m) => {
            m.ban();
          });
        } catch (err) {
          if (err.response) {
            this.bot.log.warning(err.response.text);
          } else {
            this.bot.log.warning(err);
          }
        }
      }
    }
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
