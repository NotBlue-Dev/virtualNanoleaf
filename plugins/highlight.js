let effectInterval;
let effectTimeout;

function Highlight(json,dur) {
    let delayTime;
    let Defaultloop = {"name":"loop", "value":true};
    let transTime; //1 = 10ms
    let mainColorProb;
    let DefaultdelayTime;
    let DefaulttransTime;
    // let rotDirection = {"name": "transTime", "value": 'cw'};
    // let radDirection = {"name": "transTime", "value": 'in'};
    // let linDirection = {"name": "transTime", "value": 'up'}; //holy shit how i will determinate up /right
    exporter.all(function (err, all) {
        settings = JSON.parse(all.plugins[findWithAttr(all.plugins, "pluginsName", "Highlight")].pluginsData)
        DefaultdelayTime = {"name": "delayTime", "value": settings.pluginConfig[findWithAttr(settings.pluginConfig, "name", "delayTime")].defaultValue}
        DefaultmainColorProb = {"name": "mainColorProb", "value": settings.pluginConfig[findWithAttr(settings.pluginConfig, "name", "mainColorProb")].defaultValue}
        DefaulttransTime = {"name": "transTime", "value": settings.pluginConfig[findWithAttr(settings.pluginConfig, "name", "transTime")].defaultValue}
        
        //DEFAULT VALUE
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
        mainColorProb = options[findWithAttr(options, 'name', 'mainColorProb')] ?? DefaultmainColorProb;
        nColorsPerFrame = options[findWithAttr(options, 'name', 'nColorsPerFrame')];
        console.log(DefaultdelayTime)
        //change some color :)
        //set background color
        background = tinycolor({h: hue[0], s: sat[0], v: bright[0]}).toHsl();
        colors.shift()

        //number x of panel (nColorsPerFrame) transition to white (transTime), stay delayTime thent of second and transition back
        hsl(Data,background.h,background.s*100, background.l*100);
        function nb() {
            if(nColorsPerFrame == undefined) {
                x = Math.round((100-mainColorProb.value)*(1/100)*Data.numPanels)
                y = getRandomInt(0,x)
                return y;
            } else {
                y = getRandomInt(0,nColorsPerFrame)
                return y;
            }
        }
        nbPanel = nb();
        panels = getRandomSubarray(positionData,nbPanel);

        if(loop.value == true) {
            effectInterval = setInterval(() => {  
                highpanel()
            }, delayTime.value+transTime.value*80);
        }
        setTimeout(() => {
            highpanel()
        }, 200);
        function highpanel() {
            //for each color in pallettes
            colors.forEach(function(item){
                nbPanel = nb();
                panels = getRandomSubarray(positionData,nbPanel);     
                color = tinycolor({h: item.hue, s: item.saturation, v: item.brightness}).toHsl();
                function changeColor(pan) {
                    for (let i in pan) {
                        id = pan[i].panelId;
                        panel = document.getElementById('id_'+id);
                        panel.style.transition = transTime.value*75/1000+"s all ease-in-out"
                        panel.style.backgroundColor = "hsl("+Math.round(color.h)+","+color.s*100+"%,"+color.l*100+"%)";
                    }
                    effectTimeout = setTimeout(() => {
                        for (let i in pan) {
                            id = pan[i].panelId;
                            panel = document.getElementById('id_'+id);
                            panel.style.backgroundColor = "hsl("+background.h+","+background.s*100+"%,"+background.l*100+"%)";
                        }
                    }, delayTime.value+transTime.value*75);
                }
                changeColor(panels)
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