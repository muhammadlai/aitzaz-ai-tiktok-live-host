export class CoHostEngine{
  constructor(){this.hostIds=['sara'];this.nextIndex=0;this.turn=0}
  setHosts(ids){
    const clean=[...new Set((Array.isArray(ids)?ids:[]).filter(Boolean))].slice(0,2)
    this.hostIds=clean.length?clean:['sara']; this.nextIndex=0; this.turn=0; return this.hostIds
  }
  getHosts(){return [...this.hostIds]}
  pick(event){
    if(this.hostIds.length===1)return this.hostIds[0]
    const text=String(event.text||'').toLowerCase()
    const mentioned=this.hostIds.find(id=>text.includes(id))
    if(mentioned)return mentioned
    const picked=this.hostIds[this.nextIndex%this.hostIds.length]
    this.nextIndex++
    return picked
  }
  shouldPartnerReact(event){
    if(this.hostIds.length<2)return false
    this.turn++
    return event.type==='comment' && this.turn%3===0
  }
  partnerOf(id){return this.hostIds.find(x=>x!==id)||id}
}
