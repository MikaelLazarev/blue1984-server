/*
 * Lean tool - hypothesis testing application
 *
 * https://github.com/MikaelLazarev/lean-tool/
 * Copyright (c) 2020. Mikhail Lazarev
 *
 */

import React, {useState} from "react";
import {Table, Container, Row, Col, Card, Button} from "react-bootstrap";
import { Account } from "../../core/accounts";
import { DataScreenComponentProps } from "../../components/DataLoader/DataScreen";
import { toHumanDate } from "../../utils/formaters";
import {useDispatch} from "react-redux";
import actions from "../../store/actions";

export const AccountsList: React.FC<DataScreenComponentProps<Account[]>> = ({
  data,
  onSelect,
}) => {

  const dispatch = useDispatch()
  const onPressed = (id: string) => {
    if (onSelect) {
      onSelect(id);
    }
  };

  const [hash, setHash] = useState('0')


  const renderLine = (h: Account) => {

    const onDelete = (id: string) => {
      const newHash = Date.now().toString();
      setHash(newHash);
      dispatch(actions.accounts.removeAccount(id, hash));

    }
    return (
      <tr  key={h.id}>
        <td className="tx-medium text-left tx-normal" onClick={() => onPressed(h.id)}>{h.id}</td>
        <td className="tx-medium text-center tx-normal" onClick={() => onPressed(h.id)}>{h.lastCached ? toHumanDate(h.lastCached) : '-'}</td>
        <td className="tx-medium text-center tx-normal" onClick={() => onPressed(h.id)}>{h.cached  || '-'}</td>
        <td className="tx-medium text-center tx-normal" onClick={() => onPressed(h.id)}>{h.changed  || '-'}</td>
        <td className="tx-medium text-center tx-normal" onClick={() => onPressed(h.id)}>{h.deleted  || '-'}</td>
        <td className="tx-medium text-center tx-normal"><Button
            className="btn-sm pd-x-15 btn-brand-01 btn-uppercase mg-l-10"
            onClick={() => onDelete(h.id)}
            size={'sm'}
        >Delete</Button></td>

      </tr>
    );
  };
  console.log(data);
  // tx-teal tx-pink
  const renderTableContent = (data===undefined) ? undefined : data.map((h) => renderLine(h));

  return (
    <Container style={{ padding: 0 }}>
      <Row>
        <Col lg={12} md={12} xs={12}>
          <Card className="card-dashboard-table mg-t-20">
            {/*<!-- card-body -->}*/}
            <Table className="table-dashboard mg-b-0" hover={true}>
              <thead>
                <tr>
                  <th style={{ width: "70%" }}>Account</th>

                  <th>Last cached</th>
                  <th>Total cached</th>



                  <th>Total changed</th>
                  <th>Total deleted</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>{renderTableContent}</tbody>
            </Table>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
