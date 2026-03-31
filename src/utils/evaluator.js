export function hashUser(userId) {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = (hash << 5) - hash + userId.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function isFeatureEnabled(flag, userId) {
  if (!flag.is_enabled) return false;

  if (
    flag.target_users &&
    Array.isArray(flag.target_users) &&
    flag.target_users.includes(userId)
  ) {
    return true;
  }

  // Percentage rollout
  const hash = hashUser(userId);
  return hash % 100 < flag.rollout_percentage;
}