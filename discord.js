require("source-map-support").install();
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("@exoplay/exobot"),require("discord.js")):"function"==typeof define&&define.amd?define(["@exoplay/exobot","discord.js"],t):"object"==typeof exports?exports["discord.js"]=t(require("@exoplay/exobot"),require("discord.js")):e["discord.js"]=t(e["@exoplay/exobot"],e["discord.js"])}(this,function(e,t){return function(e){function t(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,t),o.l=!0,o.exports}var n={};return t.m=e,t.c=n,t.i=function(e){return e},t.d=function(e,t,n){Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:n})},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=2)}([function(e,t){e.exports=require("@exoplay/exobot")},function(e,t){e.exports=require("discord.js")},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var c=n(1),s=c&&c.__esModule?function(){return c["default"]}:function(){return c};n.d(s,"a",s);var a=n(0),u=a&&a.__esModule?function(){return a["default"]}:function(){return a};n.d(u,"a",u),n.d(t,"EVENTS",function(){return f}),n.d(t,"DISCORD_MENTION_REGEX",function(){return p}),n.d(t,"DiscordAdapter",function(){return y});var d=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=function h(e,t,n){null===e&&(e=Function.prototype);var r=Object.getOwnPropertyDescriptor(e,t);if(void 0===r){var o=Object.getPrototypeOf(e);return null===o?void 0:h(o,t,n)}if("value"in r)return r.value;var i=r.get;if(void 0!==i)return i.call(n)},f={ready:"discordReady",message:"discordMessage",disconnected:"discordDisconnected"},p=/<@!(\d+)>/i,y=function(e){function t(e){var n=e.token,i=e.botId,c=e.username;r(this,t);var s=o(this,Object.getPrototypeOf(t).apply(this,arguments));return s.channels={},s.discordReady=function(){s.status=a.Adapter.STATUS.CONNECTED,s.bot.emitter.emit("connected",s.id),s.bot.log.notice("Connected to Discord."),s.client.setPlayingGame("Exobotting")},s.discordDisconnected=function(){s.status=a.Adapter.STATUS.DISCONNECTED,s.bot.log.critical("Disconnected from Discord.")},s.botId=i,s.username=c,s.token=n,s}return i(t,e),d(t,[{key:"register",value:function(e){var n=this;l(Object.getPrototypeOf(t.prototype),"register",this).apply(this,arguments);var r=this.token,o=this.botId,i=this.username;return r&&o&&i?(this.client=new s.a.Client({autoReconnect:!0}),Object.keys(f).forEach(function(e){var t=n[f[e]];n.client.on(e,function(){return t.bind(n).apply(void 0,arguments)}),n.client.on(e,function(){for(var t,r=arguments.length,o=Array(r),i=0;i<r;i++)o[i]=arguments[i];(t=n.bot.emitter).emit.apply(t,["discord-"+e].concat(o))})}),void this.client.loginWithToken(r)):(this.status=a.Adapter.STATUS.ERROR,void e.log.error("token, botId, and username are required to connect to discord."))}},{key:"send",value:function(e){this.bot.log.debug("Sending "+e.text+" to "+e.channel),this.client.stopTyping(channel),this.client.sendMessage(e.channel,e.text)}},{key:"discordMessage",value:function(e){var n=e.channel,r=(e.server,e.author),o=e.cleanContent;if(r.username!==this.username){this.client.startTyping(n);var i=new a.User(r.username,r.id);return n instanceof s.a.TextChannel?l(Object.getPrototypeOf(t.prototype),"receiveWhisper",this).call(this,{user:i,text:message,channel:n}):void this.receive({user:i,text:o,channel:n})}}},{key:"discordPresence",value:function(e,n,r,o,i){if(n!==this.botId){var c=new a.User(e,n);if("online"===r)return l(Object.getPrototypeOf(t.prototype),"enter",this).call(this,{user:c,channel:i.d.channel_id});if("offline"===r)return l(Object.getPrototypeOf(t.prototype),"leave",this).call(this,{user:c,channel:i.d.channel_id})}}}]),t}(a.Adapter)}])});
//# sourceMappingURL=discord.js.map