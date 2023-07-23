// storing activity logs
let activityLogs = [];

//render activity logs
function renderActivityLogs() {
  const activityLogList = document.getElementById('activityLogList');
  activityLogList.innerHTML = '';

  activityLogs.forEach((log) => {
    const li = document.createElement('li');
    li.textContent = log;
    activityLogList.appendChild(li);
  });
}

// log an activity
function logActivity(activity) {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleString();
  const logEntry = `[${formattedDate}] ${activity}`;
  activityLogs.push(logEntry);
  renderActivityLogs();

   updateActivityLogsLocalStorage();
}

// update the local storage with activity logs
function updateActivityLogsLocalStorage() {
    localStorage.setItem('activityLogs', JSON.stringify(activityLogs));
  }

// fetch activity logs from local storage
function fetchActivityLogsFromLocalStorage() {
    const storedActivityLogs = localStorage.getItem('activityLogs');
    if (storedActivityLogs) {
      activityLogs = JSON.parse(storedActivityLogs);
      renderActivityLogs();
    }
  }
  // Fetch activity logs from local storage when the page is loaded
fetchActivityLogsFromLocalStorage();

// Clear the activity logs
function clearActivityLog() {
    activityLogs = [];
    renderActivityLogs();
    updateActivityLogsLocalStorage();
  }
