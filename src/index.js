const core = require('@actions/core');
const github = require('@actions/github');
const GithubAction = require('./Action');

// 🚀 Execute Github Action
(async () => {
  try {
    const Action = new GithubAction(github.context, {
      cloudflare: {
        accountId: core.getInput('cloudflareAccountId', {
          required: true,
        }),
        apiToken: core.getInput('cloudflareApiToken', {
          required: true,
        }),
        baseUrl: core.getInput('baseCloudflareDeploymentUrl'),
        projectName: core.getInput('cloudflareProjectName', {
          required: true,
        }),
      },
      github: {
        branch: core.getInput('branchName', {
          required: true,
        }),
        token: core.getInput('githubToken', {
          required: true,
        }),
      },
      testing: {
        framework: core.getInput('framework'),
      },
    });

    core.startGroup('Running Jest Tests...');
    await Action.runTests();
    core.endGroup();

    core.startGroup('Uploading to Cloudflare Pages...');
    await Action.publishToCloudflare();
    core.endGroup();

    core.startGroup('Comment on available Pull Requests...');
    await Action.commentOnAvailablePullRequests();
    core.endGroup();
  } catch (error) {
    core.setFailed(error.message);
  }
})();