import React from 'react'
import { ChangeEvent } from 'react';
import { useState } from 'react';
import styles from './MainPage.module.scss'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'
import Table from 'components/Table';

const pol = '1011';
const errorVectors: Map<number, string> = new Map([
  [0, '1'],
  [1, '10'],
  [2, '100'],
  [3, '1000'],
  [4, '10000'],
  [5, '100000'],
  [6, '1000000']
 ]);

 const syndromeVectors: Map<string, number> = new Map([
  ['001', 0],
  ['010', 1],
  ['100', 2],
  ['011', 3],
  ['110', 4],
  ['111', 5],
  ['101', 6]
 ]);
 

 
//  const errorVectors: Map<number, string> = new Map([
//   [0, '0'],
//   [1, '010'],
//   [2, '100'],
//   [3, '011'],
//   [4, '110'],
//   [5, '111'],
//   [6, '101']
//  ]);

export type TableData = {
  multiplicity: number;
  totalErrorsCount: number;
  detectedErrorsCount: number;
  result: number;
}

export type RandomErrorData = {
  errorIndex: number,
  value: number
}

const MainPage = () => {
  const [codeStringValue, setCodeStringValue] = useState('');
  const [valueWithError, setValueWithError] = useState<RandomErrorData>();
  const [errorVector, setErrorVector] = useState('');
  const [acceptedVector, setAcceptedVector] = useState('');
  const [table, setTable] = useState<TableData[]>([])
  const [isTestButtonClicked, setIsTestButtonClicked] = useState(false)

  function factorial(n: any) {
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
  }

  function* errorGenerator(length: number) { // Генератор всевозможных ошибок
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

  function errors(vec: string, pol: string) { // Определение чисел обнаруженных ошибок
    let Res: any = {};
    for (let i = 1; i <= 7; i++) {
      Res[i] = 0;
    }
     console.log('Res now', Res);
     for (let i of errorGenerator(vec.length)) {
        if (i != 0) {
            let error_vec = (parseInt(vec, 2) ^ parseInt(i, 2)).toString(2);
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

  function coding(vec: string, pol: string) { // Кодирование
    {let new_vec = vec + '0'.repeat(pol.length - 1);
    let remainder = division(new_vec, pol);
    console.log(vec + remainder)
    return vec + remainder;}
  }

  function division(a: string, b: string) { // Деление полиномов
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

  const setRandomError = () => {
    let randomNumber = Math.floor(Math.random() * 7);
    let errorCodeArr = coding(codeStringValue, pol).split('')
    console.log(errorCodeArr)
    console.log('-------------')
    errorCodeArr[randomNumber] = errorCodeArr[randomNumber] === '0' ? '1': '0';
    setValueWithError({errorIndex: errorCodeArr.length - 1 - randomNumber, value: Number(errorCodeArr.join(''))})
    decode({errorIndex: errorCodeArr.length - 1 - randomNumber, value: Number(errorCodeArr.join(''))})
  }

  const getAcceptedPolynomial = (first: string, second: string): string => {
    const maxLength = Math.max(first.length, second.length);
    const paddedFirst = first.padStart(maxLength, '0');
    const paddedSecond = second.padStart(maxLength, '0');
    console.log('padded', paddedFirst, paddedSecond)
   
    let result = '';
   
    for (let i = maxLength - 1; i >= 0; i--) {
     const sum = parseInt(paddedFirst[i], 2) ^ parseInt(paddedSecond[i], 2);
     result = (sum % 2) + result;
    }
   
    return result;
   };
   

  const decode = (error: RandomErrorData) => {
    if (error?.errorIndex !== undefined) {
      const vector = errorVectors.get(error.errorIndex);
      let accepted;
      if (vector !== undefined) {
        setErrorVector(vector);
        accepted = getAcceptedPolynomial(coding(codeStringValue, pol), vector) // формируем принятый полином
        setAcceptedVector(accepted)
      }
      console.log('accepted', accepted)
      console.log(coding(codeStringValue, pol), '+', errorVectors.get(error.errorIndex))
    }
  }
  

  const handleTestButtonClick = () => {
    setIsTestButtonClicked(true)
    setRandomError();
    // console.log('res', getAcceptedPolynomial('1010011', '100000'))
  }

  const handleBuildButtonClick = () => {
    let encoded_vec = coding(codeStringValue, pol);
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
     { isTestButtonClicked && <><h4 className={styles['main__page-subtitle']}>Исходный код: {codeStringValue}</h4>
      <h4 className={styles['main__page-subtitle']}>Закодированный код: {coding(codeStringValue, pol)}</h4>
      <h4 className={styles['main__page-subtitle']}>Случайная ошибка в {valueWithError?.errorIndex} разряде: {valueWithError?.value}</h4>
      <h4 className={styles['main__page-subtitle']}>Вектор ошибки: {errorVector}</h4>
      <h4 className={styles['main__page-subtitle']}>Принятый полином: {acceptedVector}</h4>
      </>}
      {table.length === 7 && 
      <div>
        <h4 className={styles['main__page-subtitle']}>Таблица результатов:</h4>
        <Table applications={table}/>
      </div>}
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