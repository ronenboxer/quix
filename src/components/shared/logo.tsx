import { useRouter } from "next/navigation"

interface AppLogoProps {
    shouldNavigateToHome?: boolean
}

export default function AppLogo(props: AppLogoProps) {
    const { shouldNavigateToHome = true } = props
    const router = useRouter()

    function navigationHandler(){
        // if (shouldNavigateToHome) router.replace('/')
        // router.push('/')
    }
    return (
        <span className="app-logo exo" onClick={navigationHandler}>
            Q
            <span className="bolder">UI</span>
            X
        </span>
    )
}