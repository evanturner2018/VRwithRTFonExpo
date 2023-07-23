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
  return (
    <View style={styles.container}>
      <Canvas>
        <Eye left={0} />
        <Eye left={0.5} />
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Box position={[-1.2, 0, 0]} />
      </Canvas>
    </View>
  );
}
// <Box position={[1.2, 0, 0]} />

const styles = StyleSheet.create({
  text: {
    color: "white",
    fontSize: "20px",
  },
  container: {
    flex: 1,
    backgroundColor: "black",
  },
});
