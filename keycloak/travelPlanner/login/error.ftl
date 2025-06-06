<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Error | Travel Itinerary Planner</title>
    <link rel="stylesheet" href="${url.resourcesPath}/css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
<h1>Travel Itinerary Planner</h1>
<div class="auth-form">
    <h2>Error</h2>

    <#if message?has_content>
        <div class="alert alert-error">
            <i class="fas fa-exclamation-circle alert-icon"></i>
            ${message.summary}
        </div>
    </#if>

    <#if actionUri?has_content>
        <div class="field">
            <a href="${actionUri}" class="btn btn-primary">${msg("backToApplication")}</a>
        </div>
    <#else>
        <div class="field">
            <a href="${url.loginUrl}" class="btn btn-primary">${msg("backToLogin")}</a>
        </div>
    </#if>

    <#if client?? && client.baseUrl?has_content>
        <div class="register-link">
            <a href="${client.baseUrl}">Back</a>
        </div>
    </#if>
</div>
</body>
</html>