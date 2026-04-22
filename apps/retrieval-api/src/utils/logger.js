export function logInfo(message, data = null) {
  if (data) {
    console.log(`[INFO] ${message}`, data);
    return;
  }

  console.log(`[INFO] ${message}`);
}

export function logError(message, error = null) {
  if (error) {
    console.error(`[ERROR] ${message}`, error);
    return;
  }

  console.error(`[ERROR] ${message}`);
}