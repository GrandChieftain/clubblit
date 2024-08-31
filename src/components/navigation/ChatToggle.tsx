"use client"

import TooltipProvider from "@/context/TooltipProvider";
import { useTheme } from "next-themes"
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { usePathname, useRouter } from "next/navigation";
import { MessageCircle } from "lucide-react"
import { DefaultGenerics, StreamChat, TokenOrProvider } from "stream-chat";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { create } from "zustand";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY as string;

interface ClientState {
  client: StreamChat<DefaultGenerics> | null
  setClient: (client: StreamChat<DefaultGenerics> | null) => void
}

export const useClientState = create<ClientState>()((set) => ({
  client: null,
  setClient: (client: StreamChat<DefaultGenerics> | null) => set({ client })
}))

export default function ChatToggle(){
    
    const { resolvedTheme: theme } = useTheme();

    const { push } = useRouter();

    const pathname = usePathname();

    const { client, setClient } = useClientState();
    const [unread, setUnread] = useState<number | undefined>(undefined);

    const { user } = useUser();
    const userId = user?.id;
    const { refetch } = useQuery({
      queryKey: ["token", userId],
      queryFn: async () => {
        const { data: { response } } = await axios.get('/api/stream');
        return response as { token: TokenOrProvider, financeTeam: string[] }
      }
    })

    useEffect(() => {
      if (!userId) return
      const {id, fullName, imageUrl: image} = user;
      const init = async () => {
        const chatClient = StreamChat.getInstance(apiKey);
        const { data: response } = await refetch();
        if (response){
          const streamUser = await chatClient.connectUser({ id, name: fullName as string, image }, response.token);
          if (streamUser) setUnread(streamUser.me?.total_unread_count);
          for (const memberId of response.financeTeam){
            if (memberId != userId){
              const channel = chatClient.channel('messaging', { members: [userId, memberId] });
              await channel.watch();
            }
          }
        }
        setClient(chatClient);
      }
      init();
      return () => {
        if (client) {
          client.disconnectUser();
          setClient(null);
        }
      };
    }, [userId, client, refetch, setClient, user])

    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    if (!mounted){
      return null
    }

    if (pathname == "/"){
      return (
        <TooltipProvider isButton>
          <Button variant="ghost" size="icon" className="relative flex items-center justify-center w-7 h-7 dark:hover:bg-[#272729] hover:border hover:border-transparent hover:bg-black/[0.04] rounded-md" onClick={() => push('/chat')}>
            <MessageCircle size={28} strokeWidth={1} stroke={theme == "dark" ? "#C2C2C2" : "#000000"} />
            {unread && unread > 0 ? <span className="absolute min-w-[12px] text-center -top-[2px] -right-[2px] text-[9px] leading-3 px-[3px] text-white bg-red-500 rounded-md">{unread}</span> : null}
          </Button>
          <p>Chat</p>
        </TooltipProvider>
      )
    }
    
    else{
      return (
        <TooltipProvider isButton>
          <Button variant="ghost" size="icon" className="flex items-center justify-center w-7 h-7 dark:hover:bg-[#272729] hover:border hover:border-transparent hover:bg-black/[0.04] rounded-md" onClick={() => push('/')}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke={theme == "dark" ? "#C2C2C2" : "#000000"} className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
          </Button>
          <p>Home</p>
        </TooltipProvider>
      )
    }
}