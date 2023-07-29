import { theme } from "../assets/assets"
import StaticBox from "./geometry/StaticBox"
import Ball from "./geometry/Ball"
import Box from "./geometry/Box"

export default function SampleScene(props) {

    return (
        <>
            <Ground />
            <Box position={[-1.2, 2, -2]} />
            <Box position={[1.2, 2, -2]} />
            
            <StaticBox color={theme.color1} position={[0, 0, -10]} size={[50, 7, 1]} />
            <StaticBox color={theme.color1} position={[0, 10, 0]} size={[50, 1, 7]} />
            <StaticBox color={theme.color1} position={[0, -10, 0]} size={[50, 1, 7]} />

            <Ball radius={0.1} position={[0, 2, -2]} color={theme.color2}/>
        </>
    )
}

function Ground(props) {

    return (
        <StaticBox 
            position={[0, 0, 0]}
            size={[100, 0.1, 100]}
            color={theme.color3} 
        />
    )
}