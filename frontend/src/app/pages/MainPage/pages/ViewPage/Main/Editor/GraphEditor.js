// import FieldDraggingTool from 'app/utils/fieldDragTool';
// import { CommonFormTypes } from 'globalConstants';
// import * as go from 'gojs';
// import { ReactDiagram } from 'gojs-react';
// import React, {
//   memo,
//   useCallback,
//   useContext,
//   useEffect,
//   useRef,
//   useState,
// } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import styled from 'styled-components';
// import { ViewStatus, ViewViewModelStages } from '../../constants';
// import { EditorContext } from '../../EditorContext';
// import { SaveFormContext } from '../../SaveFormContext';
// import { useViewSlice } from '../../slice';
// import { selectCurrentEditingViewAttr } from '../../slice/selectors';
// import { runSql, saveView } from '../../slice/thunks';
// import { isNewView } from '../../utils';
// import './index.less';
// const SQL = require('app/utils/sql').default;

// function initDiagram() {
//   go.Diagram.inherit(FieldDraggingTool, go.DraggingTool);
//   const $ = go.GraphObject.make;
//   const diagram = $(go.Diagram, {
//     validCycle: go.Diagram.CycleNotDirected, // don't allow loops
//     // For this sample, automatically show the state of the diagram's model on the page
//     // ModelChanged(e) {
//     //   if (e.isTransactionFinished) {
//     //     console.log(diagram.model.toJson());
//     //   }
//     // },
//     draggingTool: $(FieldDraggingTool),
//     'undoManager.isEnabled': true,
//     model: $(go.GraphLinksModel, {
//       linkKeyProperty: 'key', // IMPORTANT! must be defined for merges and data sync when using GraphLinksModel
//       linkFromPortIdProperty: 'fromField',
//       linkToPortIdProperty: 'toField',
//       // copiesArrays: true,
//       // copiesArrayObjects: true,
//     }),
//   });

//   // This template is a Panel that is used to represent each item in a Panel.itemArray.
//   // The Panel is data bound to the item object.
//   const fieldTemplate = $(
//     go.Panel,
//     'TableRow', // this Panel is a row in the containing Table
//     new go.Binding('portId', 'name'), // this Panel is a "port"
//     {
//       background: 'transparent', // so this port's background can be picked by the mouse
//       fromSpot: go.Spot.Right, // links only go from the right side to the left side
//       toSpot: go.Spot.Left,
//       // allow drawing links from or to this port:
//       fromLinkable: true,
//       toLinkable: true,
//     },
//     // {
//     //   // allow the user to select items -- the background color indicates whether "selected"
//     //   //?? maybe this should be more sophisticated than simple toggling of selection
//     //   click: (e, item) => {
//     //     // assume "transparent" means not "selected", for items
//     //     var oldskips = item.diagram.skipsUndoManager;
//     //     item.diagram.skipsUndoManager = true;
//     //     if (item.background === 'transparent') {
//     //       item.background = 'dodgerblue';
//     //     } else {
//     //       item.background = 'transparent';
//     //     }
//     //     item.diagram.skipsUndoManager = oldskips;
//     //   },
//     // },
//     $(
//       go.Shape,
//       {
//         width: 10,
//         height: 10,
//         column: 0,
//         strokeWidth: 1,
//         strokeJoin: 'round',
//         margin: 4,
//         // but disallow drawing links from or to this shape:
//         fromLinkable: false,
//         toLinkable: false,
//       },
//       new go.Binding('figure', 'figure'),
//       new go.Binding('fill', 'color'),
//     ),
//     $(
//       go.TextBlock,
//       {
//         margin: new go.Margin(0, 5),
//         column: 1,
//         font: 'bold 14px sans-serif',
//         stretch: go.GraphObject.Horizontal,
//         alignment: go.Spot.Left,
//         // and disallow drawing links from or to this text:
//         fromLinkable: true,
//         toLinkable: true,
//       },
//       new go.Binding('text', 'name'),
//     ),
//     $(
//       go.TextBlock,
//       {
//         margin: new go.Margin(0, 5),
//         column: 2,
//         font: '12px sans-serif',
//         alignment: go.Spot.Left,
//         fromLinkable: true,
//         toLinkable: true,
//       },
//       new go.Binding('text', 'info'),
//     ),
//   );

//   diagram.toolManager.draggingTool.fieldTemplate = fieldTemplate;
//   // This template represents a whole "record".
//   diagram.nodeTemplate = $(
//     go.Node,
//     'Auto',
//     {
//       copyable: false,
//       deletable: true,
//       isShadowed: true,
//       shadowOffset: new go.Point(3, 3),
//       shadowColor: '#C5C1AA',
//       locationSpot: go.Spot.Center,
//     },
//     new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(
//       go.Point.stringify,
//     ),
//     // this rectangular shape surrounds the content of the node
//     $(go.Shape, 'RoundedRectangle', {
//       fill: 'white',
//       stroke: '#eeeeee',
//       strokeWidth: 3,
//     }),
//     // the content consists of a header and a list of items
//     $(
//       go.Panel,
//       'Vertical',
//       // this is the header for the whole node
//       $(
//         go.Panel,
//         'Auto',
//         { stretch: go.GraphObject.Horizontal }, // as wide as the whole node
//         $(go.Shape, { fill: 'white', stroke: null }),
//         $(
//           go.TextBlock,
//           {
//             alignment: go.Spot.Center,
//             margin: 3,
//             stroke: 'black',
//             textAlign: 'center',
//             font: 'bold 16px sans-serif',
//           },
//           new go.Binding('text', 'name'),
//         ),
//       ),
//       // this Panel holds a Panel for each item object in the itemArray;
//       // each item Panel is defined by the itemTemplate to be a TableRow in this Table
//       $(
//         go.Panel,
//         'Table',
//         {
//           padding: 2,
//           minSize: new go.Size(100, 10),
//           defaultStretch: go.GraphObject.Horizontal,
//           itemTemplate: fieldTemplate,
//         },
//         new go.Binding('itemArray', 'fields'),
//       ), // end Table Panel of items
//     ), // end Vertical Panel
//   ); // end Node

//   diagram.linkTemplate = $(
//     go.Link, // the whole link panel
//     {
//       selectionAdorned: true,
//       layerName: 'Foreground',
//       reshapable: true,
//       routing: go.Link.AvoidsNodes,
//       corner: 5,
//       curve: go.Link.JumpOver,
//     },
//     $(
//       go.Shape, // the link shape
//       { stroke: '#303B45', strokeWidth: 2.5 },
//     ),
//     $(
//       go.TextBlock, // the "from" label
//       {
//         textAlign: 'center',
//         font: 'bold 14px sans-serif',
//         stroke: '#1967B3',
//         segmentIndex: 0,
//         segmentOffset: new go.Point(NaN, NaN),
//         segmentOrientation: go.Link.OrientUpright,
//       },
//       new go.Binding('text', 'text'),
//     ),
//     $(
//       go.TextBlock, // the "to" label
//       {
//         textAlign: 'center',
//         font: 'bold 14px sans-serif',
//         stroke: '#1967B3',
//         segmentIndex: -1,
//         segmentOffset: new go.Point(NaN, NaN),
//         segmentOrientation: go.Link.OrientUpright,
//       },
//       new go.Binding('text', 'toText'),
//     ),
//   );

//   diagram.contextMenu = $(go.HTMLInfo, {
//     show: showContextMenu,
//     hide: hideContextMenu,
//   });

//   // This is the actual HTML context menu:
//   let cxElement = document.getElementById('contextMenu');
//   // We don't want the div acting as a context menu to have a (browser) context menu!
//   cxElement.addEventListener(
//     'contextmenu',
//     function (e) {
//       e.preventDefault();
//       return false;
//     },
//     false,
//   );

//   function hideCX() {
//     if (diagram.currentTool instanceof go.ContextMenuTool) {
//       diagram.currentTool.doCancel();
//     }
//   }
//   function showContextMenu(obj, diagram, tool) {
//     // Show only the relevant buttons given the current state.
//     var cmd = diagram.commandHandler;
//     var hasMenuItem = false;
//     function maybeShowItem(elt, pred) {
//       if (pred) {
//         elt.style.display = 'block';
//         hasMenuItem = true;
//       } else {
//         elt.style.display = 'none';
//       }
//     }
//     maybeShowItem(document.getElementById('cut'), cmd.canCutSelection());
//     maybeShowItem(document.getElementById('copy'), cmd.canCopySelection());
//     maybeShowItem(
//       document.getElementById('paste'),
//       cmd.canPasteSelection(diagram.toolManager.contextMenuTool.mouseDownPoint),
//     );
//     maybeShowItem(document.getElementById('delete'), cmd.canDeleteSelection());
//     maybeShowItem(document.getElementById('color'), obj !== null);

//     // Now show the whole context menu element
//     if (hasMenuItem) {
//       cxElement.classList.add('show-menu');
//       // we don't bother overriding positionContextMenu, we just do it here:
//       var mousePt = diagram.lastInput.viewPoint;
//       cxElement.style.left = mousePt.x + 5 + 'px';
//       cxElement.style.top = mousePt.y + 'px';
//     }

//     // Optional: Use a `window` click listener with event capture to
//     //           remove the context menu if the user clicks elsewhere on the page
//     window.addEventListener('click', hideCX, true);
//   }

//   function hideContextMenu() {
//     cxElement.classList.remove('show-menu');
//     // Optional: Use a `window` click listener with event capture to
//     //           remove the context menu if the user clicks elsewhere on the page
//     window.removeEventListener('click', hideCX, true);
//   }

//   return diagram;
// }

// const GraphEditor = memo(({}) => {
//   const diagramRef = useRef();
//   const { actions } = useViewSlice();
//   const { showSaveForm } = useContext(SaveFormContext);
//   const config = useSelector(state =>
//     selectCurrentEditingViewAttr(state, { name: 'config' }),
//   );

//   const id = useSelector(state =>
//     selectCurrentEditingViewAttr(state, { name: 'id' }),
//   );

//   const stage = useSelector(state =>
//     selectCurrentEditingViewAttr(state, { name: 'stage' }),
//   );

//   const status = useSelector(state =>
//     selectCurrentEditingViewAttr(state, { name: 'status' }),
//   );
//   const {
//     editorInstance,
//     editorCompletionItemProviderRef,
//     setEditor,
//     initActions,
//   } = useContext(EditorContext);
//   const [skipsDiagramUpdate, setSkipsDiagramUpdate] = useState(false);
//   const dispatch = useDispatch();
//   useEffect(() => {
//     const diagram = diagramRef.current.getDiagram();
//     if (diagram instanceof go.Diagram) {
//       console.log('GoJS model changed!', diagram.model.toJson());
//       const json = JSON.parse(diagram.model.toJson());
//     }
//   }, [diagramRef]);

//   useEffect(() => {
//     console.log(config);
//     const diagram = diagramRef.current.getDiagram();
//     if (diagram instanceof go.Diagram) {
//       // console.log('GoJS model changed!', diagram.model.toJson());
//       const json = JSON.parse(diagram.model.toJson());
//       const { nodeDataArray = [], linkDataArray = [] } = json;
//       // const sql = SQL.build(nodeDataArray, linkDataArray);
//       // // console.log(sql);
//       // if (sql) {
//       //   dispatch(
//       //     actions.changeCurrentEditingView({
//       //       config,
//       //       script: format(sql || '', {
//       //         language: 'mysql',
//       //         uppercase: true,
//       //       }),
//       //     }),
//       //   );
//       // }
//     }
//   }, [config]);

//   const run = useCallback(() => {
//     const fragment = editorInstance
//       ?.getModel()
//       ?.getValueInRange(editorInstance?.getSelection());
//     dispatch(runSql({ id, isFragment: !!fragment }));
//   }, [dispatch, id, editorInstance]);

//   const save = useCallback(
//     resolve => {
//       dispatch(saveView({ resolve }));
//     },
//     [dispatch],
//   );

//   useEffect(() => {
//     console.log(editorInstance);
//     editorInstance?.layout();
//     return () => {
//       editorInstance?.dispose();
//     };
//   }, [editorInstance]);

//   const callSave = useCallback(() => {
//     if (
//       status !== ViewStatus.Archived &&
//       stage === ViewViewModelStages.Saveable
//     ) {
//       if (isNewView(id)) {
//         showSaveForm({
//           type: CommonFormTypes.Edit,
//           visible: true,
//           parentIdLabel: '目录',
//           onSave: (values, onClose) => {
//             dispatch(
//               actions.changeCurrentEditingView({
//                 ...values,
//                 parentId: values.parentId || null,
//               }),
//             );
//             save(onClose);
//           },
//         });
//       } else {
//         save();
//       }
//     }
//   }, [dispatch, actions, stage, status, id, save, showSaveForm]);

//   useEffect(() => {
//     initActions({ onRun: run, onSave: callSave });
//   }, [initActions, run, callSave]);

//   const handleModelChange = changes => {
//     // setSkipsDiagramUpdate(false);
//     const {
//       insertedNodeKeys = [],
//       insertedLinkKeys = [],
//       removedNodeKeys = [],
//       removedLinkKeys = [],
//       modifiedLinkData: linkData = [],
//       modifiedNodeData: nodeData = [],
//     } = changes;
//     let newGraph = { ...config };
//     console.log(changes, config);
//     if (!newGraph['linkDataArray']) {
//       newGraph = {
//         ...newGraph,
//         linkDataArray: [],
//       };
//     }
//     if (insertedLinkKeys.length && linkData.length) {
//       const newLinkData = linkData.map(d => ({
//         ...d,
//         text: '1',
//         toText: '0..N',
//       }));
//       newGraph = {
//         ...newGraph,
//         linkDataArray: [...newGraph.linkDataArray, ...newLinkData],
//       };
//       console.log(config, newGraph);
//       dispatch(actions.changeCurrentEditingView({ config: newGraph }));
//     }
//     if (!insertedNodeKeys.length && nodeData.length) {
//       if (
//         newGraph.nodeDataArray &&
//         newGraph.nodeDataArray.length &&
//         newGraph.nodeDataArray.some(n =>
//           nodeData.map(o => o.key).includes(n.key),
//         )
//       ) {
//         let arr = newGraph.nodeDataArray.map(n => {
//           const obj = nodeData.find(o => n.key === o.key);
//           return obj ? obj : n;
//         });
//         newGraph = {
//           ...newGraph,
//           nodeDataArray: arr,
//         };
//         dispatch(actions.changeCurrentEditingView({ config: newGraph }));
//       }
//     }

//     if (removedLinkKeys.length) {
//       newGraph = {
//         ...newGraph,
//         linkDataArray: newGraph.linkDataArray.filter(
//           link => !removedLinkKeys.includes(link.key),
//         ),
//       };
//       dispatch(actions.changeCurrentEditingView({ config: newGraph }));
//     }

//     if (removedNodeKeys.length) {
//       newGraph = {
//         ...newGraph,
//         nodeDataArray: newGraph.nodeDataArray.filter(
//           link => !removedNodeKeys.includes(link.key),
//         ),
//       };
//       dispatch(actions.changeCurrentEditingView({ config: newGraph }));
//     }
//   };

//   return (
//     <EditorWrapper>
//       <ul id="contextMenu" className="menu">
//         <li id="cut" className="menu-item" onclick="cxcommand(event)">
//           Cut
//         </li>
//         <li id="copy" className="menu-item" onclick="cxcommand(event)">
//           Copy
//         </li>
//         <li id="paste" className="menu-item" onclick="cxcommand(event)">
//           Paste
//         </li>
//         <li id="delete" className="menu-item" onclick="cxcommand(event)">
//           Delete
//         </li>
//         <li id="color" className="menu-item">
//           Color
//           <ul className="menu">
//             <li
//               className="menu-item"
//               style={{ backgroundColor: '#f38181' }}
//               onclick="cxcommand(event, 'color')"
//             >
//               Red
//             </li>
//             <li
//               className="menu-item"
//               style={{ backgroundColor: '#eaffd0' }}
//               onclick="cxcommand(event, 'color')"
//             >
//               Green
//             </li>
//             <li
//               className="menu-item"
//               style={{ backgroundColor: '#95e1d3' }}
//               onclick="cxcommand(event, 'color')"
//             >
//               Blue
//             </li>
//             <li
//               className="menu-item"
//               style={{ backgroundColor: '#fce38a' }}
//               onclick="cxcommand(event, 'color')"
//             >
//               Yellow
//             </li>
//           </ul>
//         </li>
//       </ul>
//       <ReactDiagram
//         ref={diagramRef}
//         initDiagram={initDiagram}
//         divClassName="diagramComponent"
//         onModelChange={handleModelChange}
//         skipsDiagramUpdate={skipsDiagramUpdate}
//         nodeDataArray={config['nodeDataArray'] || []}
//         linkDataArray={config['linkDataArray'] || []}
//       />
//     </EditorWrapper>
//   );
// });

// const EditorWrapper = styled.div`
//   position: relative;
//   flex: 1;
//   min-height: 0;

//   &.archived {
//     .view-lines {
//       * {
//         color: ${p => p.theme.textColorDisabled};
//       }
//     }
//   }
// `;

// export default GraphEditor;
