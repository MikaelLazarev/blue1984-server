/*
 * Lean tool - hypothesis testing application
 *
 * https://github.com/MikaelLazarev/lean-tool/
 * Copyright (c) 2020. Mikhail Lazarev
 *
 */

import React, {useEffect, useState} from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import {ErrorMessage, Field, Form, Formik, useFormik} from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { Profile } from "../../core/profile";
import { RootState } from "../../store";
import "./JoinScreen.css";
import logo from './1984_cover.jpg';
import actions from "../../store/actions";

const formSchema = yup.object({
  name: yup.string().required(),
});

type FormValues = yup.InferType<typeof formSchema>;

export const JoinScreen: React.FC = () => {

  const dispatch = useDispatch();

 const onStart = () => {
     dispatch(actions.profile.updateProfile({
         status: 'READY',
     }))
 }

  return (
    <Container className="join-screen onescreen" fluid>
      <Row>
        <Col>
            <img src={logo}/>
          <h1>Welcome to BLU 1984!</h1>
          <h2>Twitter without censorship</h2>
            <Button
                type={"submit"}
                className="outline"
                style={{marginRight: '15px'}}
                onClick={onStart}
            >
                Break the wall
            </Button>
                <Button
                  type={"submit"}
                  className="Next"
                >
                  Take a tour
                </Button>
        </Col>
      </Row>
    </Container>
  );
};
