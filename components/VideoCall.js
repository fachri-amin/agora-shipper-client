import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableOpacity,
  TextInput
} from 'react-native';

import RtcEngine, {
  RtcLocalView,
  RtcRemoteView,
  VideoRenderMode,
} from 'react-native-agora';
import requestCameraAndAudioPermission from './Permission';
import styles from './style';
import axios from 'axios';

const VideoCall = () => {
  let _engine;
  const [appId, setAppId] = useState('f6a3d3fdd784401b981fe52beab9ea10');
  const [token, setToken] = useState("006f6a3d3fdd784401b981fe52beab9ea10IACwXgxnsKHL54tef2+wyyyGV16/tDyLEIbcY83UW8p9892N+lRXoFHlIgC4jSbtXeqgYQQAAQDdJcdhAgDdJcdhAwDdJcdhBADdJcdh");
  const [channelName, setChannelName] = useState('fachri-call-2');
  const [joinSucceed, setJoinSucceed] = useState(false);
  const [peerIds, setPeerIds] = useState([]);
  const [userId, setUserId] = useState(Math.floor(Math.random()*100000));

  init = async () => {
    // await axios.get(`https://express-agora.herokuapp.com/generate-token/${userId}/fachri-call-2`)
    //   .then((res) => {
    //     console.log('ini token', res.data);
    //     setToken(res.data.token);
    //     setUserId(res.data.uid);
    //     console.log('ini token',token);
    //   })
    //   .catch((err) => {
    //     console.log('terjadi kesalahan');
    //   })

    _engine = await RtcEngine.create(appId);
    console.log('init',_engine);
    await _engine.enableVideo();

    _engine.addListener('Warning', (warn) => {
      console.log('Warning', warn);
    });

    _engine.addListener('Error', (err) => {
      console.log('Error', err);
    });

    _engine.addListener('UserJoined', (uid, elapsed) => {
      console.log('uid', uid);
      console.log('UserJoined', uid, elapsed);
      // If new user
      if (peerIds.indexOf(uid) === -1) {
        setPeerIds([...peerIds, uid]);
      }
    });

    _engine.addListener('UserOffline', (uid, reason) => {
      console.log('UserOffline', uid, reason);
      setPeerIds(peerIds.filter((id) => id !== uid));
    });

    // If Local user joins RTC channel
    _engine.addListener('JoinChannelSuccess', (channel, uid, elapsed) => {
      console.log('JoinChannelSuccess', channel, uid, elapsed);
      // Set state variable to true
      setJoinSucceed(true);
    });
  };

  useEffect(() => {
    // axios.get(`https://express-agora.herokuapp.com/generate-token/${userId}/fachri-call-2`)
    //   .then((res) => {
    //     console.log('ini token', res.data);
    //     setToken(res.data.token);
    //     setUserId(res.data.uid);
    //     console.log('ini token',token);
    //   })
    //   .catch((err) => {
    //     console.log('terjadi kesalahan');
    //   })

    requestCameraAndAudioPermission().then(() => {
      console.log('requested!');
    });

  }, []);

  startCall = async () => {
    await init();
    console.log('token dari BE', token);

    console.log('start call',_engine);
    // Join Channel using null token and channel name
    await _engine?.joinChannel(
      token,
      channelName,
      null,
      2882341273 //! ini adalah uid yang harus sesuai ketika request token
    );
  };

  endCall = async () => {
    await _engine?.leaveChannel();
    setPeerIds([]);
    setJoinSucceed(false);
  };

  _renderRemoteVideos = () => {
    return (
      <ScrollView
        style={styles.remoteContainer}
        contentContainerStyle={{ paddingHorizontal: 2.5 }}
        horizontal={true}
      >
        {peerIds.map((value) => {
          return (
            <RtcRemoteView.SurfaceView
              style={styles.remote}
              uid={value}
              channelId={channelName}
              renderMode={VideoRenderMode.Hidden}
              zOrderMediaOverlay={true}
            />
          );
        })}
      </ScrollView>
    );
  };

  _renderVideos = () => {
    return joinSucceed ? (
      <View style={styles.fullView}>
        <RtcLocalView.SurfaceView
          style={styles.max}
          channelId={channelName}
          renderMode={VideoRenderMode.Hidden}
        />
        {_renderRemoteVideos()}
      </View>
    ) : null;
  };


  return (
    <View style={styles.max}>
        <View style={styles.max}>
          <View style={styles.buttonHolder}>
            <TouchableOpacity onPress={() => startCall()} style={styles.button}>
              <Text style={styles.buttonText}> Start Call</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => endCall()} style={styles.button}>
              <Text style={styles.buttonText}> End Call </Text>
            </TouchableOpacity>
          </View>
          {_renderVideos()}
        </View>
      </View>
  );
};

export default VideoCall;
