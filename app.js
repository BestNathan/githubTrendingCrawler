const { CrazyCrawler, Task } = require("crazy-crawler");
const Model = require("./selfModel");

const c = new CrazyCrawler({
  maxConnection: 5,
  maxTask: 0
});

const languages = ["", "javascript", "typescript"];

c.on("finish", res => {
  let obj = {
    collectTime: new Date().getTime() + "",
    languageRepos: res
  };
  new Model(obj).save().then(res => {
    console.log("push to mongoDB: ", res);
  });
  console.log("crawler work done");
});

c.on("progress", ({ index, all }) => {
  console.log(`${index}/${all}`);
});

c.on("begin", () => {
  console.log("crawl work begin");
});


c
  .functionalTask({
    name: "githubTrending",
    baseUrl: "https://github.com/trending/:language",
    handler: function githubTrendingHandler() {
      let $ = this.$;
      let items = $(
        "body > div:nth-child(4) > div.explore-pjax-container.container-lg.p-responsive.clearfix > div > div.col-md-9.float-md-left > div.explore-content > ol"
      ).children("li");
      let result = [];
      items.each(function(i, el) {
        let $$ = $(el);
        let repo = $$.find(".d-inline-block.col-9.mb-1 > h3 > a")
          .text()
          .trim();
        let href =
          "https://github.com" +
          $$.find(".d-inline-block.col-9.mb-1 > h3 > a").attr("href");
        let description = $$.find(".py-1 > p")
          .text()
          .trim();
        let allStars = $$.find(".f6.text-gray.mt-2 > a:nth-child(2)")
          .text()
          .trim();
        let increaseStars = $$.find(
          ".f6.text-gray.mt-2 > span.d-inline-block.float-sm-right"
        )
          .text()
          .trim()
          .match(/^[0-9]*[1-9][0-9]*/)[0];
        allStars = Number(allStars.replace(',',''))
        increaseStars = Number(increaseStars.replace(',',''))
        result.push({ repo, href, description, allStars, increaseStars });
      });
      if (!result.length) {
        return this
      }
      return {
        language: this.params.language || "All language",
        repos: result
      };
    },
    paramsConditions: {
      language: {
        setter: function(counter) {
          return languages[counter];
        },
        limit: counter => counter < 3
      }
    }
  })
  .exec({
    time: '*/3 * * * *',
    mode: "chain",
    sleep: 3000
  });
