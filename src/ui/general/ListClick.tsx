import { For, Show, createSignal } from "solid-js"
export type ListClickRecursiveFunType = ((argRecursive: string[], recursiveNumber: number) => Promise<string[]>)[]
export default function ListClick(props: { argRecursive: string[]; clickFunctionRecursive: ListClickRecursiveFunType; recursiveNumber: number }) {
  let [list, setList] = createSignal<string[]>([])
  let refreshfunction = async () => {
    setList(await props.clickFunctionRecursive[props.recursiveNumber](props.argRecursive, props.recursiveNumber))
  }
  let toogle = false
  let toogleFunction = () => {
    if (props.recursiveNumber < props.clickFunctionRecursive.length) {
      if (!toogle) {
        refreshfunction()
      } else {
        setList([])
      }
      toogle = !toogle
    }
  }
  return (
    <div class="  min-w-full w-fit pl-2">
        <div
          class="text-gray-200  bg-gray-600 hover:bg-gray-500 hover:cursor-pointer h-6"
          onclick={() => {
            toogleFunction()
          }}
        >
          <p class="pl-1"> {props.argRecursive[props.recursiveNumber]}</p>
        </div>
        <For each={list()}>
          {(listElement) => {
            return <ListClick argRecursive={[...props.argRecursive, listElement]} clickFunctionRecursive={props.clickFunctionRecursive} recursiveNumber={props.recursiveNumber + 1}></ListClick>
          }}
        </For>
    </div>
  )
}
