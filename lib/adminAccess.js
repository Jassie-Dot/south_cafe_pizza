const localHostnames = new Set(["localhost", "127.0.0.1", "::1", "[::1]", "0.0.0.0"]);

export function getConfiguredAdminPin() {
  return process.env.ADMIN_PIN || process.env.NEXT_PUBLIC_ADMIN_PIN || "";
}

function getRequestHostname(request) {
  try {
    const url = new URL(request.url);
    if (url.hostname) {
      return url.hostname.toLowerCase();
    }
  } catch {
    // Fall back to headers below.
  }

  const rawHost =
    request.headers.get("x-forwarded-host") || request.headers.get("host") || "";
  const firstHost = rawHost.split(",")[0].trim().toLowerCase();

  return firstHost.replace(/:\d+$/, "");
}

export function isLocalAdminRequest(request) {
  const hostname = getRequestHostname(request);
  return localHostnames.has(hostname) || hostname.endsWith(".localhost");
}

export function requestRequiresAdminPin(request) {
  if (getConfiguredAdminPin()) {
    return true;
  }

  return process.env.NODE_ENV === "production" && !isLocalAdminRequest(request);
}

export function hasAdminWriteAccess(request, bodyOrPin) {
  const adminPin = getConfiguredAdminPin();

  if (!adminPin) {
    return !requestRequiresAdminPin(request);
  }

  const suppliedPin = typeof bodyOrPin === "string" ? bodyOrPin : bodyOrPin?.pin;
  return (request.headers.get("x-admin-pin") || suppliedPin || "") === adminPin;
}
