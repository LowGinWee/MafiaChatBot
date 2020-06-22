const CHANNEL_ID = 'UscnU30egG9jGkgR';

const rooms = ["observable-Main", "observable-Mafia", "observable-Doc", "observable-Sheriff", "observable-broadcast"];

var role = 4;
var GM = {name: "GinWeeBot", color: '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16)};
var userName =  "GinWeeBot";
var num_Mafia = 5;
var num_Doc = 2;
var num_Sheriff = 2;

let MafiaAlive = [];
let VillagerAlive = [];
let DocAlive =[];
let SheriffAlive = [];
let GoodAlive = [];
let AllAlive = [];
let dead = [];

let toKill = [];

var voteContainer = {};

//key -- name
//value -- (alive, role, good)
var players = new Object(); 

const PassWord = "Sticky42";

const drone = new ScaleDrone(CHANNEL_ID, {
  data: { // Will be sent out as clientData via events
    name: userName,
    color: getRandomColor(),
  },
});

let members = [];

drone.on('open', error => {
  if (error) {
    return console.error(error);
  }
  console.log('Successfully connected to Scaledrone');
	
  const room = drone.subscribe(rooms[0]);
  room.on('open', error => {
    if (error) {
      return console.error(error);
    }
    addMessageToListDOM2("You have entered the Main Chat",  GM , 0);
  });

  room.on('members', m => {
    members = m;
    updateMembersDOM();
  });

  room.on('member_join', member => {
    members.push(member);
    updateMembersDOM();
  });

  room.on('member_leave', ({id}) => {
    const index = members.findIndex(member => member.id === id);
    members.splice(index, 1);
    updateMembersDOM();
  });

  room.on('data', (text, member) => {
	if (member && text.includes("-vote")) {
		var {name, color} = member.clientData;
		if (name != "GinWeeBot") {
			var s = text.split(" ");
			var vote = s[s.length - 1];
			voteContainer[name] = vote;
		}
		addMessageToListDOM(text, member, 0);
	}
    else if (member) {
      addMessageToListDOM(text, member, 0);
    } else {
      // Message is from server
    }
  });
  
  const mafiaRoom = drone.subscribe(rooms[1]);
  mafiaRoom.on('open', error => {
    if (error) {
      return console.error(error);
    }
	addMessageToListDOM2("You have entered the Mafia Chat", GM, 1);
  });

  mafiaRoom.on('members', m => {
    //members = m;
    //updateMembersDOM();
  });

  mafiaRoom.on('member_join', member => {

  });

  mafiaRoom.on('member_leave', ({id}) => {

  });

  mafiaRoom.on('data', (text, member) => {
    if (member) {
      addMessageToListDOM("M " + text, member, 1);
    } else {
      // Message is from server
    }
  });
  
  const docRoom = drone.subscribe(rooms[2]);
  docRoom.on('open', error => {
    if (error) {
      return console.error(error);
    }
    addMessageToListDOM2("You have entered the Doctor Chat", GM, 1);
  });

  docRoom.on('members', m => {
    //members = m;
    //updateMembersDOM();
  });

  docRoom.on('member_join', member => {

  });

  docRoom.on('member_leave', ({id}) => {

  });

  docRoom.on('data', (text, member) => {
    if (member) {
      addMessageToListDOM("D " + text, member, 2);
    } else {
      // Message is from server
    }
  });
  
  const sheriffRoom = drone.subscribe(rooms[3]);
  sheriffRoom.on('open', error => {
    if (error) {
      return console.error(error);
    }
    addMessageToListDOM2("You have entered the Sheriff Chat", GM, 1);
  });

  sheriffRoom.on('members', m => {
    //members = m;
    //updateMembersDOM();
  });

  sheriffRoom.on('member_join', member => {

  });

  sheriffRoom.on('member_leave', ({id}) => {

  });

  sheriffRoom.on('data', (text, member) => {
    if (member) {
      addMessageToListDOM("S " + text, member, 3);
    } else {
      // Message is from server
    }
  });
  
  const broadCastRoom = drone.subscribe(rooms[4]);
  broadCastRoom.on('open', error => {
    if (error) {
      return console.error(error);
    }
		addMessageToListDOM2("You are the Bot (BroadCast)", GM, 1);
  });


  broadCastRoom.on('data', (text, member) => {
    if (member) {
	  const { name, color } = member.clientData;

		addMessageToListDOM("B " + text, member, 4);

    } else {
      // Message is from server
    }
  });
});

drone.on('close', event => {
  console.log('Connection was closed', event);
});

drone.on('error', error => {
  console.error(error);
});



function getRandomColor() {
  return '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16);
}

//------------- DOM STUFF

const DOM = {
  membersCount: document.querySelector('.members-count'),
  membersList: document.querySelector('.members-list'),
  messages: document.getElementById("Chat1"),
  input: document.getElementById("field1"),
  form: document.forms["form1"],
  messages2: document.getElementById("Chat2"),
  input2: document.getElementById("field2"),
  form2: document.forms["form2"],
};

DOM.form.addEventListener('submit', function() { sendMessage(rooms[0]); } );
DOM.form2.addEventListener('submit', function() { sendMessage(rooms[role]); });

function sendMessage(roomStr) {
  var value = DOM.input.value;

  if (value === '') {
    return;
  }
  DOM.input.value = '';

  switch (value) {
  	case "/Assign":
		assignRoles();
		return;
	case "/Mafia":
		mafiaCycle();
		return;
	case "/Doctor":
		doctorCycle();
		return;
	case "/Sheriff":
		sheriffCycle();
		return;
	case "/Status":
		publishStatus();
		return;
	case "/voteStart":
		startVote();
		return;
	case "/voteEnd":
		endVote();
		return;
	case "/endGame":
		endGame();
		return;

  }

  if (value.includes("-kill")) {
		var s = value.split(" ");
		killPlayer(s[1]);
  	  return;
  }

    if (value.includes("-day")) {
		var s = value.split(" ");
		insertDay(s[1]);
  	  return;
  }

  if (value.includes("-reveal")) {
		var s = value.split(" ");
		revealPlayer(s[1]);
  	  return;
  }

   if (value.includes("-Assign")) {
		var s = value.split(" ");
		num_Mafia = parseInt(s[1]);
		num_Doc = parseInt(s[2]);
		num_Sheriff = parseInt(s[3]);
	drone.publish({
		room: rooms[0],
		message: "Mafia = " + num_Mafia + " Doc = " + num_Doc + " Sheriff = " + num_Sheriff ,
	  });
  	  return;
  }
  
  if (userName == "GinWeeBot") {
	  var s = value.split(" ");
	  var j = parseInt(s[0]);
	  
	  var NewArr = s.slice(1, s.length);
	  NewArr = NewArr.join(" ");
	  drone.publish({
		room: rooms[j],
		message: NewArr,
	  });
  }
}


function startVote(){
	voteContainer = {};
	drone.publish({
		room: rooms[0],
		message: "Vote on who to kill! usage: -vote NAME",
	});
}

function insertDay(num){
	drone.publish({
		room: rooms[0],
		message: "- - - - - - - - - - Day " + num + " - - - - - - - - - -",
	});
}

async function endVote(){
	var teleScore = {};
	drone.publish({
		room: rooms[0],
		message: "Counting votes!",
	});

	Object.keys(voteContainer).forEach(function(key) {
		
		if (voteContainer[key] in teleScore) {
			teleScore[voteContainer[key]] += 1;
		} else {
			teleScore[voteContainer[key]] = 1;
			console.log(voteContainer[key]);
		}
	});

	var sortable = [];
	for (var name in teleScore) {
		console.log(teleScore[name]);
		console.log(name);
		sortable.push([name, teleScore[name]]);
	}

	sortable.sort(function(a, b) {
		return a[1] - b[1];
	});

	for( var i in sortable ) {
		await new Promise(r => setTimeout(r, 200));
		drone.publish({
			room: rooms[0],
			message: sortable[i][0] + " " + sortable[i][1],
		});

	}
}

var ToggleKillPhase = false;

function nightCycle(){

	
}


var KillContainer = [];

async function mafiaCycle(){
	var msg = [];

	var i = 1;

	var numCanKill = 1;
	var numMaf = 0;
	Object.keys(players).forEach(function(key) {
		var isAlive = players[key].alive;
		var isGood = players[key].good;
		if (isAlive && !isGood)
			numMaf += 1;
	});

	if (numMaf > 2) 
		numCanKill = 2;
	
	drone.publish({
		room: rooms[1],
		message: "Mafia, Please decide who ("+ numCanKill+") to kill.(2 mins)",
	});

	Object.keys(players).forEach(async function(key) {
		await new Promise(r => setTimeout(r, 200));
		var name = key;
		var isAlive = players[key].alive;
		var isGood = players[key].good;
		if (isAlive && isGood) {
			var ii = (name);
			KillContainer.push(name);
			drone.publish({
				room: rooms[1],
				message: ii,
			});
			i += 1;
		}
	});

}

async function doctorCycle(){
	drone.publish({
		room: rooms[2],
		message: "Doctors, Please decide who to protect.(2 mins)",
	});

}

async function sheriffCycle(){
	drone.publish({
		room: rooms[3],
		message: "Sheriff, Please decide who to reveal.(2 mins)",
	});

}

async function killPlayer(name){
	var msg = "";
	msg= "4 " + PassWord + " -" + name + " -kill";
	drone.publish({
		room: rooms[4],
		message: msg,
	});

	players[name].alive = false;
}

async function revealPlayer(name){
	var msg = "";
	msg = players[name].role
	drone.publish({
		room: rooms[3],
		message: name +  " is a " + msg,
	});
}


async function assignRoles(){
		drone.publish({
			room: rooms[0],
			message: "- - - - - Assigning Roles... - - - - -",
		});

	if (members.length < num_Doc + num_Mafia + num_Sheriff + 2) {
		drone.publish({
			room: rooms[0],
			message: "Not Enough players",
		 });
	} else {
			
		let MemberIndex = [];
		let roleIndex = [];
		for( let i = 0; i < members.length; i++) {
			MemberIndex.push(i);
			AllAlive.push(members[i].clientData["name"]);
		}
		
		total = num_Doc + num_Mafia + num_Sheriff;
		
		for (let i = 0; i < total; i++) {
			var j = Math.floor((Math.random() * MemberIndex.length));		
			while (members[MemberIndex[j]].clientData["name"] == "GinWeeBot") {
				j = Math.floor((Math.random() * MemberIndex.length));
			}
			roleIndex.push(MemberIndex[j]);
			MemberIndex.splice(j, 1);
		}

		for( let i = 0; i < num_Doc; i++) {
			var ii = roleIndex.pop();
			var {name, color} = members[ii].clientData;
			var status = {};
			status.role = "Doctor"
			status.alive = true;
			status.good = true;
			players[name] = status;
		}
		
		for( let i = 0; i < num_Mafia; i++) {
			var ii = roleIndex.pop();
			var {name, color} = members[ii].clientData;
			var status = {};
			status.role = "Mafia"
			status.alive = true;
			status.good = false;
			players[name] = status;
		}
		
		for( let i = 0; i < num_Sheriff; i++) {
			var ii = roleIndex.pop();
			var {name, color} = members[ii].clientData;
			var status = {};
			status.role = "Sheriff"
			status.alive = true;
			status.good = true;
			players[name] = status;
		}
		
		for( let i = 0; i < MemberIndex.length; i++) {
			var ii = MemberIndex[i];
			var {name, color} = members[ii].clientData;
			if (members[ii].clientData["name"] != "GinWeeBot"){
				var status = {};
				status.role = "Villager"
				status.alive = true;
				status.good = true;
				players[name] = status;
			}
		}
	}

	var msg = "";
	Object.keys(players).forEach(async function(key) {
		var name = key;
		var role_c = players[key].role;
		switch(role_c) {
			case "Villager":
				msg= "4 " + PassWord + " -" + name + " -role 0";
				break;
			case "Mafia":
				msg= "4 " + PassWord + " -" + name + " -role 1";
				break;
			case "Doctor":
				msg= "4 " + PassWord + " -" + name + " -role 2";
				break;
			case "Sheriff":
				msg= "4 " + PassWord + " -" + name + " -role 3";
				break;
		}
		drone.publish({
			room: rooms[4],
			message: msg,
		});
		await new Promise(r => setTimeout(r, 200));
	});


	await new Promise(r => setTimeout(r, 1000));

	drone.publish({
		room: rooms[1],
		message: "You are now in the Mafia chatroom",
	});

	
	drone.publish({
		room: rooms[2],
		message: "You are now in the Doctor chatroom",
	});

	
	drone.publish({
		room: rooms[3],
		message: "You are now in the Sheriff chatroom",
	});

	drone.publish({
		room: rooms[0],
		message: "- - - - - Roles Assigned ... - - - - -",
	});

	publishStatus();
}

async function publishStatus() {
	var msg = [];
	var msg2 = [];
	var goodcount = 0;
	var badcount = 0;
	Object.keys(players).forEach(function(key) {
		var name = key;
		var isAlive = players[key].alive;
		var isGood = players[key].good;
		if (isAlive)
			msg.push(name + " (Alive)" );
		else
			msg2.push(name + " (Dead)" );
		if(isAlive && isGood) 
			goodcount += 1;
		else if (isAlive && !isGood)
			badcount += 1;
	});

		drone.publish({
			room: rooms[0],
			message: "- - - - - Getting Player Statuses... - - - - -",
		});


	for (var i = 0; i < msg.length; i++) {
			await new Promise(r => setTimeout(r, 200));
		drone.publish({
			room: rooms[0],
			message: msg[i],
		});	
	}

	for (var i = 0; i < msg2.length; i++) {
			await new Promise(r => setTimeout(r, 200));
		drone.publish({
			room: rooms[0],
			message: msg2[i],
		});	
	}

	await new Promise(r => setTimeout(r, 200));

	if (goodcount <= 1) {
		drone.publish({
			room: rooms[0],
			message: "- - - - - Game End! Mafia win! - - - - -",
		});	
	}

	else if (badcount <= 0) {
		drone.publish({
			room: rooms[0],
			message: "- - - - - Game End! Villagers win! - - - - -",
		});	
	}

	else {
		drone.publish({
			room: rooms[0],
			message: "- - - - - Mafia still alive! Game continues... - - - - -",
		});
	}
}

async function endGame() {
	var msg = [];
	Object.keys(players).forEach(function(key) {
		var name = key;
		var isAlive = players[key].alive;
		var isGood = players[key].good;
		var id = players[key].role;
		if (isAlive)
			msg.push(name + " " + id +" (Alive)" );
		else
			msg.push(name + " " +id +" (Dead)" );
	});
		drone.publish({
			room: rooms[0],
			message: "- - - - - Player Identities - - - - -",
		});	

	for (var i = 0; i < msg.length; i++) {
			await new Promise(r => setTimeout(r, 200));
			drone.publish({
			room: rooms[0],
			message: msg[i],
		});	
	}
}


function createMemberElement(member) {
  const { name, color } = member.clientData;
  const el = document.createElement('div');
  el.appendChild(document.createTextNode(name));
  el.className = 'member';
  el.style.color = color;
  return el;
}

function updateMembersDOM() {
  DOM.membersCount.innerText = `${members.length} users in room:`;
  DOM.membersList.innerHTML = '';
  members.forEach(member =>
    DOM.membersList.appendChild(createMemberElement(member))
  );
}

function createMessageElement(text, member) {
  const el = document.createElement('div');
  el.appendChild(createMemberElement(member));
  el.appendChild(document.createTextNode(text));
  el.className = 'message';
  return el;
}

function addMessageToListDOM(text, member, box) {
  var el = DOM.messages;
  
  if (box != 0) {
	  el = DOM.messages2;
  }
  const wasTop = el.scrollTop === el.scrollHeight - el.clientHeight;
  el.appendChild(createMessageElement(text, member));
  if (wasTop) {
    el.scrollTop = el.scrollHeight - el.clientHeight;
  }

}
function createMemberElement2(member) {
  const { name, color } = member;
  const el = document.createElement('div');
  el.appendChild(document.createTextNode(name));
  el.className = 'member';
  el.style.color = color;
  return el;
}
function createMessageElement2(text, member) {
  const el = document.createElement('div');
  el.appendChild(createMemberElement2(member));
  el.appendChild(document.createTextNode(text));
  el.className = 'message';
  return el;
}

function addMessageToListDOM2(text, member, box) {
  var el = DOM.messages;
  
  if (box != 0) {
	  el = DOM.messages2;
  }

  const wasTop = el.scrollTop === el.scrollHeight - el.clientHeight;
  el.appendChild(createMessageElement2(text, member));
  if (wasTop) {
    el.scrollTop = el.scrollHeight - el.clientHeight;
  }
}




