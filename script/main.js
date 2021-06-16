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
}