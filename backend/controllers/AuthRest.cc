#include "AuthRest.h"
#include "plugins/SodiumPlugin.h"

// POST /auth/login
void AuthRest::login(const HttpRequestPtr &req,
                     std::function<void(const HttpResponsePtr &)> &&callback)
{
    auto json = req->getJsonObject();
    if (!json) {
        callback(drogon::HttpResponse::newHttpStatusCode(drogon::k400BadRequest));
        return;
    }

    std::string email = json->get("email", "").asString();
    std::string password = json->get("password", "").asString();

    auto dbClient = drogon::app().getDbClient();
    dbClient->execSqlAsync(
        "SELECT id, password_hash FROM Users WHERE email = $1",
        [callback, password](const drogon::orm::Result &res) {
            if (res.size() > 0) {
                auto *sodium = drogon::app().getPlugin<SodiumPlugin>();
                std::string storedHash = res[0]["password_hash"].as<std::string>();

                if (sodium->verifyPassword(password, storedHash)) {
                    Json::Value ret;
                    ret["token"] = "jwt_token_example"; 
                    callback(drogon::HttpResponse::newHttpJsonResponse(ret));
                    return;
                }
            }
            callback(drogon::HttpResponse::newHttpStatusCode(drogon::k401Unauthorized));
        },
        [callback](const drogon::orm::DrogonDbException &e) {
            callback(drogon::HttpResponse::newHttpStatusCode(drogon::k500InternalServerError));
        },
        email);
}

// POST /auth/logout
void AuthRest::logout(const HttpRequestPtr &req,
                      std::function<void(const HttpResponsePtr &)> &&callback)
{
    // In stateless JWT, logout is often handled client-side by deleting the token.
    // If using server-side sessions or a blacklist:
    Json::Value ret;
    ret["result"] = "logged_out";
    callback(drogon::HttpResponse::newHttpJsonResponse(ret));
}