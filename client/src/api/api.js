
const API_URL = "https://meditrack-app-6zj5.onrender.com";

export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const cleanEndpointPath = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  if (token && cleanEndpointPath !== "/login" && cleanEndpointPath !== "/register") {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const finalUrl = `${API_URL}${cleanEndpointPath}`;

  const response = await fetch(finalUrl, {
    ...options,
    headers,
  });

  if (response.status === 204) {
    return null;
  }

  // 🌟 FIX: Check response health safely before reading payload data
  if (!response.ok) {
    let errorMessage = "Request failed";
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch (e) {
      // Fallback if the error response isn't valid JSON
      try {
        errorMessage = await response.text();
      } catch (textErr) {}
    }
    throw new Error(errorMessage);
  }

  return response.json();
}
