import styles from './Editor.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleHalfStroke, faClose, faPencil } from '@fortawesome/free-solid-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { useCallback } from 'react'
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";

const codemirrorExtensions = [json()]

export const Editor = (props: {
  code: string
  isEditable: boolean,
  isVisible: boolean
  setIsVisible: (isVisible: boolean) => void
  onChangeCode: ((code: string) => void) | undefined
  onChangeDarkMode: () => void
}) => {


  const openGithubPage = useCallback(() => {
    window.open('https://github.com/Pronink/flow-paste', '_blank')
  }, [])

  let top = -32
  const getTop = () => {
    top += 32
    return top
  }

  return (
    <div
      className={styles.root}
      style={
        props.isVisible ? undefined : (
          {
            transform: 'translateX(calc(-100% - 21px))',
          }
        )
      }>
      {props.isEditable && <div className={styles.textarea}>
        <CodeMirror
          value={props.code}
          onChange={(e) => props.onChangeCode?.(e)}
          spellCheck="false"
          extensions={codemirrorExtensions}
        />
      </div>}
      {props.isEditable && <button
        type="button"
        title={props.isVisible ? 'Close editor' : 'Open editor'}
        onClick={() => props.setIsVisible(!props.isVisible)}
        className={styles.button + ' ' + styles.buttonOpenEditor + ' ' + styles.border}
        style={
          !props.isVisible ?
            {
              top: getTop(),
              right: '-46px',
            }
            : undefined
        }>
        <div>
          {
            props.isVisible ?
              <FontAwesomeIcon icon={faClose} style={{ transform: 'translateY(1px)' }} />
              :
              <FontAwesomeIcon icon={faPencil} style={{ transform: 'translateY(1px)' }} />
          }
        </div>
      </button>}
      <button
        type="button"
        title="Toggle dark theme"
        onClick={() => props.onChangeDarkMode()}
        className={styles.button + ' ' + styles.buttonDarkMode + ' ' + styles.border}
        style={
          !props.isVisible ?
            {
              top: getTop(),
              right: '-46px',
            }
            : undefined
        }>
        <FontAwesomeIcon icon={faCircleHalfStroke} />
      </button>
      <button
        type="button"
        title="Go to my GitHub"
        onClick={() => openGithubPage()}
        className={styles.button + ' ' + styles.buttonGithub + ' ' + styles.border}
        style={
          !props.isVisible ?
            {
              top: getTop(),
              right: '-46px',
            }
            : undefined
        }>
        <FontAwesomeIcon icon={faGithub} />
      </button>
    </div>
  )
}
