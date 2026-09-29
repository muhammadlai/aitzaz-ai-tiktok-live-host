import {lazy,Suspense,useEffect,useRef,useState} from 'react'

const AvatarStage=lazy(()=>import('./AvatarStage').then(m=>({default:m.AvatarStage})))

export function DeferredAvatarStage({modelUrl,speaking}:{modelUrl:string;speaking:boolean}){
 const ref=useRef<HTMLDivElement>(null)
 const [ready,setReady]=useState(false)
 useEffect(()=>{
  const el=ref.current
  if(!el)return
  let timer:number|undefined
  const io=new IntersectionObserver(([entry])=>{
   if(entry.isIntersecting){
    timer=window.setTimeout(()=>setReady(true),1200)
    io.disconnect()
   }
  },{rootMargin:'200px'})
  io.observe(el)
  return()=>{io.disconnect();if(timer)window.clearTimeout(timer)}
 },[])
 return <div ref={ref} className="avatarDeferred">
  {ready
   ? <Suspense fallback={<div className="avatar3d avatarLoading"><div>Loading 3D host…</div></div>}><AvatarStage modelUrl={modelUrl} speaking={speaking}/></Suspense>
   : <div className="avatar3d avatarLoading"><div>3D host preview ready</div><small>Full 3D model loads after the studio opens</small></div>}
 </div>
}
