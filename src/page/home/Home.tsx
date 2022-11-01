import { Button, Typography } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import styles from "./Home.module.scss"

export const Home : React.FC= () => {

  const navigate = useNavigate()

  const onNavigation = () => {
    navigate("/get-started");
  }

  return (
    <>
      <Typography className={styles.container} component={'div'}>
        <Typography className={styles.left} component={'div'}>
          <Typography className={styles.text} component={'div'}>Your one step solution for mind boggling crossword puzzles.</Typography>
          <Typography component={'div'}>
            <Button onClick={onNavigation} className={styles.get_started} variant='contained' >Get Puzzling</Button>
          </Typography>
        </Typography>
        <Typography className={styles.right} component={'div'}>
          <img className={styles.info_graphic} src="./assets/info_graphic.png" alt='info-graphic' />
        </Typography>
      </Typography>
    </>
  )
}
