import React from 'react'
import styles from './Header.module.scss'

const Header = () => {
  return (
    <div className={styles.header}>
       <div className={styles.header__wrapper}>
            <h1 className={styles.header__title}>Циклический код</h1>
       </div>
    </div>
  )
}

export default Header