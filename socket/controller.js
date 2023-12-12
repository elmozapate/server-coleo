const DbPut = require("../db/dbput.js");
const DbMod = require("../db/dbMod.js");


const SocketController = (socket, variables, data) => {
  
  const actionTodo = data.actionTodo ? data.actionTodo : "sin action";
  const user = data.user ? data.user : "sin usuario";
  const usuario =
    data.data && data.data.usuario ? data.data.usuario : "sin usuario";
 
  if (actionTodo === "sendChatPriv") {
    
    socket.emit("coleoServer", {
      actionTodo: "resChat",
    });
    socket.broadcast.emit("coleoServer", {
      actionTodo: "resChat",
    });
  }
};
module.exports = SocketController;
