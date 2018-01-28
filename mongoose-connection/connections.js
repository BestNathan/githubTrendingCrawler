const MongooseConnector = require("./mongooseMutiple");
const Schema = MongooseConnector.Schema;

const GITHUB_COLLECTION_NAME = "githubTrending";

const GITHUB_MODEL_NAME = "Repo";

const trendingReposSchema = new Schema(
  {
    repo: { type: String },
    href: { type: String },
    description: { type: String },
    allStars: { type: Number },
    increaseStars: { type: Number }
  },
  {
    _id: false
  }
);

const trendingLanguageSchema = new Schema(
  {
    language: { type: String },
    repos: [trendingReposSchema]
  },
  {
    _id: false
  }
);

const githubTrendingSchema = new Schema({
  collectTime: { type: String, index: true, unique: true },
  languageRepos: [trendingLanguageSchema]
});
const githubTrendingConnection = new MongooseConnector(GITHUB_COLLECTION_NAME);
githubTrendingConnection.initSchema(GITHUB_MODEL_NAME, githubTrendingSchema);

module.exports = githubTrendingConnection;
