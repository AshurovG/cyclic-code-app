import React from 'react'
import { ChangeEvent } from 'react';
import { useState } from 'react';
import styles from './MainPage.module.scss'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'
import Table from 'components/Table';

let inf_vec = '1010';
let pol = '1011';

export type TableData = {
  multiplicity: number;
  totalErrorsCount: number;
  detectedErrorsCount: number;
  result: number;
}

const MainPage = () => {
  const [codeStringValue, setCodeStringValue] = useState('')
  const [codeArrayValue, setCodeArrayValue] = useState([])

  const [table, setTable] = useState<TableData[]>([])

  const [combinations, setCombinations] = useState(0)

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

  function factorial(n: any) {
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
  }

  function* error_gen(length: number) {
    function* helper(index: number, current: any): any {
      if (index === length) {
        yield parseInt(current.join(''), 10).toString();
      } else {
        yield* helper(index + 1, [...current, '0']);
        yield* helper(index + 1, [...current, '1']);
      }
    }
    yield* helper(0, []);
  }

  function errors(vec: string, pol: string) {
    //  let Res = Array(7).fill(0);
    let Res: any = {};
    for (let i = 1; i <= 7; i++) {
      Res[i] = 0;
    }
     console.log('Res now', Res);
     for (let i of error_gen(vec.length)) {
        if (i != 0) {
            let error_vec = (parseInt(vec, 2) ^ parseInt(i, 2)).toString(2);
            //  console.log('вектор ошибки ', error_vec)
            let syndrome = division(error_vec, pol);
            if (syndrome !== '000') {
                let pl = i.replace(/0/g, '');
                Res[pl.length]++;
            }
        }
     }

     console.log(Res, 'after')
     return Res;
  }

  function coding(vec: string, pol: string) {
    let new_vec = vec + '0'.repeat(pol.length - 1);
    let remainder = division(new_vec, pol);
    console.log(vec + remainder)
    return vec + remainder;
 }

  function division(a: string, b: string) {
    if (parseInt(b, 2) === 0) {
        throw new Error("ZeroDivisionError");
    }
    if (parseInt(a, 2) === 0) {
        return 0;
    }
    if (a.length < b.length) {
        return a;
    }
    let shift = b.length;
    let buf = a;
 
    while (buf.length >= b.length) {
        let buf_r = (parseInt(buf.slice(0, shift), 2) ^ parseInt(b, 2)).toString(2);
        buf = buf_r + buf.slice(shift);
    }
    let remainder = '0'.repeat(3 - buf.length) + buf;
    console.log(remainder)
    return remainder;
 }

  const handleTestButtonClick = () => {
    console.log('test button was clicked')
  }

  const handleBuildButtonClick = () => {
    let encoded_vec = coding(inf_vec, pol);
    let Res = errors(encoded_vec, pol);
    console.log(Res)
    let result: TableData[] = []
    for (let i in Res) {
      let osh = Res[i];
      if (Number(i) == 4){ 
        osh = osh - 1
      }
      let oshmax = factorial(7) / (factorial(i) * factorial(7 - Number(i)));
      result.push({multiplicity: Number(i), totalErrorsCount: oshmax, detectedErrorsCount: osh, result: osh / oshmax})
    }

    setTable(result)

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

      {table.length === 7 && <Table applications={table}/>}
      </div>
    </div>
  )
}

export default MainPage


  // const encode = () => {
  //   let codeArr = codeStringValue.split('').map((element) => {
  //     return (Number(element))
  //   })

  //   checkFirstNumbers(codeArr)

  //   codeArr.push(0, 0, 0, 0) // Добавляем проверочные биты
  //   console.log('Число с проверочными битами:', codeArr)

  //   let remainder = division(codeArr)

  //   while (remainder?.length !== 4) {
  //     remainder?.unshift(0)
  //   }

  //   let currentReminderIndex = 0;
  //   for (let i = codeArr.length - 4; i < codeArr.length; ++i) {
  //     codeArr[i] = remainder[currentReminderIndex];
  //     ++currentReminderIndex;
  //   }
  //   console.log(`Сложили ${codeArr}`)

  //   return codeArr
  // }

    // const division = (divisible: Array<number>) => {
  //   let currentIndex = 0;
  //   let isExistSymbols = true;
  //   let currentRemainder = [];
  //   let currentCodeArr = divisible.slice(currentIndex,currentIndex + 5);
  //   currentIndex = 4
  //   while (isExistSymbols) {
  //     currentRemainder = [currentCodeArr[0] ^ divider[0], currentCodeArr[1] ^ divider[1], currentCodeArr[2] ^ divider[2]
  //     , currentCodeArr[3] ^ divider[3], currentCodeArr[4] ^ divider[4]]
  //     console.log(`Поделили ${currentCodeArr} на ${divider} = ${currentRemainder}`)
  //     checkFirstNumbers(currentRemainder)

  //     console.log('current q', currentRemainder)

  //     while (currentRemainder.length !== 5) {
  //       console.log(' qqq1', currentRemainder, currentIndex)
  //       if (currentIndex + 1 >= divisible.length) {
  //         return(currentRemainder) // Возвращаем остаток от деления многочленов
  //       }
  //       currentRemainder.push(divisible[currentIndex + 1]);
  //       ++currentIndex;
  //       console.log(' qqq2', currentRemainder, currentIndex)
  //     }
  //     console.log(`текущее частное чисел ${currentCodeArr.join('')} на ${divider.join('')}  - ${currentRemainder}`)
  //     currentCodeArr = currentRemainder;
  //   }
  // }