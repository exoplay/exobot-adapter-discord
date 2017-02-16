const path = require('path');

module.exports = {
  key: process.env.EXOBOT_KEY || 'discord-test',
  plugins: {
    discord: [path.join(process.cwd(), 'discord.js'), { }],
    http: ['@exoplay/exobot', { import: 'adapters.HTTP' }],
    uptime: ['@exoplay/exobot', { import: 'plugins.Uptime' }],
    help: ['@exoplay/exobot', { import: 'plugins.Help' }],
    greetings: ['@exoplay/exobot', { import: 'plugins.Greetings' }],
    permissions: ['@exoplay/exobot', { import: 'plugins.Permissions' }],
    config: ['@exoplay/exobot', { import: 'plugins.Config' }],
  },
};
