const actions = {
  runTests: jest.fn(),
  publishToCloudflare: jest.fn(),
  commentOnAvailablePullRequests: jest.fn()
};

jest.mock('@actions/core', () => ({
  getInput: jest.fn(),
  startGroup: jest.fn(),
  endGroup: jest.fn(),
  setFailed: jest.fn()
}));

jest.mock('../src/Action', () =>  jest.fn(() => {
  return {
    runTests: actions.runTests,
    publishToCloudflare: actions.publishToCloudflare,
    commentOnAvailablePullRequests: actions.commentOnAvailablePullRequests
  };
}));

const core = require('@actions/core');
const GithubAction = require('../src/Action');

const setupEnvironmentVariables = () => {
  process.env['INPUT_GITHUBTOKEN'] = '1234';
  process.env['INPUT_BRANCHNAME'] = 'master';
  process.env['INPUT_CLOUDFLAREPROJECTNAME'] = 'my-cloudflare-project';
  process.env['INPUT_CLOUDFLAREAPITOKEN'] = 'cloudflare-api-token';
  process.env['INPUT_CLOUDFLAREACCOUNTID'] = 'cloudflare-account-id';
};

describe('Action Setup', () => {
  describe('Requirements', () => {
    beforeAll(() => {
      setupEnvironmentVariables();

      require('../src/index');
    });

    it('checks if a github token was defined', () => {
      expect(core.getInput).toHaveBeenCalledWith('githubToken', { required: true });
    });

    it('checks if the head branch name was defined', () => {
      expect(core.getInput).toHaveBeenCalledWith('branchName', { required: true });
    });

    it('checks if the cloudflare project name was defined', () => {
      expect(core.getInput).toHaveBeenCalledWith('cloudflareProjectName', { required: true });
    });

    it('checks if the cloudflare api token was defined', () => {
      expect(core.getInput).toHaveBeenCalledWith('cloudflareApiToken', { required: true });
    });

    it('checks if the cloudflare account id was defined', () => {
      expect(core.getInput).toHaveBeenCalledWith('cloudflareAccountId', { required: true });
    });
  });

  describe('Runs the action', () => {
    beforeAll(async () => {
      setupEnvironmentVariables();

      await require('../src/index').run();
    });

    it('initializes the github action instance', () => {
      expect(GithubAction).toHaveBeenCalled();
    });

    it('runs the unit tests of the project', () => {
      expect(actions.runTests).toHaveBeenCalled();
    });

    it('publishes the results to cloudflare', () => {
      expect(actions.publishToCloudflare).toHaveBeenCalled();
    });

    it('comments the results in available pull requests', () => {
      expect(actions.commentOnAvailablePullRequests).toHaveBeenCalled();
    });
  });
});