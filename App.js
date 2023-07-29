import { Pressable, StyleSheet, View, Text } from "react-native";
import { Canvas, useFrame } from "@react-three/fiber";

import Box from "./components/Box";
import Viewport from "./components/Viewport";
import Sensors from "./components/Sensors";
import DebugDisplay from "./components/DebugDisplay";
import StaticBox from "./components/StaticBox";
import Ball from "./components/Ball";
import { theme } from "./assets/assets"

import { stateContext, stateDispatchContext } from "./redux/context";
import { initReducer, reducer } from "./redux/reducer";
import { useContext, useEffect, useReducer } from "react";
import * as ScreenOrientation from 'expo-screen-orientation';


export default function Root() {
  // landscape: 2556w x 1011h
  // portrait: 1179w x 2388h
  return <App /> ;
}

/*
* In THREE:
*   x runs left->right
*   y runs bottom->top
*   z perpendicular
*/
function App() {
  const [state, dispatch] = useReducer(reducer, null, initReducer);
  return (
    <stateContext.Provider value={state}>
      <stateDispatchContext.Provider value={dispatch}>
        <Canvas style={styles.canvas}>
          <Viewport />
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <Box position={[-1.2, 0, -2]} />
          <Box position={[1.2, 0, -2]} />
          
          <StaticBox color={theme.color1} position={[0, 0, -10]} size={[50, 7, 1]} />
          <StaticBox color={theme.color1} position={[0, 10, 0]} size={[50, 1, 7]} />
          <StaticBox color={theme.color1} position={[0, -10, 0]} size={[50, 1, 7]} />

          <Ball radius={0.1} position={[0, 0, -2]} color={theme.color2}/>
        </Canvas>
        <Screen />
        <Sensors />
      </stateDispatchContext.Provider>
    </stateContext.Provider>
    
  );
}



function Screen() {
  const dispatch = useContext(stateDispatchContext);

  async function _unlock() {
    await ScreenOrientation.unlockAsync().then(
      (val) => {},
      (err) => {
        alert('lock error: '+err);
      }
    );
  }

  async function _lock() {
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE).then(
      (val) => {},
      (err) => {
        alert('lock error: '+err);
      }
    );
  }

  useEffect(() => {
    _unlock();
  }, []);

  function _handleTouch() {
    _lock();
    dispatch({
      type: 'zero'
    })
  }

  return (
    <Pressable style={styles.screen} onPress={_handleTouch} />
  )
}

const styles = StyleSheet.create({
  text: {
    top: 50,
    color: "white",
    fontSize: 20,
  },
  container: {
    flex: 1
  },
  canvas: {},
  screen: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
});
