/*
 * Lean tool - hypothesis testing application
 *
 * https://github.com/MikaelLazarev/lean-tool/
 * Copyright (c) 2020. Mikhail Lazarev
 *
 */

import React from 'react';
import {Tweet} from '../../core/tweet';

import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {toHumanDate} from '../../utils/formaters';

interface TweetWidgetProps {
  data: Tweet;
}

export const TweetWidget: React.FC<TweetWidgetProps> = ({data}) => {
  let backColor = '#FFF';
  if (data.wasChanged) backColor = '#b3b37b';
  if (data.wasDeleted) backColor = '#fda7a7';

  return (
      <View
        key={data.id}
        style={{...styles.container, backgroundColor: backColor}}>
        {!data.isReplyTo ? (
          <View style={styles.isReplyContainer}>
            <View
              style={{
                flex: 0.23,
                borderColor: 'red',
                borderWidth: 0,
                alignItems: 'flex-end',
              }}>
              <EvilIcons
                name={'retweet'}
                size={25}
                color={'rgb(136, 153, 166)'}
              />
            </View>
            <Text style={{flex: 0.5, color: 'rgb(136, 153, 166)'}}>
              {data.isRetweet} Retweeted
            </Text>
          </View>
        ) : (
          true
        )}
        <View style={styles.innerContainer}>
          <View style={styles.photoContainer}>
            <View style={styles.innerPhotoContainer}>
              <TouchableOpacity

              // onPress={() => navigation.navigate('Profile')}
              >
                <Image source={{uri: data.user?.avatar}} style={styles.photo} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.info}>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>
                {data.user?.name}
                <Text style={styles.userHandleAndTime}>
                  {' @' + data.screenName} · {toHumanDate(data.time)}
                </Text>
              </Text>
            </View>
            <View style={styles.tweetTextContainer}>
              <Text style={styles.tweetText}>{data.text}</Text>
            </View>
            <View style={styles.tweetActionsContainer}>
              <TouchableOpacity style={styles.commentButton}>
                <EvilIcons
                  name={'comment'}
                  style={styles.commentButtonIcon}
                  size={25}
                  color={'rgb(136, 153, 166)'}
                />
                <Text style={styles.commentsCount}>20</Text>
              </TouchableOpacity>
              <TouchableOpacity
                // onPress={()=> this.retweet()}
                style={styles.retweetButton}>
                <EvilIcons
                  name={'retweet'}
                  size={25}
                  color={
                    data.isRetweet ? 'rgb(23, 191, 99)' : 'rgb(136, 153, 166)'
                  }
                />
                <Text
                  style={[
                    styles.retweetButtonIcon,
                    {
                      color: data.isRetweet
                        ? 'rgb(23, 191, 99)'
                        : 'rgb(136, 153, 166)',
                      fontWeight: data.isRetweet ? 'bold' : '300',
                    },
                  ]}>
                  {data.retweetCount}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                // onPress={()=> this.like()}
                style={styles.likeButton}>
                {data.favoriteCount ? (
                  <Entypo
                    name={'heart'}
                    size={18}
                    style={{marginLeft: 4}}
                    color={
                      data.favoriteCount
                        ? 'rgb(224, 36, 94)'
                        : 'rgb(136, 153, 166)'
                    }
                  />
                ) : (
                  <EvilIcons
                    name={'heart'}
                    size={25}
                    color={
                      data.favoriteCount
                        ? 'rgb(224, 36, 94)'
                        : 'rgb(136, 153, 166)'
                    }
                  />
                )}
                <Text
                  style={[
                    styles.likeButtonIcon,
                    {
                      color: data.favoriteCount
                        ? 'rgb(224, 36, 94)'
                        : 'rgb(136, 153, 166)',
                      fontWeight: data.favoriteCount ? 'bold' : '300',
                    },
                  ]}>
                  {data.favoriteCount}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareButton}>
                <SimpleLineIcons
                  name={'share'}
                  size={16}
                  color={'rgb(136, 153, 166)'}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderBottomColor: '#b8b8b8',
    borderBottomWidth: 0.5,
    flexDirection: 'column',
    backgroundColor: '#f4f5f5',
  },
  isReplyContainer: {
    flex: 1,
    borderColor: 'green',
    flexDirection: 'row',
    borderWidth: 0,
    height: 20,
    marginTop: 5,
  },
  innerContainer: {
    flex: 1,
    borderColor: 'green',
    flexDirection: 'row',
    borderWidth: 0,
    height: 'auto',
  },
  photoContainer: {
    flex: 0.23,
    borderColor: 'yellow',
    flexDirection: 'column',
    borderWidth: 0,
  },
  innerPhotoContainer: {height: 100, alignItems: 'center'},
  photo: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginTop: 15,
  },
  info: {
    flex: 0.77,
    borderColor: 'yellow',
    flexDirection: 'column',
    borderWidth: 0,
  },
  userDetails: {
    flex: 1,
    borderColor: 'blue',
    borderWidth: 0,
    marginBottom: 5,
  },
  userName: {color: '#020202', fontWeight: 'bold'},
  userHandleAndTime: {
    color: 'rgb(107,123,137)',
    marginLeft: 5,
    fontWeight: 'normal',
  },
  tweetTextContainer: {flex: 1, borderColor: 'blue', borderWidth: 0},
  tweetText: {color: '#313131', paddingRight: 10},
  tweetActionsContainer: {
    flex: 1,
    borderColor: 'blue',
    borderWidth: 0,
    marginTop: 5,
    flexDirection: 'row',
    paddingBottom: 5,
  },
  commentButton: {
    paddingLeft: 0,
    flex: 0.25,
    alignItems: 'center',
    flexDirection: 'row',
    borderColor: 'red',
    borderWidth: 0,
  },
  commentButtonIcon: {
    margin: 0,
    marginLeft: -4,
    borderColor: 'red',
    borderWidth: 0,
  },
  commentsCount: {
    position: 'absolute',
    left: 27,
    color: 'rgb(136, 153, 166)',
    marginLeft: -4,
  },
  retweetButton: {
    padding: 5,
    flex: 0.25,
    alignItems: 'center',
    flexDirection: 'row',
    borderColor: 'red',
    borderWidth: 0,
  },
  retweetButtonIcon: {
    position: 'absolute',
    left: 27,

    marginLeft: 3,
  },
  likeButton: {
    padding: 5,
    flex: 0.25,
    alignItems: 'center',
    flexDirection: 'row',
    borderColor: 'red',
    borderWidth: 0,
  },
  likeButtonIcon: {
    position: 'absolute',
    left: 27,

    marginLeft: 3,
  },
  shareButton: {
    padding: 5,
    flex: 0.25,
    alignItems: 'center',
    flexDirection: 'row',
    borderColor: 'red',
    borderWidth: 0,
  },
});
