import { createContext, useContext, useEffect, useReducer, useState } from "react";
import { Gyroscope } from 'expo-sensors';
import { StyleSheet, View, Text } from "react-native";
import { initReducer, reducer } from "../redux/reducer";
import { stateDispatchContext } from "../redux/context";

/*
other available sensors:
https://docs.expo.dev/versions/v48.0.0/sdk/sensors/
accelerometer, pedometer, deviceMotion
*/

// TODO zero rotation on screen touch

export default function Sensors() {
    // gyroscope in degrees/second
    const [{x, y, z}, setGyro] = useState({x:0, y:0, z:0});
    const [sub, setSub] = useState(null);
    const dispatch = useContext(stateDispatchContext);

    const _subscribe = () => {
        setSub(
            Gyroscope.addListener(gyroscopeData => {
                setGyro(gyroscopeData)
                dispatch({
                    type: 'gyro',
                    payload: gyroscopeData
                });
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
        <></>
    );
}

let styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "purple",
    },
})