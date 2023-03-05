import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import Demo from "./Demo";
import Demo1 from './Demo1';
import Reactangle from './Reactangle';
import ArchitectureDiagram from './ArchitectureDiagram';
import ArchDiag from './ArchDiag';
import Barchart from './Barchart';
const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <div style={{background:'white', paddingLeft:'50px'}}>
        <ArchDiag />
        {/* <Barchart /> */}
      </div>
    </>
  )
}
