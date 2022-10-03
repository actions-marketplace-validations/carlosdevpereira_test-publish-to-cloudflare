import core from '@actions/core'
import github from '@actions/github'
import GithubAction from './src/index'

// 🚀 Execute Github Action
(async () => {
  try {
    await new GithubAction(github.context)
      .runTests()
      .publishToCloudflare()
      .commentOnAvailablePullRequests()

  } catch (error) {
    core.setFailed(error.message)
  }
})()