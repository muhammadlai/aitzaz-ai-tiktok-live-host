import { useEffect, useRef } from 'react'

export function AvatarStage({ modelUrl, speaking, audioBase64 }: { modelUrl: string; speaking: boolean; audioBase64?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const state = useRef<any>({ morphs: [] })

  useEffect(() => {
    let disposed = false
    let frame = 0
    let renderer: any
    let camera: any
    ;(async () => {
      const THREE: any = await import(/* @vite-ignore */ 'https://esm.sh/three@0.180.0')
      const { GLTFLoader }: any = await import(/* @vite-ignore */ 'https://esm.sh/three@0.180.0/examples/jsm/loaders/GLTFLoader.js?deps=three@0.180.0')
      if (disposed || !canvasRef.current) return
      const canvas = canvasRef.current
      const width = canvas.clientWidth || 700
      const height = canvas.clientHeight || 500
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setSize(width, height, false)
      const scene = new THREE.Scene()
      scene.background = new THREE.Color(0x070912)
      camera = new THREE.PerspectiveCamera(28, width / height, 0.01, 100)
      camera.position.set(0, 1.35, 3.2)
      scene.add(new THREE.HemisphereLight(0xffffff, 0x222244, 2.2))
      const key = new THREE.DirectionalLight(0xffffff, 3)
      key.position.set(2, 3, 4)
      scene.add(key)
      const group = new THREE.Group()
      scene.add(group)
      state.current.scene = scene
      state.current.group = group

      if (modelUrl) {
        new GLTFLoader().load(modelUrl, (g: any) => {
          if (disposed) return
          group.clear()
          const object = g.scene
          object.position.y = -1.25
          object.scale.setScalar(2.25)
          group.add(object)
          const morphs: any[] = []
          object.traverse((o: any) => { if (o.morphTargetInfluences && o.morphTargetDictionary) morphs.push(o) })
          state.current.morphs = morphs
        }, undefined, (e: any) => console.warn('Avatar model failed', e))
      }

      const clock = new THREE.Clock()
      const animate = () => {
        if (disposed) return
        frame = requestAnimationFrame(animate)
        const t = clock.getElapsedTime()
        group.rotation.y = Math.sin(t * 0.35) * 0.08
        group.position.y = Math.sin(t * 1.2) * 0.012
        for (const object of state.current.morphs || []) {
          const d = object.morphTargetDictionary || {}
          const inf = object.morphTargetInfluences || []
          const mouth = d.viseme_aa ?? d.mouthOpen ?? d.JawOpen ?? d.jawOpen
          const blink = d.eyeBlinkLeft ?? d.blinkLeft ?? d.blink
          if (mouth !== undefined) inf[mouth] = speaking ? 0.28 + 0.22 * Math.abs(Math.sin(t * 17)) : 0
          if (blink !== undefined) inf[blink] = Math.max(0, Math.sin(t * 0.8) ** 28)
        }
        renderer.render(scene, camera)
      }
      animate()
      const resize = () => { const w = canvas.clientWidth || 700; const h = canvas.clientHeight || 500; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix() }
      window.addEventListener('resize', resize)
      state.current.cleanup = () => window.removeEventListener('resize', resize)
    })()
    return () => { disposed = true; cancelAnimationFrame(frame); state.current.cleanup?.(); renderer?.dispose() }
  }, [modelUrl])

  useEffect(() => {
    if (!audioBase64) return
    const audio = new Audio(`data:audio/mpeg;base64,${audioBase64}`)
    audio.play().catch(() => {})
    return () => { audio.pause() }
  }, [audioBase64])

  return <div className="avatar3d"><canvas ref={canvasRef} /><div className="avatar-badge">{modelUrl ? '3D AVATAR' : '3D AVATAR READY'}<span>{speaking ? '● SPEAKING' : '● IDLE'}</span></div></div>
}
