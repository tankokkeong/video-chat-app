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
    }

    //Add nav selected
    document.getElementById(option).classList.add("bg-nav-selected");
    
}