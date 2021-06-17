function roomNavbar(option)
{
    var attendees_list = document.getElementById("attendees-list");
    var chat_list = document.getElementById("chat-list")

    if(option == "people-nav")
    {
        document.getElementById("chat-nav").classList.remove("bg-nav-selected");
        
        //Show People Nav
        attendees_list.style.display = "";

        //Remove Chat Nav
        chat_list.style.display = "none";
    }
    else
    {
        document.getElementById("people-nav").classList.remove("bg-nav-selected");

        //Show Chat Nav
        chat_list.style.display = "";

        //Remove People Nav
        attendees_list.style.display = "none";

        //Auto scroll to bottom after displaying message
        scrollToBottomMessage();
    }

    //Add nav selected
    document.getElementById(option).classList.add("bg-nav-selected");
    
}

// Meeting details trigger
$(document).ready(function(){
    $("#details-trigger").click(function(){
        $("#room-code-container").slideToggle("fast");
    });
});

function checkRoomId()
{
    var room_id = window.location.href.split("?")[1];
    var room_id_display = document.getElementById("room-code-container");

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
                room_id_display.innerHTML = "Room Code: " + room_id;
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    }

}

function displayChatRecord()
{
    var room_id = window.location.href.split("?")[1];
    var chatDoc = firestore.collection("rooms").doc(room_id).collection("chatRecords");
    var chat_record_display = document.getElementById("chat-record-display");

    chatDoc.orderBy("created_at", "asc").onSnapshot((querySnapshot) => {
        querySnapshot.docChanges().forEach((chat) => {
            // doc.data() is never undefined for query doc snapshots
            //console.log(chat.doc.id, " => ", chat.doc.data());

            chat_record_display.innerHTML = chat_record_display.innerHTML +
            '<div class="chat-message">' +
                '<div class="sender-name">' +
                    chat.doc.data().sent_by +
                    '<span class="ml-2 sender-time text-secondary">' + chat.doc.data().sent_time + '</span>' +
                '</div>' +

                '<div class="sender-message">' +
                    chat.doc.data().chat_message
                '</div>' +
            '</div>';

            //Auto scroll to bottom after sending message
            scrollToBottomMessage();
        });

    });

}

function enterSendChatMessage()
{
    if (event.keyCode === 13) {
        event.preventDefault();
        sendChatMessage();
    }

}

function sendChatMessage()
{
    var message_input = document.getElementById("message-input").value;
    var room_id = window.location.href.split("?")[1];
    var chatDoc = firestore.collection("rooms").doc(room_id).collection("chatRecords").doc();

    //Record Timestamp
    var date = new Date();
    var timestamp = date.getTime();

    // Get hour and minute
    var hour = date.getHours();
	var minute = date.getMinutes();

    //Columns in database
    var sent_time = checkTime(hour) + ":" + checkTime(minute);
    var sent_by = current_username;

    //Check if message is empty
    if(message_input.trim().length > 0)
    {
        //Clear the input field
        document.getElementById("message-input").value = "";

        chatDoc.set({
            chat_message: message_input,
            created_at : timestamp,
            sent_time : sent_time,
            sent_by: sent_by
        }).then(() => {
            
        });
    }
}

function checkTime(i)
{
	if(i<10)
	{
		i="0"+i;
	}
	
	return i;
}

function scrollToBottomMessage() {
    var messages = document.getElementById("chat-record-display");
    messages.scrollTop = messages.scrollHeight;
}

function displayAttendees()
{
    var room_id = window.location.href.split("?")[1];
    var attendeesRef = firebase.database().ref("rooms/" + room_id + "/attendees/");
    var attendees_row_display = document.getElementById("attendees-row-display");

    attendeesRef.on("value", function(snapshot){

        //Empty previous list
        attendees_row_display.innerHTML = "";

        snapshot.forEach((childSnapshot) => {
            attendees_row_display.innerHTML = attendees_row_display.innerHTML +
            '<div class="attendees-info">' +
                '<div class="attendees-video">' +
                    //<img src="images/attendees-video.PNG" alt="">
                '</div>' +

                '<div class="attendees-name">' +
                    childSnapshot.val().username +
                '</div>' +
            '</div>';
        });
    });

}

function leaveRoom()
{
    var room_id = window.location.href.split("?")[1];

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            var uid = user.uid;
            var attendeesRef = firebase.database().ref("rooms/" + room_id + "/attendees/" + uid);
        
            attendeesRef.onDisconnect().remove();

        } 
    });

}