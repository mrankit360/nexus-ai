"use client"
import React, { useEffect, useState } from 'react'
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from './_components/AppSidebar'
import AppHeader from './_components/AppHeader'
import { useUser } from '@clerk/nextjs'
import { db } from '@/config/FirebaseConfig'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { DefaultModel } from '@/shared/AiModels'
import { AiSelectedModelContext } from '@/context/AiSelectedModelContext'
import { UserDetailContext } from '@/context/UserDetailsContext'

function Provider({children,...props}) {
  const {user}=useUser();
  const [aiSelectedModels,setAiSelectedModels]=useState(DefaultModel)
  const [userDetail,setUserDetail]=useState()

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
      const userInfo=userSnap.data();
      setAiSelectedModels(userInfo?.selectedModelPref)
      setUserDetail(userInfo);
;      return ;
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
      setUserDetail(userData);
    }
    //if not then insert
  }
  return (
    <NextThemesProvider {...props}
    attribute="class"
    defaultTheme="system"
    enableSystem
    disableTransitionOnChange >
      <UserDetailContext.Provider value={{userDetail,setUserDetail}}>
    <AiSelectedModelContext.Provider value={{aiSelectedModels,setAiSelectedModels}}>
    <SidebarProvider>
        <AppSidebar/>
        
    <div className='w-full'>
        <AppHeader/>{children}</div>
    </SidebarProvider>
    </AiSelectedModelContext.Provider>
    </UserDetailContext.Provider>
    </NextThemesProvider>
  )
}

export default Provider