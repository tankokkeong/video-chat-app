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
        //Remove error prompt
        error_prompt.innerHTML = "";

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

function createNewUser(email, full_name, user_id)
{
    var UserDoc = firestore.collection("users").doc(user_id);

    //Create new user record
    UserDoc.set({
        user_email : email,
        username: full_name
    }).then(() => {

        //Redirect back to login page
        window.location.href = "login.html";

    });
}

function login()
{
    email = document.getElementById("email").value;
    password = document.getElementById("password").value;
    error_prompt = document.getElementById("error-prompt");
    login_loader = document.getElementById("login-loader");

    // Display Loader
    login_loader.style.display = "";

    // Clear the error prompt
    error_prompt.innerHTML = "";

    if(email === "" || password === "")
    {
        //Remove loader
        login_loader.style.display = "none";

        // Display error
        error_prompt.innerHTML = "Please fill up all the columns!";
    }
    else
    {
        firebase.auth().signInWithEmailAndPassword(email, password)
        .then((user) => {
            var user_id = firebase.auth().currentUser.uid;

            //Update user presence status
            firebase.database().ref("presenceStatus/" + user_id).set({
                presence_status : "Online"
            }).then(() => {
                // Signed in 
                window.location.href = "index.html";
            });
           
        })
        .catch((error) => {
            // var errorCode = error.code;
            // var errorMessage = error.message;

            //Remove loader
            login_loader.style.display = "none";

            console.log(error.message)
            // Display error
            error_prompt.innerHTML = "Invalid username or password!";
        });
    }
    
}