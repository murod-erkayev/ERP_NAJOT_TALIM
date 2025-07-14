import { useState } from "react"
export const useWorker = ()=>{
    const [result , setResult] = useState<any>(null)
    const runWorker =  (limit:number)=>{
        try {
            const worker = new Worker("/worker.js")
            worker.onmessage = (event)=>{
                console.log("Worker Massage", event.data);
                const {result} = event.data
                setResult(result)
            }
            worker.onerror = (error)=>{
                console.log("Worker error:",error);
            }
            worker.postMessage({limit})
        } catch (error) {
            console.log(error);
        }
    }
    return {
        runWorker,
        result
    }
}