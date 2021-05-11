let custom = false;

function animData(data,dur=0) {
    
    try {
        animDatas = data.animData.split(' ')
        nb = animDatas[0]
        animDatas.splice(0,1)
        len = animDatas.length
        temp = animDatas
        for(let i=0; i<len/7; i++) {
            pan = temp.splice(0,7)
            panel = document.getElementById('id_'+pan[0]);
            panel.style.backgroundColor = "rgb("+pan[2]+","+pan[3]+","+pan[4]+")";
            panel.style.transition = (pan[6]*0.1)/10+"s all ease-in-out";
        }
        if (dur != 0) {
            setTimeout(() => {
                removeTrans(Data)
                clearPanel(Data)
                latest()
            }, dur*1000);
        }
        custom = true;
    } catch {
        console.log('error with animdata')
    }
}
