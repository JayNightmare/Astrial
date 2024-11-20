require('dotenv').config(); // * Keep me above REST

module.exports = {
  token: process.env.TEST_TOKEN,
  
  prefix: "A+",
  color: "#ec1efb",

  Mongo: process.env.MONGODB,

  ownerIDS: [process.env.DEV_ID_1, process.env.DEV_ID_2],

  vote: false,

  defaultTrackImage: process.env.TRACK_IMAGE_URL,
  setupBgLink: process.env.BG_IMAGE_IRL,

  invite: process.env.INVITE_LINK_1,
  inviteTwo: process.env.INVITE_LINK_2,
  inviteThree: process.env.INVITE_LINK_3,

  ssLink: process.env.SS_LINK,
  topGg: process.env.TOPGG_LINK,
  topgg_Api: process.env.TOPGG_API,

  noprefixLogWebhook: process.env.NOPREFIX_WH,
  cmd_log: process.env.CMD_WH,
  error_log: process.env.ERR_WH,
  blacklist_log: process.env.BLACKLIST_WH,
  join_log: process.env.JOIN_WH,
  leave_log: process.env.LEAVE_WH,

  spotiId: process.env.SPOT_ID,
  spotiSecret: process.env.SPOT_SECRET,
  nodes: [
    {
      name: process.env.NAME_SERVER_S,
      url: process.env.URL_SERVER_S,
      auth: process.env.AUTH_SERVER_S,
      secure: process.env.SECURE_SERVER_S,
      // name: process.env.NAME_SERVER_N,
      // url: process.env.URL_SERVER_N,
      // auth: process.env.AUTH_SERVER_N,
    },
  ],
};