#pragma once
#include <drogon/HttpController.h>

class FoodPantry : public drogon::HttpController<FoodPantry> {
public:
    METHOD_LIST_BEGIN
    ADD_METHOD_TO(FoodPantry::getPantryById, "/pantries/{id}", drogon::Get);
    ADD_METHOD_TO(FoodPantry::getAllPantries, "/pantries", drogon::Get);
    METHOD_LIST_END

    void getPantryById(const drogon::HttpRequestPtr& req,
                       std::function<void(const drogon::HttpResponsePtr&)>&& callback, int id);
    void getAllPantries(const drogon::HttpRequestPtr& req,
                        std::function<void(const drogon::HttpResponsePtr&)>&& callback);
};