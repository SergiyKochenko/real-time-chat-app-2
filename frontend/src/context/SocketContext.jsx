/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocketContext = () => {
	return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
	const [socket, setSocket] = useState(null);
	const [onlineUsers, setOnlineUsers] = useState([]);
	const { authUser } = useAuthContext();

	useEffect(() => {
		if (!authUser) {
			setSocket((prev) => {
				prev?.close();
				return null;
			});
			setOnlineUsers([]);
			return undefined;
		}

		const newSocket = io("https://real-time-chat-app-production-mdoy.onrender.com", {
			query: {
				userId: authUser._id,
			},
		});

		setSocket(newSocket);
		newSocket.on("getOnlineUsers", (users) => {
			setOnlineUsers(users);
		});

		return () => {
			newSocket.off("getOnlineUsers");
			newSocket.close();
		};
	}, [authUser]);

	return <SocketContext.Provider value={{ socket, onlineUsers }}>{children}</SocketContext.Provider>;
};
