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
import { Moon, Sun, User2, Zap } from "lucide-react"
import { useTheme } from "next-themes"
import Image from "next/image"
import CreditProgress from "./CreditProgress";
import { useEffect, useState } from "react";

export function AppSidebar() {
    const {theme,setTheme}=useTheme()
    const[mounted,setMounted] = useState(false)
    const {user}=useUser();

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
            <Button className="mt-7 w-full" size="lg">+ New Chat</Button>:
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
              <CreditProgress/>
              <Button className={'w-full mb-3'}> <Zap /> Upgrade Plan</Button>
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