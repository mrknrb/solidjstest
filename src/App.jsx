import logo from './logo.svg'
import styles from './App.module.css'
import ButtonMRK from "./comps/ButtonMRK.tsx"

export default function App() {


    document.body.appendChild(<a> hghdfghdfgh</a>)

    let a = ["hsghs", "sgfsdg", "hdgfhdf", ["jfghjf", ["hghdgdhfg", "hdfghdfgh"], "thdthdth"], "hdgfhdf"]


    function generate(data) {

        let u = <div style="border: #404040;border-block: solid"></div>


        function insert(o, r) {
            console.log(o)
            o.forEach((e, i) => {

                if ("string" === typeof e) {
                    r.appendChild(<div style="border: #404040;border-block: solid"> {e} <ButtonMRK pr></ButtonMRK>
                    </div>)

                } else {


                    let t = <div style="border: #404040;border-block: solid"></div>
                    r.appendChild(t)
                    insert(e, t)
                }

            })

        }

        insert(data, u)
        return u


    }

    let p = (<div>

        {document.URL}
        {() => {
            generate(a)
        }}


    </div>)


    return (
        <div class={styles.App}>
            <header class={styles.header}>
                <img src={logo} class={styles.logo} alt="logo"/>
                <p>
                    Edit <code>src/App.jsx</code> dikkk
                </p>{generate(a)}

            </header>
        </div>
    )
}
