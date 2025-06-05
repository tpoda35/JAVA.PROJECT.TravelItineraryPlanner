<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Register | Travel Itinerary Planner</title>
    <link rel="stylesheet" href="${url.resourcesPath}/css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
<h1>Travel Itinerary Planner</h1>
<div class="auth-form">
    <h2>Create Account</h2>

    <!-- Error Message -->
    <#if message?has_content>
        <div class="alert alert-error">
            <i class="fas fa-exclamation-circle alert-icon"></i>
            <#if message.type = 'error'>
            <#-- Handle multiple error messages -->
                <#if message.summary?contains("missingEmailMessage")>
                    Email field cannot be empty.
                <#elseif message.summary?contains("missingUsernameMessage")>
                    Username field cannot be empty.
                <#elseif message.summary?contains("error-user-attribute-required")>
                    Please fill in all required fields.
                <#elseif message.summary?contains("missingPasswordMessage")>
                    Password field cannot be empty.
                <#elseif message.summary?contains("emailExistsMessage")>
                    Email already in use.
                <#elseif message.summary?contains("usernameExistsMessage")>
                    Username already in use.
                <#elseif message.summary?contains("invalidPasswordConfirmMessage")>
                    Passwords don't match.
                <#else>
                    ${message.summary}
                </#if>
            <#else>
                ${message.summary}
            </#if>
        </div>
    </#if>

    <!-- Rest of your form remains exactly the same -->
    <form id="kc-register-form" action="${url.registrationAction}" method="post">
        <div class="field">
            <label for="firstName">First Name</label>
            <input id="firstName" name="firstName" type="text"
                   value="${(register.formData.firstName!'')}"
                   <#if message?has_content>class="error"</#if> />
        </div>

        <div class="field">
            <label for="lastName">Last Name</label>
            <input id="lastName" name="lastName" type="text"
                   value="${(register.formData.lastName!'')}"
                   <#if message?has_content>class="error"</#if> />
        </div>

        <div class="field">
            <label for="email">Email</label>
            <input id="email" name="email" type="email"
                   value="${(register.formData.email!'')}"
                   <#if message?has_content>class="error"</#if> />
        </div>

        <div class="field">
            <label for="username">Username</label>
            <input id="username" name="username" type="text"
                   value="${(register.formData.username!'')}"
                   <#if message?has_content>class="error"</#if> />
        </div>

        <div class="field">
            <label for="password">Password</label>
            <div class="password-wrapper">
                <input id="password" name="password" type="password"
                       <#if message?has_content>class="error"</#if> />
                <button type="button" class="toggle-password" aria-label="Show password">
                    <i class="fas fa-eye"></i>
                </button>
            </div>
        </div>

        <div class="field">
            <label for="password-confirm">Confirm Password</label>
            <div class="password-wrapper">
                <input id="password-confirm" name="password-confirm" type="password"
                       <#if message?has_content>class="error"</#if> />
                <button type="button" class="toggle-password" aria-label="Show password">
                    <i class="fas fa-eye"></i>
                </button>
            </div>
        </div>

        <div class="field">
            <button type="submit" id="kc-register">Create Account</button>
        </div>

        <div class="register-link">
            Already have an account? <a href="${url.loginUrl}">Sign in</a>
        </div>
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