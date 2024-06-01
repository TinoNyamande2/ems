export const reloadSession = () =>{
    const event = new Event("visibiltychange");
    document.dispatchEvent(event)
}