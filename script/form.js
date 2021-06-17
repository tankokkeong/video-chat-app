function signup()
{
    email = document.getElementById("email").value;
    password = document.getElementById("password").value;
    confirm_password = document.getElementById("confirm-password").value;
    error_prompt = document.getElementById("error-prompt");
    signup_loader = document.getElementById("signup-loader");
    full_name = document.getElementById("full-name").value;

    // Display Loader
    signup_loader.style.display = "";

    if(email === "" || password === "" || confirm_password === "" || full_name === "")
    {
        //Remove loader
        signup_loader.style.display = "none";

        error_prompt.innerHTML = "Please fill up all the columns!";
    }
    else if(password !== confirm_password)
    {
        //Remove loader
        signup_loader.style.display = "none";

        error_prompt.innerHTML = "Password does not match!";   
    }
    else
    {
        firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((user) => {
            firebase.auth().onAuthStateChanged(function(user) {
                if (user)
                {
                    // Create user record
                    createNewUser(email, full_name, user.uid);
                }
            
            });    
            
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;

            //Remove loader
            signup_loader.style.display = "none";

            // Display error
            error_prompt.innerHTML = errorMessage;
        });
    }
}