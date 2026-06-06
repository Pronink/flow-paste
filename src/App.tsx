import { MermaidViewer } from './MermaidViewer.tsx'
import { DraggableZoom } from './DraggableDiv.tsx'
import { useEffect, useState } from 'react'
import styles from './App.module.css'
import { Editor } from './Editor.tsx'
import mermaid from 'mermaid'
import { compressToUrl, decompressFromUrl } from './compression.ts'

mermaid.initialize({
  startOnLoad: false,
  theme: 'neutral'
})

export const App = () => {
  const [mermaidCode, setMermaidCode] = useState<string>('')
  const [isEditorVisible, setIsEditorVisible] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>()
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('darkMode') === 'true')

  // Load URL at startup
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const compressed = params.get('m')

    if (compressed) {
      const decompressed = decompressFromUrl(compressed)

      if (decompressed) {
        setMermaidCode(decompressed)
        setIsEditorVisible(false)
        return
      }
    }

    setIsEditorVisible(true)
  }, [])

  // Update URL
  useEffect(() => {
    if (!isEditorVisible) return

    let newUrl = window.location.origin + window.location.pathname

    if (mermaidCode) {
      newUrl += `?m=${compressToUrl(mermaidCode)}`
    }

    window.history.replaceState(null, '', newUrl)
  }, [mermaidCode, isEditorVisible])

  return (
    <div className={`${styles.root}${isDarkMode ? ' dark-mode' : ''}`}>
      <DraggableZoom>
        <MermaidViewer mermaidCode={mermaidCode} onError={setErrorMessage} />
      </DraggableZoom>
      <Editor
        code={mermaidCode}
        onChangeCode={
          isEditorVisible ? (code) => setMermaidCode(code) : undefined
        }
        isVisible={isEditorVisible}
        setIsVisible={setIsEditorVisible}
        onChangeDarkMode={() => {
          document.startViewTransition(() => {
            localStorage.setItem('darkMode', String(!isDarkMode))
            setIsDarkMode(!isDarkMode)
          })
        }}
      />
      {errorMessage && <div className={styles.error}>{errorMessage}</div>}
    </div>
  )
}
