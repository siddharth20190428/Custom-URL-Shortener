function getOSName(userAgent) {
  if (/windows/i.test(userAgent)) return "Windows";
  if (/macintosh|mac os x/i.test(userAgent)) return "macOS";
  if (/linux/i.test(userAgent)) return "Linux";
  if (/android/i.test(userAgent)) return "Android";
  if (/iphone|ipad|ipod/i.test(userAgent)) return "iOS";
  return "Other";
}

function getDeviceType(userAgent) {
  if (/mobile/i.test(userAgent)) return "Mobile";
  if (/tablet/i.test(userAgent)) return "Tablet";
  return "Desktop";
}

function formatClicksByDate(rows) {
  const clicksByDate = {};
  rows.forEach((row) => {
    const date = row.created_at.toISOString().split("T")[0];
    clicksByDate[date] = (clicksByDate[date] || 0) + 1;
  });
  return Object.entries(clicksByDate).map(([date, count]) => ({ date, count }));
}

function formatAnalyticsData(rows) {
  const osType = {};
  const deviceType = {};
  const uniqueClicks = new Set();

  rows.forEach((row) => {
    uniqueClicks.add(row.ip_address);

    // OS Type
    const osName = getOSName(row.user_agent);
    if (!osType[osName])
      osType[osName] = { osName, uniqueClicks: 0, uniqueUsers: new Set() };
    osType[osName].uniqueClicks++;
    osType[osName].uniqueUsers.add(row.ip_address);

    // Device Type
    const deviceName = getDeviceType(row.user_agent);
    if (!deviceType[deviceName])
      deviceType[deviceName] = {
        deviceName,
        uniqueClicks: 0,
        uniqueUsers: new Set(),
      };
    deviceType[deviceName].uniqueClicks++;
    deviceType[deviceName].uniqueUsers.add(row.ip_address);
  });

  return {
    uniqueClicks: uniqueClicks.size,
    osType: Object.values(osType).map((os) => ({
      osName: os.osName,
      uniqueClicks: os.uniqueClicks,
      uniqueUsers: os.uniqueUsers.size,
    })),
    deviceType: Object.values(deviceType).map((device) => ({
      deviceName: device.deviceName,
      uniqueClicks: device.uniqueClicks,
      uniqueUsers: device.uniqueUsers.size,
    })),
  };
}

module.exports = {
  getOSName,
  getDeviceType,
  formatClicksByDate,
  formatAnalyticsData,
};
