const KEY = "limbahin_worker";

export function saveWorker(worker) {
  localStorage.setItem(KEY, JSON.stringify(worker));
}

export function getWorker() {
  try {
    return JSON.parse(localStorage.getItem(KEY));
  } catch {
    return null;
  }
}

export function clearWorker() {
  localStorage.removeItem(KEY);
}