class FeatureClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.cache = {};
  }

  async fetchFlags(userId) {
    const res = await fetch(
      `${this.baseURL}/flags/evaluate?userId=${userId}`
    );

    const data = await res.json();

    this.cache[userId] = data;

    return data;
  }

  async isEnabled(flagKey, userId) {
    // Use cache if available
    if (this.cache[userId]) {
      return this.cache[userId][flagKey] || false;
    }

    const flags = await this.fetchFlags(userId);
    return flags[flagKey] || false;
  }
}

export default FeatureClient;