import { useContext, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { stateContext } from "../redux/context";

export default function DebugDisplay(props) {
    const state = useContext(stateContext);

    let lines = [];
    for(let key in state) {
        lines.push(key+":\t"+state[key]);
    }
    for(let key in props) {
        lines.push(key+":\t"+props[key]);
    }
    return (
        <View style={styles.container}>
            {lines.map( (line) => (<Text style={styles.text}>{line}</Text>) )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: "white",
        position: "absolute",
        margin: 50,
    },
    text: {
        fontSize: 10,
        color: "black",
    },
})