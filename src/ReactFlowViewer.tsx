import { useState, useCallback, useEffect } from 'react'
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  type Node,
  type Edge,
  type NodeChange,
  type EdgeChange,
  type OnNodeDrag,
  Background,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import { AvoidNodesEdge } from 'avoid-nodes-edge/edge'
import { useAvoidNodesRouterFromWorker } from 'avoid-nodes-edge'
import styles from './ReactFlowViewer.module.css'

// Register the custom edge type
const edgeTypes = { avoidNodes: AvoidNodesEdge }

type ReactFlowCode = {
  nodes?: Node[]
  edges?: Edge[]
}

export const ReactFlowViewer = (props: {
  code: string,
  onError: (error: string) => void
}) => {
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])

  // Set up the worker-based router
  const { updateRoutingOnNodesChange, resetRouting } =
    useAvoidNodesRouterFromWorker(nodes, edges, {
      edgeRounding: 8,
      edgeToEdgeSpacing: 10,
      edgeToNodeSpacing: 12,
      diagramGridSize: 0,
      shouldSplitEdgesNearHandle: true,
      autoBestSideConnection: true,
    })

  const deferredReset = useCallback(() => {
    requestAnimationFrame(() => resetRouting())
  }, [resetRouting])

  useEffect(() => {
    try {
      const parsedCode = JSON.parse(props.code) as ReactFlowCode
      const parsedNodes = parsedCode.nodes
      const parsedEdges = parsedCode.edges

      if (Array.isArray(parsedNodes) && Array.isArray(parsedEdges)) {
        setNodes(prevState => {
          if (JSON.stringify(parsedNodes) === JSON.stringify(prevState)) {
            return prevState
          }
          return parsedNodes
        })

        setEdges(prevState => {
          if (JSON.stringify(parsedEdges) === JSON.stringify(prevState)) {
            return prevState
          }
          return parsedEdges
        })
      } else {
        // props.onError('Invalid ReactFlow code format: nodes and edges must be arrays')
        console.log('Invalid ReactFlow code format: nodes and edges must be arrays')
      }
    } catch (e) {
      console.error('Error parsing ReactFlow code:', e)
    }
  }, [props.code])

  useEffect(() => {
    if (nodes.length === 0 && edges.length === 0) {
      return
    }
    deferredReset()
  }, [nodes, edges, deferredReset])

  const onNodesChange = useCallback(
    (changes: NodeChange<Node>[]) => {
      setNodes((nds) => applyNodeChanges(changes, nds))
      updateRoutingOnNodesChange(changes)
    },
    [updateRoutingOnNodesChange],
  )

  const onEdgesChange = useCallback(
    (changes: EdgeChange<Edge>[]) => {
      setEdges((eds) => applyEdgeChanges(changes, eds))
      const needsReset = changes.some((c) => c.type === 'add' || c.type === 'remove')
      if (needsReset) deferredReset()
    },
    [deferredReset],
  )

  const onNodeDrag = useCallback<OnNodeDrag<Node>>(
    (_event, draggedNode, draggedNodes) => {
      const movedNodes = draggedNodes.length > 0 ? draggedNodes : [draggedNode]
      const positionById = new Map(movedNodes.map((node) => [node.id, node.position]))

      setNodes((nds) =>
        nds.map((node) => {
          const position = positionById.get(node.id)
          return position ? { ...node, position } : node
        }),
      )
      deferredReset()
    },
    [deferredReset],
  )

  return (
    <div className={styles.reactFlowContainer}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        //onConnect={onConnect}
        onNodeDragStop={onNodeDrag}
        onNodeDrag={onNodeDrag} //TODO Update each grab tick
        edgeTypes={edgeTypes}
        fitView
        minZoom={0.01}
        maxZoom={100}
        snapToGrid={true}
        snapGrid={[1, 1]}
        selectNodesOnDrag={false}
        multiSelectionKeyCode="Shift"
        contentEditable={false}
        nodesDraggable={true}
        nodesConnectable={false}
        elementsSelectable={false}
        proOptions={{ hideAttribution: true }}
      >
        <Background />
        {/*<Controls />*/}
        {/*<MiniMap />*/}
      </ReactFlow>
    </div>
  )
}
