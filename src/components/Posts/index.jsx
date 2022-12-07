import { useEffect, useState } from "react"

const Posts = () => {
    const [contracts, setContracts] = useState([])

    const getContractsFromLocalStorage = () => {
        // get it

        // update state
        setContracts([])
    }

    useEffect(() => {
        getContractsFromLocalStorage()
    } , [])

    return <div>{contracts.map((contract) => (<Post key={contract.id}/>))}</div>
}

export default Posts