<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Login | Travel Itinerary Planner</title>
    <link rel="stylesheet" href="${url.resourcesPath}/css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
<h1>Travel Itinerary Planner</h1>
<div class="auth-form">
    <h2>Sign In</h2>

    <!-- Error Message -->
    <#if message?has_content>
        <div class="alert alert-error">
            <i class="fas fa-exclamation-circle alert-icon"></i>
            <#if message.type = 'error'>
                Invalid username or password. Please try again.
            <#else>
                ${message.summary}
            </#if>
        </div>
    </#if>

    <form id="kc-form-login" action="${url.loginAction}" method="post">
        <div class="field">
            <label for="username">Username or email</label>
            <input id="username" name="username" type="text" autofocus
                   value="${(login.username!'')}"
                   aria-invalid="<#if message?has_content>true<#else>false</#if>"
                   <#if message?has_content>class="error"</#if> />
        </div>

        <div class="field">
            <label for="password">Password</label>
            <div class="password-wrapper">
                <input id="password" name="password" type="password"
                       aria-invalid="<#if message?has_content>true<#else>false</#if>"
                       <#if message?has_content>class="error"</#if> />
                <button type="button" class="toggle-password" aria-label="Show password">
                    <i class="fas fa-eye"></i>
                </button>
            </div>
        </div>

        <div class="form-options">
            <#if login.rememberMe??>
                <div class="remember-me">
                    <input type="checkbox" id="rememberMe" name="rememberMe" ${(login.rememberMe?? && login.rememberMe)?then('checked','')}/>
                    <label for="rememberMe">Remember me</label>
                </div>
            </#if>

            <#if realm.resetPasswordAllowed>
                <div class="forgot-password">
                    <a href="${url.loginResetCredentialsUrl}">Forgot password?</a>
                </div>
            </#if>
        </div>

        <div class="field">
            <button type="submit" id="kc-login">Sign In</button>
        </div>

        <#if realm.registrationAllowed && !registrationDisabled??>
            <div class="register-link">
                New user? <a href="${url.registrationUrl}">Create an account</a>
            </div>
        </#if>
    </form>
</div>

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
</body>
</html>