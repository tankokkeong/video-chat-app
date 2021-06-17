function joinRoom()
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

function createNewRoom()
{
    var roomDoc = firestore.collection("rooms").doc();
    var room_loader = document.getElementById("room-loader");

    //Display loader
    room_loader.style.display = "";

    roomDoc.set({
        room_id : roomDoc.id
    }).then(() =>
        {
            //Redirect to the room page
            window.location.href = "chat-room.html?" + roomDoc.id;
        }    
    );
}

function getRoomId()
{
    var room_id = window.location.href.split("?")[1];

    if(room_id == null || room_id == "")
    {
        //Redirect to home page
        window.location.href = "index.html";
    }
    else
    {
        var RoomRef = firestore.collection("rooms").doc(room_id);

        RoomRef.get().then((doc) => {
            if (!doc.exists) {
                //Redirect to home page if room doesnt exist
                window.location.href = "index.html";
            }
            else
            {
                return room_id;
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    }

    return "";
}

function checkSignIn()
{
    var user_status = document.getElementById("check-signin");

    // Check Login
    firebase.auth().onIdTokenChanged(function(user) {
        if (user) {
            // User is signed in or token was refreshed.
            user_status.innerHTML = '<button class="btn btn-danger" onclick="logout()"><i class="fas fa-sign-out-alt"></i> Sign Out</button>';
        }
        else
        {
           user_status.innerHTML = '<a href="login.html" class="text-decoration-none text-dark"><i class="fas fa-sign-in-alt"></i> Sign In</a>';
        }
    });

}

function logout()
{
    firebase.auth().signOut();
}
