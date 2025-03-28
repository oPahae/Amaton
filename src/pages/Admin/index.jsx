import Infos from "@/components/Admin/Infos"
import Ads from "@/components/Admin/Ads"
import Charts from "@/components/Admin/Charts"
import Modules from "@/components/Admin/Modules"
import Profile from "@/components/Admin/Profile"
import { verifyAuth } from "../../middlewares/adminAuth"

export default function AdminIndex() {

  return (
    <div className="w-full min-h-screen bg-gray-100 flex flex-col justify-center items-center p-6">
      <Infos />
      <Ads />
      <Charts />
      <Modules />
      <Profile />
    </div>
  )
}

export async function getServerSideProps({ req, res }) {
  const admin = verifyAuth(req, res)

  if (!admin) {
    return {
      redirect: {
        destination: "/Admin/Login",
        permanent: false,
      },
    }
  }
  return {
    props: { session: { role: "admin" } },
  }
}