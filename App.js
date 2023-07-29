import { Pressable, StyleSheet, View, Text } from "react-native";
import { Canvas, useFrame } from "@react-three/fiber";

import Viewport from "./components/Viewport";
import Sensors from "./components/Sensors";
import DebugDisplay from "./components/DebugDisplay";

import { stateContext, stateDispatchContext } from "./redux/context";
import { initReducer, reducer } from "./redux/reducer";
import { useContext, useEffect, useReducer } from "react";
import * as ScreenOrientation from 'expo-screen-orientation';
import SampleScene from "./components/SampleScene";


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
          <SampleScene />
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
