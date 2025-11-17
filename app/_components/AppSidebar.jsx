"use client"; 
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { SignInButton, useUser } from "@clerk/nextjs";
import {  Moon, Sun, User2, Zap } from "lucide-react"
import { useTheme } from "next-themes"
import Image from "next/image"
import CreditProgress from "./CreditProgress";
import { useContext, useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import moment from "moment";
import Link from "next/link"
import axios from "axios";
import { db } from "@/config/FirebaseConfig";
import { AiSelectedModelContext } from "@/context/AiSelectedModelContext";
import PricingModels from "./PricingModels";


export function AppSidebar() {
    const {theme,setTheme}=useTheme()
    const[mounted,setMounted] = useState(false)
    const {user}=useUser();
    const [chatHistory,setChatHistory]=useState([])
    const [freeMsgCount, setFreeMsgCount]=useState(0)
    const {aiSelectedModels,setAiSelectedModels,messages,setMessages} = useContext(AiSelectedModelContext)

    useEffect(()=>{
      user && GetChatHistory();
      
    },[user])

    useEffect(()=>{
      GetRemainingTokenMsgs();
    },[messages])
    const GetChatHistory=async()=>{
      const q=query(collection(db,"chatHistory"),where("userEmail",'==',user?.primaryEmailAddress?.emailAddress));
      const querySnapshot = await getDocs(q)

      querySnapshot.forEach((doc)=>{
          setChatHistory(prev=>[...prev,doc.data()])
      })
    }

    const GetLastUserMessageFromChat = (chats) => {
    if (!chats || !chats.messages) {
      return {
        chatId: chats?.chatId || "",
        message: "No messages yet",
        lastMsgDate: "N/A",
      };
    }

    const allMessages = Object.values(chats.messages).flat();
    const userMessages = allMessages.filter((msg) => msg.role === "user");

    const lastUserMsg =
      userMessages.length > 0
        ? userMessages[userMessages.length - 1].content
        : "No user message";

    const lastUpdated = chats.lastUpdated || Date.now();
    const formattedDate = moment(lastUpdated).fromNow();

    return {
      chatId: chats.chatId,
      message: lastUserMsg,
      lastMsgDate: formattedDate,
    };
  };
    const GetRemainingTokenMsgs=async()=>{
      try{
        const result=await axios.post('/api/user-remaining-msg')
        setFreeMsgCount(result?.data?.remainingToken);
      } catch(error){
        console.error("Error fetching remaining tokens:", error);
      }
    }

    useEffect(()=>{
      setMounted(true)
    },[])
  return (
    <Sidebar>
      <SidebarHeader>
        <div>
        <div className="p-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
        <Image src={'/logo.svg'} alt="logo" width={60} height={60}
            className="w-[40px] h-[40px]"/>
            <h2 className="font-bold text-xl">NexusAI</h2>
            </div>
            <div>
              {mounted && (
                theme == 'light'? (<Button variant={'ghost'} onClick={()=>setTheme('dark')}> <Sun /></Button>):(
                <Button variant={'ghost'} onClick={()=>setTheme('light')}><Moon /></Button>)
                )}
            </div>
            </div>
            {user?
            <Link href={"/"}>
            <Button className="mt-7 w-full" size="lg">+ New Chat</Button></Link>:
            <SignInButton>
            <Button className="mt-7 w-full" size="lg">+ New Chat</Button>
            </SignInButton>}
            </div>
        </SidebarHeader>
      <SidebarContent>
        <SidebarGroup >
            <div className={"p-3"}>
            <h2 className="font-bold text-lg">Chat</h2>
           {!user&& <p className="text-sm text-gray-500">Sign in to start chatting with multiple model</p>}

              {chatHistory.map((chat,index)=>(
                
                <Link href={'?chatId='+chat.chatId} key={index} className="mt-2 hover:bg-gray-500">
                  <h2 className="text-sm text-gray-400">{GetLastUserMessageFromChat(chat).lastMsgDate}</h2>
                  <h2 className="text-lg line-clamp-1">{GetLastUserMessageFromChat(chat).message}</h2>
                </Link>
              ))}
            </div>
        </SidebarGroup >
      </SidebarContent>
      <SidebarFooter >
        <div className="p-3 mb-10">
          {!user?<SignInButton mode="modal">
            <Button className={"w-full"} size={'lg'}>Sign In/Sign Up</Button>
            </SignInButton>
            :
            <div>
              <CreditProgress remainingToken={freeMsgCount}/>
              <PricingModels>
              <Button className={'w-full mb-3'}> <Zap /> Upgrade Plan</Button></PricingModels>
              <Button className="flex w-full " variant={'ghost'} >
              <User2/> <h2>Settings</h2>
            </Button>
            </div>
            }
        </div>
        </SidebarFooter>
    </Sidebar>
  )
}