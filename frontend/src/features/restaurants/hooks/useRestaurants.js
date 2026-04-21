import { startTransition, useCallback, useState } from 'react';
import { restaurantService } from '../services/restaurantService';

const transformRestaurants = (rawData) =>
    rawData
        .filter(item => {
            const lat = parseFloat(item.latitude);
            const lng = parseFloat(item.longitude);
            return !isNaN(lat) && !isNaN(lng);
        })
        .map(item => {
            const parts = [item.building, item.street, item.boro, item.zipcode ? `NY ${item.zipcode}` : null];
            const address = parts.filter(Boolean).join(', ');
            return {
                id: item.camis,
                name: item.name?.trim() || "Unknown Restaurant",
                address,
                latitude: parseFloat(item.latitude),
                longitude: parseFloat(item.longitude),
                zipcode: item.zipcode?.trim() || "",
                boro: item.boro?.trim() || "",
                cuisine: item.cuisine?.trim() || "",
                phone: item.phone?.trim() || "",
                grade: item.grade?.trim() || "",
                inspection_date: item.inspection_date || null,
            };
        });

let allRestaurantsCache = null;
let allRestaurantsPromise = null;
const restaurantsByZipcodeCache = new Map();

const cacheRestaurants = (restaurants) => {
    allRestaurantsCache = restaurants;
    restaurantsByZipcodeCache.clear();

    for (const restaurant of restaurants) {
        const zipcode = restaurant.zipcode;
        if (!zipcode) continue;

        const cachedList = restaurantsByZipcodeCache.get(zipcode);
        if (cachedList) {
            cachedList.push(restaurant);
        } else {
            restaurantsByZipcodeCache.set(zipcode, [restaurant]);
        }
    }

    return restaurants;
};

const getAllRestaurants = async () => {
    if (allRestaurantsCache) return allRestaurantsCache;

    if (!allRestaurantsPromise) {
        allRestaurantsPromise = restaurantService
            .getAll()
            .then(transformRestaurants)
            .then(cacheRestaurants)
            .finally(() => {
                allRestaurantsPromise = null;
            });
    }

    return allRestaurantsPromise;
};

export const useRestaurants = () => {
    const [state, setState] = useState({
        restaurants: [],
        loading: false,
        error: null
    });

    const fetchAll = useCallback(async () => {
        if (allRestaurantsCache) {
            startTransition(() => {
                setState({
                    restaurants: allRestaurantsCache,
                    loading: false,
                    error: null
                });
            });
            return;
        }

        setState(prev => ({ ...prev, loading: true, error: null }));
        try {
            const restaurants = await getAllRestaurants();
            startTransition(() => {
                setState({
                    restaurants,
                    loading: false,
                    error: null
                });
            });
        } catch (err) {
            console.error("Failed to load all restaurants:", err);
            setState(prev => ({
                ...prev,
                loading: false,
                error: "Failed to load the full restaurant map."
            }));
        }
    }, []);

    const fetchByZipcode = useCallback(async (zipcode) => {
        if (restaurantsByZipcodeCache.has(zipcode)) {
            startTransition(() => {
                setState({
                    restaurants: restaurantsByZipcodeCache.get(zipcode),
                    loading: false,
                    error: null
                });
            });
            return;
        }

        setState(prev => ({ ...prev, loading: true, error: null }));
        try {
            if (allRestaurantsCache) {
                const restaurants = allRestaurantsCache.filter(restaurant =>
                    restaurant.zipcode === zipcode
                );
                restaurantsByZipcodeCache.set(zipcode, restaurants);
                startTransition(() => {
                    setState({ restaurants, loading: false, error: null });
                });
                return;
            }

            const rawData = await restaurantService.getByZipcode(zipcode);
            const restaurants = transformRestaurants(rawData);
            restaurantsByZipcodeCache.set(zipcode, restaurants);
            startTransition(() => {
                setState({ restaurants, loading: false, error: null });
            });
        } catch (err) {
            console.error("Failed to load restaurants:", err);
            setState({
                restaurants: [],
                loading: false,
                error: err.message || "Failed to fetch restaurant data"
            });
        }
    }, []);

    return { ...state, fetchAll, fetchByZipcode };
};
