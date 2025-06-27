import { AnalyticsBrowser } from "@segment/analytics-next";

export const analytics = new AnalyticsBrowser();
analytics.load({
  writeKey: process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY || "nMvK8bwb1KWdWHVmq1S4CUsT7c2uHLEh",
});

export const getOSInfo = () => {
  const platform = navigator.platform.toLowerCase()
  const userAgent = navigator.userAgent.toLowerCase()

  if (platform.includes("win"))
    return { name: "Windows", version: getOSVersion(userAgent, "windows") }
  if (platform.includes("mac"))
    return { name: "MacOS", version: getOSVersion(userAgent, "mac os x") }
  if (platform.includes("linux"))
    return { name: "Linux", version: getOSVersion(userAgent, "linux") }
  if (/android/.test(userAgent))
    return { name: "Android", version: getOSVersion(userAgent, "android") }
  if (/iphone|ipad|ipod/.test(userAgent))
    return { name: "iOS", version: getOSVersion(userAgent, "iphone os") }

  return { name: "Unknown", version: "Unknown" }
}

export const getOSVersion = (userAgent: any, osName: any) => {
  const match = userAgent.match(new RegExp(`${osName} ([\\d._]+)`, "i"))
  return match ? match[1].replace(/_/g, ".") : "Unknown"
}

export function getDeviceType() {
  const ua = navigator.userAgent
  if (/Mobile|Android|iPhone|iPad|iPod/i.test(ua)) return "mobile"
  if (/Tablet|iPad/i.test(ua)) return "tablet"
  return "desktop"
}
  