//@ [GET] /chat/
module.exports.index = (req, res) => {
    //@ SocketIO
    _io.on("connection", (socket) => {
        console.log("a user connected", socket.id);
    });

    res.render("client/pages/chat/index", {
        pageTitle: "Chat",
    });
};
