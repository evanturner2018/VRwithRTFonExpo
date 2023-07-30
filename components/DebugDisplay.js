import { useContext, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { stateContext } from "../redux/context";

export default function DebugDisplay(props) {
    const state = useContext(stateContext);

    let lines = [];
    /*
    for(let key in state) {
        lines.push(key+":\t"+JSON.stringify(state[key]));
    }
    */
    for(let key in props) {
        if(Array.isArray(props[key])) {
            lines.push(key+":");
            props[key].forEach((item) => {
                lines.push('\t'+item.toFixed(2));
            })
        } else lines.push(key+":\t"+props[key]);
    }
    return (
        <View style={styles.container}>
            {lines.map( (line, idx) => (<Text key={idx} style={styles.text}>{line}</Text>) )}
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