<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${msg("infoTitle")} | Travel Itinerary Planner</title>
    <link rel="stylesheet" href="${url.resourcesPath}/css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
<h1>Travel Itinerary Planner</h1>
<div class="auth-form">
    <h2>${msg("infoTitle")}</h2>

    <#if displayMessage && message?has_content>
        <div class="alert alert-success">
            <i class="fas fa-info-circle alert-icon"></i>
            ${message.summary}
        </div>
    </#if>

    <#if actionUri?has_content>
        <div class="field">
            <a href="${actionUri}" class="btn btn-primary">${msg("proceedWithAction")}</a>
        </div>
    </#if>

    <#if requiredActions??>
        <div class="register-link">
            <#list requiredActions as reqActionItem>
                ${msg("requiredAction.${reqActionItem}")}
            </#list>
        </div>
    </#if>
</div>
</body>
</html>