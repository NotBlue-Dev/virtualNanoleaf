
//choix layout ou create

//create => save => use it

//choix => use it



const fs = require('fs');
const prompt = require('electron-prompt');
const AllowTopLevel = false;
const CellSize = new go.Size(50, 50);
const path = require('path');

let dic;

function updateCanvas(){
  const w = document.documentElement.clientWidth;
  const h = document.documentElement.clientHeight;
  const div = document.getElementById('myDiagramDiv')
  span = document.getElementById('big')
  div.style.height = h+"px"
  div.style.width = w-span.offsetWidth+"px"
}



window.addEventListener("resize", updateCanvas);

updateCanvas();

function save() {

  const data = JSON.stringify(dic);

  prompt({
    title: 'Name your layout',
    label: 'Give a name to the file',
    value: 'eg: Design Test 1',
    type: 'input'
  }).then((r) => {
      if(r === null) {
          console.log('user cancelled');
      } else {
        fs.writeFile('customPanel.json', data, 'utf8', (err) => {
          if (err) {
              console.log(`Error writing file: ${err}`);
          } else {
              console.log(`File is written successfully!`);
          }
        });
        dir = Buffer.from(r, 'utf-8').toString('hex')
        sessionStorage.setItem('name', r)
        fs.mkdirSync(path.join(__dirname, `../../layout/${dir}`))
        fs.writeFile(`./layout/${dir}/${r}.json`, data, 'utf8', (err) => {
          if (err) {
              console.log(`Error writing file: ${err}`);
          } else {
              console.log(`File is written successfully!`);
              document.location.href="../index.html"
          }
        });
      }
  })
  .catch(console.error);
}

function init() {
  const $ = go.GraphObject.make;

  sideLength = 100;
  let numPanels;
  let panelId;
  let x;
  let y;
  o = 0;
  let shapeType;

  myDiagram =
    $(go.Diagram, "myDiagramDiv",
      {
        grid: $(go.Panel, "Grid",
          { gridCellSize: CellSize },
          $(go.Shape, "LineH", { stroke: "#707070" }),
          $(go.Shape, "LineV", { stroke: "#707070" })
        ),
        "draggingTool.isGridSnapEnabled": true,
        "draggingTool.gridSnapCellSpot": go.Spot.Center,
        "resizingTool.isGridSnapEnabled": true,

        "ModelChanged": function(e) {
          if (e.isTransactionFinished) {
            data = JSON.parse(myDiagram.model.toJson())
            canva = data.nodeDataArray[0]
            numPanels = data.nodeDataArray.length-1;
            dic = [numPanels, sideLength, []]
            for (let i = 1; i<data.nodeDataArray.length; i++) {
              shapeType = 2;
              panelId = data.nodeDataArray[i].key.split('g')[1] * 12
              if (data.nodeDataArray[i].key == 'g') {panelId = 6; shapeType = 3;}
              x = data.nodeDataArray[i].pos.split(' ')[0]
              y = data.nodeDataArray[i].pos.split(' ')[1]
              dic[2].push({"panelId":panelId,"x":x,"y":y,"o":o,"shapeType":shapeType})
            }
          }
        },
        "animationManager.isEnabled": false,
        "undoManager.isEnabled": true
      });

  myDiagram.nodeTemplate =
    $(go.Node, "Auto",
      {
        resizable: false, resizeObjectName: "SHAPE",
    
        locationSpot: new go.Spot(0, 0, CellSize.width / 2, CellSize.height / 2),
        
        mouseDragEnter: function(e, node) {
          e.handled = true;
          node.findObject("SHAPE").fill = "#cc0000";
          e.diagram.currentCursor = "not-allowed";
          highlightGroup(node.containingGroup, false);
        },
        mouseDragLeave: function(e, node) {
          node.updateTargetBindings();
        },
        mouseDrop: function(e, node) { 
          node.diagram.currentTool.doCancel();
        }
      },
     
      
      new go.Binding("position", "pos", go.Point.parse).makeTwoWay(go.Point.stringify),

      $(go.Shape, "RoundedRectangle",
        {
          name: "SHAPE",
          fill: "white",
          stroke:'#FFFFFF',
          parameter1:3,
          strokeWidth: 3,
          minSize: CellSize,
          desiredSize: CellSize
        },
        new go.Binding("fill", "color"),
        new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify)),
    );  



  function highlightGroup(grp, show) {
    if (!grp) return false;
    const tool = grp.diagram.toolManager.draggingTool;
    grp.isHighlighted = show && grp.canAddMembers(tool.draggingParts);
    return grp.isHighlighted;
  }

  const groupFill = "rgba(112,112,112,0.3)";
  const groupStroke = "rgba(112,112,112,0.3)";
  const dropFill = "rgba(36,36,36,0.3)";
  const dropStroke = "rgba(36,36,36,0.3)";

  myDiagram.groupTemplate =
    $(go.Group,
      {
        layerName: "Background",
        resizable: true, resizeObjectName: "SHAPE",
        locationSpot: new go.Spot(0, 0, CellSize.width / 2, CellSize.height / 2)
      },
     
      new go.Binding("position", "pos", go.Point.parse).makeTwoWay(go.Point.stringify),
      {
        mouseDragEnter: function(e, grp, prev) {
          if (!highlightGroup(grp, true)) e.diagram.currentCursor = "not-allowed"; else e.diagram.currentCursor = "";
        },
        mouseDragLeave: function(e, grp, next) { highlightGroup(grp, false); },
        mouseDrop: function(e, grp) {
          const ok = grp.addMembers(grp.diagram.selection, true);
          if (!ok) grp.diagram.currentTool.doCancel();
        }
      },
      $(go.Shape, "Rectangle",
        {
          name: "SHAPE",
          fill: groupFill,
          stroke: groupStroke,
          minSize: new go.Size(CellSize.width * 2, CellSize.height * 2)
        },
        new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
        new go.Binding("fill", "isHighlighted", function(h) { return h ? dropFill : groupFill; }).ofObject(),
        new go.Binding("stroke", "isHighlighted", function(h) { return h ? dropStroke : groupStroke; }).ofObject())
    );

  myDiagram.commandHandler.memberValidation = function(grp, node) {
    if (grp instanceof go.Group && node instanceof go.Group) return false; 
    return true;
  };

  myDiagram.mouseDragOver = function(e) {
    if (!AllowTopLevel) {
      const tool = e.diagram.toolManager.draggingTool;
      if (!tool.draggingParts.all(function(p) {
        return p instanceof go.Group || (!p.isTopLevel && tool.draggingParts.contains(p.containingGroup));
      })) {
        e.diagram.currentCursor = "not-allowed";
      } else {
        e.diagram.currentCursor = "";
      }
    }
  };
  
  myDiagram.mouseDrop = function(e) {
    if (AllowTopLevel) {
      if (!e.diagram.commandHandler.addTopLevelParts(e.diagram.selection, true)) {
        e.diagram.currentTool.doCancel();
      }
    } else {
      if (!e.diagram.selection.all(function(p) {
        return p instanceof go.Group || (!p.isTopLevel && p.containingGroup.isSelected);
      })) {
        e.diagram.currentTool.doCancel();
      }
    }
  };

  myDiagram.model = new go.GraphLinksModel([
    { key: "G1", isGroup: true, pos: "0 0", size: "1000 500" },
  ]);

  myPaletteBig =
    $(go.Palette, "myPaletteBig",
      { 
        nodeTemplate: myDiagram.nodeTemplate,
        groupTemplate: myDiagram.groupTemplate
      });

  myPaletteBig.model = new go.GraphLinksModel([
    { key: "g", color: '#DADEE1', size: "100 100" },
  ]);

}

function undo() {myDiagram.commandHandler.undo()}
function redo() {myDiagram.commandHandler.redo()}

window.addEventListener('DOMContentLoaded', init);

//need to start  0 0