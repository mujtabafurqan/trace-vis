import Barchart from "./Barchart"

export default function Reactangle() {

    return (
        <div style={{width:150,height:90, border: '1px solid black'}}>
            <Barchart width={150} height={30} barColor='black'/>
            <Barchart width={150} height={30} barColor='black'/>
            <Barchart width={150} height={30} barColor='black'/>
        </div>
    )
}