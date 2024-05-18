"use client"

import { useEffect, useState } from "react"
import { DefaultGenerics, StreamChat, TokenOrProvider } from "stream-chat"
import {
    Chat,
    Channel,
    ChannelList,
    Window,
    ChannelHeader,
    MessageList,
    MessageInput,
    Thread,
    LoadingIndicator, 
} from "stream-chat-react"
import "./styles.css"

import { useAuth, useOrganization, useUser } from "@clerk/nextjs"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useTheme } from "next-themes"
import { useClientState } from "@/components/navigation/ChatToggle"

export default function Messenger(){
    
    const { resolvedTheme: theme } = useTheme();
    const { userId } = useAuth();

    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true));

    const { client } = useClientState();

    if (!mounted) return null;
    if (!client || !userId) return <div className="h-[calc(100%-50px)] flex items-center justify-center w-full"><LoadingIndicator size={64} /></div>;

    return (
      <Chat client={client} theme={theme == "dark" ? "messaging dark" : "messaging light"}>
        <ChannelList 
            filters={{ type: 'messaging', members: {$in: [userId]} }}
            sort={{ last_message_at: -1 }}
        />
        <Channel>
          <Window>
            <ChannelHeader />
            <MessageList />
            <MessageInput />
          </Window>
          <Thread />
        </Channel>
      </Chat>
    );
}