/*
 * Lean tool - hypothesis testing application
 *
 * https://github.com/MikaelLazarev/lean-tool/
 * Copyright (c) 2020. Mikhail Lazarev
 *
 */
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {TweetsList} from '../../containers/Tweets/ListView';
import {RootState} from '../../store';
import actions from '../../store/actions';
import {DataScreen} from '../../components/DataLoader/DataScreen';
import {useNavigation} from '@react-navigation/native';

export const TweetsFeedScreen: React.FC = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [hash, setHash] = useState('0');

  useEffect(() => {
    const newHash = Date.now().toString();
    setHash(newHash);
    dispatch(actions.tweets.getFeed(newHash));
  }, []);

  const {data, status} = useSelector((state: RootState) => state.tweets.List);

  return (
    <div className="content content-fixed">
      <DataScreen data={data} status={status} component={TweetsList} />
    </div>
  );
};
