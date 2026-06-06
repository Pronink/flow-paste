import { ReactFlowViewer } from './ReactFlowViewer.tsx'
import { useEffect, useState } from 'react'
import styles from './App.module.css'
import { Editor } from './Editor.tsx'
import { compressToUrl, decompressFromUrl } from './compression.ts'

export const App = () => {
  const [reactFlowCode, setReactFlowCode] = useState<string>('')
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
        setReactFlowCode(decompressed)
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

    if (reactFlowCode) {
      newUrl += `?m=${compressToUrl(reactFlowCode)}`
    }

    window.history.replaceState(null, '', newUrl)
  }, [reactFlowCode, isEditorVisible])

  return (
    <div className={`${styles.root}${isDarkMode ? ' dark-mode' : ''}`}>
      <ReactFlowViewer code={reactFlowCode} onError={setErrorMessage} />
      <Editor
        code={reactFlowCode}
        onChangeCode={
          isEditorVisible ? (code) => setReactFlowCode(code) : undefined
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
