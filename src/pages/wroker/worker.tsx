import React from 'react'
import { Button } from 'antd'
import { useWorker } from '../../hooks/useWorker'
export const Worker = () => {
    const {runWorker} = useWorker()
    const Calculate = ()=>{
        runWorker(100000000000)
    }
    const test = ()=>{
        console.log("test");
    }
  return (
    <div>

        <h1>Worker </h1>
        <div>
            <Button type='primary' onClick={Calculate}>Run Worker Calulcate</Button>
            <Button type="primary" onClick={test}>Run Test</Button>
        </div>
    </div>
  )
}
export default Worker
