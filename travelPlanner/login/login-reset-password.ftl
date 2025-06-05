<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${msg("resetPasswordTitle")} | Travel Itinerary Planner</title>
    <link rel="stylesheet" href="${url.resourcesPath}/css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
<h1>Travel Itinerary Planner</h1>
<div class="auth-form">
    <h2>${msg("resetPasswordTitle")}</h2>

    <#if message?has_content>
        <div class="alert <#if message.type = 'error'>alert-error<#else>alert-success</#if>">
            <i class="fas <#if message.type = 'error'>fa-exclamation-circle<#else>fa-check-circle</#if> alert-icon"></i>
            ${message.summary}
        </div>
    </#if>

    <form id="kc-reset-password-form" action="${url.loginAction}" method="post">
        <div class="field">
            <label for="username">${msg("usernameOrEmail")}</label>
            <input id="username" name="username" type="text" autofocus
                   value="${(auth.attemptedUsername!'')}"
                   aria-invalid="<#if message?has_content && message.type = 'error'>true<#else>false</#if>"
                   <#if message?has_content && message.type = 'error'>class="error"</#if> />
        </div>

        <div class="field">
            <button type="submit" id="kc-reset-password">${msg("resetPassword")}</button>
        </div>

        <div class="register-link">
            <a href="${url.loginUrl}">${msg("backToLogin")}</a>
        </div>
    </form>
</div>
</body>
</html>