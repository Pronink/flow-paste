import styles from './Editor.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleHalfStroke, faClose, faPencil } from '@fortawesome/free-solid-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { useCallback } from 'react'

export const Editor = (props: {
  code: string
  isVisible: boolean
  setIsVisible: (isVisible: boolean) => void
  onChangeCode: ((code: string) => void) | undefined
  onChangeDarkMode: () => void
}) => {

  const openGithubPage = useCallback(() => {
    window.open('https://github.com/Pronink/flow-paste', '_blank')
  }, [])

  return (
    <div
      className={styles.root + ' ' + styles.border}
      style={
        props.isVisible ? undefined : (
          {
            transform: 'translateX(calc(-100% - 21px))',
          }
        )
      }>
      <textarea
        value={props.code}
        onChange={(e) => props.onChangeCode?.(e.target.value)}
        className={styles.textarea}
        spellCheck="false"
      />
      <button
        type="button"
        title={props.isVisible ? 'Close editor' : 'Open editor'}
        onClick={() => props.setIsVisible(!props.isVisible)}
        className={styles.button + ' ' + styles.buttonOpenEditor + ' ' + styles.border}
        style={
          !props.isVisible ?
            {
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
      </button>
      <button
        type="button"
        title="Toggle dark theme"
        onClick={() => props.onChangeDarkMode()}
        className={styles.button + ' ' + styles.buttonDarkMode + ' ' + styles.border}
        style={
          !props.isVisible ?
            {
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
              right: '-46px',
            }
            : undefined
        }>
        <FontAwesomeIcon icon={faGithub} />
      </button>
    </div>
  )
}
