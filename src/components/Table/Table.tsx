import React from 'react'
import { useState } from 'react';
import styles from './Table.module.scss'
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import cn from 'classnames';
import { Link } from 'react-router-dom';

export type TableData = {
    multiplicity: number;
    totalErrorsCount: number;
    detectedErrorsCount: number;
    result: number;
}

export type ReceivedSubscriptionData = {
  id: number;
  title: string;
  price: number;
  info: string;
  src: string;
  id_category: number;
  category: string;
}

export type SubscriptionsTableProps = {
  applications: TableData[];
  className?: string;
};

const ApplicationsTable: React.FC<SubscriptionsTableProps> = ({applications, className}) => {
  return (
    <>
    <div className={styles.table__container}>
    <Table responsive borderless className={!className ? styles.table : cn(styles.table, className)}>
        <thead>
          <tr className={styles.tableHead}>
            <th>Кратность ошибки</th>
            <th>Общее количество ошибок</th>
            <th>Количество обнаруженных ошибок</th>
            <th>Обнаруживающая способность</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((application: TableData, index: number) => (
            <tr key={application.multiplicity}>
            <td>{application.multiplicity}</td>
              <td>{application.totalErrorsCount}</td>
              <td>{application.detectedErrorsCount}</td>
              <td>{application.result}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
    </>
  );
}

export default ApplicationsTable