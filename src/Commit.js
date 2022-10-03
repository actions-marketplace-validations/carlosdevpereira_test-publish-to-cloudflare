/**
 * Represents a commit inside a repository
 */
export default class Commit {
  constructor(hash, repository) {
    this.hash = hash;
    this.repository = repository;
  }

  /**
     *  Returns the short version of the commit hash.
     * (The first 7 characters)
     */
  shortHash() {
    return this.hash.slice(0, 7);
  }
}