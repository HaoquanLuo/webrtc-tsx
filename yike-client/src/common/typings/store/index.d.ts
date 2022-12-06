import { SystemState } from '@/redux/features/system/systemSlice'
import { UserState } from '@/redux/features/user/userSlice'

export interface StoreProps {
  system: SystemState
  user: UserState
}
