import { useState, useCallback, useEffect } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  type Node,
  type Edge,
  type NodeChange,
  type EdgeChange,
  type Connection,
  type OnNodeDrag,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import { AvoidNodesEdge } from 'avoid-nodes-edge/edge'
import { useAvoidNodesRouterFromWorker } from 'avoid-nodes-edge'
import styles from './ReactFlowViewer.module.css'

import { basicNodes as initialNodes, basicEdges as initialEdges } from './initialElements.ts'

// Register the custom edge type
const edgeTypes = { avoidNodes: AvoidNodesEdge }

export const ReactFlowViewer = (props: { code: string, onError: (error: string) => void }) => {
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])

  useEffect(() => {
    try {
      const parsedCode = JSON.parse(props.code)
      if (parsedCode.nodes && parsedCode.edges && Array.isArray(parsedCode.nodes) && Array.isArray(parsedCode.edges)) {
        setNodes(parsedCode.nodes)
        setEdges(parsedCode.edges)
      } else {
        props.onError('Invalid ReactFlow code format: nodes and edges must be arrays')
      }
    } catch (e) {
      console.error('Error parsing ReactFlow code:', e)
    }
  }, [props.code])

  // console.log(JSON.stringify({nodes, edges}, null, 2))

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

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge({ ...params, type: 'avoidNodes' }, eds))
      deferredReset()
    },
    [deferredReset],
  )

  const onNodeDragStop = useCallback<OnNodeDrag<Node>>(
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
      onConnect={onConnect}
      onNodeDragStop={onNodeDragStop}
      edgeTypes={edgeTypes}
      fitView
      minZoom={0.01}
      maxZoom={100}
      selectNodesOnDrag={false}
      multiSelectionKeyCode="Shift"
      proOptions={{ hideAttribution: true }}
    >
      <Background />
      {/*      <Controls />
      <MiniMap />*/}
    </ReactFlow>
    </div>
  )
}
