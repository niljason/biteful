#pragma once
#include <drogon/HttpFilter.h>

#include <string>

class CorsFilter : public drogon::HttpFilter<CorsFilter, false>  // Added 'false' here
{
public:
    // This is the string name used in METHOD_ADD
    static constexpr char name[] = "CorsFilter";

    void doFilter(const drogon::HttpRequestPtr& req, drogon::FilterCallback&& fcb,
                  drogon::FilterChainCallback&& fccb) override {
        if (req->method() == drogon::Options) {
            auto resp = drogon::HttpResponse::newHttpResponse();
            resp->setStatusCode(drogon::k204NoContent);
            resp->addHeader("Access-Control-Allow-Origin", "*");
            resp->addHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            resp->addHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
            fcb(resp);
            return;
        }
        fccb();
    }
};
