/*
 * Lean tool - hypothesis testing application
 *
 * https://github.com/MikaelLazarev/lean-tool/
 * Copyright (c) 2020. Mikhail Lazarev
 *
 */

import React from "react";
import { Table, Container, Row, Col, Card } from "react-bootstrap";
import { Account } from "../../core/accounts";
import { DataScreenComponentProps } from "../../components/DataLoader/DataScreen";
import { toHumanDate } from "../../utils/formaters";

export const AccountsList: React.FC<DataScreenComponentProps<Account[]>> = ({
  data,
  onSelect,
}) => {
  const onPressed = (id: string) => {
    if (onSelect) {
      onSelect(id);
    }
  };

  const renderLine = (h: Account) => {

    return (
      <tr onClick={() => onPressed(h.id)} key={h.id}>
        <td className="tx-medium text-left tx-normal">{h.id}</td>
      </tr>
    );
  };
  // tx-teal tx-pink
  const renderTableContent = data.map((h) => renderLine(h));

  return (
    <Container style={{ padding: 0 }}>
      <Row>
        <Col lg={12} md={12} xs={12}>
          <Card className="card-dashboard-table mg-t-20">
            {/*<!-- card-body -->}*/}
            <Table className="table-dashboard mg-b-0" hover={true}>
              <thead>
                <tr>
                  <th style={{ width: "25%" }}>Name</th>

                  <th>Date</th>
                  <th>Partner</th>
                  <th>Status</th>
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
