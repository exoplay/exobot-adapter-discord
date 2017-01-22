import Discord from 'discord.js';

import { Adapter, AdapterOperationTypes as AT, PropTypes as T } from '@exoplay/exobot';

export const EVENTS = {
  ready: 'discordReady',
  message: 'discordMessage',
  //presence: 'discordPresence',
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
  };

  channels = {};

  constructor () {
    super(...arguments);
    const { token, botId, username } = this.options;
    console.log(this.options.roleMapping);
    this.client = new Discord.Client();
    Object.keys(EVENTS).forEach(discordEvent => {
      const mappedFn = this[EVENTS[discordEvent]];
      this.client.on(discordEvent, (...args) => mappedFn.bind(this)(...args));
      this.client.on(discordEvent, (...args) => {
        this.bot.emitter.emit(`discord-${discordEvent}`, ...args);
      });
    });
    this.configureAdapterOperations();
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
    }

    return;
  }

  getRoleIdByRoleName (name, message) {
    const role = message.channel.guild.roles.find('name', name);
    if (role) {
      return role.id;
    }

    return;
  }

  getRolesForUser (userId) {
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
    this.client.user.game = 'Exobotting';

    this.client.guilds.forEach(s => {
      s.member(this.client.user).nickname = this.bot.name;
    });
  }

  discordReconnecting = () => {
    this.status = Adapter.STATUS.DISCONNECTED;
    this.bot.log.critical('Reconnecting to Discord.');
  }

  async discordMessage ({ channel, author, cleanContent, member }) {
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
          .then(user => {
            user.sendMessage(options.messageText)
            .catch(reason => {this.bot.log.warning(reason.response.text);});
          });
      }
    }
  }

  kickUser(adapterName, options) {
    if (!adapterName || adapterName === this.name) {
      const adapterUserId = this.getAdapterUserIdById(options.userId);
      if (adapterUserId) {
        options.messageText = `You are being kicked due to ${options.messageText}`;
        this.client.fetchUser(adapterUserId)
          .then(user => {
            user.sendMessage(options.messageText)
              .then(() => {
                this.client.guilds.map(g => {
                  g.fetchMember(user)
                    .then(member => {
                      member.kick()
                      .catch(reason => {this.bot.log.warning(reason.response.text);});
                    })
                    .catch(reason => {this.bot.log.warning(reason.response.text);});
                });

              })
              .catch(reason => {this.bot.log.warning(reason.response.text);});
          });
      }

    }
  }

  banUser(adapterName, options) {
    if (!adapterName || adapterName === this.name) {
      const adapterUserId = this.getAdapterUserIdById(options.userId);
      if (adapterUserId) {
        options.messageText = `You are being banned due to ${options.messageText}`;
        this.client.fetchUser(adapterUserId)
          .then(user => {
            user.sendMessage(options.messageText)
              .then(() => {
                this.client.guilds.map(g => {
                  g.fetchMember(user)
                    .then(member => {
                      member.ban()
                      .catch(reason => {this.bot.log.warning(reason.response.text);});
                    })
                    .catch(reason => {this.bot.log.warning(reason.response.text);});
                });

              })
              .catch(reason => {this.bot.log.warning(reason.response.text);});
          });
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
