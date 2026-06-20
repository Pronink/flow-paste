import { memo } from 'react'
import {
  BaseEdge,
  EdgeLabelRenderer,
  type Edge,
  type EdgeProps,
} from '@xyflow/react'
import {
  useAvoidNodesEdgePath,
  type AvoidNodesEdgeData,
} from 'avoid-nodes-edge'
import { darkenColor, lightenColor } from '../utils/ColorManipulation.ts'

/**
 * Extra label-styling fields not supported by the upstream edge.
 * Read from edge `data` so they can be set declaratively in the JSON.
 */
interface LabelStyleData extends AvoidNodesEdgeData {
  labelBgColor?: string
  labelColor?: string
  labelBorderColor?: string
  labelBorderWidth?: number
}

/**
 * Custom avoid-nodes edge: same routing/markers/label logic as the upstream
 * `AvoidNodesEdge`, but the label box background, text and border colors are
 * configurable via `data.labelBgColor` / `labelColor` / `labelBorderColor`.
 */
function CustomEdgeComponent(
  props: EdgeProps<Edge<LabelStyleData>>,
) {
  const {
    id,
    source,
    target,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    data,
    markerEnd,
    markerStart,
  } = props

  const {
    path,
    labelX,
    labelY,
    markerEnd: resolvedMarkerEnd,
    markerStart: resolvedMarkerStart,
    style,
    label,
    showLabel
  } = useAvoidNodesEdgePath({
    id,
    source,
    target,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    data,
    markerEnd: markerEnd as string | undefined,
    markerStart: markerStart as string | undefined,
  })

  const strokeColor = data?.strokeColor ?? '#000000'

  const labelBgColor = data?.labelBgColor ?? lightenColor(strokeColor, 0.2) ?? 'white'
  const labelBorderColor = data?.labelBorderColor ?? strokeColor
  const labelColor = data?.labelColor ?? darkenColor(strokeColor, 0.2) ?? 'dimgray'
  const labelBorderWidth = (() => {
    if (typeof data?.labelBorderWidth === 'number') return data.labelBorderWidth
    if (!data?.labelBgColor && !data?.labelBorderColor && !data?.labelColor) return 1
    return 0
  })()


  return (
    <>
      <BaseEdge
        id={id}
        path={path}
        markerEnd={resolvedMarkerEnd}
        markerStart={resolvedMarkerStart}
        style={style}
      />
      <EdgeLabelRenderer>
        {label && showLabel && (
          <div
            className="nodrag nopan"
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
              zIndex: 10,
              background: labelBgColor,
              padding: '2px 10px',
              borderRadius: 10,
              fontSize: 12,
              fontWeight: 500,
              border: `${labelBorderWidth}px solid ${labelBorderColor}`,
              color: labelColor,
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            }}
          >
            {label}
          </div>
        )}
      </EdgeLabelRenderer>
    </>
  )
}

export const CustomEdge = memo(CustomEdgeComponent)
