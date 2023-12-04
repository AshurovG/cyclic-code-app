import React from 'react'
import { ChangeEvent } from 'react';
import { useState } from 'react';
import styles from './MainPage.module.scss'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'
import Table from 'components/Table';

const generatingPolynomial = '1011';
const errorVectors: Map<number, string> = new Map([
  [0, '1'],
  [1, '10'],
  [2, '100'],
  [3, '1000'],
  [4, '10000'],
  [5, '100000'],
  [6, '1000000']
 ]);

const syndromeVectors = ['001', '010', '100', '011', '110', '111', '101']
 
export type TableData = {
  multiplicity: number;
  totalErrorsCount: number;
  detectedErrorsCount: number;
  result: number;
}

export type RandomErrorData = {
  errorIndex: number,
  value: string
}

const MainPage = () => {
  const [codeStringValue, setCodeStringValue] = useState('');
  const [valueWithError, setValueWithError] = useState<RandomErrorData>();
  const [errorVector, setErrorVector] = useState('');
  const [acceptedVector, setAcceptedVector] = useState('');
  const [errorSyndrome, setErrorSyndrome] = useState('');
  const [table, setTable] = useState<TableData[]>([])
  const [correctedCode, setCorrectedCode] = useState('')

  const [isTestButtonClicked, setIsTestButtonClicked] = useState(false)
  const [isBuildButtonClicked, setIsBuildButtonClicked] = useState(false)

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
    let errorCodeArr = coding(codeStringValue, generatingPolynomial).split('')
    console.log(errorCodeArr)
    console.log('-------------')
    errorCodeArr[randomNumber] = errorCodeArr[randomNumber] === '0' ? '1': '0';
    setValueWithError({errorIndex: errorCodeArr.length - 1 - randomNumber, value: errorCodeArr.join('')})
    decode({errorIndex: errorCodeArr.length - 1 - randomNumber, value: errorCodeArr.join('')})
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
        accepted = getAcceptedPolynomial(coding(codeStringValue, generatingPolynomial), vector) // формируем принятый полином
        setAcceptedVector(accepted)
        console.log('принятый на пораждающий', division(accepted, generatingPolynomial))

        const syndrome = division(accepted, generatingPolynomial);
        if (syndrome !== 0) {
          setErrorSyndrome(syndrome);
          let errorValue = error.value.split('')
          const index = syndromeVectors.indexOf(syndrome)
          console.log("до", error.value)
          if (errorValue[errorValue.length - 1 - index] === '0') {
            errorValue[errorValue.length - 1 - index] = '1'
          } else {
            errorValue[errorValue.length - 1 - index] = '0'
          }
          setCorrectedCode(errorValue.join('')) // Устанавливаем исправленный код
        }
      }
      console.log('accepted', accepted)
      console.log(coding(codeStringValue, generatingPolynomial), '+', errorVectors.get(error.errorIndex))
    }
  }
  

  const handleTestButtonClick = () => {
    setIsBuildButtonClicked(false)
    setIsTestButtonClicked(true)
    setRandomError();
  }

  const handleBuildButtonClick = () => {
    setIsTestButtonClicked(false)
    setIsBuildButtonClicked(true)
    let encoded_vec = coding(codeStringValue, generatingPolynomial);
    let Res = errors(encoded_vec, generatingPolynomial);
    console.log(Res)
    let result: TableData[] = []
    for (let i in Res) {
      let errorCount = Res[i];
      if (Number(i) == 4){ 
        errorCount = errorCount - 1
      }
      let allErrorCount = factorial(7) / (factorial(i) * factorial(7 - Number(i)));
      result.push({multiplicity: Number(i), totalErrorsCount: allErrorCount, detectedErrorsCount: errorCount, result: errorCount / allErrorCount})
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
      <h4 className={styles['main__page-subtitle']}>Закодированный код: {coding(codeStringValue, generatingPolynomial)}</h4>
      <h4 className={styles['main__page-subtitle']}>Случайная ошибка в {valueWithError?.errorIndex} разряде: {valueWithError?.value}</h4>
      <h4 className={styles['main__page-subtitle']}>Вектор ошибки: {errorVector}</h4>
      <h4 className={styles['main__page-subtitle']}>Принятый полином: {acceptedVector}</h4>
      <h4 className={styles['main__page-subtitle']}>После деления принятого полинома на порождающий получили синдром ошибки: {errorSyndrome}</h4>
      <h4 className={styles['main__page-subtitle']}>Исправили код после обнаружения ошибки: {correctedCode}</h4>

      </>}
      {isBuildButtonClicked && 
      <div>
        <h4 className={styles['main__page-subtitle']}>Таблица результатов:</h4>
        <Table applications={table}/>
      </div>}
      </div>
    </div>
  )
}

export default MainPage