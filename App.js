import { StyleSheet, View } from "react-native";
import { Canvas, useFrame } from "@react-three/fiber";
import Box from "./components/Box"

export default function App() {
  return (
    <View style={styles.container}>
      <Canvas>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Box position={[-1.2, 0, 0]} />
        <Box position={[1.2, 0, 0]} />
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
});
