require("source-map-support").install();require("regenerator-runtime/runtime");
(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

module.exports = require("@exoplay/exobot");

/***/ },
/* 1 */
/***/ function(module, exports) {

module.exports = require("discord.js");

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_discord_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_discord_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_discord_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__exoplay_exobot__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__exoplay_exobot___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__exoplay_exobot__);
/* harmony export (binding) */ __webpack_require__.d(exports, "default", function() { return DiscordAdapter; });
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || !1; descriptor.configurable = !0; if ("value" in descriptor) descriptor.writable = !0; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === void 0) { var parent = Object.getPrototypeOf(object); if (parent === null) { return; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === void 0) { return; } return getter.call(receiver); } };

var _class, _temp;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg), value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: !1, writable: !0, configurable: !0 } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }





const EVENTS = {
  ready: 'discordReady',
  message: 'discordMessage',
  //presence: 'discordPresence',
  reconnecting: 'discordReconnecting'
};
/* harmony export (immutable) */ exports["EVENTS"] = EVENTS;


const DISCORD_MENTION_REGEX = /<@!(\d+)>/i;
/* harmony export (immutable) */ exports["DISCORD_MENTION_REGEX"] = DISCORD_MENTION_REGEX;


let DiscordAdapter = (_temp = _class = function (_Adapter) {
  _inherits(DiscordAdapter, _Adapter);

  function DiscordAdapter({ token, botId, username, adapterName, roleMapping }) {
    _classCallCheck(this, DiscordAdapter);

    var _this = _possibleConstructorReturn(this, (DiscordAdapter.__proto__ || Object.getPrototypeOf(DiscordAdapter)).apply(this, arguments));

    _this.channels = {};

    _this.discordReady = () => {
      _this.status = __WEBPACK_IMPORTED_MODULE_1__exoplay_exobot__["Adapter"].STATUS.CONNECTED;

      _this.bot.emitter.emit('connected', _this.name);
      _this.bot.log.notice('Connected to Discord.');
      _this.client.user.game = 'Exobotting';

      _this.client.guilds.forEach(s => {
        s.member(_this.client.user).nickname = _this.bot.name;
      });
    };

    _this.discordReconnecting = () => {
      _this.status = __WEBPACK_IMPORTED_MODULE_1__exoplay_exobot__["Adapter"].STATUS.DISCONNECTED;
      _this.bot.log.critical('Reconnecting to Discord.');
    };

    _this.name = adapterName || _this.name;
    _this.botId = botId;
    _this.username = username;
    _this.token = token;
    return _this;
  }

  _createClass(DiscordAdapter, [{
    key: 'register',
    value: function register(bot) {
      _get(DiscordAdapter.prototype.__proto__ || Object.getPrototypeOf(DiscordAdapter.prototype), 'register', this).apply(this, arguments);
      const { token, botId, username } = this;

      if (!token || !botId || !username) {
        this.status = __WEBPACK_IMPORTED_MODULE_1__exoplay_exobot__["Adapter"].STATUS.ERROR;
        bot.log.error('token, botId, and username are required to connect to discord.');
        return;
      }

      this.client = new __WEBPACK_IMPORTED_MODULE_0_discord_js___default.a.Client();
      Object.keys(EVENTS).forEach(discordEvent => {
        const mappedFn = this[EVENTS[discordEvent]];
        this.client.on(discordEvent, (...args) => mappedFn.bind(this)(...args));
        this.client.on(discordEvent, (...args) => {
          this.bot.emitter.emit(`discord-${ discordEvent }`, ...args);
        });
      });

      this.client.login(token);
    }
  }, {
    key: 'send',
    value: function send(message) {
      this.bot.log.debug(`Sending ${ message.text } to ${ message.channel }`);
      message.channel.sendMessage(message.text);
    }
  }, {
    key: 'getUserIdByUserName',
    value: (() => {
      var _ref = _asyncToGenerator(function* (name) {
        const user = this.client.users.find('username', name);
        if (user) {
          let botUser;
          try {
            botUser = yield this.getUser(user.id, user.username, user);
          } catch (err) {
            this.bot.log.warn(err);
          }
          return botUser.id;
        }
      });

      function getUserIdByUserName(_x) {
        return _ref.apply(this, arguments);
      }

      return getUserIdByUserName;
    })()
  }, {
    key: 'getRoleIdByRoleName',
    value: function getRoleIdByRoleName(name, message) {
      const role = message.channel.guild.roles.find('name', name);
      if (role) {
        return role.id;
      }
    }
  }, {
    key: 'getRolesForUser',
    value: function getRolesForUser(userId) {
      if (this.roleMapping && this.adapterUsers && this.adapterUsers[userId]) {
        return this.adapterUsers[userId].roles.filter(role => this.roleMapping[role]).map(role => this.roleMapping[role]);
      }

      return [];
    }
  }, {
    key: 'discordMessage',
    value: (() => {
      var _ref2 = _asyncToGenerator(function* ({ channel, guild, author, content, member }) {
        if (author.username === this.username) {
          return;
        }
        this.bot.log.debug(content);

        const user = yield this.getUser(author.id, author.username, member || author);

        // if it's a whisper, the channel is in directMessages
        if (channel.type === 'dm') {
          return _get(DiscordAdapter.prototype.__proto__ || Object.getPrototypeOf(DiscordAdapter.prototype), 'receiveWhisper', this).call(this, { user, text: content, channel });
        }

        this.receive({ user, text: content, channel });
      });

      function discordMessage(_x2) {
        return _ref2.apply(this, arguments);
      }

      return discordMessage;
    })()
  }, {
    key: 'getRoles',
    value: function getRoles(adapterUserId, adapterUser) {
      if (adapterUser.roles) {
        return adapterUser.roles.map(role => role.name);
      }

      return !1;
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

  }]);

  return DiscordAdapter;
}(__WEBPACK_IMPORTED_MODULE_1__exoplay_exobot__["Adapter"]), _class.type = 'discord', _temp);


/***/ }
/******/ ])));
//# sourceMappingURL=discord.js.map