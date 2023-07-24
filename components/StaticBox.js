
export default function StaticBox(props) {
    let size = props.size ? props.size : [1, 1, 1];
    let color = props.color ? props.size : "grey";

    return (
        <mesh
            {...props}
        >
            <meshStandardMaterial attach="material"
                color={color}
            />
            <boxBufferGeometry attach="geometry" args={size} />
        </mesh>
    )
}