import { drogonClient } from "../../../api/client";

export const restaurantService = {
    getAll: async () => {
        return await drogonClient("restaurants", {
            method: "GET",
        });
    },
};