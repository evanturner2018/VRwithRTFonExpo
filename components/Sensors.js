import { useContext, useEffect, useState } from "react";
import { Gyroscope } from 'expo-sensors';
import { stateDispatchContext } from "../redux/context";
import { StyleSheet, Switch } from "react-native";

/*
other available sensors:
https://docs.expo.dev/versions/v48.0.0/sdk/sensors/
accelerometer, pedometer, deviceMotion
*/

export default function Sensors() {
    // gyroscope in degrees/second
    const [sub, setSub] = useState(null);
    const [enabled, setEnabled] = useState(false);
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
        Gyroscope.setUpdateInterval(1000);
        _subscribe();
        return () => _unsubscribe();
    }, []);

    function toggleSwitch() {
        Gyroscope.setUpdateInterval(enabled ? 20 : 1000);
        setEnabled(!enabled);
    }

    return (
        <Switch 
            style={styles.switch}
            onValueChange={toggleSwitch}
            value={enabled}
        />
    );
}

const styles = StyleSheet.create({
    switch: {
        position: 'absolute',
        right: 0,
        top: 0,
        marginTop: 10,
        marginRight: 20
    }
})