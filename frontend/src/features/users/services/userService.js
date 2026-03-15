import { drogonClient } from "../../../api/client";

export const userService = {
    // Matches your UserRest signup endpoint
    signup: async (username, email, password) => {
        return await drogonClient("users", {
            method: "POST",
            body: JSON.stringify({
                username,
                email,
                password, // C++ backend will handle the hashing
            }),
        });
    },

    // Gets profile info (username, email) for the logged-in user
    getProfile: async () => {
        return await drogonClient("user/profile", {
            method: "GET",
        });
    },
};
