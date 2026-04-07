#include "FoodPantry.h"

#include <drogon/HttpAppFramework.h>
#include <drogon/HttpResponse.h>
#include <drogon/orm/Mapper.h>

#include "../models/FoodPantries.h"

using namespace drogon;
using namespace drogon::orm;

void FoodPantry::getPantryById(const HttpRequestPtr& req, std::function<void(const HttpResponsePtr&)>&& callback,
                               int id) {
    auto dbClient = drogon::app().getDbClient();
    Mapper<drogon_model::biteful::FoodPantries> mapper(dbClient);

    // Drogon's Mapper handles the async/sync flow.
    // findByPrimaryKey can throw if not found.
    try {
        auto pantry = mapper.findByPrimaryKey(id);

        // Use the model's built-in toJson() to avoid manual assignment
        auto resp = HttpResponse::newHttpJsonResponse(pantry.toJson());
        callback(resp);
    } catch (const UnexpectedRows& e)  // Specifically catch '0 rows found'
    {
        Json::Value error;
        error["error"] = "Food pantry not found";
        auto resp = HttpResponse::newHttpJsonResponse(error);
        resp->setStatusCode(k404NotFound);
        callback(resp);
    } catch (const DrogonDbException& e) {
        LOG_ERROR << "DB Error: " << e.base().what();
        auto resp = HttpResponse::newHttpResponse();
        resp->setStatusCode(k500InternalServerError);
        callback(resp);
    }
}

void FoodPantry::getAllPantries(const HttpRequestPtr& req,
                                std::function<void(const HttpResponsePtr&)>&& callback) {
    auto dbClient = drogon::app().getDbClient();

    drogon::orm::Mapper<drogon_model::biteful::FoodPantries> mapper(dbClient);

    try {
        auto pantries = mapper.findAll();

        LOG_INFO << "Found " << pantries.size() << " rows in database.";

        Json::Value jsonArray(Json::arrayValue);
        for (const auto& pantry : pantries) {
            jsonArray.append(pantry.toJson());
        }

        auto resp = HttpResponse::newHttpJsonResponse(jsonArray);
        callback(resp);

    } catch (const DrogonDbException& e) {
        LOG_ERROR << "DB Error: " << e.base().what();
        auto resp = HttpResponse::newNotFoundResponse();  // Or a 500 error
        callback(resp);
    }
}