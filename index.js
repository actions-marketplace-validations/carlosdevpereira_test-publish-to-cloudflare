import core from '@actions/core';
import github from '@actions/github';
import GithubAction from './src/index';

// 🚀 Execute Github Action
(async () => {
  try {
    const Action = new GithubAction(github.context, {
      testing: {
        framework: core.getInput('framework')
      },
      github: {
        token: core.getInput('githubToken', { required: true }),
        branch: core.getInput('branchName', { required: true })
      },
      cloudflare: {
        projectName: core.getInput('cloudflareProjectName', { required: true }),
        apiToken: core.getInput('cloudflareApiToken', { required: true }),
        accountId: core.getInput('cloudflareAccountId', { required: true }),
        baseUrl: core.getInput('baseCloudflareDeploymentUrl')
      }
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