export function GetItem(key:string){
    return localStorage.getItem(key)
}
export function SetItem(key:string, value:string){
    return localStorage.setItem(key,value)
}
export function removeItem(key:string){
    return localStorage.removeItem(key)
}

export function ClearItem() {
  return localStorage.clear()
}


