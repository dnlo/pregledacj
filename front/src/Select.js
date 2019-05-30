export default ({selectFeedHandler, feeds, selectedFeeds}) => {
    let selectFeed = e => {
        document.querySelector("#"+e).classList.toggle("bg-red")
        let ls = window.localStorage
        if (!ls.getItem(e)) {
            ls.setItem(e, true)
        } else {
            ls.removeItem(e)
        }
        selectFeedHandler()
    } 
    let buttonClasses = "pointer ma2 pa3 br3 shadow-2"
    return (
        <div className="flex flex-wrap ma4">
            <h2 className="mv4 w-100">Koje oces</h2>
            {Object.keys(feeds).map(e => {
                if (selectedFeeds.includes(e)){
                    return (
                        <span id={e} onClick={e => selectFeed(e.target.id)} className={"bg-green white "+buttonClasses}>{e}</span>
                    )
                }
                return (
                    <span id={e} onClick={e => selectFeed(e.target.id)} className={buttonClasses}>{e}</span>
                )
            })}    
        </div>
    )
}