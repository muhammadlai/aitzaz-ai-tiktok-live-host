import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

export function AvatarStage({ modelUrl, speaking }: { modelUrl: string; speaking: boolean }) {
  const canvasRef=useRef<HTMLCanvasElement>(null), speakingRef=useRef(speaking)
  useEffect(()=>{speakingRef.current=speaking},[speaking])
  useEffect(()=>{
    const canvas=canvasRef.current; if(!canvas)return
    const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true}); renderer.setPixelRatio(Math.min(devicePixelRatio,2)); renderer.outputColorSpace=THREE.SRGBColorSpace
    const scene=new THREE.Scene(); scene.background=new THREE.Color(0x070912)
    const camera=new THREE.PerspectiveCamera(28,1,.01,100); camera.position.set(0,1.35,3.2)
    scene.add(new THREE.HemisphereLight(0xffffff,0x222244,2.2)); const key=new THREE.DirectionalLight(0xffffff,3); key.position.set(2,3,4); scene.add(key)
    const group=new THREE.Group(); scene.add(group); const clock=new THREE.Clock(); let frame=0; let disposed=false; const morphs:any[]=[]
    if(modelUrl){ new GLTFLoader().load(modelUrl,g=>{if(disposed)return; group.clear(); const object=g.scene; object.position.y=-1.25; object.scale.setScalar(2.25); group.add(object); object.traverse((o:any)=>{if(o.morphTargetInfluences&&o.morphTargetDictionary)morphs.push(o)})},undefined,e=>console.warn('Avatar model failed',e)) }
    const resize=()=>{const w=canvas.clientWidth||700,h=canvas.clientHeight||500;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}; resize(); addEventListener('resize',resize)
    const animate=()=>{if(disposed)return;frame=requestAnimationFrame(animate);const t=clock.getElapsedTime();group.rotation.y=Math.sin(t*.35)*.08;group.position.y=Math.sin(t*1.2)*.012
      for(const o of morphs){const d=o.morphTargetDictionary,inf=o.morphTargetInfluences; const mouth=d.viseme_aa??d.mouthOpen??d.JawOpen??d.jawOpen; const blink=d.eyeBlinkLeft??d.blinkLeft??d.blink; if(mouth!==undefined)inf[mouth]=speakingRef.current?.18+.18*Math.abs(Math.sin(t*16)):0; if(blink!==undefined)inf[blink]=Math.max(0,Math.sin(t*.8)**28)} renderer.render(scene,camera)};animate()
    return()=>{disposed=true;cancelAnimationFrame(frame);removeEventListener('resize',resize);renderer.dispose()}
  },[modelUrl])
  return <div className="avatar3d"><canvas ref={canvasRef}/><div className="avatar-badge">{modelUrl?'REALISTIC 3D MODEL':'3D AVATAR SLOT'}<span>{speaking?'● SPEAKING':'● IDLE'}</span></div>{!modelUrl&&<div className="avatar-note">Set VITE_AVATAR_MODEL_URL to a licensed GLB/GLTF/VRM female avatar.</div>}</div>
}
