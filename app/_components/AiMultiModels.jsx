import AiModellist from '@/shared/AiModellist'
import Image from 'next/image'
import React, { useContext, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Lock, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AiSelectedModelContext } from '@/context/AiSelectedModelContext'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/config/FirebaseConfig'
import { useUser } from '@clerk/nextjs'

function AiMultiModels() {
  const {user}=useUser();
    const [aiModelList,setAiModelList]=useState(AiModellist)
    const {aiSelectedModels,setAiSelectedModels}=useContext(AiSelectedModelContext)
    const onToggleChange = (model,value)=>{
        setAiModelList((prev)=>
        prev.map((m)=>m.model===model?{...m,enable:value}: m))
    }

    const onSelectValue=async(parentModel,value)=>{
      setAiSelectedModels(prev=>({
        ...prev,
        [parentModel]:{
          modelId:value
        }
      }))
      //update to firebase database
      const docRef = doc(db,"users",user?.primaryEmailAddress?.emailAddress);
      await updateDoc(docRef,{
        selectedModelPref:aiSelectedModels
      })
    }
  return (
    <div className='flex flex-1 h-[75vh] border-b'>
        {aiModelList.map((model,index)=>(
            <div key={index} className={`flex flex-col border-r h-[70px] overflow-auto
                ${model.enable?'flex-1 min-w-[400px]':'w-[100px] flex-none'}`}>
            <div className='flex w-full items-center justify-between border-b p-4'>
                <div className='flex items-center gap-4'>
                    <Image src={model.icon} alt={model.model} width={24} height={24} />
                {model.enable&&    
                <Select defaultValue={aiSelectedModels[model.model].modelId} onValueChange={(value)=>onSelectValue(model.model,value)}>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder={aiSelectedModels[model.model].modelId} />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup className="px-3">
      <SelectLabel className='text-sm text-gray-400'>Free</SelectLabel>
    {model.subModel.map((subModel,i)=>subModel.premium==false&&(
        <SelectItem key={i} value={subModel.id}>{subModel.name}</SelectItem>
    ))}
    </SelectGroup>
    <SelectGroup className="px-3">
      <SelectLabel className='text-sm text-gray-400'>Premium</SelectLabel>
    {model.subModel.map((subModel,i)=>subModel.premium==true&&(
        <SelectItem key={i} value={subModel.name} disabled={subModel.premium}>
          {subModel.name}
        {subModel.premium&&<Lock className='h-4 w-4'/>}
        </SelectItem>
    ))}
    </SelectGroup>
    
  </SelectContent>
</Select>}
                </div>
                <div>
                   {model.enable? <Switch checked={model.enable}
                    onCheckedChange={(v)=>onToggleChange(model.model,v)}
                    />
                    :<MessageSquare onClick={()=>onToggleChange(model.model, true)}/>}
                </div>
          
          </div>
        </div>
      ))}
    </div>
  )
}

export default AiMultiModels