import { useSession } from "@/lib/auth-client";
import { Role } from "@/utils/constant";

export const useUserCheck = () => {
    const session = useSession()



    const roleCheck = (role: Role)=>{
 if (session.data?.user.role === role) {
        return true
    } else {
        return false
    }
    }

    return {
        roleCheck
    }
}

