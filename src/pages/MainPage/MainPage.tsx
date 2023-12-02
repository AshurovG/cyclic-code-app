import React from 'react'
import { ChangeEvent } from 'react';
import { useState } from 'react';
import styles from './MainPage.module.scss'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'

const divider = [1, 0, 0, 1, 1]

const MainPage = () => {
  const [codeStringValue, setCodeStringValue] = useState('')
  const [codeArrayValue, setCodeArrayValue] = useState([])

  const checkFirstNumbers = (array: Array<Number>) => {
    let isFirstElementCorrect = false;
    while (!isFirstElementCorrect) {
      if (array[0] !== 0) {
        isFirstElementCorrect = true;
      } else {
        array.shift()
      }
    }
  }

  const encode = (value: string) => {
    let codeArr = codeStringValue.split('').map((element) => {
      return (Number(element))
    })

    checkFirstNumbers(codeArr)

    codeArr.push(0, 0, 0, 0)
    console.log(codeArr)

    let currentIndex = 0;
    let isExistSymbols = true;
    let currentQuotient = [];
    let currentCodeArr = codeArr.slice(currentIndex,currentIndex + 5);
    currentIndex = 4
    while (isExistSymbols) {
      currentQuotient = [currentCodeArr[0] ^ divider[0], currentCodeArr[1] ^ divider[1], currentCodeArr[2] ^ divider[2]
      , currentCodeArr[3] ^ divider[3], currentCodeArr[4] ^ divider[4]]
      console.log(`Поделили ${currentCodeArr} на ${divider} = ${currentQuotient}`)
      checkFirstNumbers(currentQuotient)

      console.log('current q', currentQuotient)

      while (currentQuotient.length !== 5) {
        console.log(' qqq1', currentQuotient, currentIndex)
        if (currentIndex + 1 >= codeArr.length) {
          return(currentQuotient)
        }
        currentQuotient.push(codeArr[currentIndex + 1]);
        ++currentIndex;
        console.log(' qqq2', currentQuotient, currentIndex)
      }
      console.log(`текущее частное чисел ${currentCodeArr.join('')} на ${divider.join('')}  - ${currentQuotient}`)
      currentCodeArr = currentQuotient;
    }
  }

  const handleTestButtonClick = () => {
    console.log('test button was clicked')
    console.log('lala' ,encode(codeStringValue))
  }

  const handleBuildButtonClick = () => {
    console.log('build button was clicked')
  }

  const handleTitleValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCodeStringValue(event.target.value)
    console.log(`число: ${Number(event.target.value)}`)
  };

  return (
    <div className={styles.main__page}>
      <div className={styles['main__page-wrapper']}>

      <Form className={styles['form']}>
        <div className={styles['form__input-block']}>
          <Form.Control className={styles.form__input} value={codeStringValue} onChange={handleTitleValueChange} type="text" placeholder="Введите двоичный код*" />
          <div className={styles.form__btns}>
            <Button className={styles.form_btn} onClick={() => handleTestButtonClick()}>Протестировать</Button>
            <Button className={styles.form_btn} onClick={() => handleBuildButtonClick()}>Построить таблицу</Button>
          </div>
          
        </div>
      </Form>
      </div>
    </div>
  )
}

export default MainPage