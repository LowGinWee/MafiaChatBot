

const CHANNEL_ID = 'UscnU30egG9jGkgR';

const rooms = ["observable-Main", "observable-Mafia", "observable-Doc", "observable-Sheriff", "observable-broadcast"];

var role = 4;
var GM = {name: "GinWeeBot", color: '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16)};
var userName =  "GinWeeBot";

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
    if (member) {
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
    if (member && role == 1) {
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
	if (roomStr != rooms[0]) {
		value = DOM.input2.value;
	}

  if (value === '') {
    return;
  }
  DOM.input.value = '';
  DOM.input2.value = '';
  drone.publish({
    room: roomStr,
    message: value,
  });
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




