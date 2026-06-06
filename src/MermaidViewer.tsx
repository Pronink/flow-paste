import { useEffect, useRef } from 'react'
import mermaid from 'mermaid'

import styles from './MermaidViewer.module.css'

export const MermaidViewer = (props: { mermaidCode: string, onError: (error: string) => void }) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let isMounted = true
    const render = async () => {
      if (!containerRef.current) {
        return
      }

      const id = `mermaid-${crypto.randomUUID()}`

      const onError = props.onError
      try {
        await mermaid.parse(props.mermaidCode)

        const { svg } = await mermaid.render(id, props.mermaidCode)

        if (isMounted && containerRef.current) {
          containerRef.current.innerHTML = svg
          onError('')
        }
      } catch (e: any) {
        if (isMounted) {
          console.error('Mermaid render error:', e)
          onError(e.str || e.message || 'Syntax error in mermaid code')
        }
      }
    }

    render()
    return () => {
      isMounted = false
    }
  }, [props.mermaidCode, props.onError])

  return <div
    ref={containerRef}
    className={styles.mermaidContainer}
  />
}
