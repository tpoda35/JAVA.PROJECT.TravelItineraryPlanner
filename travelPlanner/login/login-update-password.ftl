<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${msg("updatePasswordTitle")} | Travel Itinerary Planner</title>
    <link rel="stylesheet" href="${url.resourcesPath}/css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
<h1>Travel Itinerary Planner</h1>
<div class="auth-form">
    <h2>${msg("updatePasswordTitle")}</h2>

    <#if message?has_content>
        <div class="alert alert-error">
            <i class="fas fa-exclamation-circle alert-icon"></i>
            ${message.summary}
        </div>
    </#if>

    <form id="kc-passwd-update-form" action="${url.loginAction}" method="post">
        <input type="text" id="username" name="username" value="${username}" autocomplete="username" readonly="readonly" style="display:none;"/>

        <div class="field">
            <label for="password-new">${msg("passwordNew")}</label>
            <div class="password-wrapper">
                <input type="password" id="password-new" name="password-new" autocomplete="new-password"
                       aria-invalid="<#if message?has_content>true<#else>false</#if>"
                       <#if message?has_content>class="error"</#if> />
                <button type="button" class="toggle-password" aria-label="Show password">
                    <i class="fas fa-eye"></i>
                </button>
            </div>
        </div>

        <div class="field">
            <label for="password-confirm">${msg("passwordConfirm")}</label>
            <div class="password-wrapper">
                <input type="password" id="password-confirm" name="password-confirm" autocomplete="new-password"
                       aria-invalid="<#if message?has_content>true<#else>false</#if>"
                       <#if message?has_content>class="error"</#if> />
                <button type="button" class="toggle-password" aria-label="Show password">
                    <i class="fas fa-eye"></i>
                </button>
            </div>
        </div>

        <div class="field">
            <button type="submit" id="kc-submit">${msg("doSubmit")}</button>
        </div>
    </form>

    <script>
        document.querySelectorAll('.toggle-password').forEach(button => {
            button.addEventListener('click', function() {
                const passwordInput = this.previousElementSibling;
                const icon = this.querySelector('i');
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                icon.classList.toggle('fa-eye');
                icon.classList.toggle('fa-eye-slash');
            });
        });
    </script>
</div>
</body>
</html>