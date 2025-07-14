
self.onmessage = function(event){
    const {data} = event
    console.log("Limit", data);
    let result = 0
    for (let index = 0; index < data.limit; index++) {
        result+=index
    }
    self.postMessage({
        result:result
    })
}