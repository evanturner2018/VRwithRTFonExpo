import { StyleSheet, View, Text } from "react-native";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { Gyroscope } from 'expo-sensors';
import Box from "./components/Box"
import Eye from "./components/Eye"

/*
other available sensors:
https://docs.expo.dev/versions/v48.0.0/sdk/sensors/
accelerometer, pedometer, deviceMotion
*/

const scale = 1;
const w = 800/scale;
const h = 300/scale;

function App2() {
  // gyroscope in degrees/second
  const [{x, y, z}, setGyro] = useState({x:0, y:0, z:0});
  const [sub, setSub] = useState(null);

  const _subscribe = () => {
    setSub(
      Gyroscope.addListener(gyroscopeData => {
        setGyro(gyroscopeData)
      })
    );
  }

  const _unsubscribe = () => {
    sub && sub.remove();
    setSub(null);
  };

  useEffect(() => {
    _subscribe();
    return () => _unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>x: {x}</Text>
      <Text style={styles.text}>y: {y}</Text>
      <Text style={styles.text}>z: {z}</Text>
    </View>
  );
}

export default function App() {
  // landscape: 2556w x 1011h
  // portrait: 1179w x 2388h
  const [data, setData] = useState(-1);

  return (
      <Canvas style={styles.canvas}>
        <Eye left={0} w={w} h={h} setData={setData}/>
        <Eye left={0.5} w={w} h={h} setData={setData} />
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Box position={[-1.2, 0, 0]} />
        <Box position={[1.2, 0, 0]} />
      </Canvas>
  );
}

const styles = StyleSheet.create({
  text: {
    top: 50,
    color: "white",
    fontSize: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  canvas: {
    borderColor: "black",
    borderRadius: 5,
    backgroundColor: "black",
    width: w,
    height: h,
    position: "absolute",
    left: 0,
    bottom: 0
  },
});
