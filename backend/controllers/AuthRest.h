#pragma once

#include <drogon/HttpController.h>

class AuthRest : public drogon::HttpController<AuthRest>
{
  public:
    METHOD_LIST_BEGIN
    // POST /auth/login
    METHOD_ADD(AuthRest::login, "/login", Post, "CorsFilter");
    // POST /auth/logout
    METHOD_ADD(AuthRest::logout, "/logout", Post, "CorsFilter");
    METHOD_LIST_END

    void login(const HttpRequestPtr &req,
               std::function<void(const HttpResponsePtr &)> &&callback);

    void logout(const HttpRequestPtr &req,
                std::function<void(const HttpResponsePtr &)> &&callback);
};