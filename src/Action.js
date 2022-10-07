const Commit = require('./Commit');
const Cloudflare = require('./Cloudflare');
const Repository = require('./Repository');
const core = require('@actions/core');

class GithubAction {
  constructor(context, config) {
    this.config = config;

    core.info('context: ' + JSON.stringify(context));
    core.info('config: ' + JSON.stringify(config));
    this.repository = new Repository(context.payload.repository.name, context.payload.repository.owner.login, config);
    this.commit = new Commit(context.sha, this.repository);

    this.testResults = null;
    this.coverageReportUrl = null;
  }

  async runTests() {
    this.testResults = await this.repository.testFramework.runTests();

    return this;
  }

  async publishToCloudflare() {
    const cloudflare = new Cloudflare(this.config.cloudflare);
    const commitShortHash = this.commit.shortHash();
    this.coverageReportUrl = await cloudflare.publish(commitShortHash);

    return this;
  }

  async commentOnAvailablePullRequests() {
    const pullRequests = await this.repository.getPullRequests();

    pullRequests.forEach(async pullRequest => {
      await this.repository.commentPullRequests(pullRequest, this.testResults, this.coverageReportUrl);
    });

    return this;
  }
}

module.exports = GithubAction;