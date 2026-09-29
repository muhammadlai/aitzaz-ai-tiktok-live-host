import {lazy,Suspense,useEffect,useRef,useState} from 'react'

const AvatarStage=lazy(()=>import('./AvatarStage').then(m=>({default:m.AvatarStage})))

export function DeferredAvatarStage({modelUrl,speaking,enabled=true}:{modelUrl:string;speaking:boolean;enabled?:boolean}){
 const ref=useRef<HTMLDivElement>(null)
 const [ready,setReady]=useState(false)
 useEffect(()=>{
  if(!enabled)return
  const el=ref.current
  if(!el)return
  let timer:number|undefined
  const io=new IntersectionObserver(([entry])=>{
   if(entry.isIntersecting){
    timer=window.setTimeout(()=>setReady(true),500)
    io.disconnect()
   }
  },{rootMargin:'200px'})
  io.observe(el)
  return()=>{io.disconnect();if(timer)window.clearTimeout(timer)}
 },[enabled])
 return <div ref={ref} className="avatarDeferred">
  {ready
   ? <Suspense fallback={<div className="avatar3d avatarLoading"><div>Loading 3D host…</div></div>}><AvatarStage modelUrl={modelUrl} speaking={speaking}/></Suspense>
   : <div className="avatar3d avatarLoading"><div>{enabled?'Preparing 3D host…':'SARA is ready'}</div><small>{enabled?'Loading model…':'3D model loads when Test LIVE starts'}</small></div>}
 </div>
}
