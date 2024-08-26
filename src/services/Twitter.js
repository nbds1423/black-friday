const axios = require('axios').default;
const { VARIABLES, FEATURES } = require('../utils/constants');
const { add_product } = require('../database/Product');
const Database = require('../database/Database');
const moment = require('moment');

module.exports = class Twitter {

  #_instance;

  constructor() {

    this.#_instance = axios.create({
      baseURL: 'https://twitter.com/i/api/graphql/VgitpdpNZ-RUIp5D1Z_D-A',
      headers: {
        "Cookie": process.env.COOKIE,
        "x-csrf-token": process.env.TOKEN,
        "Authorization": process.env.BEARER
      }
    });

    this.run();
  };

  variables(userId) {
    VARIABLES.userId = userId
    return encodeURIComponent(JSON.stringify(VARIABLES));
  }

  async run() {
    const ids = await Database.users;
    ids.map(async (i) => {
      try {
        const { data } = await this.#_instance.get(`/UserTweets?variables=${this.variables(i)}&features=${FEATURES}`);
        const entries = this.entries(data);
        this.tweets(entries);
      } catch (e) {
        if (e.response?.status == 429) return console.error('rate limit');
        console.error(e);
      }
    });
  }

  async tweets(entries) {
    const obj = [];

    await Promise.all(
      entries
        .filter((twitter) => {
          if (twitter.entryId.split('-')[0] !== 'tweet') return false;
          const { full_text } = twitter.content.itemContent.tweet_results.result.legacy;
          return !(full_text.includes("RT") || !full_text.includes("R$"));
        })
        .map(async (twitter) => {
          const tweet = twitter.content.itemContent.tweet_results.result;
          const { screen_name, name } = tweet.core.user_results.result.legacy;
          const { full_text, entities, id_str, created_at } = tweet.legacy;

          obj.push({
            profile: {
              screen_name,
              name
            },
            text: full_text,
            price: this.price(full_text),
            media: this.media(entities),
            id: id_str,
            created_at,
            timestamp: this.sort(created_at),
            url: this.url(entities)
          });

        })
    );

    await add_product(obj);
  }

  entries(data) {
    const { instructions } = data.data.user.result.timeline_v2.timeline;
    return instructions[2]?.entries ? instructions[2].entries : instructions[1].entries;
  }

  price(text) {
    const price = text.match(/R\$\s*\d+,\d{2}/g);
    return price ?? ["R$ ??,??"];
  }

  media(tweet) {
    return tweet.media[0].media_url_https;
  }

  url(uri) {
    const { urls } = uri;
    return urls[0]?.display_url ? urls[0]?.display_url : urls[0]?.expanded_url;
  }

  sort(dateString) {
    const date = moment(dateString, 'ddd MMM DD HH:mm:ss ZZ YYYY', 'en');
    return date.valueOf();
  }

}