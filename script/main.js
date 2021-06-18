//Global variables
let current_user_id = "";
let current_username = "";
let current_user_email = "";
let checked_login = false;

function joinRoomEnabled()
{
    var room_code_input = document.getElementById("room-code").value;
    var join_btn = document.getElementById("join-room-btn");

    if(room_code_input.length > 0)
    {
        join_btn.disabled = false;
    }
    else
    {
        join_btn.disabled = true;
    }
}

function enterJoinRoom()
{
    if (event.keyCode === 13) {
        event.preventDefault();
        joinRoom();
    }
}

function joinRoom()
{
    var room_code_input = document.getElementById("room-code").value;
    var roomDoc = firestore.collection("rooms").doc(room_code_input);
    var room_error = document.getElementById("room-error-prompt");
    var room_loader = document.getElementById("room-loader");

    //Display loader
    room_loader.style.display = "";

    //Remove error prompt
    room_error.innerHTML = "";

    if(checked_login == true){
        roomDoc.get().then((doc) => {
            if (doc.exists) {
    
                var attendeesRef = firebase.database().ref("rooms/" + roomDoc.id + "/attendees/" + current_user_id);
    
                //add new user to the room
                attendeesRef.set({
                    user_email : current_user_email,
                    username: current_username
                }).then(() => {
                    //Redirect to the room page
                    window.location.href = "chat-room.html?" + room_code_input;
                });
            }
            else
            {
                //If no room found

                //Remove loader
                room_loader.style.display = "none";

                //Display error
                room_error.innerHTML = "No Room Found!";
            }
    
            console.log("success")
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    }
    else
    {
        alert("Please login first!");
    }

}

function createNewRoom()
{
    var roomDoc = firestore.collection("rooms").doc();
    var room_loader = document.getElementById("room-loader");
    var attendeesRef = firebase.database().ref("rooms/" + roomDoc.id + "/attendees/" + current_user_id);

    if(checked_login == true)
    {
        //Display loader
        room_loader.style.display = "";

        roomDoc.set({
            room_id : roomDoc.id,
            
        }).then(() =>
            {
                attendeesRef.set({
                    username: current_username,
                    user_email: current_user_email
                }).then(() => {
                    //Redirect to the room page
                    window.location.href = "chat-room.html?" + roomDoc.id;
                })
            }    
        );
    }
    else
    {
        alert("Please login first!");
    }
    
}

function checkSignIn()
{
    var user_status = document.getElementById("check-signin");

    // Check Login
    firebase.auth().onIdTokenChanged(function(user) {
        if (user) {
            // User is signed in or token was refreshed.
            checked_login = true;

            if(user_status != null)
            {
                user_status.innerHTML = '<button type="button" class="btn btn-danger" onclick="logout()"><i class="fas fa-sign-out-alt"></i> Sign Out</button>';
            }
           
            current_user_id = user.uid;

            //Get User Info
            getUserInfo(current_user_id);
        }
        else
        {
            if(user_status != null){
                user_status.innerHTML = '<a href="login.html" class="text-decoration-none text-dark"><i class="fas fa-sign-in-alt"></i> Sign In</a>';
            }
        }
    });

}

function logout()
{
    var user_id = firebase.auth().currentUser.uid;
  

    //Update user presence status
    firebase.database().ref("presenceStatus/" + user_id).set({
        presence_status : "Offline"
    }).then(()=>{
        //Logout account
        firebase.auth().signOut();

        checked_login = false;
    });


}


function getUserInfo(user_id)
{
    var UserRef = firestore.collection("users").doc(user_id);

    UserRef.get().then((doc) => {
        if (doc.exists) {
            //Assign user info to the global variables
            current_user_id = user_id;
            current_username = doc.data().username;
            current_user_email = doc.data().user_email;
        }

        console.log("success")
    }).catch((error) => {
        console.log("Error getting document:", error);
    });

}
