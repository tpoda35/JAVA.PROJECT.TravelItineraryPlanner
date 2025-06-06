<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${msg("emailVerifyTitle")} | Travel Itinerary Planner</title>
    <link rel="stylesheet" href="${url.resourcesPath}/css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
<h1>Travel Itinerary Planner</h1>
<div class="auth-form">
    <h2>${msg("emailVerifyTitle")}</h2>

    <#if message?has_content>
        <div class="alert <#if message.type = 'error'>alert-error<#else>alert-success</#if>">
            <i class="fas <#if message.type = 'error'>fa-exclamation-circle<#else>fa-check-circle</#if> alert-icon"></i>
            ${message.summary}
        </div>
    </#if>

    <div class="field">
        <p>${msg("emailVerifyInstruction1")}</p>
        <p>${msg("emailVerifyInstruction2")}</p>
    </div>

    <div class="field">
        <a href="${url.loginAction}" class="btn btn-primary">${msg("resendEmail")}</a>
    </div>

    <div class="register-link">
        <a href="${url.loginUrl}">${msg("backToLogin")}</a>
    </div>
</div>
</body>
</html>