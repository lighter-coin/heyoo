import styles from './LighterSpark.module.css'

export const LighterSpark = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
      <div className={styles.fireballSpark} />
    </div>
  )
}
