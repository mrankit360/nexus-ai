"use client"
import React, { useEffect } from 'react'
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from './_components/AppSidebar'
import AppHeader from './_components/AppHeader'
import { useUser } from '@clerk/nextjs'
import { db } from '@/config/FirebaseConfig'
import { doc, getDoc, setDoc } from 'firebase/firestore'

function Provider({children,...props}) {
  const {user}=useUser();

  useEffect(()=>{
    if(user){
      CreateNewuser()
    }
  },[user])
  const CreateNewuser=async()=>{
    //if user exit
    const userRef=doc(db,"users",user?.primaryEmailAddress?.emailAddress)
    const userSnap=await getDoc(userRef)

    if(userSnap.exists()){
      console.log("existing user..;")
      return ;
    }else{
      const userData={
        name:user?.fullName,
        email:user?.primaryEmailAddress?.emailAddress,
        createdAt:new Date(),
        remainingMsg: 20, //only for free users
        plan: 'Free',
        credits:1000 //paid user
      }
      await setDoc(userRef,userData)
      console.log('New User Data Saved')
    }
    //if not then insert
  }
  return (
    <NextThemesProvider 
    attribute="class"
    defaultTheme="system"
    enableSystem
    disableTransitionOnChange
    {...props}>
    <SidebarProvider>
        <AppSidebar/>
        
    <div className='w-full'>
        <AppHeader/>{children}</div>
    </SidebarProvider>
    </NextThemesProvider>
  )
}

export default Provider