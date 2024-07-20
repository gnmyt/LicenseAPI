const API_VERSION = "v1";

export const request = async (url, method, body, headers) => {
    const response = await fetch(`/api/${API_VERSION}${url}`, {
        method: method,
        headers: {...headers, "Content-Type": "application/json"},
        body: JSON.stringify(body)
    });

    if (response.status === 401) throw new Error("Unauthorized");

    const rawData = await response.text();
    const data = rawData ? JSON.parse(rawData) : rawData.toString();

    if (data.code >= 300) throw data;

    if (!response.ok) throw data;

    return data;
}

export const sessionRequest = (url, method, token, body) => {
    return request(url, method, body, {"Authorization": `Bearer ${token}`});
}

export const getRequest = (url) => {
    return sessionRequest(url, "GET", localStorage.getItem("sessionToken"));
}

export const postRequest = (url, body) => {
    return sessionRequest(url, "POST", localStorage.getItem("sessionToken"), body);
}

export const putRequest = (url, body) => {
    return sessionRequest(url, "PUT", localStorage.getItem("sessionToken"), body);
}

export const deleteRequest = (url) => {
    return sessionRequest(url, "DELETE", localStorage.getItem("sessionToken"));
}

export const patchRequest = (url, body) => {
    return sessionRequest(url, "PATCH", localStorage.getItem("sessionToken"), body);
}