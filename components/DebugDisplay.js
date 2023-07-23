import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function DebugDisplay(props) {
    let lines = [];
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