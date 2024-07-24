const socket = io();
let sendBtn = document.querySelector(".send-btn");
let msgInput = document.querySelector(".msg-input");
let content = document.querySelector(".content");
let nameInput = document.querySelector(".name-input");
let setName = document.querySelector(".set-name");
let namePage = document.querySelector(".namePage");
let userName = document.querySelector(".username");
let Users = document.querySelector(".users");
let live = document.querySelector(".live");
let typing = document.querySelector(".typing");


setName.addEventListener("click", function(){
    if(nameInput.value.trim().length > 0){
        socket.emit("username", nameInput.value.trim())
    } 
})

socket.on("username-set", function(username){
    namePage.style.display = "none";
    userName.textContent = username;
})

nameInput.addEventListener("input", function(){
    if(nameInput.value.trim().length > 0){
        let newName = nameInput.value.replace(" ", "_");
        nameInput.value = newName
    } else{
        nameInput.value = ""
    }
})

sendBtn.addEventListener("click", function(){
    let date = new Date();
    let time = `${date.getHours()}:${date.getMinutes()}`;
    if(msgInput.value.trim().length > 0){
     socket.emit("message", {message: msgInput.value, time});
     msgInput.value = ""
    }
  
})

let lastSendId = "";

socket.on("recieve-message", function(data){
    let {id, message, time, user} = data;
    let userDisplay = "";
    if(lastSendId !== id){
        userDisplay = `<p>${user}</p>`
    }
    
    /* <p class="text-zinc-300 text-sm text-end">${user}</p> */

    if(data.id === socket.id){
       content.innerHTML +=  ` <div class="flex self-end">
       <div>
       <div class="text-zinc-300 text-sm text-end">
        ${userDisplay}
       </div>
       
        <div class="msg w-[fit-content] bg-emerald-700 rounded-lg px-3 py-2 rounded-tr-[0] mt-2 ml-32">
           <h4 class="word-wrap ">${message}</h4>
           <p class="font-light text-zinc-300 text-sm text-end">${time}</p>
       </div>
       </div>
      </div>`
    }else{
        content.innerHTML += `  <div class="flex">
                      <div>
                        <div class="text-zinc-300 text-sm text-start">
                        ${userDisplay}
                         </div>
                        
                         <div class="msg w-[fit-content] bg-zinc-700 rounded-lg px-3 py-2 rounded-tl-[0] mt-2 mr-32">
                        <h4 class="word-wrap ">${message}</h4>
                        <p class="font-light text-zinc-300 text-sm text-end">${time}</p>
                        </div>
                      </div>
                    </div>`
    }

    
      lastSendId = id;
    content.scrollTop = content.scrollHeight
});

socket.on("connected-user", function(data){
    live.textContent = data.totalUsers;
    Users.innerHTML = "";
    data.users.forEach(function(username){
        Users.innerHTML += ` <div class="user p-2 w-[90%]  border-b-2 border-white mt-3">
                        <p class="text-xl">${username}</p>
                    </div>`
    })
})

socket.on("disconnected-user", function(data){
    live.textContent = data.totalUsers;
    Users.innerHTML = "";
    data.users.forEach(function(username){
        Users.innerHTML += ` <div class="user p-2 w-[90%] border-b-2 border-zinc-600 mt-3">
                        <p class="text-xl">${username}</p>
                    </div>`
    })
})

msgInput.addEventListener("input", function(){
    socket.emit("typing");
})

socket.on("typing", function(){
    document.querySelector(".typing").innerHTML = `<em>Typing...</em>`;
    setTimeout(() => {
        document.querySelector(".typing").innerHTML = ""
    }, 2000)
})