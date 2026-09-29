import {lazy,Suspense,useEffect,useRef,useState} from 'react'

const AvatarStage=lazy(()=>import('./AvatarStage').then(m=>({default:m.AvatarStage})))

export function DeferredAvatarStage({modelUrl,speaking}:{modelUrl:string;speaking:boolean}){
 const ref=useRef<HTMLDivElement>(null)
 const [ready,setReady]=useState(false)
 useEffect(()=>{
  const el=ref.current
  if(!el)return
  const io=new IntersectionObserver(([entry])=>{
   if(entry.isIntersecting){setReady(true);io.disconnect()}
  },{rootMargin:'300px'})
  io.observe(el)
  return()=>io.disconnect()
 },[])
 return <div ref={ref} className="avatarDeferred">
  {ready
   ? <Suspense fallback={<div className="avatar3d avatarLoading"><div>Loading 3D host…</div></div>}><AvatarStage modelUrl={modelUrl} speaking={speaking}/></Suspense>
   : <div className="avatar3d avatarLoading"><div>3D host ready</div></div>}
 </div>
}
