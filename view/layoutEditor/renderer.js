
const AllowTopLevel = false;
const CellSize = new go.Size(50, 50);

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


function init() {
  const $ = go.GraphObject.make;

  myDiagram =
    $(go.Diagram, "myDiagramDiv",
      {
        grid: $(go.Panel, "Grid",
          { gridCellSize: CellSize },
          $(go.Shape, "LineH", { stroke: "lightgray" }),
          $(go.Shape, "LineV", { stroke: "lightgray" })
        ),
        "draggingTool.isGridSnapEnabled": true,
        "draggingTool.gridSnapCellSpot": go.Spot.Center,
        "resizingTool.isGridSnapEnabled": true,

        "ModelChanged": function(e) {
          if (e.isTransactionFinished) {
            console.log(myDiagram.model.toJson());
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
          node.findObject("SHAPE").fill = "red";
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

      $(go.Shape, "Rectangle",
        {
          name: "SHAPE",
          fill: "white",
          minSize: CellSize,
          desiredSize: CellSize
        },
        new go.Binding("fill", "color"),
        new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify)),


      $(go.TextBlock,
        { alignment: go.Spot.Center, font: 'bold 16px sans-serif' },
        new go.Binding("text", "key"))
    );  

  function highlightGroup(grp, show) {
    if (!grp) return false;
    const tool = grp.diagram.toolManager.draggingTool;
    grp.isHighlighted = show && grp.canAddMembers(tool.draggingParts);
    return grp.isHighlighted;
  }

  const groupFill = "rgba(128,128,128,0.2)";
  const groupStroke = "gray";
  const dropFill = "rgba(128,255,255,0.2)";
  const dropStroke = "red";

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

  const green = '#B2FF59';

  myPaletteBig =
    $(go.Palette, "myPaletteBig",
      { 
        nodeTemplate: myDiagram.nodeTemplate,
        groupTemplate: myDiagram.groupTemplate
      });

  myPaletteBig.model = new go.GraphLinksModel([
    { key: "g", color: green, size: "100 100" },
  ]);
}
window.addEventListener('DOMContentLoaded', init);