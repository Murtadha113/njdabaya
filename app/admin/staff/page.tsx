import { StaffView } from "@/components/admin/staff-view"
import { getStaff } from "@/lib/data"

export const dynamic = "force-dynamic"

export default async function AdminStaffPage() {
  const staff = await getStaff()
  return <StaffView staff={staff} />
}
