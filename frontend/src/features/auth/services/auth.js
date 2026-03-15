import { drogonClient } from "../../../api/client";

const auth = {
    login: async (username, password) => {
        const options = {
            method: "POST",
            body: JSON.stringify({
                username: username,
                password: password,
            }),
            // accepts cookies from response
            credentials: "include",
        };
        const data = await drogonClient("auth", options);
        return data;
    },

    // clears cookie
    logout: async (sessionId) => {
        const options = {
            credentials: "include",
            method: "DELETE",
        };
        const data = await fetch(
            import.meta.env.VITE_API_ENDPOINT + "auth/" + sessionId,
            options,
        );
        return data;
    },
};

export default auth;
