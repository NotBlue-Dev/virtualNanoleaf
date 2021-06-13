

   function Random(json,dur) {
    let delayTime;
    let Defaultloop = {"name":"loop", "value":true};
    let transTime; //1 = 10ms
    let DefaultdelayTime;
    let DefaulttransTime;
    exporter.all(function (err, all) {
        settings = JSON.parse(all.plugins[findWithAttr(all.plugins, "pluginsName", "Random")].pluginsData)
        DefaultdelayTime = {"name": "delayTime", "value": settings.pluginConfig[findWithAttr(settings.pluginConfig, "name", "delayTime")].defaultValue}
        DefaulttransTime = {"name": "transTime", "value": settings.pluginConfig[findWithAttr(settings.pluginConfig, "name", "transTime")].defaultValue}
    
    if (json.hasOverlay == true) {
        //implemented later
    }
    if (json.pluginType == 'rythm') {
        //implemented later
    }
    //get json
    colors = json.palette
    options = json.pluginOptions
    positionData = Data.positionData

    //define color
    hue = [];
    sat = [];
    bright = [];
    prob = [];
    for (let i in colors) {
        hue.push(colors[i].hue);
        sat.push(colors[i].saturation);
        bright.push(colors[i].brightness);
        prob.push(colors[i].probability);
    }

    //define options
    delayTime = options[findWithAttr(options, 'name', 'delayTime')] ?? DefaultdelayTime
    loop = options[findWithAttr(options, 'name', 'loop')] ?? Defaultloop;
    transTime = options[findWithAttr(options, 'name', 'transTime')] ?? DefaulttransTime;
    if(loop.value == true) {
        effectInterval = setInterval(() => {  
            randomPanel(true)
        }, delayTime.value+transTime.value*60);
    }
    setTimeout(() => {
        randomPanel(false)
    }, 100);
    function randomPanel(tr) {
        //for each panel
        positionData.forEach(item => {
            rand = Math.round(Math.random() * (hue.length-1))
            color = tinycolor({h: hue[rand], s: sat[rand], v: bright[rand]}).toHsl();
            id = item.panelId
            panel = document.getElementById('id_'+id);
            panel.style.backgroundColor = "hsl("+Math.round(color.h)+","+color.s*100+"%,"+color.l*100+"%)";
            if(tr == true) {
                panel.style.transition = (transTime.value*75/1000)+"s all ease-in-out"
            }
        });
    }
    if(dur != 0) {
        setTimeout(() => {
            clearInterval(effectInterval)
            clearTimeout(effectTimeout)
            removeTrans(Data)
            clearPanel(Data)
            latest()
        }, dur*1000);
    }
});
   }
