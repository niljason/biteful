import { drogonClient } from "../../../api/client";

export const restaurantService = {
    getAll: async () => {
        return await drogonClient(`restaurants?limit=30000`, {
            method: "GET",
        });
    },

    getByZipcode: async (zipcode) => {
        return await drogonClient(`restaurants?zipcode=${encodeURIComponent(zipcode)}`, {
            method: "GET",
        });
    },
};