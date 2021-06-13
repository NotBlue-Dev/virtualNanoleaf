const fs = require('fs');
const path = require('path')

const dir = path.join(__dirname, "../../layout")

fs.readdir(dir, (err, files) => {
  if(err) throw err;
  files.forEach(file => {
    names = Buffer.from(file, 'hex').toString('utf-8')
    buff = fs.readFileSync(path.join(__dirname, `../../layout/${file}/preview.txt`))
    previews = buff.toString()
    let card = document.createElement("div")
    card.className = `card ${names}`
    let topcard = document.createElement("div");
    topcard.className = 'topcard'
    card.appendChild(topcard);
    let title = document.createElement("div");
    title.className = 'title'
    txt = document.createTextNode(names);
    title.appendChild(txt)
    topcard.appendChild(title)
    let options = document.createElement("div");
    options.className = 'options'
    txt = document.createTextNode('...');
    options.appendChild(txt)
    let hr = document.createElement("HR");
    card.appendChild(hr)
    let preview = document.createElement("div");
    preview.className = 'preview'
    let img = document.createElement("IMG");
    img.src = previews
    preview.appendChild(img)
    card.appendChild(preview)
    card.onclick = function () {
      sessionStorage.setItem('name', Buffer.from(file, 'hex').toString('utf-8'))
      fs.copyFileSync(path.join(__dirname, `../../layout/${file}/${Buffer.from(file, 'hex').toString('utf-8')}.json`), path.join(__dirname, `../../customPanel.json`));
      window.location = '../index.html'
    }
    document.getElementById("layouts").appendChild(card)
  })
})