import { StyleSheet } from "react-native";
import { Canvas } from "@react-three/fiber";

import Box from "./components/Box";
import Viewport from "./components/Viewport";
import Sensors from "./components/Sensors";
import DebugDisplay from "./components/DebugDisplay";
import { stateContext, stateDispatchContext } from "./redux/context";
import { initReducer, reducer } from "./redux/reducer";
import { useReducer } from "react";

export default function Root() {
  // landscape: 2556w x 1011h
  // portrait: 1179w x 2388h

  return <App /> ;
}

function App() {
  const [state, dispatch] = useReducer(reducer, null, initReducer);

  return (
    <stateContext.Provider value={state}>
      <stateDispatchContext.Provider value={dispatch}>
        <Canvas style={styles.canvas}>
          <Viewport />
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <Box position={[-1.2, 0, 0]} />
          <Box position={[1.2, 0, 0]} />
        </Canvas>
        <Sensors />
        <DebugDisplay />
      </stateDispatchContext.Provider>
    </stateContext.Provider>
    
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
    
  },
});
