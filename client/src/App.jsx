import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { Button, Container, Stack, TextField, Typography } from "@mui/material";

const App = () => {
  const socket = useMemo(() => io("http://localhost:3000"), []);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [socketId, setSocketId] = useState("");
  const [room, setRoom] = useState("");
  const [roomName, setRoomName] = useState("");
  console.log(messages);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { message, room });
    setMessage("");
  };

  const joinRoomHandler = (e) => {
    e.preventDefault();
    socket.emit("join-room", roomName);
    setRoomName("");
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected", socket.id);
      setSocketId(socket.id);
    });

    socket.on("welcome", (s) => {
      console.log(s);
    });

    socket.on("recieve-message", (data) => {
      setMessages((messages) => [...messages, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-4">Welcome to Socket Io</h1>
      <p className="text-xl mb-8">{socketId}</p>

      {/* Join Room Form */}
      <form onSubmit={joinRoomHandler} className="mb-8 space-y-4">
        <h5 className="text-lg font-medium">Join Room</h5>
        <div className="flex gap-4 flex-wrap md:flex-nowrap">
          <input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Room Name"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Join
          </button>
        </div>
      </form>

      {/* Send Message Form */}
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Message"
          />
          <input
            type="text"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            className="md:w-32 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Room"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Send
          </button>
        </div>
      </form>

      {/* Messages */}
      <div className="space-y-4">
        {messages.map((m, i) => (
          <div key={i} className="p-4 bg-white border rounded-md shadow-sm">
            {m}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
