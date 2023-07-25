import { createContext, useContext, useEffect, useReducer, useState } from "react";
import { Gyroscope } from 'expo-sensors';
import { StyleSheet, View, Text } from "react-native";
import { stateDispatchContext } from "../redux/context";

/*
other available sensors:
https://docs.expo.dev/versions/v48.0.0/sdk/sensors/
accelerometer, pedometer, deviceMotion
*/

export default function Sensors() {
    // gyroscope in degrees/second
    const [sub, setSub] = useState(null);
    const dispatch = useContext(stateDispatchContext);

    const _subscribe = () => {
        setSub(
            Gyroscope.addListener(gyroscopeData => {
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