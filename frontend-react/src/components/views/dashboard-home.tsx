import { ClaimantFinderDashboard } from '@/components/uix/dashb-claimant-fiinder'
import { useAuth } from '@/hooks/useAuthProvider'
import ItemInCustody from '../uix/items-incustody'
// import { ManagerDashboard } from '@/components/uix/manager-dashboard'
export function Dashboard(){
  const {currentUser} = useAuth()

  if (currentUser?.user_role !=='manager') {return<><ClaimantFinderDashboard/></>}
  else return <><ItemInCustody/></>
}