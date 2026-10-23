const API_BASE_URL = (
    import.meta.env.VITE_DASHBOARD_API_URL || "http://localhost/dashboard-server/api"
).replace(/\/+$/, "");
const DASHBOARD_ID = 1;
const TOKEN_KEY = "dashboard-builder-access-token";

export function getAccessToken() {
    return sessionStorage.getItem(TOKEN_KEY);
}

function setAccessToken(token) {
    sessionStorage.setItem(TOKEN_KEY, token);
}

export function clearAccessToken() {
    sessionStorage.removeItem(TOKEN_KEY);
}

async function parseResponse(response) {
    let payload;
    try {
        payload = await response.json();
    } catch {
        throw new Error("The dashboard server returned invalid JSON.");
    }
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
        throw new Error("The dashboard server returned an invalid response.");
    }
    if (!response.ok) {
        if (response.status === 401) {
            clearAccessToken();
            window.dispatchEvent(new Event("dashboard-auth-expired"));
        }
        throw new Error(payload.error || `Dashboard API request failed (${response.status}).`);
    }
    return payload;
}

function authorizationHeaders(headers = {}) {
    const token = getAccessToken();
    return token ? { ...headers, Authorization: `Bearer ${token}` } : headers;
}

export async function loginDashboard(password) {
    const response = await fetch(`${API_BASE_URL}/auth.php`, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
    });
    const result = await parseResponse(response);
    if (typeof result.accessToken !== "string" || result.accessToken.length < 20) {
        throw new Error("The dashboard server returned an invalid access token.");
    }
    setAccessToken(result.accessToken);
}

export async function fetchDashboard() {
    const response = await fetch(
        `${API_BASE_URL}/dashboards.php?id=${DASHBOARD_ID}`,
        { headers: authorizationHeaders({ Accept: "application/json" }) }
    );
    const dashboard = await parseResponse(response);
    if (!Array.isArray(dashboard.elements)) {
        throw new Error("The dashboard server returned an invalid layout.");
    }
    return dashboard;
}

export async function saveDashboard(elements) {
    const response = await fetch(
        `${API_BASE_URL}/dashboards.php?id=${DASHBOARD_ID}`,
        {
            method: "PUT",
            headers: authorizationHeaders({
                Accept: "application/json",
                "Content-Type": "application/json",
            }),
            body: JSON.stringify({ elements, isPreview: true }),
        }
    );
    const result = await parseResponse(response);
    if (result.saved !== true) {
        throw new Error("The dashboard server did not confirm the save.");
    }
    return result;
}

export async function uploadDashboardImage(file) {
    const body = new FormData();
    body.append("image", file);

    const response = await fetch(`${API_BASE_URL}/upload.php`, {
        method: "POST",
        headers: authorizationHeaders({ Accept: "application/json" }),
        body,
    });
    const payload = await parseResponse(response);
    if (typeof payload.url !== "string" || typeof payload.fileName !== "string") {
        throw new Error("The dashboard server returned an invalid image upload response.");
    }

    return {
        ...payload,
        url: new URL(payload.url, `${API_BASE_URL}/`).toString(),
    };
}
